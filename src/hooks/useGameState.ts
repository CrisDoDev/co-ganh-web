import { useState, useCallback, useEffect } from "react";
import {
  initializeBoard,
  executeMove,
  passTurn,
  type BoardState,
  type GameMove,
} from "@/lib/gameEngine";

const TURN_TIME_LIMIT = 30;

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    initialized: false,
  });

  const [timeLeft, setTimeLeft] = useState<number>(TURN_TIME_LIMIT);

  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
    setTimeLeft(TURN_TIME_LIMIT);
  }, []);

  useEffect(() => {
    if (!boardState || boardState.phase !== "playing") return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [boardState?.currentPlayer, boardState?.phase]);

  useEffect(() => {
    if (timeLeft <= 0 && boardState?.phase === "playing") {
      setBoardState((currentState) => {
        if (currentState) return passTurn(currentState);
        return currentState;
      });
      setSelectedPiece(null);
      setTimeLeft(TURN_TIME_LIMIT);
    }
  }, [timeLeft, boardState?.phase]);

  useEffect(() => {
    if (boardState?.phase === "playing") {
      setTimeLeft(TURN_TIME_LIMIT);
    }
  }, [boardState?.currentPlayer, boardState?.phase]);

  useEffect(() => {
    // 5.2.3 Controller (useGameState) phát hiện phase === "game_over", lập tức trigger useEffect kích hoạt bộ đếm để cộng thêm 1 trận thắng cho winner.
    if (
      boardState?.phase === "game_over" &&
      boardState.winner &&
      !scores.initialized
    ) {
      const winnerKey = boardState.winner as "player1" | "player2";
      setScores((prev) => ({
        ...prev,
        [winnerKey]: prev[winnerKey] + 1,
        initialized: true,
      }));
    }
    // 5.3.3 Controller cập nhật State nội bộ, giữ nguyên tổng tỷ số trận đấu (không ai được cộng điểm).
    else if (boardState?.phase === "playing" && scores.initialized) {
      setScores((prev) => ({ ...prev, initialized: false }));
    }
  }, [boardState?.phase, boardState?.winner]);

  const handlePieceSelect = useCallback((pieceId: string) => {
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      if (!boardState || !selectedPiece) return;

      const piece = boardState.pieces.find((p) => p.id === selectedPiece);
      if (!piece) return;

      const move: GameMove = {
        pieceId: selectedPiece,
        fromX: piece.x,
        fromY: piece.y,
        toX,
        toY,
      };

      // 5.1.1 Controller (useGameState) gửi yêu cầu kiểm tra cục diện ván cờ sang Model (gameEngine).
      const newState = executeMove(move, boardState);

      // 5.1.5 Controller cập nhật State nội bộ, kích hoạt View (GameInfo) re-render để hiển thị số quân thực tế và làm nổi bật viền của người đến lượt đi.
      setBoardState(newState);
      setSelectedPiece(null);
      setTimeLeft(TURN_TIME_LIMIT);
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    timeLeft,
    scores,
    initGame,
    handlePieceSelect,
    handleMove,
  };
}

import { useState, useCallback, useEffect } from "react";
import {
  initializeBoard,
  executeMove,
  type BoardState,
  type GameMove,
} from "@/lib/gameEngine";

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // Cập nhật: Quản lý tổng tỷ số trận đấu tích lũy qua nhiều ván cờ
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    initialized: false, // Cờ hiệu bảo vệ chống trùng lặp dữ liệu re-render
  });

  // =========================================================================
  // [UC-1: Khởi động và Thiết lập ván cờ]
  // =========================================================================
  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
  }, []);

  // =========================================================================
  // Xử lý vòng đời kết thúc game để cập nhật tỷ số
  // =========================================================================
  useEffect(() => {
    // Nếu trạng thái ván cờ chuyển sang "game_over" và có người thắng, tiến hành cộng điểm
    if (
      boardState?.phase === "game_over" &&
      boardState.winner &&
      !scores.initialized
    ) {
      const winnerKey = boardState.winner as "player1" | "player2";
      setScores((prev) => ({
        ...prev,
        [winnerKey]: prev[winnerKey] + 1, // Tăng điểm số tích lũy cho người thắng
        initialized: true, // Khóa cờ hiệu để không bị cộng điểm lặp lại ở lượt re-render sau
      }));
    }
    // Khi một ván đấu mới được khởi tạo lại (quay về trạng thái "playing"), mở khóa cờ hiệu điểm số
    else if (boardState?.phase === "playing" && scores.initialized) {
      setScores((prev) => ({ ...prev, initialized: false }));
    }
  }, [boardState?.phase, boardState?.winner, scores.initialized]);

  // =========================================================================
  // [UC-2: Tương tác di chuyển quân cờ]
  // =========================================================================
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

      const newState = executeMove(move, boardState);
      setBoardState(newState);
      setSelectedPiece(null);
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    scores, // Xuất dữ liệu tổng tỷ số ra ngoài cho View sử dụng
    initGame,
    handlePieceSelect,
    handleMove,
  };
}

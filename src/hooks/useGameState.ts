import { useState, useCallback } from "react";
import {
  initializeBoard,
  executeMove,
  type BoardState,
  type GameMove,
} from "@/lib/gameEngine";

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // =========================================================================
  // [UC-1: Khởi động và Thiết lập ván cờ]
  // =========================================================================
  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
  }, []);

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
      // =========================================================================
      // [UC-4: Thực thi luật bắt quân]
      // =========================================================================
      // 4.1 Controller gửi yêu cầu thực thi nước đi (kèm move) sang Model (gameEngine)
      const newState = executeMove(move, boardState);

      // 4.6 Controller cập nhật State nội bộ, kích hoạt View re-render lại giao diện
      setBoardState(newState);
      setSelectedPiece(null);
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    initGame,
    handlePieceSelect,
    handleMove,
  };
}

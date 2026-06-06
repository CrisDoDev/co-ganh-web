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
  // [UC-1: Khởi tạo và thiết lập ván cờ]
  // =========================================================================
  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
  }, []);

  // =========================================================================
  // [UC-2: Di chuyển quân cờ]
  // =========================================================================
  const handlePieceSelect = useCallback((pieceId: string) => {
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      if (!boardState || !selectedPiece) return;

      const piece = boardState.pieces.find((p) => p.id === selectedPiece);
      if (!piece) return;

      // 4.1.0 Hệ thống kết thúc UC-3 thành công.
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
      // 4.1.1 Controller (useGameState) gửi yêu cầu thực thi nước đi sang Model (gameEngine).
      const newState = executeMove(move, boardState);

      // 4.1.9 Controller cập nhật State nội bộ và kích hoạt View re-render giao diện bàn cờ.
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

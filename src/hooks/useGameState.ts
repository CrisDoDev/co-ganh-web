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

  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
  }, []);

  const handlePieceSelect = useCallback((pieceId: string) => {

    // 3.2.0 Controller nhận yêu cầu chọn quân cờ từ View và cập nhật quân cờ đang được chọn

    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));

  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {

      // 3.7.0 Controller nhận yêu cầu di chuyển tới ô đích từ View

      if (!boardState || !selectedPiece) return;

      const piece = boardState.pieces.find((p) => p.id === selectedPiece);

      // [AF1 - 3.2.1] Không tìm thấy quân cờ hợp lệ
      if (!piece) return;

      const move: GameMove = {
        pieceId: selectedPiece,
        fromX: piece.x,
        fromY: piece.y,
        toX,
        toY,
      };

      // 3.8.0 Controller gửi yêu cầu xác nhận nước đi tới Model

      const newState = executeMove(move, boardState);

      // 3.9.0 Nhận trạng thái mới sau khi nước đi được xác nhận

      setBoardState(newState);

      // Reset trạng thái chọn quân sau khi xử lý xong
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
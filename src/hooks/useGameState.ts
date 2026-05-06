import { useState, useCallback } from "react";
import { BoardState, initializeBoard, executeMove, getValidMoves } from "@/lib/gameEngine";

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<Array<{ x: number; y: number }>>([]);

  const initGame = useCallback(() => {
    setBoardState(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
  }, []);

  const handlePieceSelect = useCallback(
    (pieceId: string) => {
      // Logic xử lý khi click vào ô cờ
    },
    [boardState]
  );

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      // Logic xử lý khi xác nhận đi cờ
    },
    [boardState, selectedPiece]
  );

  return {
    boardState,
    selectedPiece,
    validMoves,
    initGame,
    handlePieceSelect,
    handleMove,
  };
}

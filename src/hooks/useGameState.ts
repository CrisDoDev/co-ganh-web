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

  // =========================================================================
  // [UC-2: Tương tác di chuyển quân cờ]
  // =========================================================================
  const handlePieceSelect = useCallback((pieceId: string) => {
    // UC-2.1: Người chơi click vào quân cờ thuộc phe mình
    // UC-2.2: View gửi event sang Controller (handlePieceSelect)

    // UC-2.3: Controller xử lý logic chọn quân
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));

     // UC-2.3.1: Nếu đã chọn thì bỏ chọn (toggle)
    // UC-2.3.2: Nếu chưa chọn thì set quân đang được chọn
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
        // UC-2.7: Người chơi click vào ô đích
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
       // UC-2.8: Controller gửi request sang Model (executeMove)

      const newState = executeMove(move, boardState);

      // UC-2.9: Controller nhận state mới từ Model
      setBoardState(newState);


    // UC-2.10: Reset trạng thái chọn quân cờ sau khi đi xong
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

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
  // [UC-2: Tương tác di chuyển quân cờ] - PHÁT TRIỂN TIẾP GIAI ĐOẠN 2
  // =========================================================================
  const handlePieceSelect = useCallback((pieceId: string) => {
    // 2.1.1 View gửi sự kiện chọn quân cờ sang Controller.
    // 2.1.2 Controller kiểm tra tính hợp lệ của quân cờ được chọn.
    
    // 2.1.2.0 Nếu quân cờ thuộc lượt hiện tại, Controller cập nhật trạng thái “đang được chọn”.
    // 2.2.0.0 Controller từ chối yêu cầu chọn quân (Bỏ chọn set null nếu click lại quân cũ).
    // 2.2.2.0 Hệ thống hủy trạng thái chọn quân cờ cũ.
    // 2.2.2.1 Hệ thống thực hiện lại quy trình từ bước 2.2 với quân cờ mới.
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      // 2.1.7 View gửi yêu cầu thực hiện nước đi sang Controller.
      
      // 2.2.1.0 Controller từ chối thực hiện nước đi (chặn lỗi nếu state rỗng).
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
       // 2.1.8 Controller cập nhật dữ liệu bàn cờ với vị trí mới của quân cờ.

      const newState = executeMove(move, boardState);
      setBoardState(newState);


      // 2.1.9 View cập nhật giao diện bàn cờ (thông qua React State triggers re-render).
      // 2.1.9.0 Xóa trạng thái làm nổi bật quân cờ cũ.
      // 2.1.9.1 Xóa toàn bộ dấu chấm gợi ý.
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

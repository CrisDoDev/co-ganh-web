
"use client";

import { useEffect, useState } from "react";
import { getValidMoves, type BoardState } from "@/lib/gameEngine";
import { motion, AnimatePresence } from "framer-motion"; // [PHÁT TRIỂN TIẾP GĐ2]: Import thư viện tạo Animation

interface GameBoardProps {
  boardState: BoardState;
  selectedPiece: string | null;
  onPieceSelect: (pieceId: string) => void;
  onMove: (toX: number, toY: number) => void;
  gameOver: boolean;
}

const BOARD_SIZE = 5;

export default function GameBoard({
  boardState,
  selectedPiece,
  onPieceSelect,
  onMove,
  gameOver,
}: GameBoardProps) {
  const [validMoves, setValidMoves] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    // 3.3.0 Controller yêu cầu Model xác định các ô lân cận có thể di chuyển.
    if (selectedPiece) {
      // 2.1.2.1 Controller gửi yêu cầu sang Model để tính toán các nước đi hợp lệ xung quanh quân cờ.
      const moves = getValidMoves(selectedPiece, boardState);
      
      // 2.1.4 Controller gửi danh sách nước đi hợp lệ về View.
      // 3.5.0 Hệ thống nhận danh sách nước đi hợp lệ.
      setValidMoves(moves);

      // 3.6.0 View hiển thị các ô có thể di chuyển.
    } else {
      // 2.1.9.1 Xóa toàn bộ dấu chấm gợi ý (khi không có quân nào được chọn hoặc sau khi đi xong).
      setValidMoves([]);
    }
  }, [selectedPiece, boardState]);

  const getPieceAt = (x: number, y: number) => {
    return boardState.pieces.find((p) => p.x === x && p.y === y);
  };

  const handleSquareClick = (x: number, y: number) => {
    // 3.1.0 Người chơi chọn một quân cờ trên bàn cờ hoặc chọn một ô đích.
    if (gameOver) return;

    // 3.2.0 Hệ thống kiểm tra quân cờ có thuộc quyền điều khiển của người chơi hiện tại hay không.
    const clickedPiece = getPieceAt(x, y);

    // 2.1.0 Người chơi click vào một quân cờ thuộc phe của mình trên bàn cờ.
    if (clickedPiece && clickedPiece.owner === boardState.currentPlayer) {
      // 2.2.2 Luồng đổi quân cờ được chọn: Nếu người chơi click sang một quân cờ khác thuộc phe mình.
      // 2.1.1 View gửi sự kiện chọn quân cờ sang Controller.
      // 3.2.0 Quân cờ hợp lệ, gửi yêu cầu chọn quân sang Controller.
      onPieceSelect(clickedPiece.id);
      return;
    }

    // 3.7.0 Người chơi chọn một ô đích.
    // 3.8.0 Hệ thống xác nhận ô đích có thuộc danh sách nước đi hợp lệ hay không.
    if (selectedPiece && validMoves.some((m) => m.x === x && m.y === y)) {
      // 2.1.6 Người chơi click vào một ô đích hợp lệ.
      // 2.1.7 View gửi yêu cầu thực hiện nước đi sang Controller.
      // 3.9.0 Hệ thống cho phép thực hiện nước đi và chuyển tiếp sang UC-4.
      onMove(x, y);
      return;
    }

    // [AF3] Người chơi chọn ô đích không thuộc danh sách nước đi hợp lệ. Hệ thống từ chối yêu cầu di chuyển.
    // 2.2.0 Luồng chọn quân không hợp lệ / 2.7.a Luồng chọn ô đích không hợp lệ.
    if (!clickedPiece) {
      // 2.2.0.2 Hệ thống không hiển thị trạng thái nổi bật hay dấu chấm gợi ý.
      // 2.2.1.1 Quân cờ hiện tại vẫn giữ trạng thái được chọn (nếu click sai thì Controller xử lý ngầm, ở View báo deselect).
      // [AF1] Người chơi chọn ô không có quân hoặc quân không thuộc lượt hiện tại. Hệ thống không ghi nhận lựa chọn.
      onPieceSelect("");
    }
  };

  // 2.1.5 View thực hiện cập nhật giao diện.
  // 2.1.9 View cập nhật giao diện bàn cờ.
  return (
    <div className="flex items-center justify-center relative">
      {/* Box ngoài cùng nguyên bản chứa bàn cờ */}
      <div className="bg-card border-8 border-primary shadow-2xl rounded-lg p-4 relative overflow-hidden">
        
        {/* Lớp Đồ Thị Topology (Node Graph) vẽ các đường line kết nối hình học */}
        <div className="absolute inset-0 p-4 pointer-events-none z-0">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 320 320"
            className="stroke-muted-foreground/40"
            strokeWidth="3"
            strokeLinecap="round"
          >
            {/* Đường ngang */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h-${i}`} x1={32} y1={32 + i * 64} x2={288} y2={32 + i * 64} />
            ))}
            {/* Đường dọc */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`v-${i}`} x1={32 + i * 64} y1={32} x2={32 + i * 64} y2={288} />
            ))}
            {/* Đường chéo chính */}
            <line x1={32} y1={32} x2={288} y2={288} />
            <line x1={288} y1={32} x2={32} y2={288} />
            {/* Đường chéo phụ */}
            <line x1={160} y1={32} x2={288} y2={160} />
            <line x1={32} y1={160} x2={160} y2={288} />
            <line x1={32} y1={160} x2={160} y2={32} />
            <line x1={160} y1={288} x2={288} y2={160} />
          </svg>
        </div>

        {/* Lưới grid tàng hình để làm điểm neo hitbox */}
        <div
          className="grid gap-0 relative z-10"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
        >
          {Array.from({ length: BOARD_SIZE }).map((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => {
              const piece = getPieceAt(x, y);
              const isValid = validMoves.some((m) => m.x === x && m.y === y);
              const isSelected =
                selectedPiece &&
                boardState.pieces.find((p) => p.id === selectedPiece)?.x === x &&
                boardState.pieces.find((p) => p.id === selectedPiece)?.y === y;

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleSquareClick(x, y)}
                  disabled={gameOver}
                  className={`
                    w-16 h-16 transition-all bg-transparent
                    hover:bg-accent/10 cursor-pointer rounded-full scale-90
                    relative flex items-center justify-center
                    ${/* 2.1.5.0 Làm nổi bật quân cờ đang được chọn (ví dụ: hiện viền hoặc hiệu ứng sáng). */ ""}
                    ${/* 2.1.9.0 Xóa trạng thái làm nổi bật quân cờ cũ. */ ""}
                    ${isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""}
                    ${gameOver ? "cursor-not-allowed" : ""}
                  `}
                >
                  {/* 2.1.5.1 Hiển thị dấu chấm gợi ý tại các ô có thể đi. */}
                  {/* [UC-3][3.6.0] Hiển thị các ô có thể di chuyển */}
                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* 2.1.9.2 Hiển thị quân cờ tại vị trí mới. */}
                  {/* [PHÁT TRIỂN TIẾP GĐ2]: Bọc bằng motion.div để tạo Animation lướt mượt mà */}
                  {/* 3.6.0 Hiển thị quân cờ trên bàn cờ */}
                  <AnimatePresence>
                    {piece && (
                      <motion.div
                        layoutId={piece.id}
                        initial={false}
                        animate={
                          boardState.lastCapturedIds?.includes(piece.id)
                            ? {
                                scale: [1, 1.3, 1],
                                filter: [
                                  "brightness(1)",
                                  "brightness(2)",
                                  "brightness(1)",
                                ],
                              }
                            : {
                                scale: 1,
                                filter: "brightness(1)",
                              }
                        }
                        transition={
                          boardState.lastCapturedIds?.includes(piece.id)
                            ? {
                                type: "keyframes",
                                duration: 0.5,
                                ease: "easeInOut",
                              }
                            : { type: "spring", stiffness: 350, damping: 25 }
                        }
                        className={`
                          absolute inset-2 rounded-full shadow-lg 
                          flex items-center justify-center font-serif font-bold text-lg
                          hover:scale-110 z-10
                          ${
                            piece.owner === "player1"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }
                        `}
                      >
                        {piece.owner === "player1" ? "●" : "○"}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
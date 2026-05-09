"use client";
import { BoardState } from "@/lib/gameEngine";

interface GameBoardProps {
  state: BoardState;

  // [UC-5][5.5] View nhận dữ liệu để hiển thị trạng thái bàn cờ hiện tại
  selectedPiece: string | null;

  // [UC-5][5.5] Các nước đi hợp lệ để hiển thị cho người chơi
  validMoves: Array<{ x: number; y: number }>;

  // [UC-5][5.1] Người chơi thực hiện hành động: chọn quân cờ
  onPieceSelect: (id: string) => void;

  // [UC-5][5.1] Người chơi thực hiện nước đi hợp lệ 
  // (Hàm này sẽ gọi lên Controller để kích hoạt tiếp bước 5.2, 5.3, 5.4)
  onMove: (x: number, y: number) => void;
}

export default function GameBoard({ state, selectedPiece, validMoves, onPieceSelect, onMove }: GameBoardProps) {

  // Lưu ý: Các bước 5.2 (Controller gửi trạng thái), 5.3 (Cập nhật lịch sử), 
  // và 5.4 (Kiểm tra thắng/thua) không nằm ở đây mà được xử lý ở Hook và Engine.
  // View (GameBoard) chỉ nhận kết quả đã xử lý thông qua prop `state`.

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50">
      
      {/* [UC-5][5.5] View hiển thị lại giao diện bàn cờ và diễn biến trận đấu */}
      
      <div className="text-center text-gray-500">
        <p className="font-semibold mb-2">GameBoard Component</p>
        <p className="text-sm">Vẽ các ô grid 5x5 vào đây</p>
      </div>

      {/* [UC-5][5.6] Nếu trận đấu kết thúc, hệ thống hiển thị kết quả cho Người chơi */}
      {/* Code hiển thị Modal/Thông báo Winner sẽ nằm ở đây */}

      {/* [UC-5][5.7] Người chơi chọn thoát khỏi ván đấu */}
      {/* Code hiển thị nút Quit/Thoát sẽ nằm ở đây */}

    </div>
  );
}
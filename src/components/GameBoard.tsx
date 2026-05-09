"use client";
import { BoardState } from "@/lib/gameEngine";

interface GameBoardProps {
  state: BoardState;

  // [UC-5][5.5]
  // Hiển thị trạng thái bàn cờ hiện tại
  selectedPiece: string | null;

  // [UC-5][5.5]
  // Các nước đi hợp lệ để hiển thị cho người chơi
  validMoves: Array<{ x: number; y: number }>;

  // [UC-5][5.1]
  // Người chơi chọn quân cờ
  onPieceSelect: (id: string) => void;

  // [UC-5][5.1]
  // Người chơi thực hiện nước đi
  onMove: (x: number, y: number) => void;
}

export default function GameBoard({ state, selectedPiece, validMoves, onPieceSelect, onMove }: GameBoardProps) {

  // [UC-5][5.2]
  // Controller nhận input và xử lý logic game

  // [UC-5][5.4]
  // Hệ thống kiểm tra trạng thái thắng/thua/hòa

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50">
      
      {/* [UC-5][5.5] Hiển thị giao diện bàn cờ */}
      
      <div className="text-center text-gray-500">
        <p className="font-semibold mb-2">GameBoard Component</p>
        <p className="text-sm">Vẽ các ô grid 5x5 vào đây</p>
      </div>

      {/* [UC-5][5.6] Nếu có kết quả → hiển thị winner */}

      {/* [UC-5][5.7] Người chơi có thể thoát hoặc lưu game */}

    </div>
  );
}
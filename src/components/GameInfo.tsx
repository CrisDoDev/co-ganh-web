"use client";

interface GameInfoProps {
  // [UC-5][5.5] Dữ liệu View nhận được để hiển thị diễn biến ván đấu
  playerName: string;

  // [UC-5][5.5] Dữ liệu để View làm nổi bật người chơi đang đến lượt
  isActive: boolean;

  // [UC-5][5.5] Dữ liệu hiển thị số lượng quân cờ còn lại
  pieces: number;

  // [UC-5][5.5] Dữ liệu hiển thị màu quân cờ
  color: string;
}

export default function GameInfo({ playerName, isActive, pieces, color }: GameInfoProps) {

  // Lưu ý: Component này thuần túy là View. Không chứa logic của Controller [5.2] 
  // hay logic kiểm tra trạng thái thắng/thua của Model [5.4].
  // Mọi dữ liệu truyền vào đây đều đã được tính toán xong.

  return (
    <div className="p-6 bg-white border rounded shadow-sm text-center">
      
      {/* [UC-5][5.5] View hiển thị lại giao diện diễn biến trận đấu */}
      <p className="font-semibold mb-2 text-gray-700">GameInfo Component</p>

      <p className="text-sm text-gray-500">Làm giao diện thống kê ở đây</p>

      {/* [UC-5][5.5] Hiển thị trạng thái người chơi và số quân hiện tại */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        {playerName} ({color}) - Đang đến lượt: {isActive ? 'Có' : 'Không'} - Số quân: {pieces}
      </div>

      {/* [UC-5][5.6] Nếu trận đấu kết thúc, hệ thống hiển thị kết quả cho Người chơi */}
      {/* (Ví dụ: Có thể hiển thị thẻ trạng thái "NGƯỜI THẮNG" hoặc "KẺ THUA" ở khu vực này) */}

    </div>
  );
}
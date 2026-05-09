"use client";

interface GameInfoProps {
  // [UC-5][5.5]
  // Tên người chơi được hiển thị trên giao diện
  playerName: string;

  // [UC-5][5.5]
  // Trạng thái lượt chơi hiện tại
  isActive: boolean;

  // [UC-5][5.5]
  // Số lượng quân cờ còn lại
  pieces: number;

  // [UC-5][5.5]
  // Màu quân cờ của người chơi
  color: string;
}

export default function GameInfo({ playerName, isActive, pieces, color }: GameInfoProps) {

  // [UC-5][5.2]
  // Controller nhận dữ liệu từ Model và truyền xuống View

  return (
    <div className="p-6 bg-white border rounded shadow-sm text-center">
      
      {/* [UC-5][5.5] Hiển thị thông tin ván đấu */}
      <p className="font-semibold mb-2 text-gray-700">GameInfo Component</p>

      <p className="text-sm text-gray-500">Làm giao diện thống kê ở đây</p>

      {/* [UC-5][5.5] Hiển thị trạng thái người chơi */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        {playerName} - Đang đến lượt: {isActive ? 'Có' : 'Không'}
      </div>

      {/* [UC-5][5.4] Thông tin này hỗ trợ kiểm tra trạng thái trận đấu */}
      {/* [UC-5][5.6] Có thể dùng để hiển thị kết quả khi trận đấu kết thúc */}

    </div>
  );
}
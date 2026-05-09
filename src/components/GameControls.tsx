"use client";

interface GameControlsProps {
  // [UC-5][5.7] Người chơi thực hiện hành động thoát hoặc làm mới ván đấu
  // (View truyền sự kiện này lên Controller để xử lý)
  onRestart: () => void;

  // Hành động điều khiển phụ: Người chơi chọn hoàn tác nước đi
  onUndo: () => void;
}

export default function GameControls({ onRestart, onUndo }: GameControlsProps) {

  // Lưu ý: Component này là View. Các logic như [UC-5][5.2] (Controller nhận 
  // hành động và xử lý logic) sẽ được thực hiện ở Hook (useGameState) 
  // thay vì nằm trong thân hàm render này.

  return (
    <div className="p-6 bg-white border rounded shadow-sm flex flex-col items-center space-y-4">
      
      {/* [UC-5][5.5] View hiển thị giao diện điều khiển ván đấu */}
      <p className="font-semibold text-gray-700 text-center">GameControls Component</p>

      {/* [UC-5][5.7] Nút để người chơi chọn thoát / làm mới ván đấu */}
      <button 
        onClick={onRestart} 
        className="px-6 py-2 bg-slate-800 text-white rounded w-full"
      >
        Làm mới ván cờ
      </button>

      {/* Nút hoàn tác (undo) nước đi */}
      <button 
        onClick={onUndo} 
        className="px-6 py-2 bg-gray-500 text-white rounded w-full"
      >
        Hoàn tác nước đi
      </button>

    </div>
  );
}
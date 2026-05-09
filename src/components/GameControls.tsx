"use client";

interface GameControlsProps {
  // [UC-5][5.7]
  // Người chơi có thể chọn thao tác làm mới (restart) ván đấu
  onRestart: () => void;

  // [UC-5][5.7]
  // Người chơi có thể hoàn tác nước đi (undo)
  onUndo: () => void;
}

export default function GameControls({ onRestart, onUndo }: GameControlsProps) {

  // [UC-5][5.2]
  // Controller nhận hành động từ người chơi và xử lý logic tương ứng

  return (
    <div className="p-6 bg-white border rounded shadow-sm flex flex-col items-center space-y-4">
      
      {/* [UC-5][5.5] Hiển thị giao diện điều khiển ván đấu */}
      <p className="font-semibold text-gray-700 text-center">GameControls Component</p>

      {/* [UC-5][5.7] Người chơi chọn làm mới ván đấu */}
      <button 
        onClick={onRestart} 
        className="px-6 py-2 bg-slate-800 text-white rounded w-full"
      >
        Làm mới ván cờ
      </button>

      {/* [UC-5][5.7] Người chơi có thể hoàn tác (undo) nước đi */}
      <button 
        onClick={onUndo} 
        className="px-6 py-2 bg-gray-500 text-white rounded w-full"
      >
        Hoàn tác nước đi
      </button>

    </div>
  );
}
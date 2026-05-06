"use client";

interface GameControlsProps {
  onRestart: () => void;
  onUndo: () => void;
}

export default function GameControls({ onRestart, onUndo }: GameControlsProps) {
  return (
    <div className="p-6 bg-white border rounded shadow-sm flex flex-col items-center space-y-4">
      <p className="font-semibold text-gray-700 text-center">GameControls Component</p>
      <button 
        onClick={onRestart} 
        className="px-6 py-2 bg-slate-800 text-white rounded w-full"
      >
        Làm mới ván cờ
      </button>
    </div>
  );
}

"use client";

interface GameInfoProps {
  playerName: string;
  isActive: boolean;
  pieces: number;
  color: string;
}

export default function GameInfo({ playerName, isActive, pieces, color }: GameInfoProps) {
  return (
    <div className="p-6 bg-white border rounded shadow-sm text-center">
      <p className="font-semibold mb-2 text-gray-700">GameInfo Component</p>
      <p className="text-sm text-gray-500">Làm giao diện thống kê ở đây</p>
      <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
        {playerName} - Đang đến lượt: {isActive ? 'Có' : 'Không'}
      </div>
    </div>
  );
}

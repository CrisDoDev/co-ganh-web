"use client";
import { BoardState } from "@/lib/gameEngine";

interface GameBoardProps {
  state: BoardState;
  selectedPiece: string | null;
  validMoves: Array<{ x: number; y: number }>;
  onPieceSelect: (id: string) => void;
  onMove: (x: number, y: number) => void;
}

export default function GameBoard({ state, selectedPiece, validMoves, onPieceSelect, onMove }: GameBoardProps) {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50">
      <div className="text-center text-gray-500">
        <p className="font-semibold mb-2">GameBoard Component</p>
        <p className="text-sm">Vẽ các ô grid 5x5 vào đây</p>
      </div>
    </div>
  );
}

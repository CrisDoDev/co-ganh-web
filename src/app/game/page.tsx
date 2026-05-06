"use client";
import { useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import GameBoard from "@/components/GameBoard";
import GameInfo from "@/components/GameInfo";
import GameControls from "@/components/GameControls";

export default function GamePage() {
  const { boardState, selectedPiece, validMoves, initGame, handlePieceSelect, handleMove } = useGameState();

  useEffect(() => { initGame(); }, [initGame]);

  if (!boardState) return <div className="p-8">Loading...</div>;

  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Bàn Cờ Gánh (Base Mẫu)</h1>
      <div className="flex gap-8 w-full max-w-5xl">
        <div className="flex-1 bg-white p-4 border rounded shadow-sm min-h-[500px]">
          <GameBoard 
            state={boardState}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            onPieceSelect={handlePieceSelect}
            onMove={handleMove}
          />
        </div>
        <div className="w-80 flex flex-col space-y-4">
          <GameInfo playerName="Người chơi 1" isActive={boardState.currentPlayer === "player1"} pieces={16} color="blue" />
          <GameInfo playerName="Người chơi 2" isActive={boardState.currentPlayer === "player2"} pieces={16} color="red" />
          <GameControls onRestart={initGame} onUndo={() => {}} />
        </div>
      </div>
    </main>
  );
}

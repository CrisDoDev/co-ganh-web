"use client";

import { useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import GameInfo from "@/components/GameInfo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function GamePage() {
  const {
    boardState,
    selectedPiece,
    timeLeft,
    scores,
    initGame,
    handlePieceSelect,
    handleMove,
  } = useGameState();

  useEffect(() => {
    initGame();
  }, [initGame]);
  if (!boardState)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const player1Count = boardState.pieces.filter(
    (p) => p.owner === "player1",
  ).length;
  const player2Count = boardState.pieces.filter(
    (p) => p.owner === "player2",
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Message */}
      {boardState.message && (
        <div className="mb-6 p-4 bg-card border border-border rounded-lg text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            {boardState.message}
          </p>
          {boardState.phase === "playing" && (
            <p className="text-sm text-muted-foreground mt-1">
              Lượt đi không bắt quân: {boardState.movesWithoutCapture} / 50
            </p>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="hidden lg:block">
            <GameInfo
              playerName="Người chơi 1"
              isActive={boardState.currentPlayer === "player1"}
              pieces={player1Count}
              color="bg-primary/10 border-primary"
              score={scores.player1}
              timeLeft={
                boardState.currentPlayer === "player1" &&
                boardState.phase === "playing"
                  ? timeLeft
                  : undefined
              }
            />
          </div>

          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <GameBoard
              boardState={boardState}
              selectedPiece={selectedPiece}
              onPieceSelect={handlePieceSelect}
              onMove={handleMove}
              gameOver={boardState.phase !== "playing"}
            />
          </div>

          <div className="hidden lg:block">
            <GameInfo
              playerName="Người chơi 2"
              isActive={boardState.currentPlayer === "player2"}
              pieces={player2Count}
              color="bg-secondary/10 border-secondary"
              score={scores.player2}
              timeLeft={
                boardState.currentPlayer === "player2" &&
                boardState.phase === "playing"
                  ? timeLeft
                  : undefined
              }
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <GameControls onRestart={initGame} />
        </div>
      </div>

      {/* 5.2.4 View (GameInfo) nhận dữ liệu thay đổi, tự động mở Dialog Pop-up hiển thị tên người chiến thắng kèm lý do (ăn sạch quân hoặc đối phương hết nước đi). */}
      {/* 5.3.4 View (GameInfo) nhận dữ liệu, kích hoạt mở Dialog Pop-up thông báo tiêu đề "HÒA NHAU! (Sau 50 lượt không ăn quân)". */}
      <AlertDialog open={boardState.phase !== "playing"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {boardState.phase === "draw" ? "HÒA NHAU!" : "Trò Chơi Kết Thúc!"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg mt-2">
              {boardState.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={initGame}>
              Chơi lại ván mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

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
  const { boardState, selectedPiece, initGame, handlePieceSelect, handleMove } =
    useGameState();

  useEffect(() => {
    initGame();
  }, [initGame]);

  if (!boardState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const player1Count = boardState.pieces.filter(
    (p) => p.owner === "player1",
  ).length;
  const player2Count = boardState.pieces.filter(
    (p) => p.owner === "player2",
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-primary">
            Cờ Gánh
          </h1>
          <Link href="/">
            <Button variant="outline" className="font-semibold">
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Message */}
        {boardState.message && (
          <div className="mb-6 p-4 bg-card border border-border rounded-lg text-center">
            <p className="text-lg font-semibold text-foreground">
              {boardState.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Player 1 Info */}
          <div className="hidden lg:block">
            <GameInfo
              playerName="Người chơi 1"
              isActive={boardState.currentPlayer === "player1"}
              pieces={player1Count}
              color="bg-primary/10 border-primary"
            />
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <GameBoard
              boardState={boardState}
              selectedPiece={selectedPiece}
              onPieceSelect={handlePieceSelect}
              onMove={handleMove}
              gameOver={boardState.gameOver}
            />
          </div>

          {/* Right Sidebar - Player 2 Info */}
          <div className="hidden lg:block">
            <GameInfo
              playerName="Người chơi 2"
              isActive={boardState.currentPlayer === "player2"}
              pieces={player2Count}
              color="bg-secondary/10 border-secondary"
            />
          </div>
        </div>

        {/* Game Controls - Below Board */}
        <div className="mt-8 flex justify-center">
          <GameControls onRestart={initGame} gameOver={boardState.gameOver} />
        </div>

        {/* Mobile Player Info */}
        <div className="lg:hidden mt-8 space-y-4">
          <GameInfo
            playerName={
              boardState.currentPlayer === "player1"
                ? "Người chơi 1"
                : "Người chơi 2"
            }
            isActive={true}
            pieces={
              boardState.currentPlayer === "player1"
                ? player1Count
                : player2Count
            }
            color="bg-primary/10 border-primary"
          />
        </div>
      </div>

      {/* =========================================================================
        [UC-5: Theo dõi diễn biến và kết thúc ván cờ] - Đảm nhận: Chí
        Chức năng: View - Hiển thị Popup (Dialog) thông báo kết quả Game Over.
        Đại diện chốt hạ cho luồng MVC: Model (kiểm tra GameOver) -> View (Mở Popup).
        ========================================================================= */}
      <AlertDialog open={boardState.gameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trò Chơi Kết Thúc!</AlertDialogTitle>
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

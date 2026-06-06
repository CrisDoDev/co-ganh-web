"use client";

import { useEffect, useState } from "react";
import { getValidMoves, type BoardState } from "@/lib/gameEngine";

interface GameBoardProps {
  boardState: BoardState;
  selectedPiece: string | null;
  onPieceSelect: (pieceId: string) => void;
  onMove: (toX: number, toY: number) => void;
  gameOver: boolean;
}

const BOARD_SIZE = 5;

export default function GameBoard({
  boardState,
  selectedPiece,
  onPieceSelect,
  onMove,
  gameOver,
}: GameBoardProps) {
  const [validMoves, setValidMoves] = useState<Array<{ x: number; y: number }>>(
    [],
  );

  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(selectedPiece, boardState);
      setValidMoves(moves);
    } else {
      setValidMoves([]);
    }
  }, [selectedPiece, boardState]);

  const getPieceAt = (x: number, y: number) => {
    return boardState.pieces.find((p) => p.x === x && p.y === y);
  };

  const handleSquareClick = (x: number, y: number) => {
    if (gameOver) return;

    const clickedPiece = getPieceAt(x, y);

    // If clicking on own piece, select it
    if (clickedPiece && clickedPiece.owner === boardState.currentPlayer) {
      onPieceSelect(clickedPiece.id);
      return;
    }

    // If a piece is selected and clicking on valid move
    if (selectedPiece && validMoves.some((m) => m.x === x && m.y === y)) {
      onMove(x, y);
      return;
    }

    // Deselect if clicking elsewhere
    if (!clickedPiece) {
      onPieceSelect("");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-card border-8 border-primary shadow-2xl rounded-lg p-4">
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
        >
          {Array.from({ length: BOARD_SIZE }).map((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => {
              const piece = getPieceAt(x, y);
              const isValid = validMoves.some((m) => m.x === x && m.y === y);
              const isSelected =
                selectedPiece &&
                boardState.pieces.find((p) => p.id === selectedPiece)?.x ===
                  x &&
                boardState.pieces.find((p) => p.id === selectedPiece)?.y === y;

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleSquareClick(x, y)}
                  disabled={gameOver}
                  className={`
                    w-16 h-16 border border-border transition-all
                    ${(x + y) % 2 === 0 ? "bg-muted" : "bg-background"}
                    hover:bg-opacity-80 cursor-pointer
                    relative
                    ${isSelected ? "ring-4 ring-accent" : ""}
                    ${gameOver ? "cursor-not-allowed" : ""}
                  `}
                >
                  {/* Valid move indicator */}
                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* Piece */}
                  {piece && (
                    <div
                      className={`
                        absolute inset-2 rounded-full shadow-lg 
                        flex items-center justify-center font-serif font-bold text-lg
                        transition-transform hover:scale-110
                        ${
                          piece.owner === "player1"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }
                      `}
                    >
                      {piece.owner === "player1" ? "●" : "○"}
                    </div>
                  )}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

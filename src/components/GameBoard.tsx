"use client";
import { getValidMoves, type BoardState } from "@/lib/gameEngine";
import { useEffect, useState } from 'react'


interface GameBoardProps {
  boardState: BoardState;
  selectedPiece: string | null;
  onPieceSelect: (id: string) => void;
  onMove: (x: number, y: number) => void;
  gameOver: boolean

}

const BOARD_SIZE = 5

export default function GameBoard({ boardState, selectedPiece, gameOver, onPieceSelect, onMove }: GameBoardProps) {
  const [validMoves, setValidMoves] = useState<Array<{x: number; y: number}>>([])

  useEffect(() => {
    if (selectedPiece) {
      const moves = getValidMoves(selectedPiece, boardState)
      setValidMoves(moves)
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, boardState])

  const getPieceAt = (x: number, y: number) => {
    return boardState.pieces.find(p => p.x === x && p.y === y)
  }

  const handleSquareClick = (x: number, y: number) => {
   
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-card border-8 border-primary shadow-2xl rounded-lg p-4">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
          {Array.from({ length: BOARD_SIZE }).map((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => {
              const piece = getPieceAt(x, y)
              const isValid = validMoves.some(m => m.x === x && m.y === y)
              const isSelected = selectedPiece && boardState.pieces.find(p => p.id === selectedPiece)?.x === x && boardState.pieces.find(p => p.id === selectedPiece)?.y === y

              return (
                <button
                  key={`${x}-${y}`}
                  onClick={() => handleSquareClick(x, y)}
                  disabled={gameOver}
                  className={`
                    w-16 h-16 border border-border transition-all
                    ${(x + y) % 2 === 0 ? 'bg-muted' : 'bg-background'}
                    hover:bg-opacity-80 cursor-pointer
                    relative
                    ${/* [UC-2] Nam: Highlight khung viền khi chọn quân cờ */ ''}
                    ${isSelected ? 'ring-4 ring-accent' : ''}
                    ${gameOver ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {/* [UC-2] Nam: Render dấu chấm gợi ý nước đi */}
                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* [UC-2] Nam: Render biểu tượng quân cờ. Chuẩn bị cho Animation GĐ2 */}
                  {piece && (
                    <div
                      className={`
                        absolute inset-2 rounded-full shadow-lg 
                        flex items-center justify-center font-serif font-bold text-lg
                        transition-transform hover:scale-110
                        ${piece.owner === 'player1'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                        }
                      `}
                    >
                      {piece.owner === 'player1' ? '●' : '○'}
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}

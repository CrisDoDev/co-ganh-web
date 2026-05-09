'use client'

import { useEffect, useState } from 'react'
import { getValidMoves, type BoardState } from '@/lib/gameEngine'

interface GameBoardProps {
  boardState: BoardState
  selectedPiece: string | null
  onPieceSelect: (pieceId: string) => void
  onMove: (toX: number, toY: number) => void
  gameOver: boolean
}

const BOARD_SIZE = 5

export default function GameBoard({ 
  boardState, 
  selectedPiece, 
  onPieceSelect, 
  onMove,
  gameOver 
}: GameBoardProps) {
  const [validMoves, setValidMoves] = useState<Array<{x: number; y: number}>>([])

  // =========================================================================
  // UC-2.4: Controller/Model tính toán danh sách nước đi hợp lệ
  // UC-2.5: View nhận dữ liệu và cập nhật state hiển thị
  // =========================================================================
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

  // =========================================================================
  // [UC-2: Tương tác di chuyển quân cờ] - View Layer
  // Chức năng: bắt toàn bộ click trên bàn cờ (select + move)
  // =========================================================================
  const handleSquareClick = (x: number, y: number) => {

    // UC-2.1: Người chơi click vào một ô trên bàn cờ
    // UC-2.2: View gửi event sang Controller thông qua onPieceSelect / onMove

    if (gameOver) return

    const clickedPiece = getPieceAt(x, y)

    // =========================
    // UC-2.1 (CASE): chọn quân cờ của mình
    // =========================
    if (clickedPiece && clickedPiece.owner === boardState.currentPlayer) {
      onPieceSelect(clickedPiece.id)
      return
    }

    // =========================
    // UC-2.7: click vào ô hợp lệ để di chuyển
    // =========================
    if (selectedPiece && validMoves.some(m => m.x === x && m.y === y)) {
      onMove(x, y)
      return
    }

    // =========================
    // UC-2.b ALT FLOW: click ngoài → deselect
    // =========================
    if (!clickedPiece) {
      onPieceSelect('')
    }
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
                    ${/* UC-2.6.1: highlight quân cờ đang được chọn */ ''}
                    ${isSelected ? 'ring-4 ring-accent' : ''}
                    ${gameOver ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {/* UC-2.6.2: hiển thị gợi ý nước đi hợp lệ */}
                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* UC-2.6.1: render quân cờ */}
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
  )
}
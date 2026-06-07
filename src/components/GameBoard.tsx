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

  const [validMoves, setValidMoves] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {

    // 3.3.0 Controller yêu cầu Model xác định các ô lân cận có thể di chuyển.

    if (selectedPiece) {

      const moves = getValidMoves(
        selectedPiece,
        boardState
      )

      //3.5.0 Hệ thống nhận danh sách nước đi hợp lệ.

      setValidMoves(moves)

      // 3.6.0 View hiển thị các ô có thể di chuyển.

    } else {
      setValidMoves([])
    }

  }, [selectedPiece, boardState])

  const getPieceAt = (x: number, y: number) => {
    return boardState.pieces.find(p => p.x === x && p.y === y)
  }

  const handleSquareClick = (x: number, y: number) => {

    // 3.1.0 Người chơi chọn một quân cờ trên bàn cờ hoặc chọn một ô đích.

    if (gameOver) return

    const clickedPiece = getPieceAt(x, y)

    // 3.2.0 Hệ thống kiểm tra quân cờ có thuộc quyền điều khiển của người chơi hiện tại hay không.

    if (clickedPiece && clickedPiece.owner === boardState.currentPlayer) {

      // 3.2.0 Quân cờ hợp lệ, gửi yêu cầu chọn quân sang Controller.

      onPieceSelect(clickedPiece.id)
      return
    }

    // 3.7.0 Người chơi chọn một ô đích.

    // 3.8.0 Hệ thống xác nhận ô đích có thuộc danh sách nước đi hợp lệ hay không.

    if (
      selectedPiece &&
      validMoves.some(m => m.x === x && m.y === y)
    ) {

      // 3.9.0 Hệ thống cho phép thực hiện nước đi và chuyển tiếp sang UC-4.

      onMove(x, y)
      return
    }

    // [AF3] Người chơi chọn ô đích không thuộc danh sách nước đi hợp lệ. Hệ thống từ chối yêu cầu di chuyển.

    if (!clickedPiece) {
      onPieceSelect('')
    }

    // [AF1] Người chơi chọn ô không có quân hoặc quân không thuộc lượt hiện tại. Hệ thống không ghi nhận lựa chọn.

  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-card border-8 border-primary shadow-2xl rounded-lg p-4">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`
          }}
        >
          {Array.from({ length: BOARD_SIZE }).map((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => {

              const piece = getPieceAt(x, y)

              const isValid = validMoves.some(
                m => m.x === x && m.y === y
              )

              const isSelected =
                selectedPiece &&
                boardState.pieces.find(
                  p => p.id === selectedPiece
                )?.x === x &&
                boardState.pieces.find(
                  p => p.id === selectedPiece
                )?.y === y

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
                    ${isSelected ? 'ring-4 ring-accent' : ''}
                    ${gameOver ? 'cursor-not-allowed' : ''}
                  `}
                >

                  {/* [UC-3][3.6.0] Hiển thị các ô có thể di chuyển */}

                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* 3.6.0 Hiển thị quân cờ trên bàn cờ */}

                  {piece && (
                    <div
                      className={`
                        absolute inset-2 rounded-full shadow-lg
                        flex items-center justify-center
                        font-serif font-bold text-lg
                        transition-transform hover:scale-110
                        ${piece.owner === 'player1'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                        }
                      `}
                    >
                      {piece.owner === 'player1'
                        ? '●'
                        : '○'}
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
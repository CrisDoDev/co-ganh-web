'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion' // [PHÁT TRIỂN TIẾP GĐ2]: Import thư viện tạo Animation
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

  useEffect(() => {
    if (selectedPiece) {
      // 2.1.2.1 Controller gửi yêu cầu sang Model để tính toán các nước đi hợp lệ xung quanh quân cờ.
      const moves = getValidMoves(selectedPiece, boardState)
      // 2.1.4 Controller gửi danh sách nước đi hợp lệ về View.
      setValidMoves(moves)
    } else {
      // 2.1.9.1 Xóa toàn bộ dấu chấm gợi ý (khi không có quân nào được chọn hoặc sau khi đi xong).
      setValidMoves([])
    }
  }, [selectedPiece, boardState])

  const getPieceAt = (x: number, y: number) => {
    return boardState.pieces.find(p => p.x === x && p.y === y)
  }

  const handleSquareClick = (x: number, y: number) => {

    if (gameOver) return

    const clickedPiece = getPieceAt(x, y)

    // 2.1.0 Người chơi click vào một quân cờ thuộc phe của mình trên bàn cờ.
    if (clickedPiece && clickedPiece.owner === boardState.currentPlayer) {
      // 2.2.2 Luồng đổi quân cờ được chọn: Nếu người chơi click sang một quân cờ khác thuộc phe mình.
      // 2.1.1 View gửi sự kiện chọn quân cờ sang Controller.
      onPieceSelect(clickedPiece.id)
      return
    }

    // 2.1.6 Người chơi click vào một ô đích hợp lệ.
    if (selectedPiece && validMoves.some(m => m.x === x && m.y === y)) {
      // 2.1.7 View gửi yêu cầu thực hiện nước đi sang Controller.
      onMove(x, y)
      return
    }

    // 2.2.0 Luồng chọn quân không hợp lệ / 2.7.a Luồng chọn ô đích không hợp lệ.
    if (!clickedPiece) {
      // 2.2.0.2 Hệ thống không hiển thị trạng thái nổi bật hay dấu chấm gợi ý.
      // 2.2.1.1 Quân cờ hiện tại vẫn giữ trạng thái được chọn (nếu click sai thì Controller xử lý ngầm, ở View báo deselect).
      onPieceSelect('')
    }
  }
// 2.1.5 View thực hiện cập nhật giao diện.
  // 2.1.9 View cập nhật giao diện bàn cờ.
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
                    ${/* 2.1.5.0 Làm nổi bật quân cờ đang được chọn (ví dụ: hiện viền hoặc hiệu ứng sáng). */ ''}
                    ${/* 2.1.9.0 Xóa trạng thái làm nổi bật quân cờ cũ. */ ''}
                    ${isSelected ? 'ring-4 ring-accent' : ''}
                    ${gameOver ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {/* 2.1.5.1 Hiển thị dấu chấm gợi ý tại các ô có thể đi. */}
                  {isValid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                    </div>
                  )}

                  {/* 2.1.9.2 Hiển thị quân cờ tại vị trí mới. */}
                  {/* [PHÁT TRIỂN TIẾP GĐ2]: Bọc bằng motion.div để tạo Animation lướt mượt mà */}
                  {piece && (
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 250, damping: 25 }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
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
                    </motion.div>
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

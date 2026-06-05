import { Position } from "./types";

export const BOARD_SIZE = 5;

// [UC-3: Board Topology - Lưới và tọa độ]
// Chức năng: Helper quản lý topology cố định của bàn game thay vì dùng Strategy

export const BoardTopology = {
  // Check xem tọa độ (x,y) có nằm trong bàn cờ không
  isValidPosition: (x: number, y: number): boolean => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  },
 // Check xem ô này có đường chéo không ( x+y chẵn thì mới có)
  canMoveDiagonal: (x: number, y: number): boolean => {
    return (x + y) % 2 === 0;
  },
   // Lấy tất cả các ô xung quanh (neighbors) có đường nối hợp lệ
  getAvailableNeighbors: (x: number, y: number): Position[] => {
    const neighbors: Position[] = [];

    // Các hướng ngang, dọc (luôn luôn có ở mọi ô)
    const orthogonalDirs = [
      { dx: 0, dy: -1 }, // Lên
      { dx: 0, dy: 1 }, // Xuống
      { dx: -1, dy: 0 }, // Trái
      { dx: 1, dy: 0 }, // Phải
    ];

    // Các hướng chéo (chỉ có ở các ô canMoveDiagonal)
    const diagonalDirs = [
      { dx: -1, dy: -1 }, // Lên trái
      { dx: 1, dy: -1 }, // Lên phải
      { dx: -1, dy: 1 }, // Xuống trái
      { dx: 1, dy: 1 }, // Xuống phải
    ];

    const dirsToUse = BoardTopology.canMoveDiagonal(x, y)
      ? [...orthogonalDirs, ...diagonalDirs]
      : orthogonalDirs;

    for (const dir of dirsToUse) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      if (BoardTopology.isValidPosition(newX, newY)) {
        neighbors.push({ x: newX, y: newY });
      }
    }

    return neighbors;
  },
};
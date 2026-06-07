//Cập nhật - Bùi Trung Nam:
//Bổ sung BoardTopology để kiểm tra tính hợp lệ của nước đi dựa trên topology bàn cờ

import { Position } from "./types";

export const BOARD_SIZE = 5;
export const BoardTopology = {

  // 3.4.1 Hệ thống kiểm tra ô đích có nằm trong phạm vi bàn cờ hay không.
  isValidPosition: (x: number, y: number): boolean => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  },

  // 3.4.2 Hệ thống kiểm tra có tồn tại đường nối chéo hợp lệ từ ô hiện tại hay không.
  canMoveDiagonal: (x: number, y: number): boolean => {
    return (x + y) % 2 === 0;
  },

  // 3.3.0 Hệ thống xác định các ô lân cận có thể di chuyển dựa trên topology bàn cờ.
  getAvailableNeighbors: (x: number, y: number): Position[] => {
    const neighbors: Position[] = [];

    const orthogonalDirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];

    const diagonalDirs = [
      { dx: -1, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: 1, dy: 1 },
    ];

    // 3.4.2 Xác định tập hướng di chuyển hợp lệ (ngang, dọc, chéo được phép).
    const dirsToUse = BoardTopology.canMoveDiagonal(x, y)
      ? [...orthogonalDirs, ...diagonalDirs]
      : orthogonalDirs;

    for (const dir of dirsToUse) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      // 3.4.1 Chỉ chấp nhận các ô đích nằm trong phạm vi bàn cờ.
      if (BoardTopology.isValidPosition(newX, newY)) {
        neighbors.push({ x: newX, y: newY });
      }
    }

    // 3.5.0 Trả về danh sách các ô đích hợp lệ theo topology.
    return neighbors;
  },
};
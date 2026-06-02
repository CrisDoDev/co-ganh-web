import { Position } from "./types";

export const BOARD_SIZE = 5;

// [UC-3: Board Topology - Lưới và tọa độ]
// Chức năng: Helper quản lý topology cố định của bàn game thay vì dùng Strategy

export const BoardTopology = {
  // Check xem tọa độ (x,y) có nằm trong bàn cờ không
  isValidPosition: (x: number, y: number): boolean => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  },

};
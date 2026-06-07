// src/lib/types.ts

// Loại người chơi & màu cờ
export type Player = "player1" | "player2";
export type PieceColor = "player1" | "player2";

// Tọa độ trên bàn cờ
export interface Position {
  x: number;
  y: number;
}

// Đối tượng quân cờ
export interface Piece {
  id: string;
  x: number;
  y: number;
  owner: PieceColor;
}

// Các trạng thái của Ván cờ
export type GamePhase = "playing" | "game_over" | "draw";

export interface BoardState {
  pieces: Piece[];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  phase: GamePhase;
  movesWithoutCapture: number; // Thuộc tính phục vụ luật Hòa (Giới hạn 50 nước)
  message: string;
  lastCapturedIds?: string[];
}

// Struct thông tin khi di chuyển
export interface GameMove {
  pieceId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

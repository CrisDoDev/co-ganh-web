

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
  x: number; // Tọa độ thật của quân cờ
  y: number;
  owner: PieceColor;
}

// Các trạng thái của Ván cờ (State Pattern)
export type GamePhase = "playing" | "game_over" | "draw";

export interface BoardState {
  pieces: Piece[];
  currentPlayer: Player;
  moveHistory?: string[]; // Mảng lưu lịch sử nước đi phục vụ đồng bộ hệ thống
  gameOver: boolean; // UC-5: True nếu có state game_over hoặc draw
  winner: Player | null; // Lấy data winner khi GameOverState
  phase: GamePhase; // State Pattern Behavior
  movesWithoutCapture: number; // Thuộc tính phục vụ luật Hòa (Giới hạn 50 nước) - UC-5
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
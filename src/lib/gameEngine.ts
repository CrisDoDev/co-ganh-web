export type PieceOwner = "player1" | "player2";

export interface Piece {
  id: string;
  x: number;
  y: number;
  owner: PieceOwner;
}

export interface BoardState {
  pieces: Piece[];
  currentPlayer: PieceOwner;
  moveHistory: any[];
  gameOver: boolean;
  winner: PieceOwner | null;
  message: string;
}

export interface GameMove {
  pieceId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export const BOARD_SIZE = 5;
export const TOTAL_PIECES = 16;

export function initializeBoard(): BoardState {
  return {
    pieces: [],
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    message: "Chờ người chơi vào",
  };
}

export function getValidMoves(
  pieceId: string,
  state: BoardState,
): Array<{ x: number; y: number }> {
  return [];
}

export function processGanh(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {
  return [];
}

export function processChat(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {
  return [];
}

export function processSurrounding(pieces: Piece[]): string[] {
  return [];
}

export function executeMove(move: GameMove, state: BoardState): BoardState {
  return state;
}

export type Player = "player1" | "player2";
export type PieceColor = "player1" | "player2";

export interface Piece {
  id: string;
  x: number;
  y: number;
  owner: PieceColor;
}

export interface BoardState {
  pieces: Piece[];
  currentPlayer: Player;
  moveHistory: string[];
  gameOver: boolean;
  winner: Player | null;
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

// =========================================================================
// [UC-1: Khởi động và Thiết lập ván cờ] - Đảm nhận: Phúc
// Chức năng: Khởi tạo mảng bàn cờ 5x5, xếp 16 quân cờ đối xứng nhau và set lượt đi đầu tiên
// Model: Xử lý quy hoạch dữ liệu nền tảng ban đầu
// =========================================================================
export function initializeBoard(): BoardState {

  const pieces: Piece[] = [];
  let id = 0;

  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p1-${id++}`, x, y: 4, owner: "player1" });
  }
  pieces.push({ id: `p1-${id++}`, x: 0, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 4, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 0, y: 2, owner: "player1" });

  id = 0;

  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p2-${id++}`, x, y: 0, owner: "player2" });
  }
  pieces.push({ id: `p2-${id++}`, x: 0, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${id++}`, x: 4, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${id++}`, x: 4, y: 2, owner: "player2" });

  return {
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    message: "Đến lượt Người chơi 1",
  };
}

// =========================================================================
// [UC-3: Xác thực tính hợp lệ của nước đi] - Đảm nhận: Long
// =========================================================================
function isValidPosition(x: number, y: number, pieces: Piece[]): boolean {

  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }

  return !pieces.some((p) => p.x === x && p.y === y);
}

// =========================================================================
// [UC-3: Tính toán nước đi hợp lệ] - Đảm nhận: Long
// Gắn với UC-2.4 (View/Controller gọi Model để lấy valid moves)
// =========================================================================
export function getValidMoves(
  pieceId: string,
  state: BoardState,
): Array<{ x: number; y: number }> {

  // UC-2.4: Model nhận request từ Controller để tính nước đi

  const piece = state.pieces.find((p) => p.id === pieceId);

  // UC-2.a ALT: quân không hợp lệ hoặc sai lượt
  if (!piece || piece.owner !== state.currentPlayer) {
    return [];
  }

  const validMoves: Array<{ x: number; y: number }> = [];

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];

  for (const dir of directions) {
    const newX = piece.x + dir.dx;
    const newY = piece.y + dir.dy;

    if (isValidPosition(newX, newY, state.pieces)) {
      validMoves.push({ x: newX, y: newY });
    }
  }

  // UC-2.5: trả danh sách về View
  return validMoves;
}

// =========================================================================
// [UC-4: Luật Gánh - bắt quân] - Đảm nhận: Phước
// =========================================================================
function processGanh(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {

  const capturedIds: string[] = [];
  const movedPiece = pieces.find((p) => p.id === movedPieceId)!;

  const opponentOwner = movedPiece.owner === "player1" ? "player2" : "player1";

  const axes = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
  ];

  for (const axis of axes) {

    const p1X = newX + axis.dx;
    const p1Y = newY + axis.dy;
    const p2X = newX - axis.dx;
    const p2Y = newY - axis.dy;

    const piece1 = pieces.find((p) => p.x === p1X && p.y === p1Y);
    const piece2 = pieces.find((p) => p.x === p2X && p.y === p2Y);

    if (
      piece1 &&
      piece1.owner === opponentOwner &&
      piece2 &&
      piece2.owner === opponentOwner
    ) {
      if (!capturedIds.includes(piece1.id)) capturedIds.push(piece1.id);
      if (!capturedIds.includes(piece2.id)) capturedIds.push(piece2.id);
    }
  }

  return capturedIds;
}

// =========================================================================
// UC-4 (Phase 2): Luật Chẹt (placeholder)
// =========================================================================
function processChat(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {
  return [];
}

// =========================================================================
// UC-4 (Phase 2): Luật Vây (placeholder)
// =========================================================================
function processSurrounding(pieces: Piece[]): string[] {
  return [];
}

// =========================================================================
// [UC-4: Thực thi nước đi + cập nhật state] - Controller/Model boundary
// =========================================================================
export function executeMove(move: GameMove, state: BoardState): BoardState {

  if (state.gameOver) return state;

  const newState: BoardState = {
    pieces: state.pieces.map((p) => ({ ...p })),
    currentPlayer: state.currentPlayer,
    moveHistory: [...state.moveHistory],
    gameOver: state.gameOver,
    winner: state.winner,
    message: state.message,
  };

  const piece = newState.pieces.find((p) => p.id === move.pieceId);
  if (!piece) return state;

  piece.x = move.toX;
  piece.y = move.toY;

  const ganhCaptured = processGanh(
    move.pieceId,
    move.toX,
    move.toY,
    newState.pieces,
  );

  for (const id of ganhCaptured) {
    const capturedPiece = newState.pieces.find((p) => p.id === id);
    if (capturedPiece) capturedPiece.owner = newState.currentPlayer;
  }

  const p1Count = newState.pieces.filter((p) => p.owner === "player1").length;
  const p2Count = newState.pieces.filter((p) => p.owner === "player2").length;

  if (p1Count === TOTAL_PIECES) {
    newState.gameOver = true;
    newState.winner = "player1";
    newState.message = "Người chơi 1 chiến thắng! Đã ăn toàn bộ quân đối phương.";
  } else if (p2Count === TOTAL_PIECES) {
    newState.gameOver = true;
    newState.winner = "player2";
    newState.message = "Người chơi 2 chiến thắng! Đã ăn toàn bộ quân đối phương.";
  } else {

    newState.currentPlayer =
      newState.currentPlayer === "player1" ? "player2" : "player1";

    const nextPlayerPieces = newState.pieces.filter(
      (p) => p.owner === newState.currentPlayer,
    );

    const hasValidMoves = nextPlayerPieces.some(
      (p) => getValidMoves(p.id, newState).length > 0,
    );

    if (nextPlayerPieces.length === 0 || !hasValidMoves) {
      newState.gameOver = true;
      newState.winner =
        newState.currentPlayer === "player1" ? "player2" : "player1";

      newState.message = "Hết nước đi - game over";
    } else {
      newState.message =
        newState.currentPlayer === "player1"
          ? "Đến lượt Người chơi 1"
          : "Đến lượt Người chơi 2";
    }
  }

  return newState;
}
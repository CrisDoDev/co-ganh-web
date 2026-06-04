export type Player = "player1" | "player2";
export type PieceColor = "player1" | "player2";

export interface Piece {
  id: string;
  x: number;
  y: number;
  owner: PieceColor;
}

// State Pattern: Định nghĩa các trạng thái vòng đời của ván cờ
export type GamePhase = "playing" | "game_over" | "draw";

export interface BoardState {
  pieces: Piece[];
  currentPlayer: Player;
  moveHistory: string[];
  gameOver: boolean;
  winner: Player | null;
  message: string;
  movesWithoutCapture: number;
  phase: GamePhase; // Thuộc tính cốt lõi của State Pattern quản lý hành vi game
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
export const MAX_DRAW_MOVES = 50;

// Khởi tạo dữ liệu ván cờ mới
export function initializeBoard(): BoardState {
  const pieces: Piece[] = [];
  let id = 0;

  // Player 1 (Bottom)
  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p1-${id++}`, x, y: 4, owner: "player1" });
  }
  pieces.push({ id: `p1-${id++}`, x: 0, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 4, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 0, y: 2, owner: "player1" });

  id = 0;

  // Player 2 (Top)
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
    movesWithoutCapture: 0,
    phase: "playing", // Trạng thái ban đầu: Đang chơi
  };
}

function isValidPosition(x: number, y: number, pieces: Piece[]): boolean {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }
  return !pieces.some((p) => p.x === x && p.y === y);
}

export function getValidMoves(
  pieceId: string,
  state: BoardState,
): Array<{ x: number; y: number }> {
  const piece = state.pieces.find((p) => p.id === pieceId);
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
  return validMoves;
}

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

export function executeMove(move: GameMove, state: BoardState): BoardState {
  // Ngăn chặn tương tác nếu trạng thái hiện tại thuộc các State kết thúc
  if (state.phase !== "playing") return state;

  const newState: BoardState = {
    pieces: state.pieces.map((p) => ({ ...p })),
    currentPlayer: state.currentPlayer,
    moveHistory: [...state.moveHistory],
    gameOver: state.gameOver,
    winner: state.winner,
    message: state.message,
    movesWithoutCapture: state.movesWithoutCapture,
    phase: state.phase,
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

  const isCaptureHappen = ganhCaptured.length > 0;
  newState.movesWithoutCapture = isCaptureHappen
    ? 0
    : state.movesWithoutCapture + 1;

  const p1Count = newState.pieces.filter((p) => p.owner === "player1").length;
  const p2Count = newState.pieces.filter((p) => p.owner === "player2").length;

  // ===============================
  // XỬ LÝ CHUYỂN ĐỔI TRẠNG THÁI
  // ===============================

  // Trường hợp 1: Một người chơi không còn quân cờ nào trên bàn cờ
  if (p1Count === 0 || p2Count === 0) {
    newState.phase = "game_over"; // Chuyển sang kết thúc ván
    newState.gameOver = true;
    newState.winner = p1Count === 0 ? "player2" : "player1";
    newState.message = `${newState.winner === "player1" ? "Người chơi 1" : "Người chơi 2"} chiến thắng! Đã ăn toàn bộ quân đối phương.`;
  }
  // Trường hợp 2: Vượt quá giới hạn 50 nước đi không ăn quân -> Xử Hòa
  else if (newState.movesWithoutCapture >= MAX_DRAW_MOVES) {
    newState.phase = "draw"; // Chuyển đổi sang State Hòa
    newState.gameOver = true;
    newState.winner = null;
    newState.message = "Hai người chơi HÒA nhau! (Sau 50 lượt không ăn quân).";
  }
  // Kịch bản tiếp diễn hoặc check kẹt nước
  else {
    newState.currentPlayer =
      newState.currentPlayer === "player1" ? "player2" : "player1";

    const nextPlayerPieces = newState.pieces.filter(
      (p) => p.owner === newState.currentPlayer,
    );
    const hasValidMoves = nextPlayerPieces.some(
      (p) => getValidMoves(p.id, newState).length > 0,
    );

    // Kịch bản 3: Người chơi đến lượt nhưng không còn nước đi hợp lệ (Kẹt nước)
    if (nextPlayerPieces.length === 0 || !hasValidMoves) {
      newState.phase = "game_over"; // Chuyển sang kết thúc ván
      newState.gameOver = true;
      newState.winner =
        newState.currentPlayer === "player1" ? "player2" : "player1";
      const loserName =
        newState.currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
      const winnerName =
        newState.winner === "player1" ? "Người chơi 1" : "Người chơi 2";
      newState.message = `${loserName} hết nước đi. ${winnerName} chiến thắng!`;
    } else {
      // Ván đấu duy trì State cũ (playing)
      newState.phase = "playing";
      const playerName =
        newState.currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
      newState.message = `Đến lượt ${playerName}`;
    }
  }

  return newState;
}

export function passTurn(state: BoardState): BoardState {
  if (state.phase !== "playing") return state;
  const nextPlayer = state.currentPlayer === "player1" ? "player2" : "player1";

  return {
    ...state,
    currentPlayer: nextPlayer,
    message: `Đến lượt ${nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2"}`,
  };
}

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
  if (state.phase !== "playing") return state;

  let newPieces = state.pieces.map((p) => ({ ...p }));
  const movedPiece = newPieces.find((p) => p.id === move.pieceId);
  if (!movedPiece) return state;

  movedPiece.x = move.toX;
  movedPiece.y = move.toY;

  const myOwner = movedPiece.owner;
  const opponent = myOwner === "player1" ? "player2" : "player1";

  const capturedByGanh = getCapturedByGanh(
    move.toX,
    move.toY,
    myOwner,
    newPieces,
  );
  const capturedByChet = getCapturedByChet(
    move.toX,
    move.toY,
    myOwner,
    newPieces,
  );

  let totalCaptured = [...capturedByGanh, ...capturedByChet];
  let isCaptureHappen = totalCaptured.length > 0;
  let lastCapturedIds: string[] = [];

  for (const piece of totalCaptured) {
    const target = newPieces.find((p) => p.id === piece.id);
    if (target) {
      target.owner = myOwner;
      lastCapturedIds.push(piece.id);
    }
  }

  const capturedByVay = getCapturedByVay(newPieces, opponent);
  if (capturedByVay.length > 0) {
    isCaptureHappen = true;
    for (const piece of capturedByVay) {
      const target = newPieces.find((p) => p.id === piece.id);
      if (target) {
        target.owner = myOwner;
        lastCapturedIds.push(piece.id);
      }
    }
  }

  // 5.1.0 Hệ thống kết thúc UC-4 thành công.

  let newMovesWithoutCapture = isCaptureHappen
    ? 0
    : state.movesWithoutCapture + 1;

  // 5.1.2 Model quét mảng dữ liệu, đếm số quân hiện tại và gọi hàm hasAnyValidMoves để check nước đi của đối thủ.
  const p1Count = newPieces.filter((p) => p.owner === "player1").length;
  const p2Count = newPieces.filter((p) => p.owner === "player2").length;
  let nextPlayer: Player = opponent;
  let phase: GamePhase = "playing";
  let winner: Player | null = null;
  let message = `Đến lượt ${nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2"}`;

  // 5.2.0 Tại bước 5.1.3, Model phát hiện một bên có số quân bằng 0 HOẶC hàm hasAnyValidMoves trả về false (đối thủ bị kẹt cứng).
  if (p1Count === 0 || p2Count === 0) {
    // 5.2.1 Model thiết lập phase = "game_over", gán ID người thắng vào biến winner và bật cờ hiệu gameOver = true.
    phase = "game_over";
    winner = p1Count === 0 ? "player2" : "player1";
    message = `${winner === "player1" ? "Người chơi 1" : "Người chơi 2"} chiến thắng! Đã ăn toàn bộ quân đối phương.`;
  } else if (
    !hasAnyValidMoves(
      { ...state, pieces: newPieces, currentPlayer: nextPlayer },
      nextPlayer,
    )
  ) {
    phase = "game_over";
    winner = myOwner;
    const loserName =
      nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
    const winnerName = winner === "player1" ? "Người chơi 1" : "Người chơi 2";
    message = `${loserName} hết nước đi. ${winnerName} chiến thắng!`;
  }
  // 5.3.0 Tại bước 5.1.3, Model phát hiện biến đếm bộ nhớ movesWithoutCapture >= 50 (Đạt giới hạn tối đa không ăn quân).
  else if (newMovesWithoutCapture >= MAX_DRAW_MOVES) {
    // 5.3.1 Model thiết lập phase = "draw", gán winner = null và bật cờ hiệu gameOver = true.
    phase = "draw";
    message = "Hai người chơi HÒA nhau! (Sau 50 lượt không ăn quân).";
  } else {
    // 5.1.3 Model xác định ván cờ vẫn tiếp tục (chưa thỏa điều kiện dừng), giữ nguyên phase = "playing".
    phase = "playing";
  }

  // 5.1.4 Model trả mảng trạng thái cùng thông điệp an toàn về cho Controller.
  // 5.2.2 Model gửi trạng thái kết thúc ván đấu về cho Controller.
  // 5.3.2 Model gửi trạng thái Hòa về cho Controller.
  return {
    pieces: newPieces,
    currentPlayer: nextPlayer,
    gameOver: phase !== "playing",
    winner,
    phase,
    movesWithoutCapture: newMovesWithoutCapture,
    message,
    lastCapturedIds,
  };
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

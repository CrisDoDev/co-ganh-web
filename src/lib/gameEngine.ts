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
  };
}

// [UC-2: Di chuyển quân cờ] - PHÁT TRIỂN TIẾP GIAI ĐOẠN 2
function isValidPosition(x: number, y: number, pieces: Piece[]): boolean {
  // 2.4.1 Model kiểm tra từng ô có nằm trong phạm vi bàn cờ hay không.
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }
  // 2.4.2 Model kiểm tra ô đó có đang trống và hợp lệ để di chuyển hay không.
  return !pieces.some((p) => p.x === x && p.y === y);
}


// 2.4 Model quét các ô lân cận theo luật di chuyển của cờ Gánh.
export function getValidMoves(
  pieceId: string,
  state: BoardState,
): Array<{ x: number; y: number }> {
  
  const piece = state.pieces.find((p) => p.id === pieceId);
  // 2.3.a Luồng chọn quân không hợp lệ: Nếu người chơi click vào quân cờ không thuộc lượt của mình.
  if (!piece || piece.owner !== state.currentPlayer) {
    return [];
  }

  const validMoves: Array<{ x: number; y: number }> = [];
  // [PHÁT TRIỂN TIẾP GĐ2]: Luật đi chéo chỉ áp dụng cho các ô có tổng tọa độ chẵn (0,0; 0,2; 1,1...)
  const isEvenSquare = (piece.x + piece.y) % 2 === 0;
  const directions = isEvenSquare?[
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ]:[{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }];

  for (const dir of directions) {
    const newX = piece.x + dir.dx;
    const newY = piece.y + dir.dy;

    if (isValidPosition(newX, newY, state.pieces)) {
      validMoves.push({ x: newX, y: newY });
    }
  }

   // 2.4.3 Model trả về danh sách các tọa độ có thể đi.
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


function processChat(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {
  return []; // FIXME: Dummy function for Phase 2
}


function processSurrounding(pieces: Piece[]): string[] {
  return []; // FIXME: Dummy function for Phase 2
}

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
    newState.message =
      "Người chơi 1 chiến thắng! Đã ăn toàn bộ quân đối phương.";
  } else if (p2Count === TOTAL_PIECES) {
    newState.gameOver = true;
    newState.winner = "player2";
    newState.message =
      "Người chơi 2 chiến thắng! Đã ăn toàn bộ quân đối phương.";
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
      const loserName =
        newState.currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
      const winnerName =
        newState.winner === "player1" ? "Người chơi 1" : "Người chơi 2";
      newState.message = `${loserName} hết nước đi. ${winnerName} chiến thắng!`;
    } else {
      const playerName =
        newState.currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
      newState.message = `Đến lượt ${playerName}`;
    }
  }

  return newState;
}

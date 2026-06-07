import {
  Piece,
  BoardState,
  GameMove,
  Player,
  PieceColor,
  GamePhase,
} from "./types";
import { BoardTopology } from "./boardTopology";
import {
  getCapturedByGanh,
  getCapturedByChet,
  getCapturedByVay,
} from "./captureRules";

// Export các type cần thiết cho các chỗ khác dùng
export * from "./types";
export * from "./boardTopology";
export * from "./captureRules";

export const BOARD_SIZE = 5;
export const TOTAL_PIECES = 16;
export const MAX_DRAW_MOVES = 50;

// =========================================================================
// [UC-1: Khởi tạo và thiết lập ván cờ]
// =========================================================================
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

// =========================================================================
// [UC-3: Xác thực nước đi hợp lệ]
// =========================================================================
function isValidPosition(x: number, y: number, pieces: Piece[]): boolean {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }
  return !pieces.some((p) => p.x === x && p.y === y);
}

// =========================================================================
// [UC-3: Xác thực nước đi hợp lệ]
// =========================================================================
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

// Helper: Kiểm tra xem người chơi có bước đi hợp lệ nào không? (Check để xử Endgame do bí)
export function hasAnyValidMoves(state: BoardState, player: Player): boolean {
  const myPieces = state.pieces.filter((p) => p.owner === player);
  for (const p of myPieces) {
    if (getValidMoves(p.id, state).length > 0) return true;
  }
  return false;
}

// =========================================================================
// [UC-2, UC-4, UC-5: Thực thi nước đi & Gộp luồng Capture]
// Chức năng: Aggregator gom logic từ mọi nguồn tạo ra State Immutable mới
// =========================================================================

export function executeMove(move: GameMove, state: BoardState): BoardState {
  if (state.phase !== "playing") return state;

  // 1. Phân giải Immutable State (Copy array)
  let newPieces = state.pieces.map((p) => ({ ...p }));
  const movedPiece = newPieces.find((p) => p.id === move.pieceId);
  if (!movedPiece) return state;

  // Cập nhật vị trí quân di chuyển
  movedPiece.x = move.toX;
  movedPiece.y = move.toY;

  const myOwner = movedPiece.owner;
  const opponent = myOwner === "player1" ? "player2" : "player1";

  // 2. Chạy Pipeline Capture Rules [UC-4] (Gánh -> Chẹt -> Vây)
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

  // Đổi màu quân bị ăn tức thì trước khi rà soát Vây (Vì Gánh/Chẹt dọn đường rồi mới tính Vây)
  for (const piece of totalCaptured) {
    const target = newPieces.find((p) => p.id === piece.id);
    if (target) {
      target.owner = myOwner;
      lastCapturedIds.push(piece.id);
    }
  }

  // Chạy tiếp Vây trên dữ liệu đã biến động
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
    

  // 4.1.7 Model lặp qua mảng danh sách "bị bắt" và tiến hành đổi màu (đổi thuộc tính owner) của các quân cờ đó sang phe người vừa đánh.
  // 4.2.1 Model bỏ qua bước 4.1.6 và 4.1.7 (Mảng bị bắt rỗng).
  for (const id of ganhCaptured) {
    const capturedPiece = newState.pieces.find((p) => p.id === id);
    if (capturedPiece) capturedPiece.owner = newState.currentPlayer;
  }

  // =========================================================================
  // [UC-5: Cập nhật diễn biến và xử lý kết quả]
  // =========================================================================
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

  // =========================================================================
  // [UC-4: Thực thi luật bắt quân]
  // =========================================================================
  // 4.1.8 Model trả mảng BoardState mới đã cập nhật về cho Controller.
  // 4.2.2 Hệ thống chuyển thẳng đến bước 4.1.8 để trả về kết quả.
  return newState;
}

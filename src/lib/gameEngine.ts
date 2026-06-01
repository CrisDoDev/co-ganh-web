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

// =========================================================================
// [UC-3: Xác thực tính hợp lệ của nước đi]
/**
 * Hỗ trợ logic xác thực cho Bước 3.2 và kiểm tra nước đi kế tiếp ở Bước 3.4.2.
 */
// =========================================================================
function isValidPosition(x: number, y: number, pieces: Piece[]): boolean {
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    return false;
  }
  return !pieces.some((p) => p.x === x && p.y === y);
}

// =========================================================================
// [UC-3: Xác thực tính hợp lệ của nước đi]
/**
 * Bước 3.4.2: Lấy danh sách các ô kề cận hợp lệ để di chuyển.
 */
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
  /**
 * Bước 3.3.1: Xử lý Gánh (Luật ăn quân cơ bản của UC-4).
 */
   // UC-2.5: trả danh sách về View
  return validMoves;
}

// =========================================================================
// [UC-4: Thực thi luật bắt quân]
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

  // 4.3.1 Model định nghĩa 4 trục quét (Ngang, Dọc, Chéo 1, Chéo 2) đi qua tọa độ mới của quân cờ.
  const axes = [
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: 1, dy: -1 },
  ];

  // 4.3.2 Model lặp (Loop) qua từng trục để kiểm tra các vị trí lân cận.
  for (const axis of axes) {
    const p1X = newX + axis.dx;
    const p1Y = newY + axis.dy;
    const p2X = newX - axis.dx;
    const p2Y = newY - axis.dy;

    const piece1 = pieces.find((p) => p.x === p1X && p.y === p1Y);
    const piece2 = pieces.find((p) => p.x === p2X && p.y === p2Y);

    // 4.3.3 Model kiểm tra điều kiện "chủ động" và nhận diện kẹp quân (quân mình vừa đi kẹp 2 quân địch).
    // 4.3a.1 (Alternate Flow): Nếu không có quân kẹp (IF = False) -> Bỏ qua bước 4.3.4 đi tiếp đến 4.5
    if (
      piece1 &&
      piece1.owner === opponentOwner &&
      piece2 &&
      piece2.owner === opponentOwner
    ) {
      // 4.3.4 Model đưa ID của các quân địch thỏa mãn điều kiện vào mảng danh sách "bị bắt".
      if (!capturedIds.includes(piece1.id)) capturedIds.push(piece1.id);
      if (!capturedIds.includes(piece2.id)) capturedIds.push(piece2.id);
    }
  }

  return capturedIds;
}

// =========================================================================
// [UC-4: Thực thi luật bắt quân] (GIAI ĐOẠN 2)
// Chức năng chờ: Dummy Function thiết lập khung gốc cho "Luật Chẹt"
// =========================================================================
/**
 * Bước 3.3.2: Dự phòng Xử lý Chẹt/Vây (Phase 2).
 */
function processChat(
  movedPieceId: string,
  newX: number,
  newY: number,
  pieces: Piece[],
): string[] {
  return []; // FIXME: Dummy function for Phase 2
}

// =========================================================================
// [UC-4: Thực thi luật bắt quân] (GIAI ĐOẠN 2)
// Chức năng chờ: Dummy Function thiết lập khung gốc cho "Luật Vây" (Chặn đường lui)
// =========================================================================
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
  // Bước 3.2: Kiểm tra tính hợp lệ (Validation)
  // Bước 3.2.1: Kiểm tra sự tồn tại của quân cờ dựa trên pieceId
  const piece = newState.pieces.find((p) => p.id === move.pieceId);

   // Bước 3.2.1a: Alternate Flow - Quân cờ không hợp lệ
  // 3.2.1a.1: Trả về trạng thái hiện tại không thay đổi
  if (!piece) return state;

  // =========================================================================
  // [UC-4: Thực thi luật bắt quân]
  // =========================================================================
   // Bước 3.2.2: Cập nhật tọa độ mới vào newState
  // 4.2 Model tiến hành cập nhật tọa độ mới cho quân cờ vừa đi trên mảng dữ liệu ảo.
  piece.x = move.toX;
  piece.y = move.toY;

  // Bước 3.3: Thực thi luật bắt quân (UC-4)
  // Bước 3.3.1: Gọi hàm xử lý Gánh để cập nhật thuộc tính owner

  // 4.3 Model bắt đầu thực thi thuật toán quét bắt quân (Luật Gánh & Chầu).
  const ganhCaptured = processGanh(
    move.pieceId,
    move.toX,
    move.toY,
    newState.pieces,
  );

  // 4.4 Model lặp qua mảng danh sách "bị bắt" và tiến hành đổi màu (đổi thuộc tính owner) sang phe người vừa đánh.
  for (const id of ganhCaptured) {
    const capturedPiece = newState.pieces.find((p) => p.id === id);
    if (capturedPiece) capturedPiece.owner = newState.currentPlayer;
  }

   // Bước 3.3.2: Dự phòng xử lý Chẹt/Vây (Mở rộng cho Phase 2)

  // Bước 3.4: Hoàn tất lượt đi và Chuyển đổi trạng thái
  // Bước 3.4.1: Kiểm tra điều kiện thắng (Nếu đạt 16 quân)

  // =========================================================================
  // [UC-5: Theo dõi diễn biến và và Xử lý kết quả]
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
    // Bước 3.4.2: Đổi lượt đi (Đảo ngược currentPlayer)
    newState.currentPlayer =
      newState.currentPlayer === "player1" ? "player2" : "player1";

    const nextPlayerPieces = newState.pieces.filter(
      (p) => p.owner === newState.currentPlayer,
    );
    const hasValidMoves = nextPlayerPieces.some(
      (p) => getValidMoves(p.id, newState).length > 0,
    );
    // Bước 3.4.2a: Alternate Flow - Người chơi kế tiếp hết nước đi
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
      // Bước 3.4.3: Cập nhật thông điệp tương ứng (Ví dụ: "Đến lượt Người chơi 2")
      const playerName =
        newState.currentPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
      newState.message = `Đến lượt ${playerName}`;
    }
  }

  // =========================================================================
  // [UC-4: Thực thi luật bắt quân]
  // =========================================================================
  // 4.5 Model trả mảng bàn cờ (BoardState) mới đã cập nhật xong xuôi về cho Controller.
  return newState;
}

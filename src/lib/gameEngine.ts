
import { BoardTopology } from "./boardTopology";
import {
  getCapturedByGanh,
  getCapturedByChet,
  getCapturedByVay,
} from "./captureRules";
import {
  Piece,
  BoardState,
  GameMove,
  Player,
  PieceColor,
  GamePhase,
} from "./types";

// Export các type cần thiết cho các chỗ khác dùng
export * from "./types";
export * from "./boardTopology";
export * from "./captureRules";

export const BOARD_SIZE = 5;
export const TOTAL_PIECES = 16;
export const MAX_DRAW_MOVES = 50;

// =========================================================================
// [UC-1: Khởi tạo và Thiết lập ván cờ]
// =========================================================================
export function initializeBoard(): BoardState {
  const pieces: Piece[] = [];
  let id = 0;
  const matchId = Math.random().toString(36).slice(2, 6);

  // Người chơi 1 (Phía dưới bàn cờ - Quân Đen)
  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p1-${matchId}-${id++}`, x, y: 4, owner: "player1" });
  }
  pieces.push({ id: `p1-${matchId}-${id++}`, x: 0, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${matchId}-${id++}`, x: 4, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${matchId}-${id++}`, x: 0, y: 2, owner: "player1" });

  id = 0;
  // Người chơi 2 (Phía trên bàn cờ - Quân Trắng)
  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p2-${matchId}-${id++}`, x, y: 0, owner: "player2" });
  }
  pieces.push({ id: `p2-${matchId}-${id++}`, x: 0, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${matchId}-${id++}`, x: 4, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${matchId}-${id++}`, x: 4, y: 2, owner: "player2" });

  return {
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    phase: "playing",
    movesWithoutCapture: 0,
    message: "Đến lượt Người chơi 1",
  };
}

// =========================================================================
// [UC-2 & UC-3: Xác thực nước đi hợp lệ & Di chuyển quân cờ]
// Sử dụng BoardTopology để tìm đường đi chính xác (ngang, dọc, chéo được phép)
// =========================================================================
export function getValidMoves(
  pieceId: string,
  state: BoardState,
): Array<{ x: number; y: number }> {
  // 3.2.0 Hệ thống kiểm tra quân cờ có thuộc quyền điều khiển của người chơi hiện tại hay không.
  const piece = state.pieces.find((p) => p.id === pieceId);

  // [AF1] Quân cờ không tồn tại hoặc không thuộc lượt hiện tại.
  // 2.2.0 Luồng chọn quân không hợp lệ: Nếu người chơi click vào quân cờ không thuộc lượt của mình.
  if (!piece || piece.owner !== state.currentPlayer) return [];

  // 2.1.3 Model quét các ô lân cận theo luật di chuyển của cờ Gánh.
  // 3.3.0 Hệ thống xác định các ô lân cận có thể di chuyển dựa trên topology bàn cờ
  const neighbors = BoardTopology.getAvailableNeighbors(piece.x, piece.y);

  // 3.4.0 Hệ thống kiểm tra tính hợp lệ của từng ô đích.
  // 2.1.3.0 Model kiểm tra từng ô có nằm trong phạm vi bàn cờ hay không (Xử lý thông qua Topology cố định).
  // 2.1.3.1 Model kiểm tra ô đó có đang trống và hợp lệ để di chuyển hay không.
  // 3.5.0 Hệ thống trả về danh sách nước đi hợp lệ.
  // 2.1.3.2 Model trả về danh sách các tọa độ có thể đi.
  return neighbors.filter(
    (n) => !state.pieces.some((p) => p.x === n.x && p.y === n.y),
  );
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

  let newPieces = state.pieces.map((p) => ({ ...p }));
  const movedPiece = newPieces.find((p) => p.id === move.pieceId);
  if (!movedPiece) return state;

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
  // 4.1.7 Model lặp qua mảng danh sách "bị bắt" và tiến hành đổi màu (đổi thuộc tính owner) của các quân cờ đó sang phe người vừa đánh.
  // 4.2.1 Model bỏ qua bước 4.1.6 và 4.1.7 (Mảng bị bắt rỗng).
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
    const loserName = nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";
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

  // 4.1.8 Model trả mảng BoardState mới đã cập nhật về cho Controller.
  // 4.2.2 Hệ thống chuyển thẳng đến bước 4.1.8 để trả về kết quả.
  // 5.1.4 Model trả mảng trạng thái cùng thông điệp an toàn về cho Controller.
  // 5.2.2 Model gửi trạng thái kết thúc ván đấu về cho Controller.
  // 5.3.2 Model gửi trạng thái Hòa về cho Controller.
  return {
    pieces: newPieces,
    currentPlayer: nextPlayer,
    moveHistory: [...state.moveHistory],
    gameOver: phase !== "playing",
    winner,
    phase,
    movesWithoutCapture: newMovesWithoutCapture,
    message,
    lastCapturedIds,
  };
}

// =========================================================================
// [UC-1: Cơ cơ chế xử lý hết giờ suy nghĩ (Timer Auto-Switch)]
// =========================================================================
export function passTurn(state: BoardState): BoardState {
  if (state.phase !== "playing") return state;
  const nextPlayer = state.currentPlayer === "player1" ? "player2" : "player1";
  const playerLabel = nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";

  return {
    ...state,
    currentPlayer: nextPlayer,
    message: `Hết thời gian suy nghĩ! Hệ thống tự động chuyển lượt sang ${playerLabel}.`,
  };
}
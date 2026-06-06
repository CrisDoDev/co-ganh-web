

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
  

  // GIAI ĐOẠN 2 NÂNG CẤP: CẤU HÌNH THỜI GIAN (TIMER)

  turnTimeLeft: number;      // Thời gian còn lại của lượt hiện tại (tính bằng giây)
  isTimeOut: boolean;        // Trạng thái cờ báo hết giờ hay chưa
}

export interface GameMove {
  pieceId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface Position {
  x: number;
  y: number;
}

export const BOARD_SIZE = 5;
export const TOTAL_PIECES = 16;
export const DEFAULT_TURN_TIME = 30; // Cấu hình mặc định mỗi lượt có 30 giây suy nghĩ


// GIAI ĐOẠN 2 NÂNG CẤP: HỆ THỐNG ĐƯỜNG KẺ CHÉO (TOPOLOGY MATRIX)
// Xác định mạng lưới các ô có liên kết đường chéo hợp lệ theo chuẩn luật Cờ Gánh.
// Trong Cờ Gánh, các ô có tọa độ (x + y) là số chẵn sẽ có đường kẻ chéo nối với các góc lân cận.

export function hasDiagonalConnection(x: number, y: number): boolean {
  return (x + y) % 2 === 0;
}

/**
 * Hàm lấy danh sách các vị trí kề cận hợp lệ dựa trên cấu trúc liên kết hình học (Topology) của bàn cờ.
 * Hỗ trợ đắc lực cho UC-2 (Hiển thị dấu chấm gợi ý) và UC-3 (Xác thực nước đi).
 */
export function getTopologyNeighbors(x: number, y: number): Position[] {
  const neighbors: Position[] = [];
  
  // 4 hướng di chuyển cơ bản: Ngang và Dọc
  const baseDirections = [
    { dx: 1, dy: 0 },  // Phải
    { dx: -1, dy: 0 }, // Trái
    { dx: 0, dy: 1 },  // Xuống
    { dx: 0, dy: -1 }  // Lên
  ];

  // 4 hướng di chuyển mở rộng: Đường chéo (Chỉ khả dụng tại các ô Topology chẵn)
  const diagonalDirections = [
    { dx: 1, dy: 1 },   // Chéo dưới phải
    { dx: 1, dy: -1 },  // Chéo trên phải
    { dx: -1, dy: 1 },  // Chéo dưới trái
    { dx: -1, dy: -1 }  // Chéo trên trái
  ];

  // Hợp nhất các hướng dựa vào vị trí hình học của ô hiện tại
  const validDirections = hasDiagonalConnection(x, y) 
    ? [...baseDirections, ...diagonalDirections] 
    : baseDirections;

  for (const dir of validDirections) {
    const nx = x + dir.dx;
    const ny = y + dir.dy;

    // Đảm bảo tọa độ nằm trong biên ma trận bàn cờ 5x5
    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}

// 4.1.1 Khởi tạo bàn cờ 5x5 với 16 quân (8 đen, 8 trắng).
// 4.2.1 Hệ thống thực hiện việc ghi dữ liệu hiện tại bằng cấu hình mặc định[cite: 1].
export function initializeBoard(): BoardState {
  const pieces: Piece[] = [];
  let id = 0;

  // Người chơi 1 (Phía dưới bàn cờ - Quân Đen)[cite: 1]
  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p1-${id++}`, x, y: 4, owner: "player1" });
  }
  pieces.push({ id: `p1-${id++}`, x: 0, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 4, y: 3, owner: "player1" });
  pieces.push({ id: `p1-${id++}`, x: 0, y: 2, owner: "player1" });

  id = 0;
  // Người chơi 2 (Phía trên bàn cờ - Quân Trắng)[cite: 1]
  for (let x = 0; x < 5; x++) {
    pieces.push({ id: `p2-${id++}`, x, y: 0, owner: "player2" });
  }
  pieces.push({ id: `p2-${id++}`, x: 0, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${id++}`, x: 4, y: 1, owner: "player2" });
  pieces.push({ id: `p2-${id++}`, x: 4, y: 2, owner: "player2" });

  // 4.1.4 Hiển thị lại bàn cờ ở trạng thái ban đầu và làm mới lượt đi thuộc về Người chơi 1[cite: 1].
  // 4.2.2 Hệ thống đặt lại giá trị lượt đi cho Người chơi 1 (quân Đen)[cite: 1].
  return {
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    message: "Đến lượt Người chơi 1",
    
    // Nâng cấp Giai đoạn 2: Đặt giá trị thời gian ban đầu
    turnTimeLeft: DEFAULT_TURN_TIME,
    isTimeOut: false,
  };
}

// GIAI ĐOẠN 2 NÂNG CẤP: CƠ CHẾ XỬ LÝ HẾT GIỜ SUY NGHĨ (TIMER AUTO-SWITCH)
// Tự động chuyển lượt và đặt lại bộ đếm thời gian khi một bên hết thời hạn đi cờ.

export function handleTurnTimeout(state: BoardState): BoardState {
  if (state.gameOver) return state;

  const nextPlayer: Player = state.currentPlayer === "player1" ? "player2" : "player1";
  const playerLabel = nextPlayer === "player1" ? "Người chơi 1" : "Người chơi 2";

  return {
    ...state,
    currentPlayer: nextPlayer,
    turnTimeLeft: DEFAULT_TURN_TIME, // Reset lại bộ đếm thời gian cho người chơi tiếp theo
    isTimeOut: true,
    message: `Hết thời gian suy nghĩ! Hệ thống tự động chuyển lượt sang ${playerLabel}.`,
  };
}
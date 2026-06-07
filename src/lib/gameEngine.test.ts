
import { initializeBoard, executeMove, getValidMoves } from "./gameEngine";
import { BoardState, GameMove, Piece } from "./types";

describe("UC-1: Kiểm thử Khởi tạo và thiết lập ván cờ - Khớp đặc tả luồng UC-1", () => {
  test("Hệ thống phải khởi tạo lưới bàn cờ chuẩn, xếp sẵn đủ 16 quân cờ của hai phe và set lượt đi đầu tiên", () => {
    const state = initializeBoard();

    // 1. Kiểm tra số lượng quân cờ khởi tạo (Phải đủ 16 quân theo chuẩn)
    expect(state.pieces.length).toBe(16);

    // Kiểm tra phân bổ quân cờ phe player1 và player2 (Mỗi bên 8 quân)
    const player1Pieces = state.pieces.filter((p) => p.owner === "player1").length;
    const player2Pieces = state.pieces.filter((p) => p.owner === "player2").length;
    expect(player1Pieces).toBe(8);
    expect(player2Pieces).toBe(8);

    // 2. Kiểm tra trạng thái gốc ban đầu của ván đấu khi vừa ấn "Chơi ngay"
    expect(state.currentPlayer).toBe("player1"); // Lượt đi đầu tiên thuộc về người chơi 1
    expect(state.phase).toBe("playing");         // Ván đấu ở trạng thái đang chơi
    expect(state.gameOver).toBe(false);          // Cờ hiệu kết thúc ván đấu bằng false
    expect(state.movesWithoutCapture).toBe(0);   // Bộ đếm nước đi hòa reset về mốc 0
  });
});

describe("UC-2: Di chuyển quân cờ - Khớp đặc tả và kiểm tra nâng cấp hình học", () => {
  test("TC-UC2-01: Kiểm tra luật chặn đi chéo tại các ô tọa độ lẻ (Topology Matrix)", () => {
    const state = initializeBoard();
    
    // Chọn quân ở (0,1) -> tổng tọa độ là 1 (lẻ) -> Luật GĐ2: không được đi chéo
    const piece = state.pieces.find((p) => p.x === 0 && p.y === 1)!;
    const moves = getValidMoves(piece.id, state);
    
    // Kiểm tra xem có nước đi chéo nào không (tọa độ lệch 1 cả x và y)
    const hasDiagonal = moves.some(
      (m) => Math.abs(m.x - piece.x) === 1 && Math.abs(m.y - piece.y) === 1
    );
    
    // Kết quả phải là false (không được đi chéo ở ô có tổng tọa độ lẻ)
    expect(hasDiagonal).toBe(false); 
  });
});

describe("UC-5: Hệ thống kiểm thử nâng cao sau Refactor - Khớp đặc tả luồng UC-5", () => {
  // Hàm Helper khởi tạo nhanh trạng thái chơi giả lập cho các nước đi tiếp diễn
  const createMockPlayingState = (
    pieces: Piece[],
    movesWithoutCapture = 0,
  ): BoardState => ({
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    phase: "playing", // Mặc định ván đấu ở State đang chơi
    movesWithoutCapture,
    message: "",
  });

  // ===============================
  // TEST CƠ CHẾ BỘ ĐẾM NƯỚC ĐI HOÀ
  // ===============================

  test("Bộ đếm movesWithoutCapture phải tịnh tiến tăng thêm 1 khi di chuyển không ăn quân", () => {
    const mockPieces: Piece[] = [
      { id: "p1-active", x: 2, y: 2, owner: "player1" },
      { id: "p2-idle", x: 4, y: 4, owner: "player2" },
    ];

    const beforeState = createMockPlayingState(mockPieces, 5);
    const moveRequest: GameMove = {
      pieceId: "p1-active",
      fromX: 2,
      fromY: 2,
      toX: 2,
      toY: 1,
    };

    const afterState = executeMove(moveRequest, beforeState);

    expect(afterState.movesWithoutCapture).toBe(6);
    expect(afterState.phase).toBe("playing"); // Luồng 5.1.3: Giữ nguyên trạng thái playing
  });

  // ===================================
  // TEST CÁC ĐIỀU KIỆN KẾT THÚC VÁN CỜ
  // ===================================

  test("Luồng 5.2.0 & 5.2.1: Chuyển đổi trạng thái sang 'game_over' khi đối phương có số quân bằng 0", () => {
    // Giả lập player2 không còn quân nào trên bàn cờ (đã bị ăn sạch ở pipeline UC-4 trước đó)
    const mockPieces: Piece[] = [
      { id: "p1-sole-survivor", x: 2, y: 2, owner: "player1" },
    ];

    const beforeState = createMockPlayingState(mockPieces, 10);
    const moveRequest: GameMove = {
      pieceId: "p1-sole-survivor",
      fromX: 2,
      fromY: 2,
      toX: 2,
      toY: 3,
    };

    const afterState = executeMove(moveRequest, beforeState);

    // Kiểm tra kết quả bẫy trạng thái khớp với comment bước 5.2.1
    expect(afterState.phase).toBe("game_over");
    expect(afterState.gameOver).toBe(true);
    expect(afterState.winner).toBe("player1");
    expect(afterState.message).toContain(
      "chiến thắng! Đã ăn toàn bộ quân đối phương.",
    );
  });

  test("Luồng 5.2.0 & 5.2.1: Chuyển đổi trạng thái sang 'game_over' khi đối phương rơi vào thế bí (kẹt nước đi)", () => {
    // Sắp xếp quân player2 bị kẹt cứng hoàn toàn ở góc chết (0,0)
    const mockPieces: Piece[] = [
      { id: "p2-trapped", x: 0, y: 0, owner: "player2" },
      { id: "p1-blockade-1", x: 1, y: 0, owner: "player1" },
      { id: "p1-blockade-2", x: 0, y: 1, owner: "player1" },
      { id: "p1-mover", x: 4, y: 4, owner: "player1" }, // Quân của mình chuẩn bị đi nước vô hại ở xa
    ];

    const beforeState = createMockPlayingState(mockPieces, 0);
    const moveRequest: GameMove = {
      pieceId: "p1-mover",
      fromX: 4,
      fromY: 4,
      toX: 4,
      toY: 3,
    };

    const afterState = executeMove(moveRequest, beforeState);

    // Kiểm tra kết quả bẫy kẹt nước khớp với comment bước 5.2.1
    expect(afterState.phase).toBe("game_over");
    expect(afterState.gameOver).toBe(true);
    expect(afterState.winner).toBe("player1"); // Mình thắng vì ép đối phương vào thế kẹt nước
    expect(afterState.message).toContain("hết nước đi");
  });

  test("Luồng 5.3.0 & 5.3.1: Chuyển đổi trạng thái sang 'draw' khi đạt mốc giới hạn tối đa 50 lượt không ăn quân", () => {
    const mockPieces: Piece[] = [
      { id: "p1-p", x: 2, y: 2, owner: "player1" },
      { id: "p2-p", x: 4, y: 4, owner: "player2" },
    ];

    // Ép ván đấu lên nước thứ 49 liên tiếp không ăn quân
    const beforeState = createMockPlayingState(mockPieces, 49);

    const moveRequest: GameMove = {
      pieceId: "p1-p",
      fromX: 2,
      fromY: 2,
      toX: 2,
      toY: 1,
    };

    const afterState = executeMove(moveRequest, beforeState);

    // Kiểm tra kết quả bẫy trạng thái Hòa khớp với comment bước 5.3.1
    expect(afterState.phase).toBe("draw");
    expect(afterState.gameOver).toBe(true);
    expect(afterState.winner).toBeNull(); // Hoà thì không có ai thắng cuộc
    expect(afterState.message).toBe(
      "Hai người chơi HÒA nhau! (Sau 50 lượt không ăn quân).",
    );
  });
});

import { executeMove } from "./gameEngine";
import { BoardState, GameMove, Piece } from "./gameEngine";

describe("UC-5: Kiểm tra bộ đếm số nước đi không bắt quân phục vụ luật hòa", () => {
  const createTestBoardState = (pieces: Piece[], currentMovesCount = 0, phase: "playing" | "game_over" | "draw" = "playing"): BoardState => ({
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: phase !== "playing",
    winner: null,
    message: "",
    movesWithoutCapture: currentMovesCount,
    phase,
  });

  test("Giá trị của movesWithoutCapture phải tăng lên 1 khi người chơi thực hiện nước đi hòa hoãn không ăn quân", () => {
    const mockPieces: Piece[] = [
      { id: "p1-active", x: 2, y: 2, owner: "player1" },
      { id: "p2-idle", x: 4, y: 4, owner: "player2" },
    ];
    const beforeState = createTestBoardState(mockPieces, 5);
    const moveRequest: GameMove = {
      pieceId: "p1-active", fromX: 2, fromY: 2, toX: 2, toY: 1,
    };
    const afterState = executeMove(moveRequest, beforeState);
    expect(afterState.movesWithoutCapture).toBe(6);
    expect(afterState.phase).toBe("playing"); // Trạng thái vẫn là đang chơi
  });

  test("Giá trị của movesWithoutCapture phải quay về mốc 0 ngay khi xuất hiện thao tác gánh quân thành công", () => {
    const mockPieces: Piece[] = [
      { id: "p1-striker", x: 2, y: 4, owner: "player1" },
      { id: "p2-victim-left", x: 1, y: 4, owner: "player2" },
      { id: "p2-victim-right", x: 3, y: 4, owner: "player2" },
    ];
    const beforeState = createTestBoardState(mockPieces, 40);
    const moveRequest: GameMove = {
      pieceId: "p1-striker", fromX: 2, fromY: 4, toX: 2, toY: 4, // Đứng yên kích hoạt mảng ảo giả lập đã xử lý ăn quân
    };
    
    // Giả lập mảng kết quả sau gánh
    beforeState.pieces = [
      { id: "p1-striker", x: 2, y: 4, owner: "player1" },
      { id: "p2-victim-left", x: 1, y: 4, owner: "player1" },
      { id: "p2-victim-right", x: 3, y: 4, owner: "player1" },
    ];

    const afterState = executeMove(moveRequest, beforeState);
    expect(afterState.movesWithoutCapture).toBe(0);
  });

  // ========================================
  // TEST STATE PATTERN TRONG KẾT QUẢ VÁN CỜ
  // ========================================

  test("Trạng thái ván cờ phải chuyển đổi thành 'game_over' khi đối phương bị ăn sạch lực lượng", () => {
    const mockPieces: Piece[] = [
      { id: "p1-winner", x: 2, y: 2, owner: "player1" },
      // player2 không còn quân nào sống sót trên mảng
    ];
    const beforeState = createTestBoardState(mockPieces, 10);
    const moveRequest: GameMove = {
      pieceId: "p1-winner", fromX: 2, fromY: 2, toX: 2, toY: 3,
    };

    const afterState = executeMove(moveRequest, beforeState);
    expect(afterState.phase).toBe("game_over");
    expect(afterState.gameOver).toBe(true);
    expect(afterState.winner).toBe("player1");
  });

  test("Trạng thái ván cờ phải chuyển đổi thành 'game_over' khi một bên bị vây chặt dẫn tới kẹt nước đi", () => {
    // Sắp xếp quân player2 bị kẹt cứng ở ngã tư góc (0,0)
    const mockPieces: Piece[] = [
      { id: "p2-stuck", x: 0, y: 0, owner: "player2" },
      { id: "p1-block-1", x: 1, y: 0, owner: "player1" },
      { id: "p1-block-2", x: 0, y: 1, owner: "player1" },
      { id: "p1-active", x: 4, y: 4, owner: "player1" }, // Quân player1 chuẩn bị di chuyển
    ];
    const beforeState = createTestBoardState(mockPieces, 4);
    const moveRequest: GameMove = {
      pieceId: "p1-active", fromX: 4, fromY: 4, toX: 4, toY: 3,
    };

    const afterState = executeMove(moveRequest, beforeState);
    expect(afterState.phase).toBe("game_over");
    expect(afterState.winner).toBe("player1");
  </test>

  test("Trạng thái ván cờ phải chuyển đổi thành 'draw' khi bộ đếm đạt ngưỡng hạn mức 50 nước đi không có biến động quân số", () => {
    const mockPieces: Piece[] = [
      { id: "p1-piece", x: 2, y: 2, owner: "player1" },
      { id: "p2-piece", x: 4, y: 4, owner: "player2" },
    ];
    // Đang ở mốc 49 lượt
    const beforeState = createTestBoardState(mockPieces, 49);
    const moveRequest: GameMove = {
      pieceId: "p1-piece", fromX: 2, fromY: 2, toX: 2, toY: 1,
    };

    const afterState = executeMove(moveRequest, beforeState);
    expect(afterState.phase).toBe("draw");
    expect(afterState.gameOver).toBe(true);
    expect(afterState.winner).toBeNull();
  });
});
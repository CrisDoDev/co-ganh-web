import { executeMove } from "./gameEngine";
import { BoardState, GameMove, Piece } from "./gameEngine";

describe("UC-5: Kiểm tra bộ đếm số nước đi không bắt quân phục vụ luật hòa", () => {
  const createTestBoardState = (
    pieces: Piece[],
    currentMovesCount = 0,
  ): BoardState => ({
    pieces,
    currentPlayer: "player1",
    moveHistory: [],
    gameOver: false,
    winner: null,
    message: "",
    movesWithoutCapture: currentMovesCount,
  });

  test("Giá trị của movesWithoutCapture phải tăng lên 1 khi người chơi thực hiện nước đi hòa hoãn không ăn quân", () => {
    const mockPieces: Piece[] = [
      { id: "p1-active", x: 2, y: 2, owner: "player1" },
      { id: "p2-idle", x: 4, y: 4, owner: "player2" },
    ];

    // Giả lập ván đấu đang ở nước thứ 5 không ăn quân
    const beforeState = createTestBoardState(mockPieces, 5);

    const moveRequest: GameMove = {
      pieceId: "p1-active",
      fromX: 2,
      fromY: 2,
      toX: 2,
      toY: 1, // Di chuyển tịnh tiến lên ô trống
    };

    const afterState = executeMove(moveRequest, beforeState);

    // Thẩm định: Bộ đếm phải tịnh tiến lên mốc 6
    expect(afterState.movesWithoutCapture).toBe(6);
  });

  test("Giá trị của movesWithoutCapture phải quay về mốc 0 ngay khi xuất hiện thao tác gánh quân thành công", () => {
    // Sắp xếp thế cờ gánh: quân player1 chuẩn bị đi vào giữa tọa độ (2,2) để kẹp hai quân player2 ở (1,2) và (3,2)
    const mockPieces: Piece[] = [
      { id: "p1-striker", x: 2, y: 1, owner: "player1" }, // Quân chuẩn bị di chuyển xuống
      { id: "p2-victim-left", x: 1, y: 2, owner: "player2" },
      { id: "p2-victim-right", x: 3, y: 2, owner: "player2" },
    ];

    // Giả lập ván đấu đang có chuỗi 40 nước liên tiếp không ăn quân
    const beforeState = createTestBoardState(mockPieces, 40);

    const moveRequest: GameMove = {
      pieceId: "p1-striker",
      fromX: 2,
      fromY: 1,
      toX: 2,
      toY: 2, // Đi xuống điểm chính giữa tạo thế gánh quân
    };

    const afterState = executeMove(moveRequest, beforeState);

    // Thẩm định: Do có quân bị đổi màu (bị gánh), bộ đếm phải lập tức reset sạch về 0
    expect(afterState.movesWithoutCapture).toBe(0);
  });
});

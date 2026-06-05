import { renderHook, act } from "@testing-library/react";
import { useGameState } from "./useGameState";
import * as gameEngine from "../lib/gameEngine";

// Giả lập (Mock) các hàm của gameEngine để kiểm soát đầu ra theo ý muốn khi test Hook
jest.mock("../lib/gameEngine", () => ({
  initializeBoard: jest.fn(),
  executeMove: jest.fn(),
}));

describe("UC-5: Unit Test cho Controller (useGameState) - Quản lý điểm số tích lũy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Hệ thống phải tự động cộng 1 điểm cho Người chơi 1 khi trạng thái ván cờ chuyển sang 'game_over' với winner là player1", () => {
    // 1. Định nghĩa trạng thái ban đầu khi khởi tạo game
    const mockInitialState = {
      pieces: [],
      currentPlayer: "player1" as const,
      moveHistory: [],
      gameOver: false,
      winner: null,
      message: "Đến lượt Người chơi 1",
      movesWithoutCapture: 0,
      phase: "playing" as const,
    };

    (gameEngine.initializeBoard as jest.Mock).mockReturnValue(mockInitialState);

    // 2. Tiến hành render Hook ảo để kiểm tra
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.initGame();
    });

    // Xác nhận điểm số ban đầu của cả hai người chơi bằng 0
    expect(result.current.scores.player1).toBe(0);
    expect(result.current.scores.player2).toBe(0);

    // 3. Giả lập nước đi dẫn tới kết quả kết thúc game, Model phản hồi trạng thái 'game_over'
    const mockGameOverState = {
      ...mockInitialState,
      phase: "game_over" as const,
      gameOver: true,
      winner: "player1" as const,
      message: "Người chơi 1 chiến thắng!",
    };

    (gameEngine.executeMove as jest.Mock).mockReturnValue(mockGameOverState);

    // Người chơi thực hiện di chuyển quân cờ
    act(() => {
      result.current.handleMove(2, 3);
    });

    // 4. Kết quả: Điểm của player1 phải được tăng lên chính xác 1 đơn vị
    expect(result.current.scores.player1).toBe(1);
    expect(result.current.scores.player2).toBe(0); // Player 2 vẫn giữ nguyên 0 điểm
  });
});

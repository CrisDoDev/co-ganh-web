import { renderHook, act } from "@testing-library/react";
import { useGameState } from "./useGameState";
import * as gameEngine from "../lib/gameEngine";

jest.mock("../lib/gameEngine", () => ({
  initializeBoard: jest.fn(),
  executeMove: jest.fn(),
}));

describe("UC-5: Unit Test cho Controller (useGameState) - Quản lý điểm số tích lũy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Controller phải bắt đúng luồng 5.2.3 để tự động cộng điểm tích lũy trận thắng cho người chơi chiến thắng", () => {
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

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.initGame();
    });

    expect(result.current.scores.player1).toBe(0);

    // Giả lập trạng thái trả về từ Model khi có kết quả Thắng cuộc
    const mockGameOverState = {
      ...mockInitialState,
      phase: "game_over" as const,
      gameOver: true,
      winner: "player1" as const,
      message: "Người chơi 1 chiến thắng!",
    };

    (gameEngine.executeMove as jest.Mock).mockReturnValue(mockGameOverState);

    act(() => {
      result.current.handleMove(2, 3);
    });

    //Luồng 5.2.3 kích hoạt thành công, player1 nhận 1 ván thắng
    expect(result.current.scores.player1).toBe(1);
    expect(result.current.scores.player2).toBe(0);
  });
});

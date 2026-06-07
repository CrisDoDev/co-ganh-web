import {
  getValidMoves,
  type BoardState,
  type Piece,
} from "../lib/gameEngine";

describe("UC-3 - Xác thực nước đi hợp lệ", () => {

  const createBoardState = (
    pieces: Piece[],
    currentPlayer: "player1" | "player2" = "player1"
  ): BoardState => ({
    pieces,
    currentPlayer,
    moveHistory: [],
    gameOver: false,
    winner: null,
    message: "",
  });

  // =========================================================================
  // UT-UC3-10: getValidMoves() - di chuyển chéo hợp lệ
  // =========================================================================
  test("TC-UC3-10 - Cho phép di chuyển chéo từ ô có topology đường chéo", () => {
    const state = createBoardState([
      { id: "p1-main", x: 2, y: 2, owner: "player1" },
    ]);

    const validMoves = getValidMoves("p1-main", state);

    expect(validMoves.some(move => move.x === 3 && move.y === 3)).toBe(true);
  });

  // =========================================================================
  // UT-UC3-11: getValidMoves() - chặn di chuyển chéo sai topology
  // =========================================================================
  test("TC-UC3-11 - Không cho phép di chuyển chéo từ ô không có topology đường chéo", () => {
    const state = createBoardState([
      { id: "p1-main", x: 2, y: 1, owner: "player1" },
    ]);

    const validMoves = getValidMoves("p1-main", state);

    expect(validMoves.some(m => m.x === 3 && m.y === 2)).toBe(false);
    expect(validMoves.some(m => m.x === 3 && m.y === 0)).toBe(false);
    expect(validMoves.some(m => m.x === 1 && m.y === 0)).toBe(false);
    expect(validMoves.some(m => m.x === 1 && m.y === 2)).toBe(false);
  });

  // =========================================================================
  // UT-UC3-12: getValidMoves() - không đi vào ô đã chiếm
  // =========================================================================
  test("TC-UC3-12 - Không cho phép đi vào ô đã có quân chiếm giữ", () => {
    const state = createBoardState([
      { id: "p1-main", x: 2, y: 2, owner: "player1" },
      { id: "p2-block", x: 2, y: 1, owner: "player2" },
    ]);

    const validMoves = getValidMoves("p1-main", state);

    expect(validMoves.some(m => m.x === 2 && m.y === 1)).toBe(false);
  });

  // =========================================================================
  // UT-UC3-13: getValidMoves() - không lấy nước đi của quân đối phương
  // =========================================================================
  test("TC-UC3-13 - Không lấy nước đi của quân đối phương", () => {
    const state = createBoardState([
      { id: "enemy-piece", x: 2, y: 2, owner: "player2" },
    ]);

    const validMoves = getValidMoves("enemy-piece", state);

    expect(validMoves).toEqual([]);
  });

  // =========================================================================
  // UT-UC3-14: getValidMoves() - pieceId không tồn tại
  // =========================================================================
  test("TC-UC3-14 - Trả về danh sách rỗng khi pieceId không tồn tại", () => {
    const state = createBoardState([
      { id: "p1-main", x: 2, y: 2, owner: "player1" },
    ]);

    const validMoves = getValidMoves("invalid-piece-id", state);

    expect(validMoves).toEqual([]);
  });

  // =========================================================================
  // UT-UC3-15: getValidMoves() - không sinh nước đi vượt ngoài bàn cờ
  // =========================================================================
  test("TC-UC3-15 - Không sinh nước đi vượt ngoài bàn cờ", () => {
    const state = createBoardState([
      { id: "p1-corner", x: 0, y: 0, owner: "player1" },
    ]);

    const validMoves = getValidMoves("p1-corner", state);

    const outOfBoardMove = validMoves.some(
      move =>
        move.x < 0 ||
        move.y < 0 ||
        move.x > 4 ||
        move.y > 4
    );

    expect(outOfBoardMove).toBe(false);
  });

});
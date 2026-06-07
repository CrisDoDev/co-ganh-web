import { getCapturedByGanh } from "../../lib/captureRules";
import { BoardTopology } from "../../lib/boardTopology";
import { Piece } from "../../lib/types";

describe("UC-4: Capture Mechanics - Gánh", () => {

  test("Bắt gánh theo hàng ngang", () => {
    const pieces: Piece[] = [
      { id: "p1", x: 1, y: 2, owner: "player2" },
      { id: "p2", x: 3, y: 2, owner: "player2" },
    ];

    const captured = getCapturedByGanh(2, 2, "player1", pieces);

    expect(captured).toHaveLength(2);
    expect(captured).toContainEqual(pieces[0]);
    expect(captured).toContainEqual(pieces[1]);
  });

  test("Bắt gánh theo hàng dọc", () => {
    const pieces: Piece[] = [
      { id: "p1", x: 2, y: 1, owner: "player2" },
      { id: "p2", x: 2, y: 3, owner: "player2" },
    ];

    const captured = getCapturedByGanh(2, 2, "player1", pieces);

    expect(captured).toHaveLength(2);
  });

  test("Không bắt được khi chỉ có một quân địch", () => {
    const pieces: Piece[] = [
      { id: "p1", x: 1, y: 2, owner: "player2" },
    ];

    const captured = getCapturedByGanh(2, 2, "player1", pieces);

    expect(captured).toHaveLength(0);
  });

  test("Không bắt được khi một bên là quân mình", () => {
    const pieces: Piece[] = [
      { id: "p1", x: 1, y: 2, owner: "player2" },
      { id: "p2", x: 3, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByGanh(2, 2, "player1", pieces);

    expect(captured).toHaveLength(0);
  });

});
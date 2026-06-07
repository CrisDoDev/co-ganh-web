import { getCapturedByChet } from "../../lib/captureRules";
import { Piece } from "../../lib/types";

describe("UC-4: Capture Mechanics - Chẹt", () => {

  test("Bắt chẹt theo hàng ngang", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 3, y: 2, owner: "player2" },
      { id: "a1", x: 4, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByChet(2, 2, "player1", pieces);

    expect(captured).toHaveLength(1);
    expect(captured).toContainEqual(pieces[0]);
  });

  test("Bắt chẹt theo hàng dọc", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 2, y: 3, owner: "player2" },
      { id: "a1", x: 2, y: 4, owner: "player1" },
    ];

    const captured = getCapturedByChet(2, 2, "player1", pieces);

    expect(captured).toHaveLength(1);
  });

  test("Không bắt được nếu thiếu quân đồng minh ở đầu kia", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 3, y: 2, owner: "player2" },
    ];

    const captured = getCapturedByChet(2, 2, "player1", pieces);

    expect(captured).toHaveLength(0);
  });

  test("Không bắt được nếu quân ở giữa là quân mình", () => {
    const pieces: Piece[] = [
      { id: "a1", x: 3, y: 2, owner: "player1" },
      { id: "a2", x: 4, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByChet(2, 2, "player1", pieces);

    expect(captured).toHaveLength(0);
  });

  test("Bắt chẹt theo đường chéo", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 3, y: 3, owner: "player2" },
      { id: "a1", x: 4, y: 4, owner: "player1" },
    ];

    const captured = getCapturedByChet(2, 2, "player1", pieces);

    expect(captured).toHaveLength(1);
    expect(captured).toContainEqual(pieces[0]);
  });

});
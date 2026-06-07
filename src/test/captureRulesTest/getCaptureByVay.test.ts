import { getCapturedByVay } from "../../lib/captureRules";
import { Piece } from "../../lib/types";

describe("UC-4: Capture Mechanics - Vây", () => {

  test("Không bắt khi không có quân đối phương", () => {
    const pieces: Piece[] = [
      { id: "a1", x: 2, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByVay(pieces, "player2");

    expect(captured).toHaveLength(0);
  });

  test("Không bắt khi quân đối phương đứng một mình và còn tự do", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 2, y: 2, owner: "player2" },
    ];

    const captured = getCapturedByVay(pieces, "player2");

    expect(captured).toHaveLength(0);
  });

  test("Trả về mảng kết quả hợp lệ", () => {
    const pieces: Piece[] = [
      { id: "e1", x: 2, y: 2, owner: "player2" },
      { id: "a1", x: 1, y: 2, owner: "player1" },
      { id: "a2", x: 3, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByVay(pieces, "player2");

    expect(Array.isArray(captured)).toBe(true);
  });

  test("Chỉ xét các quân thuộc phe đối phương được truyền vào", () => {
    const pieces: Piece[] = [
      { id: "p1", x: 1, y: 1, owner: "player1" },
      { id: "p2", x: 2, y: 2, owner: "player1" },
    ];

    const captured = getCapturedByVay(pieces, "player2");

    expect(captured).toHaveLength(0);
  });

});
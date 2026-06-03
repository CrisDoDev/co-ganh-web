import { BoardTopology } from "../lib/boardTopology";

describe("UC-3: Kiểm tra tính hợp lệ của tọa độ trên bàn cờ", () => {
//kiểm tra tính hợp lệ của tọa độ trên bàn cờ
  test("Tọa độ nằm trong phạm vi bàn cờ phải được xác nhận là hợp lệ", () => {
    const result = BoardTopology.isValidPosition(2, 2);

    expect(result).toBe(true);
  });

  test("Tọa độ có giá trị âm phải bị từ chối", () => {
    const result = BoardTopology.isValidPosition(-1, 0);

    expect(result).toBe(false);
  });

  test("Tọa độ vượt quá kích thước bàn cờ phải bị từ chối", () => {
    const result = BoardTopology.isValidPosition(5, 2);

    expect(result).toBe(false);
  });
// kiểm tra tính hợp lệ của topology đường chéo
  test("Ô có tổng tọa độ chẵn phải được phép kết nối đường chéo", () => {
    const result = BoardTopology.canMoveDiagonal(2, 2);

    expect(result).toBe(true);
  });

  test("Ô có tổng tọa độ lẻ không được phép kết nối đường chéo", () => {
    const result = BoardTopology.canMoveDiagonal(2, 1);

    expect(result).toBe(false);
  });

  test("Ô góc (0,0) phải có topology đường chéo", () => {
    const result = BoardTopology.canMoveDiagonal(0, 0);

    expect(result).toBe(true);
  });
});


import { BoardTopology } from "../lib/boardTopology";

describe("UC-3: Kiểm tra tính hợp lệ của tọa độ trên bàn cờ", () => {

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

});


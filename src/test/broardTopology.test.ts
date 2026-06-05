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
 describe("UC-3: Kiểm tra topology đường chéo của bàn cờ", () => {

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
//kiểm tra sinh danh sách ô lân cận hợp lệ
describe("UC-3: Kiểm tra sinh danh sách ô lân cận hợp lệ", () => {

  test("Ô trung tâm có topology đường chéo phải sinh ra 8 ô lân cận", () => {
    const neighbors =
      BoardTopology.getAvailableNeighbors(2, 2);

    expect(neighbors.length).toBe(8);
  });

  test("Ô không có topology đường chéo chỉ sinh ra 4 ô lân cận", () => {
    const neighbors =
      BoardTopology.getAvailableNeighbors(2, 1);

    expect(neighbors.length).toBe(4);
  });

  test("Ô góc bàn cờ chỉ sinh ra các ô nằm trong bàn cờ", () => {
    const neighbors =
      BoardTopology.getAvailableNeighbors(0, 0);

    expect(neighbors.length).toBe(3);

    neighbors.forEach((cell) => {
      expect(
        BoardTopology.isValidPosition(
          cell.x,
          cell.y
        )
      ).toBe(true);
    });
  });

});
});


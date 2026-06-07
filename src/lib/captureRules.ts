import { Piece, Position } from "./types";
import { BoardTopology } from "./boardTopology";

// =========================================================================
// [UC-4: Capture Mechanics]
// Chức năng: Pure Functions xử lý thuật toán bắt quân. Không mutate trực tiếp boardState
// Mỗi hàm trả về danh sách các piece bị đổi màu.
// =========================================================================

// 1. LUẬT GÁNH (Chầu 4, Chầu 6 cũng chung cơ chế này)
// Xảy ra khi ta chủ động đi 1 quân vào giữa kẹp 2 quân của địch trên một đường thẳng
export function getCapturedByGanh(
  toX: number,
  toY: number,
  myOwner: string,
  pieces: Piece[],
): Piece[] {
  const capturedPieces: Piece[] = [];
  const opponentOwner = myOwner === "player1" ? "player2" : "player1";

  // Các trục đối xứng để check (Chỉ cần loop nửa vòng tròn (4 trục) là bao quát đủ hướng)
  const axes = [
    { dx: 1, dy: 0 }, // Ngang
    { dx: 0, dy: 1 }, // Dọc
    { dx: 1, dy: 1 }, // Chéo chính (\)
    { dx: -1, dy: 1 }, // Chéo phụ (/)
  ];

  for (const axis of axes) {
    const p1X = toX + axis.dx;
    const p1Y = toY + axis.dy;
    const p2X = toX - axis.dx;
    const p2Y = toY - axis.dy;

    // Phải chắc chắn đường đó hợp lệ (Ví dụ: ô đáp xuống không có đường chéo thì bỏ qua xét chéo)
    // Thực tế trên bàn cờ này nếu to(x,y) không có chéo thì tọa độ +1,-1 sẽ không hợp lệ theo Topology line
    if (
      !BoardTopology.canMoveDiagonal(toX, toY) &&
      axis.dx !== 0 &&
      axis.dy !== 0
    ) {
      continue; // Bỏ qua đường chéo nếu đứng ở ô không có đường chéo
    }

    const piece1 = pieces.find((p) => p.x === p1X && p.y === p1Y);
    const piece2 = pieces.find((p) => p.x === p2X && p.y === p2Y);

    if (
      piece1 &&
      piece2 &&
      piece1.owner === opponentOwner &&
      piece2.owner === opponentOwner
    ) {
      capturedPieces.push(piece1, piece2);
    }
  }

  // Khử trùng lặp (phòng hờ)
  return Array.from(new Set(capturedPieces));
}


// 2. LUẬT CHẸT
// Xảy ra khi ta đi vào tạo thế gọng kìm, kẹp đúng 1 quân đối phương ở giữa ta và 1 quân của mình
export function getCapturedByChet(
  toX: number,
  toY: number,
  myOwner: string,
  pieces: Piece[],
): Piece[] {
  const capturedPieces: Piece[] = [];
  const opponentOwner = myOwner === "player1" ? "player2" : "player1";

  // Check 8 hướng xung quanh (kể cả xa hơn để tìm vị trí kẹp)
  const dirs = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: 1 },
  ];

  for (const dir of dirs) {
    // Quân địch kế bên
    const targetX = toX + dir.dx;
    const targetY = toY + dir.dy;

    // Nếu đi theo hướng chéo từ 1 ô không có chéo thì không hợp lệ
    if (
      dir.dx !== 0 &&
      dir.dy !== 0 &&
      !BoardTopology.canMoveDiagonal(toX, toY)
    )
      continue;
    if (
      !BoardTopology.canMoveDiagonal(targetX, targetY) &&
      dir.dx !== 0 &&
      dir.dy !== 0
    )
      continue;

    // Ô thứ 2 theo hướng đó (Phải là quân của mình kẹp ở đầu kia)
    const myAllyX = toX + dir.dx * 2;
    const myAllyY = toY + dir.dy * 2;

    const opPiece = pieces.find((p) => p.x === targetX && p.y === targetY);
    const myAllyPiece = pieces.find((p) => p.x === myAllyX && p.y === myAllyY);

    if (
      opPiece &&
      opPiece.owner === opponentOwner &&
      myAllyPiece &&
      myAllyPiece.owner === myOwner
    ) {
      capturedPieces.push(opPiece);
    }
  }

  return Array.from(new Set(capturedPieces));
}

// 3. LUẬT VÂY (Flood Fill Algorithm)
// Quét toàn bộ lưới. Tìm các cụm quân địch bị khóa chặt (Không có ô trống nào kề cạnh).
export function getCapturedByVay(
  pieces: Piece[],
  opponentOwner: string,
): Piece[] {
  let totallyCaptured: Piece[] = [];
  const opponentPieces = pieces.filter((p) => p.owner === opponentOwner);
  const visited = new Set<string>();

  for (const piece of opponentPieces) {
    const key = `${piece.x},${piece.y}`;
    if (visited.has(key)) continue;

    // Bắt đầu cụm mới
    const cluster: Piece[] = [];
    const queue: Piece[] = [piece];
    let hasFreedom = false;

    // Flood Fill
    let head = 0;
    while (head < queue.length) {
      const current = queue[head++];
      const currentKey = `${current.x},${current.y}`;

      if (!visited.has(currentKey)) {
        visited.add(currentKey);
        cluster.push(current);

        const neighbors = BoardTopology.getAvailableNeighbors(
          current.x,
          current.y,
        );
        for (const n of neighbors) {
          const occ = pieces.find((p) => p.x === n.x && p.y === n.y);
          if (!occ) {
            hasFreedom = true; // Cụm này có ô trống kế bên => Thoát vây
          } else if (
            occ.owner === opponentOwner &&
            !visited.has(`${occ.x},${occ.y}`)
          ) {
            queue.push(occ);
          }
        }
      }
    }

    if (!hasFreedom) {
      // Bị vây kín toàn bộ cụm
      totallyCaptured.push(...cluster);
    }
  }

  return totallyCaptured;
}

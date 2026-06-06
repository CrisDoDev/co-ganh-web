import { describe, it, expect } from '@jest/globals';
import { getValidMoves, initializeBoard } from './gameEngine';

describe('Development Testing - UC-2', () => {
  it('TC-UC2-01: Kiểm tra luật chặn đi chéo tại các ô tọa độ lẻ', () => {
    const state = initializeBoard();
    // Chọn quân ở (0,1) -> tổng tọa độ là 1 (lẻ) -> Luật GĐ2: không được đi chéo
    const piece = state.pieces.find(p => p.x === 0 && p.y === 1)!;
    const moves = getValidMoves(piece.id, state);
    
    // Kiểm tra xem có nước đi chéo nào không (tọa độ lệch 1 cả x và y)
    const hasDiagonal = moves.some(m => Math.abs(m.x - piece.x) === 1 && Math.abs(m.y - piece.y) === 1);
    
    // Kết quả phải là false (không được đi chéo)
    expect(hasDiagonal).toBe(false); 
  });
});
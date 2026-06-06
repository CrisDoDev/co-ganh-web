import { initializeBoard } from "./gameEngine";

function testInitializeBoardUC1() {
  console.log("=== BẮT ĐẦU KIỂM THỬ UC-1: KHỞI TẠO BÀN CỜ ===");
  
  const state = initializeBoard();

  // 1. Kiểm tra số lượng quân cờ khởi tạo (Phải đủ 16 quân)
  const totalPieces = state.pieces.length;
  console.log(`Kiểm tra tổng số quân cờ: ${totalPieces} / 16`);
  if (totalPieces !== 16) {
    console.error("❌ LỖI: Số lượng quân cờ không chính xác!");
    return false;
  }

  // 2. Kiểm tra cấu hình nâng cấp thời gian (UC-1 của Chí)
  console.log(`Kiểm tra cấu hình thời gian lượt đi: ${state.turnTimeoutSeconds}s`);
  console.log(`Kiểm tra trạng thái bộ đếm giờ: ${state.isTimerActive}`);
  
  if (state.turnTimeoutSeconds !== 30 || state.isTimerActive !== true) {
    console.error("❌ LỖI: Cấu hình nâng cấp UC-1 hoạt động sai!");
    return false;
  }

  console.log("=> KẾT QUẢ: KIỂM THỬ UC-1 ĐẠT CHUẨN (PASSED)!");
  return true;
}

// Chạy thử nghiệm
testInitializeBoardUC1();
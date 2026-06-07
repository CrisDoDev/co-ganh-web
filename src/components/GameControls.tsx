"use client";

import { Button } from "@/components/ui/button";

interface GameControlsProps {
  onRestart: () => void;
  gameOver?: boolean;
  // Bổ sung các Props để nhận dữ liệu thời gian từ Controller (UC-1)
}

export default function GameControls({
  onRestart,
  gameOver,
  // Cài đặt giá trị mặc định để không bị crash nếu Parent chưa kịp truyền vào
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* =========================================================
          KHU VỰC NÚT ĐIỀU KHIỂN & HƯỚNG DẪN 
          ========================================================= */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* STT 6: Nút Chơi lại ván mới */}
          {/* [UC-1] Thiết lập ván cờ : Nút Restart gọi hàm initGame */}
          <Button
            onClick={onRestart}
            variant="outline"
            className="px-6 py-2 border-border hover:bg-muted font-serif"
          >
            Chơi lại ván mới
          </Button>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="bg-secondary/10 border border-secondary rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center font-serif">
          Chọn một quân cờ, sau đó nhấn vào ô trống để di chuyển
        </p>
      </div>
    </div>
  );
}

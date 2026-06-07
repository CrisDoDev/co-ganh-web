"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameControlsProps {
  onRestart: () => void;
  gameOver: boolean;
  // Bổ sung các Props để nhận dữ liệu thời gian từ Controller (UC-1)
  turnTimeLeft?: number;
  isTimeOut?: boolean;
  currentPlayer?: "X" | "O" | string | null;
}

export default function GameControls({
  onRestart,
  gameOver,
  // Cài đặt giá trị mặc định để không bị crash nếu Parent chưa kịp truyền vào
  turnTimeLeft = 30,
  isTimeOut = false,
  currentPlayer = "X",
}: GameControlsProps) {
  // [UC-5][5.5] View hiển thị giao diện điều khiển ván đấu
  // [UC-5][5.7] Nút để người chơi chọn thoát / làm mới ván đấu
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      
      {/* =========================================================
          KHU VỰC DASHBOARD 2 NGƯỜI CHƠI (UC-1)
          ========================================================= */}
      <div className="flex justify-between w-full gap-4">
        {/* Dashboard Người chơi 1 */}
        <div className={`flex-1 p-4 border rounded-lg ${currentPlayer === "X" ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
          <h3 className="font-bold text-sm text-center mb-2 font-serif">Người chơi 1</h3>
          {currentPlayer === "X" ? (
            <div className="flex flex-col items-center mt-2">
              {/* STT 4: Chỉ báo Thời gian */}
              <p className="text-destructive font-bold text-sm mb-1">
                Thời gian: {isTimeOut ? "0" : turnTimeLeft}s
              </p>
              {/* STT 5: Thanh đường kẻ dưới thời gian (Cố định, không co giãn) */}
              <div className="h-1.5 w-full bg-destructive rounded-full"></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center mt-3">Đang chờ</p>
          )}
        </div>

        {/* Dashboard Người chơi 2 */}
        <div className={`flex-1 p-4 border rounded-lg ${currentPlayer === "O" ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
          <h3 className="font-bold text-sm text-center mb-2 font-serif">Người chơi 2</h3>
          {currentPlayer === "O" ? (
            <div className="flex flex-col items-center mt-2">
              <p className="text-destructive font-bold text-sm mb-1">
                Thời gian: {isTimeOut ? "0" : turnTimeLeft}s
              </p>
              <div className="h-1.5 w-full bg-destructive rounded-full"></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center mt-3">Đang chờ</p>
          )}
        </div>
      </div>

      {/* =========================================================
          KHU VỰC NÚT ĐIỀU KHIỂN & HƯỚNG DẪN 
          ========================================================= */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* STT 6: Nút Chơi lại ván mới */}
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
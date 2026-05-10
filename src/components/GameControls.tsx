"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameControlsProps {
  onRestart: () => void;
  gameOver: boolean;
}

export default function GameControls({
  onRestart,
  // [UC-5][5.7] Người chơi thực hiện hành động thoát hoặc làm mới ván đấu
  // (View truyền sự kiện này lên Controller để xử lý)
  gameOver,
}: GameControlsProps) {
  //
  // Lưu ý: Component này là View. Các logic như [UC-5][5.2] (Controller nhận
  // hành động và xử lý logic) sẽ được thực hiện ở Hook (useGameState)
  // thay vì nằm trong thân hàm render này.
  // [UC-5][5.5] View hiển thị giao diện điều khiển ván đấu
  // [UC-5][5.7] Nút để người chơi chọn thoát / làm mới ván đấu
  //  Nút hoàn tác (undo) nước đi
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* [UC-1] Thiết lập ván cờ (Phúc): Nút Restart gọi hàm initGame */}
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

"use client";

interface GameInfoProps {
  // [UC-5][5.5] Dữ liệu View nhận được để hiển thị diễn biến ván đấu
  playerName: string;
  // [UC-5][5.5] Dữ liệu để View làm nổi bật người chơi đang đến lượt
  isActive: boolean;
  // [UC-5][5.5] Dữ liệu hiển thị số lượng quân cờ còn lại
  pieces: number;
  // [UC-5][5.5] Dữ liệu hiển thị màu quân cờ
  color: string;
}

export default function GameInfo({
  playerName,
  isActive,
  pieces,
  color,
}: GameInfoProps) {
  // Lưu ý: Component này thuần túy là View. Không chứa logic của Controller [5.2]
  // hay logic kiểm tra trạng thái thắng/thua của Model [5.4].
  // Mọi dữ liệu truyền vào đây đều đã được tính toán xong.
  return (
    <div
      //  [UC-5][5.5] View hiển thị lại giao diện diễn biến trận đấu
      className={`
      bg-card border-2 rounded-lg p-6 shadow-lg transition-all
      ${isActive ? `${color} ring-2 ring-offset-2 ring-primary` : "border-border"}
    `}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-primary text-center">
          {playerName}
        </h3>

        <div
          className={`
          p-4 rounded-lg
          ${playerName.includes("1") ? "bg-primary/10" : "bg-secondary/10"}
        `}
        >
          <p className="text-center text-2xl font-serif font-bold text-primary">
            {playerName.includes("1") ? "●" : "○"}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Trạng thái:</span>{" "}
            {isActive ? (
              // [UC-5][5.5] Hiển thị trạng thái người chơi và số quân hiện tại
              <span className="text-accent font-semibold">Đến lượt</span>
            ) : (
              <span className="text-muted-foreground">Đang chờ</span>
            )}
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Số quân:</span>{" "}
            {pieces}/16
          </p>
        </div>

        {isActive && (
          <div className="animate-pulse">
            <div className="h-2 bg-accent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
    // [UC-5][5.6] Nếu trận đấu kết thúc, hệ thống hiển thị kết quả cho Người chơi
  );
}

"use client";

interface GameInfoProps {
  playerName: string;
  isActive: boolean;
  pieces: number;
  color: string;
  timeLeft?: number; // Cập nhật Nhận dữ liệu đếm ngược
  score?: number; // Cập nhật: Nhận tổng số trận thắng
}

export default function GameInfo({
  playerName,
  isActive,
  pieces,
  color,
  timeLeft,
  score = 0,
}: GameInfoProps) {
  return (
    <div
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
              <span className="text-accent font-semibold">Đến lượt</span>
            ) : (
              <span className="text-muted-foreground">Đang chờ</span>
            )}
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Số quân:</span>{" "}
            {pieces}/16
          </p>

          {/* Cập nhật: Hiển thị tổng số trận thắng chung cuộc của người chơi */}
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Thắng chung cuộc:
            </span>{" "}
            <span className="font-bold text-lg text-primary">{score} ván</span>
          </p>

          {/* Cập nhật: Hiển thị đồng hồ đếm ngược nếu đang trong lượt đi */}
          {isActive && timeLeft !== undefined && (
            <p className="text-muted-foreground items-center text-[#a94438]">
              <span className="font-semibold text-[#a94438]">Thời gian:</span>{" "}
              <span className="text-base font-bold animate-pulse">
                {timeLeft}s
              </span>
            </p>
          )}
        </div>

        {isActive && (
          <div className="animate-pulse">
            <div className="h-2 bg-accent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

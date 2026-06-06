"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameControlsProps {
  onRestart: () => void;
  gameOver: boolean;
}

export default function GameControls({
  onRestart,
  gameOver,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex flex-wrap gap-3 justify-center">
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

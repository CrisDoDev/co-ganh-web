"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary">
            Cờ Gánh
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Trò chơi cờ truyền thống Việt Nam
          </p>
        </div>

        <div className="space-y-4 bg-card rounded-lg p-8 shadow-lg border border-border">
          <p className="text-lg text-foreground leading-relaxed">
            Cờ Gánh là một trò chơi cờ truyền thống của người Việt, được chơi
            trên bàn cờ 5x5 ô vuông. Trò chơi này đòi hỏi sự tính toán chiến
            lược cao và là biểu tượng của trí tuệ Việt.
          </p>

          <div className="pt-4 space-y-3 text-sm text-muted-foreground">
            <p className="font-semibold text-primary">Cách chơi:</p>
            <ul className="space-y-2 text-left">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">1.</span>
                <span>Hai người chơi lần lượt di chuyển quân cờ của mình</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">2.</span>
                <span>
                  Tấn công và bắt quân đối phương để giành chiến thắng
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">3.</span>
                <span>
                  Người chơi đầu tiên bắt được tất cả quân đối phương sẽ thắng
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/game">
            <Button
              size="lg"
              className="px-12 py-7 text-xl bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Chơi Ngay
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

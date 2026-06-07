
import { useState, useCallback, useEffect } from "react";
import {
  initializeBoard,
  executeMove,
  passTurn,
  type BoardState,
  type GameMove,
} from "@/lib/gameEngine";

const TURN_TIME_LIMIT = 30; // 30 seconds per turn

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // Nâng cấp: Theo dõi tổng tỷ số Thắng - Thua chung cuộc
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    initialized: false,
  });

  // [UC-1: Khởi động và Thiết lập ván cờ - Bổ sung State Timer]
  const [timeLeft, setTimeLeft] = useState<number>(TURN_TIME_LIMIT);

  // =========================================================================
  // [UC-1: Khởi tạo và Thiết lập ván cờ]
  // =========================================================================
  const initGame = useCallback(() => {
    const freshBoard = initializeBoard();
    setBoardState(freshBoard);
    setSelectedPiece(null);
    setTimeLeft(TURN_TIME_LIMIT); // Khởi tạo lại 30s
  }, []);

  // =========================================================================
  // [UC-1: Quản lý Timer đếm ngược]
  // Chức năng: Observer pattern - Chạy đếm ngược mỗi giây. Nếu hết giờ đổi lượt.
  // =========================================================================

  // 1. Interval đếm giảm thời gian (Chỉ chạy khi đang playing)
  useEffect(() => {
    if (!boardState || boardState.phase !== "playing") return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [boardState?.currentPlayer, boardState?.phase]);

  // 2. Chuyển lượt khi hết giờ
  useEffect(() => {
    if (timeLeft <= 0 && boardState?.phase === "playing") {
      setBoardState((currentState) => {
        if (currentState) return passTurn(currentState);
        return currentState;
      });
      setSelectedPiece(null);
      setTimeLeft(TURN_TIME_LIMIT);
    }
  }, [timeLeft, boardState?.phase]);

  // 3. Reset thời gian ngay khi lượt thay đổi (ai đó vừa đi xong)
  useEffect(() => {
    if (boardState?.phase === "playing") {
      setTimeLeft(TURN_TIME_LIMIT);
    }
  }, [boardState?.currentPlayer, boardState?.phase]);

  // 4. Cập nhật tỷ số khi kết thúc ván
  useEffect(() => {
    // 5.2.3 Controller (useGameState) phát hiện phase === "game_over", lập tức trigger useEffect kích hoạt bộ đếm để cộng thêm 1 trận thắng cho winner.
    if (
      boardState?.phase === "game_over" &&
      boardState.winner &&
      !scores.initialized
    ) {
      const winnerKey = boardState.winner as "player1" | "player2";
      setScores((prev) => ({
        ...prev,
        [winnerKey]: prev[winnerKey] + 1,
        initialized: true,
      }));
    } 
    // 5.3.3 Controller cập nhật State nội bộ, giữ nguyên tổng tỷ số trận đấu (không ai được cộng điểm).
    else if (boardState?.phase === "playing" && scores.initialized) {
      setScores((prev) => ({ ...prev, initialized: false }));
    }
  }, [boardState?.phase, boardState?.winner, scores.initialized]);

  // =========================================================================
  // [UC-2: Tương tác di chuyển quân cờ - Chọn quân cờ]
  // =========================================================================
  const handlePieceSelect = useCallback((pieceId: string) => {
    // 2.1.1 View gửi sự kiện chọn quân cờ sang Controller.
    // 2.1.2 Controller kiểm tra tính hợp lệ của quân cờ được chọn.
    // 3.2.0 Controller nhận yêu cầu chọn quân cờ từ View và cập nhật quân cờ đang được chọn
    
    // 2.1.2.0 Nếu quân cờ thuộc lượt hiện tại, Controller cập nhật trạng thái “đang được chọn”.
    // 2.2.0.0 Controller từ chối yêu cầu chọn quân (Bỏ chọn set null nếu click lại quân cũ).
    // 2.2.2.0 Hệ thống hủy trạng thái chọn quân cờ cũ.
    // 2.2.2.1 Hệ thống thực hiện lại quy trình từ bước 2.2 với quân cờ mới.
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));
  }, []);

  // =========================================================================
  // [UC-2: Tương tác di chuyển quân cờ - Thực hiện nước đi]
  // =========================================================================
  const handleMove = useCallback(
    (toX: number, toY: number) => {
      // 2.1.7 View gửi yêu cầu thực hiện nước đi sang Controller.
      // 3.7.0 Controller nhận yêu cầu di chuyển tới ô đích từ View
      
      // 2.2.1.0 Controller từ chối thực hiện nước đi (chặn lỗi nếu state rỗng).
      if (!boardState || !selectedPiece) return;

      const piece = boardState.pieces.find((p) => p.id === selectedPiece);

      // [AF1 - 3.2.1] Không tìm thấy quân cờ hợp lệ
      if (!piece) return;

      const move: GameMove = {
        pieceId: selectedPiece,
        fromX: piece.x,
        fromY: piece.y,
        toX,
        toY,
      };

      // 2.1.8 Controller cập nhật dữ liệu bàn cờ với vị trí mới của quân cờ.
      // 3.8.0 Controller gửi yêu cầu xác nhận nước đi tới Model
      // 5.1.1 Controller (useGameState) gửi yêu cầu kiểm tra cục diện ván cờ sang Model (gameEngine).
      const newState = executeMove(move, boardState);

      // 3.9.0 Nhận trạng thái mới sau khi nước đi được xác nhận
      // 5.1.5 Controller cập nhật State nội bộ, kích hoạt View (GameInfo) re-render để hiển thị số quân thực tế và làm nổi bật viền của người đến lượt đi.
      // 2.1.9 View cập nhật giao diện bàn cờ (thông qua React State triggers re-render).
      setBoardState(newState);

      // 2.1.9.0 Xóa trạng thái làm nổi bật quân cờ cũ.
      // 2.1.9.1 Xóa toàn bộ dấu chấm gợi ý.
      setSelectedPiece(null);
      setTimeLeft(TURN_TIME_LIMIT); // Đánh xong reset timer
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    timeLeft, // Xuất ra View để hiển thị thanh Progress Bar thời gian
    scores,
    initGame,
    handlePieceSelect,
    handleMove,
  };
}
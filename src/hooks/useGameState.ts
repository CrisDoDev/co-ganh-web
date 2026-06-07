
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
  // State phục vụ Timer (timeLeft đóng vai trò turnTimeLeft xuất ra View hiển thị Progress Bar)
  const [timeLeft, setTimeLeft] = useState<number>(TURN_TIME_LIMIT);

  // =========================================================================
  // [UC-1: Khởi tạo và Thiết lập ván cờ]
  // =========================================================================
  const initGame = useCallback(() => {
    const freshBoard = initializeBoard();
    setBoardState(freshBoard);
    setSelectedPiece(null);
    setTimeLeft(TURN_TIME_LIMIT); // Khởi tạo lại 30s lượt đi đầu tiên
  }, []);

  // =========================================================================
  // [UC-1: Quản lý Timer đếm ngược]
  // Chức năng: Observer pattern - Effect tự động chạy đếm ngược (đóng vai trò Controller điều khiển Timer)
  // Nếu hết thời gian của lượt hiện tại, hệ thống tự động đổi lượt.
  // =========================================================================

  // 1. Interval đếm giảm thời gian (Chỉ chạy khi đang playing)
  useEffect(() => {
    if (!boardState || boardState.phase !== "playing") return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [boardState?.currentPlayer, boardState?.phase]);

  // 2. Chuyển lượt khi hết giờ (Logic xử lý khi timeout - tự động đổi lượt)
  useEffect(() => {
    if (timeLeft <= 0 && boardState?.phase === "playing") {
      setBoardState((currentState) => {
        if (currentState) return passTurn(currentState);
        return currentState;
      });
      setSelectedPiece(null); // Bỏ chọn quân cờ đang chọn dở khi bị hết giờ
      setTimeLeft(TURN_TIME_LIMIT); // Reset lại thanh thời gian cho người tiếp theo
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
  // [UC-2: Tương tác di chuyển quân cờ]
  // =========================================================================
  const handlePieceSelect = useCallback((pieceId: string) => {
    // UC-2.1: Người chơi click vào quân cờ thuộc phe mình
    // UC-2.2: View gửi event sang Controller (handlePieceSelect)
    // 3.2.0 Controller nhận yêu cầu chọn quân cờ từ View và cập nhật quân cờ đang được chọn
    // UC-2.3.1: Nếu đã chọn thì bỏ chọn (toggle)
    // UC-2.3.2: Nếu chưa chọn thì set quân đang được chọn
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      // UC-2.7: Người chơi click vào ô đích
      // 3.7.0 Controller nhận yêu cầu di chuyển tới ô đích từ View
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

      // UC-2.8: Controller gửi request sang Model (executeMove)
      // 3.8.0 Controller gửi yêu cầu xác nhận nước đi tới Model
      // 4.1 Controller gửi yêu cầu thực thi nước đi (kèm move) sang Model (gameEngine)
      // 5.1.1 Controller (useGameState) gửi yêu cầu kiểm tra cục diện ván cờ sang Model (gameEngine).
      const newState = executeMove(move, boardState);

      // 3.9.0 Nhận trạng thái mới sau khi nước đi được xác nhận
      // 4.6 Controller cập nhật State nội bộ, kích hoạt View re-render lại giao diện
      // 5.1.5 Controller cập nhật State nội bộ, kích hoạt View (GameInfo) re-render để hiển thị số quân thực tế và làm nổi bật viền của người đến lượt đi.
      // Sau khi đi thành công, hệ thống tự động reset thời gian lượt mới về 30s
      setBoardState(newState);
      
      // UC-2.10: Reset trạng thái chọn quân cờ sau khi đi xong
      setSelectedPiece(null);
      setTimeLeft(TURN_TIME_LIMIT); // Đánh xong reset timer
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    timeLeft, // Đóng vai trò turnTimeLeft xuất ra View để hiển thị thanh Progress Bar và thông báo hết giờ khi <= 0
    scores,
    initGame,
    handlePieceSelect,
    handleMove,
  };
}
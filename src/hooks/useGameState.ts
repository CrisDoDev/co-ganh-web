import { useState, useCallback, useEffect } from "react";
import {
  initializeBoard,
  executeMove,
  type BoardState,
  type GameMove,
} from "@/lib/gameEngine";

export function useGameState() {
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);


  // [UC-1: Khởi động và Thiết lập ván cờ - Bổ sung State Timer]

  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(30); // 30 giây cho mỗi lượt
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  // Lấy thời gian cấu hình mặc định từ Model khi khởi tạo ván cờ
  const initGame = useCallback(() => {
    const freshBoard = initializeBoard();
    setBoardState(freshBoard);
    setSelectedPiece(null);
    setTurnTimeLeft(freshBoard.turnTimeLeft ?? 30); // Khởi tạo lại 30s
    setIsTimeOut(false);
  }, []);

  // Effect tự động chạy đếm ngược (đóng vai trò Controller điều khiển Timer)
  useEffect(() => {
    // Nếu chưa khởi tạo board hoặc ván đấu đã kết thúc/timeout thì dừng đếm
    if (!boardState || isTimeOut) return;

    // Nếu hết thời gian của lượt hiện tại
    if (turnTimeLeft <= 0) {
      setIsTimeOut(true);
      // Logic xử lý khi timeout (ví dụ: tự động đổi lượt hoặc xử thua)
      setBoardState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentPlayer: prev.currentPlayer === "X" ? "O" : "X", // Đổi lượt đi tự động
          turnTimeLeft: 30,
        };
      });
      setTurnTimeLeft(30); // Reset lại thanh thời gian cho người tiếp theo
      setSelectedPiece(null); // Bỏ chọn quân cờ đang chọn dở
      return;
    }

    // Thiết lập bộ đếm ngược mỗi 1 giây
    const timer = setInterval(() => {
      setTurnTimeLeft((prev) => {
        const nextTime = prev - 1;
        // Cập nhật đồng bộ thời gian vào Model State nội bộ
        if (boardState) {
          boardState.turnTimeLeft = nextTime;
        }
        return nextTime;
      });
    }, 1000);

    // Dọn dẹp bộ nhớ (cleanup) khi lượt đi thay đổi hoặc re-render
    return () => clearInterval(timer);
  }, [boardState, turnTimeLeft, isTimeOut]);


  // [UC-2: Tương tác di chuyển quân cờ]

  const handlePieceSelect = useCallback((pieceId: string) => {
    // UC-2.1: Người chơi click vào quân cờ thuộc phe mình
    // UC-2.2: View gửi event sang Controller (handlePieceSelect)

    // UC-2.3: Controller xử lý logic chọn quân
    setSelectedPiece((prev) => (prev === pieceId ? null : pieceId));

    // UC-2.3.1: Nếu đã chọn thì bỏ chọn (toggle)
    // UC-2.3.2: Nếu chưa chọn thì set quân đang được chọn
  }, []);

  const handleMove = useCallback(
    (toX: number, toY: number) => {
      // UC-2.7: Người chơi click vào ô đích
      if (!boardState || !selectedPiece) return;

      const piece = boardState.pieces.find((p) => p.id === selectedPiece);
      if (!piece) return;

      const move: GameMove = {
        pieceId: selectedPiece,
        fromX: piece.x,
        fromY: piece.y,
        toX,
        toY,
      };
      // UC-2.8: Controller gửi request sang Model (executeMove)

      // [UC-4: Thực thi luật bắt quân]
      // =========================================================================
      // 4.1 Controller gửi yêu cầu thực thi nước đi (kèm move) sang Model (gameEngine)
      const newState = executeMove(move, boardState);

      // 4.6 Controller cập nhật State nội bộ, kích hoạt View re-render lại giao diện
      // Sau khi đi thành công, tự động reset thời gian lượt mới về 30s
      setBoardState({
        ...newState,
        turnTimeLeft: 30,
      });
      setTurnTimeLeft(30);
      setIsTimeOut(false);

      // UC-2.10: Reset trạng thái chọn quân cờ sau khi đi xong
      setSelectedPiece(null);
    },
    [boardState, selectedPiece],
  );

  return {
    boardState,
    selectedPiece,
    turnTimeLeft, // Xuất ra View để hiển thị thanh Progress Bar thời gian
    isTimeOut,    // Xuất ra View để thông báo trạng thái hết giờ
    initGame,
    handlePieceSelect,
    handleMove,
  };
}
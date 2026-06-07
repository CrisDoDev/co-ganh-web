import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameInfo from "./GameInfo";

describe("UC-5: Unit Test cho Tầng View (GameInfo) - Hiển thị Dashboard Người chơi", () => {
  test("Giao diện phải hiển thị chính xác tên người chơi, số lượng quân cờ hiện tại và tổng số trận thắng", () => {
    render(
      <GameInfo
        playerName="Người chơi 1"
        isActive={false}
        pieces={6}
        color="bg-primary/10 border-primary"
        score={3}
      />,
    );

    expect(screen.getByText("Người chơi 1")).toBeInTheDocument();
    expect(screen.getByText("6/16")).toBeInTheDocument();
    expect(screen.getByText("3 ván")).toBeInTheDocument();
  });

  test("Giao diện phải hiển thị trạng thái 'Đến lượt' có màu nổi bật khi thuộc tính isActive nhận giá trị là true", () => {
    render(
      <GameInfo
        playerName="Người chơi 2"
        isActive={true}
        pieces={8}
        color="bg-secondary/10 border-secondary"
        score={1}
      />,
    );

    const statusElement = screen.getByText("Đến lượt");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass("text-accent");
  });

  test("Giao diện phải hiển thị trạng thái 'Đang chờ' khi thuộc tính isActive nhận giá trị là false", () => {
    render(
      <GameInfo
        playerName="Người chơi 2"
        isActive={false}
        pieces={8}
        color="bg-secondary/10 border-secondary"
        score={1}
      />,
    );

    expect(screen.getByText("Đang chờ")).toBeInTheDocument();
  });
});

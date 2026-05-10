# Business Requirements Document (BRD)

## Dự án: Web Game Cờ Gánh (Local Multiplayer)

### 1. Giới thiệu (Introduction)

- **Project Name:** Web Game Cờ Gánh (Local Multiplayer).
- **Background:** Cờ Gánh là một trò chơi board game dân gian đầy tính trí tuệ của Việt Nam. Tuy nhiên, việc tìm kiếm một nền tảng trực tuyến mượt mà, giao diện đẹp và thuật toán chuẩn xác để chơi bộ môn này hiện nay rất hạn chế. Dự án này ra đời nhằm số hóa và bảo tồn trò chơi dân gian trên nền tảng Web hiện đại.
- **Problem Statement:** Người dùng thiếu một nền tảng chơi Cờ Gánh đơn giản, dễ tiếp cận trên trình duyệt, không cần tải app phức tạp, đồng thời phải đảm bảo tính chính xác tuyệt đối của các luật chơi (Gánh, Vây, Chẹt).

### 2. Mục tiêu (Objectives)

- Tạo ra một nền tảng Web Game Cờ Gánh giải trí với độ trễ thấp, giao diện trực quan.
- Đạt được sự hoàn hảo về **"Core Logic"** (Luật cờ) cho phiên bản chơi Local 2 người (2 người chơi trên cùng 1 máy).
- Xây dựng kiến trúc phần mềm chuẩn **MVC** làm nền tảng vững chắc để dễ dàng bảo trì và đáp ứng các yêu cầu nâng cấp tính năng.

### 3. Phạm vi dự án (Scope)

#### **In Scope (Trong phạm vi):**

- Triển khai lưới bàn cờ tiêu chuẩn, tích hợp thuật toán ma trận để quản lý tọa độ.
- Hỗ trợ chơi **Local Multiplayer** (2 người chơi luân phiên trên cùng 1 thiết bị).
- Xử lý 100% các luật bắt quân cốt lõi: **Gánh, Chầu (4, 6), Vây, Chẹt**.
- Ứng dụng Framework **Next.js 16** và **TypeScript** để kiểm soát chặt chẽ kiểu dữ liệu.

#### **Out of Scope (Ngoài phạm vi):**

- Chơi với máy (AI Bot).
- Hệ thống đấu giải (Tournament system).
- Kết nối Online (Multiplayer qua mạng) và lưu trữ hệ thống cơ sở dữ liệu trên máy chủ (Database).

### 4. Các bên liên quan (Stakeholders)

| Vai trò              | Thành phần                                       |
| :------------------- | :----------------------------------------------- |
| **Product Owner**    | Khách hàng đại diện (AI Delegate)                |
| **Development Team** | Phước (Lead), Long, Phúc, Nam, Chí               |
| **Users**            | Người chơi yêu thích board game truyền thống     |
| **QA/QC**            | Đội ngũ kiểm thử sản phẩm trên môi trường Vercel |

### 5. Yêu cầu nghiệp vụ (Business Requirements)

- **BR-01:** Hệ thống phải cung cấp môi trường chơi cờ dạng Turn-based (đánh theo lượt) hoạt động ổn định trên các trình duyệt web hiện đại (Chrome, Edge, Safari).
- **BR-02:** Hệ thống thuật toán lõi (Core Logic) phải được viết hoàn toàn bằng **TypeScript** để giảm thiểu rủi ro lỗi thời gian chạy (runtime errors) khi xử lý mảng ma trận đa chiều.
- **BR-03:** Giao diện người dùng phải được thiết kế dạng **Responsive**, linh hoạt trên cả PC và Mobile, tận dụng sức mạnh của Tailwind CSS.
- **BR-04:** Mã nguồn phải được thiết kế theo mô hình kiến trúc **MVC**, tách biệt rõ ràng giữa Giao diện (View) và Logic thuật toán (Model/Controller).

### 6. Tiêu chí thành công (Success Metrics)

- **Performance:** Tốc độ load trang ban đầu (First Contentful Paint) < 1.5 giây trên môi trường deploy Vercel.
- **Algorithm Speed:** Thuật toán xử lý BFS (Tìm vùng bị vây) chạy dưới 100ms mỗi nước đi.
- **Quality:** Pass 100% các Manual Testcases về luồng bắt quân trước khi Demo.

### 7. Ràng buộc & Công nghệ (Constraints & Technology Stack)

- **Framework chính:** Next.js 16.
- **Ngôn ngữ:** TypeScript.
- **Môi trường Dev:** Node.js 22.22.2 LTS.
- **Công cụ:** Visual Studio Code.
- **Deploy:** Vercel (CI/CD qua GitHub).
- **Thời gian:** Hoàn thành bản MVP theo đúng tiến độ môn học.

### 8. Tiêu chí nghiệm thu (Acceptance Criteria)

- Người dùng có thể bắt đầu, thao tác và hoàn thành một ván cờ từ đầu đến cuối mà không gặp lỗi crash hệ thống.
- Mọi luật lệ của Cờ gánh (Gánh, Vây) hoạt động chính xác theo đặc tả.
- Có đầy đủ tài liệu hướng dẫn cài đặt môi trường.

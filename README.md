🌟 Cnck-TuThien (Transparent Charity)Dự án nền tảng từ thiện minh bạch ứng dụng công nghệ Blockchain (Ethereum Sepolia) để theo dõi dòng tiền và quản lý chiến dịch.📋 Yêu cầu hệ thống (Prerequisites)Thành phầnYêu cầuRuntimeNode.js 18+ (Khuyến nghị v20)DatabaseMongoDB Atlas hoặc MongoDB LocalWalletMetaMask (Mạng Sepolia)NetworkSepolia ETH (Faucet) & Alchemy/Infura RPC🚀 Hướng dẫn triển khai (Setup Guide)1. Smart ContractTriển khai hợp đồng thông minh lên mạng thử nghiệm Sepolia.Bashcd smart-contract
npm install
copy .env.example .env  # Windows: copy | Linux/macOS: cp
Cấu hình: Chỉnh sửa file .env với RPC_URL và PRIVATE_KEY của bạn.Bashnpm run compile
npm run deploy:sepolia
Sau khi chạy, hãy lưu lại địa chỉ: TransparentCharity deployed to: 0x... để cấu hình cho Backend.2. Backend APIKết nối logic nghiệp vụ với cơ sở dữ liệu và Blockchain.Bashcd backend
npm install
copy .env.example .env
Cấu hình .env: Cập nhật DB_URL, RPC_URL, PRIVATE_KEY, và CONTRACT_ADDRESS (từ bước 1).Chạy Server: npm run devKiểm tra: Truy cập http://localhost:8080/health để xác nhận trạng thái.3. Frontend DashboardGiao diện người dùng tương tác trực quan.Bashcd frontend
npm install
npm run dev
👉 Truy cập: http://localhost:5173🧪 Quy trình Kiểm thử (Testing)Tạo chiến dịch mới (Create Campaign)Sử dụng PowerShell để gửi yêu cầu tạo chiến dịch mẫu:PowerShellInvoke-RestMethod -Method Post -Uri "http://localhost:8080/api/campaign" `
  -ContentType "application/json" `
  -Body '{"name":"Cứu trợ lũ lụt","description":"Hỗ trợ đồng bào miền Trung","targetAmount":20000000,"category":"emergency"}'
Gửi donate (Donate Test)Mô phỏng một giao dịch ủng hộ:PowerShellInvoke-RestMethod -Method Post -Uri "http://localhost:8080/api/donate" `
  -ContentType "application/json" `
  -Body '{"campaignMongoId":"<ID_MONGO_CUA_BAN>","amountVND":10000,"paymentTxHash":"mock-tx-001"}'
🛠 Quản lý mã nguồn (Git Workflow)Thực hiện các lệnh sau tại thư mục gốc để đẩy mã nguồn lên GitHub:Bashgit init
git add .
git commit -m "feat: initial project structure with smart contract and backend"
# git remote add origin <your-repo-url>
# git push -u origin main

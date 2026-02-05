🌟 Cnck-TuThien (Transparent Charity)Dự án nền tảng từ thiện minh bạch ứng dụng công nghệ Blockchain (Ethereum Sepolia) để theo dõi dòng tiền và quản lý chiến dịch.📋 Yêu cầu hệ thống (Prerequisites)Trước khi bắt đầu, hãy đảm bảo máy của bạn đã cài đặt các thành phần sau:Thành phầnYêu cầuGhi chúRuntimeNode.js 18+Khuyến nghị phiên bản v20DatabaseMongoDBAtlas (Cloud) hoặc LocalWalletMetaMaskCấu hình mạng SepoliaNetworkSepolia ETHCần có ETH testnet (Faucet)RPC ProviderAlchemy / InfuraAPI Key để kết nối Blockchain🚀 Hướng dẫn triển khai (Setup Guide)1. Smart ContractTriển khai hợp đồng thông minh lên mạng thử nghiệm Sepolia.Bashcd smart-contract
npm install

# Tạo file môi trường
# Windows:
copy .env.example .env
# Linux/macOS:
cp .env.example .env
Cấu hình: Mở file .env và cập nhật thông tin:RPC_URL: Đường dẫn RPC từ Alchemy/Infura.PRIVATE_KEY: Khóa bí mật ví MetaMask của bạn.Biên dịch & Triển khai:Bashnpm run compile
npm run deploy:sepolia
⚠️ Lưu ý quan trọng: Sau khi chạy lệnh deploy, hãy lưu lại địa chỉ Contract được xuất ra màn hình (TransparentCharity deployed to: 0x...) để sử dụng cho bước cấu hình Backend.2. Backend APIKết nối logic nghiệp vụ với cơ sở dữ liệu và Blockchain.Bashcd backend
npm install

# Tạo file môi trường
copy .env.example .env
Cấu hình .env:Cập nhật các biến sau:DB_URL: Chuỗi kết nối MongoDB.RPC_URL & PRIVATE_KEY: Tương tự bước 1.CONTRACT_ADDRESS: Địa chỉ Contract đã lưu ở bước 1.Khởi chạy Server:Bashnpm run dev
✅ Kiểm tra: Truy cập http://localhost:8080/health để xác nhận trạng thái hệ thống.3. Frontend DashboardGiao diện người dùng tương tác trực quan.Bashcd frontend
npm install
npm run dev
👉 Truy cập: http://localhost:5173🧪 Quy trình Kiểm thử (Testing)Bạn có thể sử dụng PowerShell hoặc Postman để kiểm thử các API.1. Tạo chiến dịch mới (Create Campaign)Gửi yêu cầu tạo một chiến dịch mẫu:PowerShellInvoke-RestMethod -Method Post -Uri "http://localhost:8080/api/campaign" `
  -ContentType "application/json" `
  -Body '{"name":"Cứu trợ lũ lụt", "description":"Hỗ trợ đồng bào miền Trung", "targetAmount":20000000, "category":"emergency"}'
2. Gửi donate (Donate Test)Mô phỏng một giao dịch ủng hộ (lưu ý thay thế <ID_MONGO_CUA_BAN> bằng ID thực tế):PowerShellInvoke-RestMethod -Method Post -Uri "http://localhost:8080/api/donate" `
  -ContentType "application/json" `
  -Body '{"campaignMongoId":"<ID_MONGO_CUA_BAN>", "amountVND":10000, "paymentTxHash":"mock-tx-001"}'
🛠 Quản lý mã nguồn (Git Workflow)Thực hiện các lệnh sau tại thư mục gốc để đẩy mã nguồn lên GitHub:Bashgit init
git add .
git commit -m "feat: initial project structure with smart contract and backend"
# git remote add origin <your-repo-url>
# git push -u origin master

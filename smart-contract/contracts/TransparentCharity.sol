// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Transparent Charity
 * =========================================================
 * Mục tiêu:
 * 1) Minh bạch: ghi nhận (log) mọi khoản quyên góp lên blockchain
 * 2) Tiền thật (VNĐ) chuyển OFF-CHAIN: xử lý bởi backend/cổng thanh toán
 *
 * Lưu ý quan trọng:
 * - Contract KHÔNG giữ ETH / token / VNĐ
 * - Số tiền "amount" ở đây chỉ là con số VNĐ được ghi nhận để audit
 *
 * Mô hình bảo mật:
 * - owner (deployer) có quyền cấu hình backendRecorder
 * - backendRecorder (ví backend) là ví DUY NHẤT được phép recordDonation
 * - mỗi campaign có campaignOwner (người tạo) có thể gọi withdraw (chỉ mang tính logic/audit)
 */
contract TransparentCharity {
    // =========================================================
    // 1) OWNERSHIP / QUẢN TRỊ HỢP ĐỒNG
    // =========================================================

    /// @notice owner là chủ hợp đồng (người deploy). Có quyền setBackendRecorder.
    address public owner;

    /// @notice Modifier: chỉ owner mới được gọi hàm có gắn modifier này.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    // =========================================================
    // 2) BACKEND RECORDER / VÍ BACKEND ĐƯỢC PHÉP GHI DONATION
    // =========================================================

    /**
     * @notice backendRecorder là địa chỉ ví backend.
     * Backend sẽ gọi recordDonation() sau khi xác nhận thanh toán VNĐ off-chain thành công.
     */
    address public backendRecorder;

    /// @notice Event: ghi nhận việc thay đổi backendRecorder (audit).
    event BackendRecorderUpdated(address indexed oldRecorder, address indexed newRecorder);

    /// @notice Modifier: chỉ backendRecorder mới được phép gọi hàm có gắn modifier này.
    modifier onlyBackendRecorder() {
        require(msg.sender == backendRecorder, "Only backend recorder");
        _;
    }

    /**
     * @notice Owner set ví backendRecorder (đổi key backend / đổi server / môi trường).
     * @param _recorder địa chỉ ví mới (không được là address(0))
     */
    function setBackendRecorder(address _recorder) external onlyOwner {
        require(_recorder != address(0), "Invalid recorder");
        address old = backendRecorder;
        backendRecorder = _recorder;
        emit BackendRecorderUpdated(old, _recorder);
    }

    // =========================================================
    // 3) DỮ LIỆU CAMPAIGN / THÔNG TIN CHIẾN DỊCH
    // =========================================================

    /**
     * @notice Campaign lưu thông tin chiến dịch trên chain để ai cũng có thể kiểm chứng.
     * - targetAmount, totalDonations là đơn vị VNĐ (chỉ ghi nhận, không chuyển tiền)
     */
    struct Campaign {
        uint256 id;              // id chiến dịch (tăng dần)
        address owner;           // người tạo chiến dịch (campaign owner)
        string name;             // tên chiến dịch
        uint256 targetAmount;    // mục tiêu VNĐ (chỉ để ghi nhận)
        uint256 totalDonations;  // tổng VNĐ đã ghi nhận
        bool exists;             // flag kiểm tra tồn tại
    }

    /**
     * @notice Donation là 1 bản ghi quyên góp trên chain.
     * - amount: số VNĐ được ghi nhận
     * - txHash: mã giao dịch off-chain (VNPay/MoMo thật hoặc mock)
     * - timestamp: thời gian ghi nhận trên chain
     */
    struct Donation {
        uint256 amount;      // số VNĐ ghi nhận
        string txHash;       // mã giao dịch off-chain
        uint256 timestamp;   // block.timestamp lúc ghi nhận
    }

    /// @notice Mapping campaignId -> Campaign
    mapping(uint256 => Campaign) private campaigns;

    /// @notice Mapping campaignId -> donationIndex -> Donation (lưu lịch sử theo index)
    mapping(uint256 => mapping(uint256 => Donation)) private donations;

    /// @notice donationCount[campaignId] = số donation đã ghi cho campaign đó
    mapping(uint256 => uint256) public donationCount;

    /// @notice campaignId tăng dần, bắt đầu từ 1
    uint256 public nextCampaignId = 1;

    // =========================================================
    // 4) EVENTS / SỰ KIỆN PHỤC VỤ AUDIT & FRONTEND LISTEN
    // =========================================================

    /// @notice Event: campaign được tạo
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed campaignOwner,
        string name,
        uint256 targetAmount
    );

    /// @notice Event: donation được ghi nhận
    event DonationRecorded(
        uint256 indexed campaignId,
        uint256 amount,
        string txHash,
        uint256 indexed donationIndex
    );

    /// @notice Event: withdraw logic (audit)
    event Withdrawn(uint256 indexed campaignId, address indexed campaignOwner, uint256 amount);

    // =========================================================
    // 5) CONSTRUCTOR / KHỞI TẠO
    // =========================================================

    /**
     * @notice Khi deploy:
     * - owner = người deploy
     * - backendRecorder mặc định = người deploy (demo). Thực tế nên set sang ví backend riêng.
     */
    constructor() {
        owner = msg.sender;
        backendRecorder = msg.sender;
    }

    // =========================================================
    // 6) CHỨC NĂNG TẠO CAMPAIGN (ON-CHAIN)
    // =========================================================

    /**
     * @notice Tạo chiến dịch quyên góp on-chain.
     * @dev Trả về campaignId để backend lưu vào DB (blockchainCampaignId).
     *
     * @param name tên chiến dịch
     * @param targetAmount mục tiêu VNĐ (chỉ ghi nhận)
     * @return campaignId id chiến dịch vừa tạo
     */
    function createCampaign(string calldata name, uint256 targetAmount) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(targetAmount > 0, "Target must be > 0");

        uint256 campaignId = nextCampaignId;
        nextCampaignId++;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            owner: msg.sender,
            name: name,
            targetAmount: targetAmount,
            totalDonations: 0,
            exists: true
        });

        emit CampaignCreated(campaignId, msg.sender, name, targetAmount);
        return campaignId;
    }

    // =========================================================
    // 7) CHỨC NĂNG GHI NHẬN DONATION (ON-CHAIN LOG)
    // =========================================================

    /**
     * @notice Ghi nhận 1 donation sau khi thanh toán VNĐ off-chain thành công.
     * @dev Chỉ backendRecorder được phép gọi để tránh user tự ghi fake donation.
     *
     * @param campaignId id campaign on-chain
     * @param amount số VNĐ ghi nhận
     * @param txHash mã giao dịch off-chain (VNPay/MoMo mock/real)
     */
    function recordDonation(
        uint256 campaignId,
        uint256 amount,
        string calldata txHash
    ) external onlyBackendRecorder {
        Campaign storage c = campaigns[campaignId];
        require(c.exists, "Campaign not found");
        require(amount > 0, "Amount must be > 0");
        require(bytes(txHash).length > 0, "txHash required");

        // idx là index donation hiện tại (0..donationCount-1)
        uint256 idx = donationCount[campaignId];

        // lưu donation vào mapping để có thể đọc lại từng bản ghi
        donations[campaignId][idx] = Donation({
            amount: amount,
            txHash: txHash,
            timestamp: block.timestamp
        });

        // tăng số lượng donation đã ghi
        donationCount[campaignId] = idx + 1;

        // cập nhật tổng VNĐ đã ghi nhận
        c.totalDonations += amount;

        // emit event để frontend/indexer có thể bắt và hiển thị
        emit DonationRecorded(campaignId, amount, txHash, idx);
    }

    // =========================================================
    // 8) WITHDRAW LOGIC (CHỈ MANG TÍNH MÔ PHỎNG/AUDIT)
    // =========================================================

    /**
     * @notice "Withdraw" chỉ là logic audit vì tiền thật nằm off-chain.
     * @dev Không chuyển ETH/token. Chỉ reset totalDonations về 0 và emit event.
     *
     * @param campaignId id campaign on-chain
     */
    function withdraw(uint256 campaignId) external {
        Campaign storage c = campaigns[campaignId];
        require(c.exists, "Campaign not found");
        require(msg.sender == c.owner, "Only campaign owner");
        require(c.totalDonations > 0, "Nothing to withdraw");

        uint256 amount = c.totalDonations;

        // reset về 0 để đánh dấu "đã giải ngân" trong mô phỏng/audit
        c.totalDonations = 0;

        emit Withdrawn(campaignId, msg.sender, amount);
    }

    // =========================================================
    // 9) READ FUNCTIONS / HÀM ĐỌC DỮ LIỆU CHO FRONTEND
    // =========================================================

    /**
     * @notice Lấy thông tin campaign + donationCount.
     * @param campaignId id campaign on-chain
     */
    function getCampaign(uint256 campaignId)
        external
        view
        returns (
            uint256 id,
            address campaignOwner,
            string memory name,
            uint256 targetAmount,
            uint256 totalDonations_,
            uint256 donationCount_
        )
    {
        Campaign storage c = campaigns[campaignId];
        require(c.exists, "Campaign not found");

        return (c.id, c.owner, c.name, c.targetAmount, c.totalDonations, donationCount[campaignId]);
    }

    /**
     * @notice Lấy 1 donation theo index.
     * Frontend có thể loop từ 0..donationCount-1 để đọc từng donation.
     *
     * @param campaignId id campaign on-chain
     * @param index chỉ số donation
     */
    function getDonation(uint256 campaignId, uint256 index)
        external
        view
        returns (uint256 amount, string memory txHash, uint256 timestamp)
    {
        require(campaigns[campaignId].exists, "Campaign not found");
        require(index < donationCount[campaignId], "Index out of range");

        Donation storage d = donations[campaignId][index];
        return (d.amount, d.txHash, d.timestamp);
    }
}

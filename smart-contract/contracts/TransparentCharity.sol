// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Transparent Charity
 * - Donations are recorded ON-CHAIN for transparency
 * - Actual money transfer is OFF-CHAIN (VND), verified by backend
 *
 * Security model:
 * - contractOwner (deployer) sets backendRecorder
 * - backendRecorder is allowed to call recordDonation
 * - each campaign has its own owner who can withdraw the on-chain "recorded" value (logic only)
 */
contract TransparentCharity {
    // ====== Ownership (simple Ownable) ======
    address public owner; // contract owner (deployer)

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    // backend wallet allowed to record donations
    address public backendRecorder;

    event BackendRecorderUpdated(address indexed oldRecorder, address indexed newRecorder);

    // ====== Campaign data ======
    struct Campaign {
        uint256 id;
        address owner;          // campaign creator
        string name;
        uint256 targetAmount;   // VND unit (off-chain amount, just recorded)
        uint256 totalDonations; // VND recorded total
        bool exists;
    }

    // donation history per campaign (stored on-chain)
    struct Donation {
        uint256 amount;     // VND
        string txHash;      // off-chain payment tx hash (VNPay/MoMo mock)
        uint256 timestamp;
    }

    // campaignId => Campaign
    mapping(uint256 => Campaign) private campaigns;

    // campaignId => donationIndex => Donation
    mapping(uint256 => mapping(uint256 => Donation)) private donations;

    // campaignId => donationCount
    mapping(uint256 => uint256) public donationCount;

    uint256 public nextCampaignId = 1;

    // ====== Events ======
    event CampaignCreated(uint256 indexed campaignId, address indexed campaignOwner, string name, uint256 targetAmount);
    event DonationRecorded(uint256 indexed campaignId, uint256 amount, string txHash, uint256 indexed donationIndex);
    event Withdrawn(uint256 indexed campaignId, address indexed campaignOwner, uint256 amount);

    constructor() {
        owner = msg.sender;
        backendRecorder = msg.sender; // default to deployer
    }

    // ====== Admin / backend config ======
    function setBackendRecorder(address _recorder) external onlyOwner {
        require(_recorder != address(0), "Invalid recorder");
        address old = backendRecorder;
        backendRecorder = _recorder;
        emit BackendRecorderUpdated(old, _recorder);
    }

    modifier onlyBackendRecorder() {
        require(msg.sender == backendRecorder, "Only backend recorder");
        _;
    }

    // ====== Campaign functions ======
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

    /**
     * recordDonation: called by backend after off-chain VND payment success
     * - amount is in VND (integer)
     * - txHash is off-chain payment transaction hash/id
     */
    function recordDonation(uint256 campaignId, uint256 amount, string calldata txHash)
        external
        onlyBackendRecorder
    {
        Campaign storage c = campaigns[campaignId];
        require(c.exists, "Campaign not found");
        require(amount > 0, "Amount must be > 0");
        require(bytes(txHash).length > 0, "txHash required");

        // store donation
        uint256 idx = donationCount[campaignId];
        donations[campaignId][idx] = Donation({
            amount: amount,
            txHash: txHash,
            timestamp: block.timestamp
        });
        donationCount[campaignId] = idx + 1;

        // update total
        c.totalDonations += amount;

        emit DonationRecorded(campaignId, amount, txHash, idx);
    }

    /**
     * withdraw: logical withdraw (since funds are off-chain)
     * In real product you might:
     * - replace this with an off-chain bank transfer workflow
     * - or use stablecoin on-chain, etc.
     *
     * Here we just emit event and reset campaign totalDonations to 0 for auditing.
     */
    function withdraw(uint256 campaignId) external {
        Campaign storage c = campaigns[campaignId];
        require(c.exists, "Campaign not found");
        require(msg.sender == c.owner, "Only campaign owner");
        require(c.totalDonations > 0, "Nothing to withdraw");

        uint256 amount = c.totalDonations;
        c.totalDonations = 0;

        emit Withdrawn(campaignId, msg.sender, amount);
    }

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
     * getDonation: fetch a specific donation by index
     * Frontend can page through donationCount and read each donation if needed.
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MarketplaceEscrowHash {
    enum TradeStatus {
        None,
        Deposited,
        Completed,
        Cancelled
    }

    struct Trade {
        string businessId;
        bytes32 dataHash;
        address buyer;
        address seller;
        uint256 totalPrice;
        uint256 depositAmount;
        uint256 remainingAmount;
        uint256 createdAt;
        uint256 updatedAt;
        TradeStatus status;
    }

    mapping(string => Trade) private trades;

    event Deposited(
        string businessId,
        bytes32 dataHash,
        address indexed buyer,
        address indexed seller,
        uint256 depositAmount,
        uint256 totalPrice,
        uint256 timestamp
    );

    event RemainingPaid(
        string businessId,
        bytes32 dataHash,
        address indexed buyer,
        address indexed seller,
        uint256 remainingAmount,
        uint256 timestamp
    );

    function depositForTrade(
        string calldata businessId,
        bytes32 dataHash,
        address seller,
        uint256 totalPrice
    ) external payable {
        require(bytes(businessId).length > 0, "businessId required");
        require(seller != address(0), "invalid seller");
        require(msg.value > 0, "deposit > 0");
        require(totalPrice > msg.value, "total must > deposit");
        require(trades[businessId].buyer == address(0), "trade exists");

        uint256 remainingAmount = totalPrice - msg.value;

        trades[businessId] = Trade({
            businessId: businessId,
            dataHash: dataHash,
            buyer: msg.sender,
            seller: seller,
            totalPrice: totalPrice,
            depositAmount: msg.value,
            remainingAmount: remainingAmount,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            status: TradeStatus.Deposited
        });

        emit Deposited(
            businessId,
            dataHash,
            msg.sender,
            seller,
            msg.value,
            totalPrice,
            block.timestamp
        );
    }

    function payRemaining(
        string calldata businessId,
        bytes32 newDataHash
    ) external payable {
        Trade storage t = trades[businessId];

        require(t.buyer != address(0), "trade not found");
        require(t.status == TradeStatus.Deposited, "invalid status");
        require(msg.sender == t.buyer, "only buyer");
        require(msg.value == t.remainingAmount, "wrong remaining amount");

        t.dataHash = newDataHash;
        t.status = TradeStatus.Completed;
        t.updatedAt = block.timestamp;

        uint256 payout = t.depositAmount + t.remainingAmount;
        payable(t.seller).transfer(payout);

        emit RemainingPaid(
            businessId,
            newDataHash,
            t.buyer,
            t.seller,
            msg.value,
            block.timestamp
        );
    }

    function getTrade(string calldata businessId) external view returns (Trade memory) {
        return trades[businessId];
    }
}
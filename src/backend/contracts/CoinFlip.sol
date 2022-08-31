// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Bank.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract CoinFlip is Ownable, ReentrancyGuard, VRFConsumerBaseV2 {
    Bank private bank;
    
    uint64 s_subscriptionId;
    VRFCoordinatorV2Interface COORDINATOR;
    address vrfCoordinator = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;
    bytes32 keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;
    uint256[] public s_randomWords;
    uint256 public s_requestId;

    struct Bet {
        address user;
        uint256 amount;
    }

    Bet[] betsQueue;

    event BetSettled(
        address user,
        uint256 amount,
        uint256 result
    );

    constructor(address _bankAddress, uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        bank = Bank(_bankAddress);

        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function play(uint _betAmount) public {
        require(bank.playerBalance(msg.sender) >= _betAmount, "Not enough coins to bet");
        requestFlip();
        betsQueue.push(Bet(msg.sender, _betAmount));
    }

    function requestFlip() public {
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
        
        uint256 betsQueueLength = betsQueue.length;
        require(betsQueueLength > 0, "No bets in queue");

        Bet memory lastBet = betsQueue[betsQueueLength - 1];
        bool result = s_randomWords[0] % 2 == 1;
        if (result) {
            bank.addPlayerBalance(lastBet.user, lastBet.amount);
        }
        else {
            bank.substractPlayerBalance(lastBet.user, lastBet.amount);
        }

        emit BetSettled(lastBet.user, lastBet.amount, s_randomWords[0] % 2);
        betsQueue.pop();
    }
}

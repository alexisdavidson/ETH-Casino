// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Bank.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CoinFlip is Ownable, ReentrancyGuard {
    Bank private bank;

    constructor(address _bankAddress)
    {
        bank = Bank(_bankAddress);
    }

    function play(uint _betAmount) public {
        require(bank.playerBalance(msg.sender) >= _betAmount, "Not enough coins to bet");
        if (flipResult()) {
            bank.addPlayerBalance(msg.sender, _betAmount);
        }
        else {
            bank.substractPlayerBalance(msg.sender, _betAmount);
        }
    }

    function flipResult() public pure returns(bool) {
        return true;
    }
}

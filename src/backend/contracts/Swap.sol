// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    string public name = "Casino Instant Exchange";
    Token public token;
    uint public rate = 100;
    uint public immutable feePercent = 35; // 3.5%
    address payable public immutable feeAccount; // the account that receives fees

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
        token.claimInitialSupply();
        feeAccount = payable(address(this));
    }

    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate;

        require(token.balanceOf(address(this)) >= tokenAmount, "Swap has not enough tokens");

        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "User cant sell more tokens than they have");

        uint etherAmount = _amount / rate;

        require(address(this).balance >= etherAmount, "Bank has not enough liquidity");

        token.transferFrom(msg.sender, address(this), _amount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}

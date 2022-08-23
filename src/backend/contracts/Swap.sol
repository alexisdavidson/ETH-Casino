// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Token.sol";

contract Swap {
    string public name = "Casino Instant Exchange";
    Token public token;
    uint public rate = 100;

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
    }

    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require that EthSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount, "Swap has not enough tokens");

        // Transfer tokens to the user
        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount, "User cant sell more tokens than they have");

        // Calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether
        require(address(this).balance >= etherAmount);

        // Perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        // msg.sender.transfer(etherAmount);

        // Emit an event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}

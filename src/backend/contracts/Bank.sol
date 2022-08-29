// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank is Ownable, ReentrancyGuard {
    uint public rate = 100;
    uint public immutable feePercent = 35; // 3.5%
    mapping(address => uint256) public players;
    address[] private gameContracts;

    constructor() { }

    function buyTokens() public payable nonReentrant {
        uint tokenAmount = msg.value * rate * (1000 - feePercent) / 1000;
        players[msg.sender] += tokenAmount;
    }

    function sellTokens(uint _amount) public nonReentrant {
        require(players[msg.sender] >= _amount, "User cant sell more tokens than they have");

        uint etherAmount = _amount / rate * (1000 - feePercent) / 1000;

        require(address(this).balance >= etherAmount, "Bank has not enough liquidity");

        players[msg.sender] -= _amount;
        payable(msg.sender).transfer(etherAmount);
    }
    
    function playerBalance(address _playerAddress) public view returns(uint256) {
        return players[_playerAddress];
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setGameContracts(address[] calldata _gameContracts) public onlyOwner {
        delete gameContracts;
       gameContracts = _gameContracts;
    }

    function isGameContract(address _gameContract) public view returns (bool) {
        address[] memory _gameContracts = gameContracts;
        for (uint i = 0; i < _gameContracts.length; i++) {
            if (_gameContracts[i] == _gameContract) {
                return true;
            }
        }
        return false;
    }

    function addPlayerBalance(address _playerAddress, uint256 _amount) public {
        require(isGameContract(msg.sender), "Only game contracts can act on player balance");
        players[_playerAddress] += _amount;
    }

    function substractPlayerBalance(address _playerAddress, uint256 _amount) public {
        require(isGameContract(msg.sender), "Only game contracts can act on player balance");
        players[_playerAddress] -= _amount;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract House is Ownable, ReentrancyGuard {
    uint public rate = 100000;
    uint public feePercentWithdraw = 40; // 4.0%
    uint public feePercentDeposit = 5; // 0.5%
    mapping(address => uint256) public players;
    address[] private gameContracts;
    address[] private admins;

    modifier onlyAdmins() {
      require(isAdmin(msg.sender), "User is not admin");
      _;
    }

    constructor(address _newOwner, address[] memory _admins) {
        transferOwnership(_newOwner);

        delete admins;
        admins = _admins;
    }

    function buyTokens() public payable nonReentrant {
        require(msg.value >= 10000000000000000, "Minimum amount to deposit is 0.01");
        uint tokenAmount = msg.value * rate * (1000 - feePercentDeposit) / 1000;
        players[msg.sender] += tokenAmount;
    }

    function sellTokens(uint _amount) public nonReentrant {
        require(players[msg.sender] >= _amount, "User cant sell more tokens than they have");

        uint etherAmount = _amount / rate * (1000 - feePercentWithdraw) / 1000;

        require(address(this).balance >= etherAmount, "House has not enough liquidity");

        players[msg.sender] -= _amount;
        payable(msg.sender).transfer(etherAmount);
    }
    
    function playerBalance(address _playerAddress) public view returns(uint256) {
        return players[_playerAddress];
    }

    function withdraw() public onlyAdmins {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setGameContracts(address[] calldata _gameContracts) public onlyAdmins {
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
    
    function setAdmins(address[] calldata _admins) public onlyAdmins {
        delete admins;
        admins = _admins;
    }

    function isAdmin(address _user) public view returns (bool) {
        uint256 adminsLength = admins.length;
        for (uint256 i = 0; i < adminsLength;) {
            if (admins[i] == _user) {
                return true;
            }
            unchecked { ++i; }
        }
        return false;
    }
    
    function setFeePercentWithdraw(uint _fee) public onlyAdmins {
        feePercentWithdraw = _fee;
    }
    
    function setFeePercentDeposit(uint _fee) public onlyAdmins {
        feePercentDeposit = _fee;
    }
}

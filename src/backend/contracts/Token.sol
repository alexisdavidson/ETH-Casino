// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20
{
    bool public initialSupplyClaimed;

    constructor() ERC20("CasinoTokenName", "CSN") { }

    function claimInitialSupply() external {
        require(initialSupplyClaimed == false, 'Initial supply has already been claimed');
        initialSupplyClaimed = true;
        
        // Mint 222'000'000 tokens
        _mint(msg.sender, 222000000 * 10**uint(decimals()));
    }
}

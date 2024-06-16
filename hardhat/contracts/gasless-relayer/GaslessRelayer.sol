// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// solhint-disable no-empty-blocks, func-name-mixedcase

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract GaslessRelayer is MinimalForwarder {
    uint256 private constant diff = 0x01;  // for another bytecode hash
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface ICoupon {
    function mint(address to) external returns(uint256 tokenId);
}
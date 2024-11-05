// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./ICoupon.sol";

// solhint-disable not-rely-on-time

contract CouponDrop {

    // contract settings
    bytes32 public immutable mercleRoot;
    uint256 public immutable startTimestamp;

    // claim state
    address public token;
    mapping(address => bool) public isClaimed;

    event Claim(
        address indexed target,
        bytes32[] merkleProof,
        uint256 tokenId,
        uint256 timestamp
    );

    constructor(address erc721Token, bytes32 _mercleRoot, uint256 _startTimestamp) {
        require(_mercleRoot != bytes32(0), "CouponDrop: zero mercle root");
        require(_startTimestamp >= block.timestamp, "CouponDrop: wrong start timestamp");

        mercleRoot = _mercleRoot;
        startTimestamp = _startTimestamp;

        // deploy nft contract
        token = erc721Token;
    }

    function checkVerify(address _target, bytes32[] calldata _merkleProof) external view returns(bool) {
        return (_verify(_target, _merkleProof));
    }

    function claim(bytes32[] calldata _merkleProof) external returns(uint256 tokenId) {
        require(_verify(msg.sender, _merkleProof), "CouponDrop: invalid proof or wrong data");
        require(block.timestamp >= startTimestamp, "CouponDrop: giver has not started yet");
        require(!isClaimed[msg.sender], "CouponDrop: already received the gift");

        isClaimed[msg.sender] = true;

        tokenId = ICoupon(token).mint(msg.sender);

        emit Claim(msg.sender, _merkleProof, tokenId, block.timestamp);
    }

    function _verify(address _target, bytes32[] memory _merkleProof) internal view returns(bool) {
        bytes32 node = keccak256(abi.encodePacked(_target));
        return(MerkleProof.verify(_merkleProof, mercleRoot, node));
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./token/ERC20Bonuses.sol";
import "./token/ERC721Card.sol";

contract TokenFactory {

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => EnumerableSet.AddressSet) internal _erc20ByUser;
    mapping(address => EnumerableSet.AddressSet) internal _erc721ByUser;

    uint256 public totalERC20Bonuses;
    uint256 public totalERC721Card;

    event DeployERC20Bonuses(address newToken);
    event DeployERC721Card(address newToken);

    function deployERC20Bonuses(address impl, string memory name, string memory symbol) public {
        bytes memory data = new bytes(0);
        TransparentUpgradeableProxy newToken = new TransparentUpgradeableProxy(impl, address(this), data);

        // ERC20Bonuses(address(newToken)).initialize(name, symbol);

        _erc20ByUser[msg.sender].add(address(newToken));
        totalERC20Bonuses++;

        emit DeployERC20Bonuses(address(newToken));
    }

    function deployERC721Card(address impl, string memory name, string memory symbol) public {
        bytes memory data = new bytes(0);
        TransparentUpgradeableProxy newToken = new TransparentUpgradeableProxy(impl, address(this), data);

        // ERC721Card(address(newToken)).initialize(name, symbol);

        _erc721ByUser[msg.sender].add(address(newToken));
        totalERC721Card++;

        emit DeployERC721Card(address(newToken));
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./loyalty/BonusSystem.sol";

contract TokenFactory {

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => EnumerableSet.AddressSet) internal _bonusSystemsUser;

    uint256 public totalBonusSystems;

    event DeployERC20Bonuses(address newToken);
    event DeployERC721Card(address newToken);

    function deployBonusSystem(address impl, string memory name, string memory symbol) public {
        bytes memory data = new bytes(0);
        TransparentUpgradeableProxy newToken = new TransparentUpgradeableProxy(impl, address(this), data);

        // ERC20Bonuses(address(newToken)).initialize(name, symbol);

        _bonusSystemsUser[msg.sender].add(address(newToken));
        totalBonusSystems++;

        emit DeployERC20Bonuses(address(newToken));
    }

}
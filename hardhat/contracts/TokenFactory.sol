// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./token/ERC20Bonuses.sol";

contract TokenFactory {

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => EnumerableSet.AddressSet) internal _erc20ByUser;
    EnumerableSet.AddressSet internal _erc20;

    uint256 public totalERC20Bonuses;

    event DeployERC20Bonuses(address newToken);

    function deployERC20Bonuses(string memory name_) public {
        ERC20Bonuses newToken = new ERC20Bonuses(name_, "BONUS");

        _erc20ByUser[msg.sender].add(address(newToken));
        _erc20.add(address(newToken));
        totalERC20Bonuses++;

        emit DeployERC20Bonuses(address(newToken));
    }

    function name() external pure returns (string memory) {
        return "TokenFactory V1";
    }

    function getTokensByUser(
        address user,
        uint256 cursor,
        uint256 howMany
    ) external view returns (address[] memory values, string[] memory names, uint256[] memory totalSupply, uint256 newCursor) {
        return (_fetchWithPagination(_erc20ByUser[user], cursor, howMany));
    }

    function getTokens(
        uint256 cursor,
        uint256 howMany
    ) external view returns (address[] memory values, string[] memory names, uint256[] memory totalSupply, uint256 newCursor) {
        return (_fetchWithPagination(_erc20, cursor, howMany));
    }

    function getBalances(address[] memory tokens, address target) external view returns (uint256[] memory balances) {

        balances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            balances[i] = ERC20Bonuses(tokens[i]).balanceOf(target);
        }

        return (balances);
    }

    function _fetchWithPagination(
        EnumerableSet.AddressSet storage set,
        uint256 cursor,
        uint256 howMany
    ) internal view returns (address[] memory values, string[] memory names, uint256[] memory totalSupply, uint256 newCursor) {
        uint256 length = howMany;

        if (length > set.length() - cursor) {
            length = set.length() - cursor;
        }

        values = new address[](length);
        names = new string[](length);
        totalSupply = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            values[i] = set.at(cursor + i);
            names[i] = ERC20Bonuses(values[i]).name();
            totalSupply[i] = ERC20Bonuses(values[i]).totalSupply();
        }

        return (values, names, totalSupply, cursor + length);
    }

}
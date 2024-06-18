// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./loyalty/BonusSystem.sol";

contract LoyaltyFactory {

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => EnumerableSet.AddressSet) internal _loyaltyByUser;
    EnumerableSet.AddressSet internal _loyalty;

    uint256 public totalBonusSystem;

    event DeployBonusSystem(address newToken);

    function deployBonusSystem(address token, string memory name_) public {
        BonusSystem newToken = new BonusSystem(token, name_);

        _loyaltyByUser[msg.sender].add(address(newToken));
        _loyalty.add(address(newToken));
        totalBonusSystem++;

        emit DeployBonusSystem(address(newToken));
    }

    function name() external pure returns (string memory) {
        return "LoyaltyFactory V1";
    }

    function getLoyaltiesByUser(
        address user,
        uint256 cursor,
        uint256 howMany
    ) external view returns (address[] memory values, string[] memory names, address[] memory tokens, uint256 newCursor) {
        return (_fetchWithPagination(_loyaltyByUser[user], cursor, howMany));
    }

    function getLoyalties(
        uint256 cursor,
        uint256 howMany
    ) external view returns (address[] memory values, string[] memory names, address[] memory tokens, uint256 newCursor) {
        return (_fetchWithPagination(_loyalty, cursor, howMany));
    }

    function _fetchWithPagination(
        EnumerableSet.AddressSet storage set,
        uint256 cursor,
        uint256 howMany
    ) internal view returns (address[] memory values, string[] memory names, address[] memory tokens, uint256 newCursor) {
        uint256 length = howMany;

        if (length > set.length() - cursor) {
            length = set.length() - cursor;
        }

        values = new address[](length);
        names = new string[](length);
        tokens = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            values[i] = set.at(cursor + i);
            names[i] = BonusSystem(values[i]).name();
            tokens[i] = BonusSystem(values[i]).ftToken();
        }

        return (values, names, tokens, cursor + length);
    }

}
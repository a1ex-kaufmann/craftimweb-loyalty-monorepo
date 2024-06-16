// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.19;
// solhint-disable avoid-low-level-calls

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract MultiTransactor is Initializable, AccessControlEnumerableUpgradeable {
    bytes32 public constant TRANSACTOR_ROLE = keccak256("TRANSACTOR_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /**
     * @dev Constructor method (https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers).
     */
    function initialize() external initializer {
        __AccessControlEnumerable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TRANSACTOR_ROLE, msg.sender);
    }

    function isAdmin(address account) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isTransactor(address account) public view returns (bool) {
        return hasRole(TRANSACTOR_ROLE, account);
    }

    function setAdmin(address account, bool value) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool success) {
        if (value) {
            require(!hasRole(DEFAULT_ADMIN_ROLE, account), "MultiTransactor: account already has admin role");
            grantRole(DEFAULT_ADMIN_ROLE, account);
        } else {
            require(hasRole(DEFAULT_ADMIN_ROLE, account), "MultiTransactor: account doesn't have admin role");
            revokeRole(DEFAULT_ADMIN_ROLE, account);
        }

        return true;
    }

    function setTransactor(address account, bool value) public onlyRole(TRANSACTOR_ROLE) returns (bool success) {
        if (value) {
            require(!hasRole(TRANSACTOR_ROLE, account), "MultiTransactor: account already has transactor role");
            grantRole(TRANSACTOR_ROLE, account);
        } else {
            require(hasRole(TRANSACTOR_ROLE, account), "MultiTransactor: account doesn't have transactor role");
            revokeRole(TRANSACTOR_ROLE, account);
        }

        return true;
    }

    function getAdminList(uint256 cursor, uint256 count)
        public
        view
        returns (address[] memory result, uint256 newCursor)
    {
        uint256 length = count;
        uint256 adminAmount = getRoleMemberCount(DEFAULT_ADMIN_ROLE);

        if (length > adminAmount - cursor) {
            length = adminAmount - cursor;
        }

        address[] memory addresses = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            addresses[i] = getRoleMember(DEFAULT_ADMIN_ROLE, cursor + i);
        }

        return (addresses, cursor + length);
    }

    function getTransactorList(uint256 cursor, uint256 count)
        public
        view
        returns (address[] memory result, uint256 newCursor)
    {
        uint256 length = count;
        uint256 transactorAmount = getRoleMemberCount(TRANSACTOR_ROLE);

        if (length > transactorAmount - cursor) {
            length = transactorAmount - cursor;
        }

        address[] memory addresses = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            addresses[i] = getRoleMember(TRANSACTOR_ROLE, cursor + i);
        }

        return (addresses, cursor + length);
    }

    function sendTx(address to, bytes memory data) external onlyRole(TRANSACTOR_ROLE) returns (bytes memory) {
        (bool success, bytes memory result) = to.call(data);
        require(success, "MultiTransactor: call failed");

        return result;
    }

    function sendTxBatch(address[] calldata to, bytes[] calldata data)
        external
        onlyRole(TRANSACTOR_ROLE)
        returns (bytes[] memory)
    {
        require(to.length == data.length, "MultiTransactor: to.length != data.length");
        bytes[] memory results = new bytes[](data.length);

        for (uint256 i = 0; i < to.length; i++) {
            (bool success, bytes memory result) = to[i].call(data[i]);
            require(success, "MultiTransactor: call failed");
            results[i] = result;
        }

        return results;
    }

}

// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

 /**
 * @dev Loyalty Core interface
 */
interface ILoyaltyCore {

    struct LoyaltyEntity {
        address contractAddress;
        uint256 id;
        address registrar;
    }

    function registerEntity(address loyaltyContract) external returns(address contractAddress, uint256 entityId, address registrar);

    function getEntity(uint256 id) external view returns(address contractAddress, uint256 entityId, address registrar);

    function getEntity(address entityAddress) external view returns(address contractAddress, uint256 entityId, address registrar);

    function entityTotal() external view returns(uint256);

    function entityCountByRegistrar(address target) external view returns(uint256);

    function entityListByRegistrar(address target) external view returns(uint256[] memory);

    function coreVersion() external view returns(string memory);
}
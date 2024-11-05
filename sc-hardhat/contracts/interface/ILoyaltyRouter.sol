// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

 /**
 * @dev Loyalty Router interface
 */
interface ILoyaltyRouter {

    event DeployAndRegister(address indexed contractAddress, uint256 entityId, address indexed owner, uint256 _timestamp);

    function deployAndRegister(
        bytes memory bytecode,
        bytes memory settingsData,
        bytes memory othersData,
        string memory metaData
    ) external returns(address contractAddress, uint256 entityId, address owner);

    function coreContract() external view returns(address);
}
// SPDX-License-Identifier: UNLICENSED
// solhint-disable not-rely-on-time, reason-string, no-inline-assembly

pragma solidity 0.8.20;

import "../interface/IJRC1.sol";
import "../interface/ILoyaltyCore.sol";

 /**
 * @dev Loyalty programs core smart contract.
 */
contract LoyaltyCore is ILoyaltyCore {

    uint256 private _entityTotal = 0;
    mapping(uint256 => ILoyaltyCore.LoyaltyEntity) private _entity;
    mapping(address => uint256) private _addressToEntity;

    mapping(address => uint256[]) private _entityListByRegistrar;

    event RegisterEntity(address contractAddress, uint256 entityId, address indexed registrar, uint256 timestamp);

    /**
    * @dev Register new loyalty program instance
    */
    function registerEntity(address loyaltyContract) 
    external
    override
    returns(address contractAddress, uint256 entityId, address registrar) {
        require(loyaltyContract != address(0), "LoyaltyCore: zero address error");
        require(_entity[_addressToEntity[loyaltyContract]].contractAddress == address(0), "LoyaltyCore: loyalty already registered");

        // the loyaltyEntity must be contract
        uint256 codeSize;
        assembly { codeSize := extcodesize(loyaltyContract) }
        require(codeSize != 0, "LoyaltyCore: entity must be a contract");

        // check jrc1
        (bool success1,) = loyaltyContract.staticcall(abi.encodeWithSignature("implName()"));
        (bool success2,) = loyaltyContract.staticcall(abi.encodeWithSignature("implGeneration()"));
        (bool success3,) = loyaltyContract.staticcall(abi.encodeWithSignature("protoVersion()"));
        require(success1 && success2 && success3, "LoyaltyCore: incompatible JRC-1 contract");
        require(IJRC1(loyaltyContract).isInitialized(), "LoyaltyCore: contract must be inited");

        // creating entity
        uint256 newEntityId = _entityTotal + 1;
        _entityTotal = newEntityId;
        _entity[newEntityId] = LoyaltyEntity({
            contractAddress: loyaltyContract,
            id: newEntityId,
            registrar: msg.sender
        });
        _addressToEntity[loyaltyContract] = newEntityId; 

        _entityListByRegistrar[msg.sender].push(newEntityId);

        emit RegisterEntity(loyaltyContract, newEntityId, msg.sender, block.timestamp);

        return (loyaltyContract, newEntityId, msg.sender);
    }

    function getEntity(uint256 id) external view override returns(address contractAddress, uint256 entityId, address registrar) {
        require(id <= _entityTotal, "LoyaltyCore: loyalty entity does not exist");
        return (_entity[id].contractAddress, _entity[id].id, _entity[id].registrar);
    }

    function getEntity(address entityAddress) external view override returns(address contractAddress, uint256 entityId, address registrar) {
        uint256 id = _addressToEntity[entityAddress];
        return (_entity[id].contractAddress, _entity[id].id, _entity[id].registrar);
    }

    function entityTotal() external view override returns(uint256) {
        return _entityTotal;
    }

    function entityCountByRegistrar(address target) external view override returns(uint256) {
        return _entityListByRegistrar[target].length;
    }

    function entityListByRegistrar(address target) external view override returns(uint256[] memory) {
        return _entityListByRegistrar[target];
    }

    function coreVersion() external view override returns(string memory) {
        return "1.5";
    }
}
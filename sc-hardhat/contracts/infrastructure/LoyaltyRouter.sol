// SPDX-License-Identifier: UNLICENSED
// solhint-disable reason-string, no-inline-assembly, not-rely-on-time, var-name-mixedcase

pragma solidity 0.8.20;

import "../interface/ILoyaltyRouter.sol";
import "../interface/ILoyaltyCore.sol";
import "../interface/IJRC1.sol";

 /**
 * @dev Loyalty programs router. Router helps to simplify queries to the loyalty contract ecosystem
 */
contract LoyaltyRouter is ILoyaltyRouter {

    address internal _coreContract;

    constructor(address coreAddress) public {
        require(coreAddress != address(0), "LoyaltyRouter: zero core address");
        uint256 codeSize;
        assembly { codeSize := extcodesize(coreAddress) }
        require(codeSize != 0, "LoyaltyRouter: core must be a contract");

        _coreContract = coreAddress;
    }

    function deployAndRegister(
        bytes memory bytecode,
        bytes memory settingsData,
        bytes memory othersData,
        string memory metaData
    ) 
    external
    override
    returns(address contractAddress, uint256 entityId, address owner) {
        require(bytecode.length != 0, "LoyaltyRouter: smart contract of the specified type of loyalty does not exist");

        // deploy contract
        address addr;
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(addr != address(0), "LoyaltyRouter: loyalty contract deployment failed");

        // initialize loyalty contract
        IJRC1 newLoyalty = IJRC1(addr);
        newLoyalty.initialize(msg.sender, settingsData, othersData, metaData);

        // register loyalty in the core
        ILoyaltyCore core = ILoyaltyCore(_coreContract);
        (contractAddress, entityId,) = core.registerEntity(addr);
        owner = msg.sender;

        emit DeployAndRegister(contractAddress, entityId, msg.sender, block.timestamp);
    }

    function coreContract() external view override returns(address) {
        return _coreContract;
    }

    function getEntity(uint256 id) external view returns(address contractAddress, uint256 entityId, address registrar) {
        return ILoyaltyCore(_coreContract).getEntity(id);
    }

    function getEntity(address entityAddress) external view returns(address contractAddress, uint256 entityId, address registrar) {
        return ILoyaltyCore(_coreContract).getEntity(entityAddress);
    }

    function entityTotal() external view returns(uint256) {
        return ILoyaltyCore(_coreContract).entityTotal();
    }

    function entityCountByRegistrar(address target) external view returns(uint256) {
        return ILoyaltyCore(_coreContract).entityCountByRegistrar(target);
    }

}
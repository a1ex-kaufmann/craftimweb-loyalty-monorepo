// SPDX-License-Identifier: UNLICENSED
// solhint-disable var-name-mixedcase, func-name-mixedcase

pragma solidity 0.8.20;

 /**
 * @dev JRC1 standart interface
 */
interface IJRC1 {

    event Initialize(address indexed oldOwner, address indexed newOwner, bytes settings_abi, bytes properties_abi, string metadataURI, uint256 timestamp);
    event EditSettings(address indexed editor, bytes settings_abi, uint256 timestamp);
    event MakePurchase(address indexed cashbox, bytes purchase_abi_in, bytes purchase_abi_out, uint256 timestamp);
    event CreateUser(address indexed cashbox, address indexed userAddress, bytes user_abi_in, bytes user_abi_out, uint256 timestamp);

    // methods for abi conversion

    function SETTINGS_ABI() external view returns(string memory);

    function PROPERTIES_ABI() external view returns(string memory);

    function PURCHASE_ABI_IN() external view returns(string memory);

    function PURCHASE_ABI_OUT() external view returns(string memory);

    function USER_ABI_IN() external view returns(string memory);
    
    function USER_ABI_OUT() external view returns(string memory);

    // main protocol methods

    function initialize(address newOwner, bytes memory settings_abi, bytes memory properties_abi, string memory metadataURI) external returns(bool success);

    function editSettings(bytes memory settings_abi) external returns(bool success);

    function makePurchase(bytes memory purchase_abi_in) external returns(bytes memory purchase_abi_out);

    function createUser(address userAddress, bytes memory user_abi_in) external returns(bytes memory user_abi_out);

    function isInitialized() external view returns(bool);

    function settings() external view returns(bytes memory settings_abi);

    function properties() external view returns(bytes memory properties_abi);

    function metadataURI() external view returns(string memory);

    function erc20tokens() external view returns(address[] memory);

    function erc721tokens() external view returns(address[] memory);

    function erc1155tokens() external view returns(address[] memory);

    function currencyCode() external view returns(string memory);
    
    function currencyDecimals() external view returns(uint256);

    function userDetails(address target) external view returns(bytes memory user_abi_out);

    function isUserExist(address userAddress) external view returns(bool);

    function totalUsers() external view returns(uint256);

    function getOwner() external view returns(address);

    function implName() external view returns(string memory);

    function implGeneration() external view returns(string memory);

    function protoVersion() external view returns(string memory);
}

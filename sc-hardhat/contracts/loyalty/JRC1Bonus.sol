// SPDX-License-Identifier: UNLICENSED
// solhint-disable var-name-mixedcase, func-name-mixedcase, not-rely-on-time, func-param-name-mixedcase

pragma solidity 0.8.20;

import "../interface/IJRC1.sol";
import "../lib/safe-ownable/LoyaltyOwnable.sol";
import "../token/LoyaltyERC20.sol";

 /**
 * @dev Loyalty program implementation for "BONUS" system
 */
contract JRC1Bonus is IJRC1, LoyaltyOwnable {

    /**
    * accrualPercent - bonus points accrual rate
    * minAccrualThreshold - minimum purchase amount for bonus points accrual
    * writeoffRate - bonus point writeoff rate
    * maxWriteoffPercent - maximum percentage of purchase that can be paid with bonus points
    * isSimultaneous - simultaneous writeoff and accrual of points
    * !!! all ruble and token amounts are in wei (10^(-18))
    */

    struct Settings {
        uint256 accrualPercent;
        uint256 minAccrualThreshold;
        uint256 writeoffRate;
        uint256 maxWriteoffPercent;
        bool isSimultaneous;
    }

    struct User {
        bool registered;
        uint256 totalPurchases;
        uint256 totalSum;
    }

    struct Purchase {
        uint256 status;
        address target;
        bytes purchase_abi_in;
        bytes purchase_abi_out;
    }

    bool internal _inited = false;
    Settings internal _settings;
    string internal _metadataURI;
    address internal _ftToken;

    uint256 internal _totalUsers = 0;
    mapping(address => User) internal _user;
    mapping(string => address) internal _fcardToUser;
    mapping(uint256 => Purchase) internal _purchase;

    event CancelPurchase(uint256 purchaseId, uint256 timestamp);

    function SETTINGS_ABI() external pure override returns(string memory) {
        return ("uint256,uint256,uint256,uint256,bool");
    }

    function PROPERTIES_ABI() external pure override returns(string memory) {
        return ("string,string");
    }

    function PURCHASE_ABI_IN() external pure override returns(string memory) {
        return ("address,uint256,uint256,uint256,string,uint256,bytes");
    }

    function PURCHASE_ABI_OUT() external pure override returns(string memory) {
        return ("uint256,uint256,uint256");
    }

    function USER_ABI_IN() external pure override returns(string memory) {
        return ("string");
    }

    function USER_ABI_OUT() external pure override returns(string memory) {
        return ("bool,uint256,uint256,uint256");
    }

    function initialize(address newOwner, bytes memory settings_abi, bytes memory properties_abi, string memory metadataURI) external override onlyOwner returns(bool success) {
        require(_inited == false, "JRC1Bonus: already inited");

        transferOwnership(newOwner);

        (uint256 accrualPercent,
        uint256 minAccrualThreshold,
        uint256 writeoffRate,
        uint256 maxWriteoffPercent,
        bool isSimultaneous) = abi.decode(settings_abi, (uint256,uint256,uint256,uint256,bool));

        (string memory tokenName,
        string memory tokenSymbol) = abi.decode(properties_abi, (string,string));

        _checkSettings(
            accrualPercent,
            minAccrualThreshold,
            writeoffRate,
            maxWriteoffPercent,
            isSimultaneous
        );

        _inited = true;
        _settings = Settings({
            accrualPercent: accrualPercent,
            minAccrualThreshold: minAccrualThreshold,
            writeoffRate: writeoffRate,
            maxWriteoffPercent: maxWriteoffPercent,
            isSimultaneous: isSimultaneous
        });
        LoyaltyERC20 newToken = new LoyaltyERC20(0, tokenName, tokenSymbol);
        _ftToken = address(newToken);
        _metadataURI = metadataURI;

        emit Initialize(msg.sender, newOwner, settings_abi, properties_abi, metadataURI, block.timestamp);

        return true;
    }

    function editSettings(bytes memory settings_abi) external override onlyOwner returns(bool success) {
        (uint256 accrualPercent,
        uint256 minAccrualThreshold,
        uint256 writeoffRate,
        uint256 maxWriteoffPercent,
        bool isSimultaneous) = abi.decode(settings_abi, (uint256,uint256,uint256,uint256,bool));

        _checkSettings(
            accrualPercent,
            minAccrualThreshold,
            writeoffRate,
            maxWriteoffPercent,
            isSimultaneous
        );

        _settings = Settings({
            accrualPercent: accrualPercent,
            minAccrualThreshold: minAccrualThreshold,
            writeoffRate: writeoffRate,
            maxWriteoffPercent: maxWriteoffPercent,
            isSimultaneous: isSimultaneous
        });
        
        emit EditSettings(msg.sender, settings_abi, block.timestamp);

        return true;
    }

    function makePurchase(bytes memory purchase_abi_in) external override onlyOwner returns(bytes memory purchase_abi_out) {    
        // bonusPayment: decimal=10^18
        // sumTotal: decimal=10^18
        (address target,
        uint256 purchaseId,
        uint256 bonusPayment,
        uint256 sumTotal,,
        uint256 signTimestamp,
        bytes memory signature) = abi.decode(purchase_abi_in, (address,uint256,uint256,uint256,string,uint256,bytes));

        require(target != address(0), "JRC1Bonus: address cannot be null");
        LoyaltyERC20 token = LoyaltyERC20(_ftToken);
        require(sumTotal > 0, "JRC1Bonus: sumTotal=0");
        require(token.balanceOf(target) >= bonusPayment, "JRC1Bonus: not enought balance");
        require(_purchase[purchaseId].status == 0, "JRC1Bonus: purchase with this ID already exists");
        require(_user[target].registered == true, "JRC1Bonus: user not created");

        _user[target].totalPurchases = _user[target].totalPurchases + 1;
        _user[target].totalSum = _user[target].totalSum + sumTotal;
        
        uint256 needAccrue;
        uint256 bonusPaid;
        uint256 resultCost = sumTotal;

        if (bonusPayment > 0) {
            // writeoff
            uint256 wantWriteOff = bonusPayment * _settings.writeoffRate / 10**18;
            uint256 maxWriteOff = sumTotal * _settings.maxWriteoffPercent / 100;

            if (wantWriteOff < maxWriteOff) {
                resultCost = sumTotal - wantWriteOff;
                bonusPaid = bonusPayment;
            } else {
                resultCost = sumTotal - maxWriteOff;

                // bonus = fiat / rate
                bonusPaid = maxWriteOff * 10**18 / _settings.writeoffRate;

            }
            require(signTimestamp > 0, "JRC1Bonus: need sign timestamp");
            require(signature.length > 0, "JRC1Bonus: need signature");

            // only for demo
            // bytes32 msgHash = ECDSA.toEthSignedMessageHash(
            //     keccak256(abi.encodePacked(address(this), target, signTimestamp))
            // );
            // require(ECDSA.recover(msgHash, signature) == target, "JRC1Bonus: invalid approve signature");

            token.burn(target, bonusPaid);
            
            if (_settings.isSimultaneous == true) {
                // accrue
                if (resultCost > _settings.minAccrualThreshold) {
                    needAccrue = resultCost * _settings.accrualPercent / 100;
                    token.mint(target, needAccrue);
                }
            }
        } else {
            // accrue
            bonusPaid = 0;
            resultCost = sumTotal;

            if (resultCost >= _settings.minAccrualThreshold) {
                needAccrue = resultCost * _settings.accrualPercent / 100;
                token.mint(target, needAccrue);
            }
        }

        purchase_abi_out = (abi.encode(resultCost, needAccrue, bonusPaid));

        _purchase[purchaseId] = Purchase({
            status: uint256(1),
            target: target,
            purchase_abi_in: purchase_abi_in,
            purchase_abi_out: purchase_abi_out
        });

        emit MakePurchase(msg.sender, purchase_abi_in, purchase_abi_out, block.timestamp);
    }

    function cancelPurchase(uint256 purchaseId) external onlyOwner returns(bool success) {
        Purchase storage purchase = _purchase[purchaseId];

        require(purchase.status == 1, "JRC1Bonus: purchase must be completed and not canceled");

        purchase.status = 2;

        (,uint256 needAccrue, uint256 bonusPaid) = abi.decode(purchase.purchase_abi_out, (uint256,uint256,uint256));
        (,,,uint256 sumTotal) = abi.decode(purchase.purchase_abi_in, (uint256,uint256,uint256,uint256));

        address target = purchase.target;

        _user[target].totalPurchases = _user[target].totalPurchases - 1;
        _user[target].totalSum = _user[target].totalSum - sumTotal;

        LoyaltyERC20 token = LoyaltyERC20(_ftToken);

        if (needAccrue > 0) {
            (, bytes memory rawBalance) = _ftToken.staticcall(abi.encodeWithSignature("balanceOf(address)", target));
            uint256 balance = abi.decode(rawBalance, (uint256));
            uint256 burningAmount = needAccrue > balance ? balance : needAccrue;
            token.burn(target, burningAmount);
        }
        if (bonusPaid > 0) {
            token.mint(target, bonusPaid);
        }

        emit CancelPurchase(purchaseId, block.timestamp);

        return true;
    }

    function createUser(address userAddress, bytes memory user_abi_in) external override onlyOwner returns(bytes memory user_abi_out) {
        string memory foreignCard = abi.decode(user_abi_in, (string));

        require(userAddress != address(0), "JRC1Bonus: address cannot be null");
        require(_user[userAddress].registered == false, "JRC1Bonus: user already created");
        require(_fcardToUser[foreignCard] == address(0), "JRC1Bonus: foreign dublicate");

        _totalUsers = _totalUsers + 1;
        _user[userAddress] = User({
            registered: true,
            totalPurchases: 0,
            totalSum: 0
        });

        if (keccak256(abi.encodePacked(foreignCard)) != keccak256(abi.encodePacked(""))) {
            _fcardToUser[foreignCard] = userAddress;
        }

        user_abi_out = abi.encode(
            _user[userAddress].registered,
            _user[userAddress].totalPurchases,
            _user[userAddress].totalSum,
            IERC20(_ftToken).balanceOf(userAddress)
        );

        emit CreateUser(msg.sender, userAddress, user_abi_in, user_abi_out, block.timestamp);

        return user_abi_out;
    }

    function isInitialized() external view override returns(bool) {
        return _inited;
    }

    function purchase(uint256 purchaseId) external view returns(Purchase memory) {
        return _purchase[purchaseId];
    }

    function settings() external view override returns(bytes memory settings_abi) {
        return abi.encode(
            _settings.accrualPercent,
            _settings.minAccrualThreshold,
            _settings.writeoffRate,
            _settings.maxWriteoffPercent,
            _settings.isSimultaneous
        );
    }

    function properties() external view override returns(bytes memory properties_abi) { 
        (, bytes memory rawTokenName) = _ftToken.staticcall(abi.encodeWithSignature("name()"));
        (, bytes memory rawTokenSymbol) = _ftToken.staticcall(abi.encodeWithSignature("symbol()"));
        string memory tokenName = abi.decode(rawTokenName, (string));
        string memory tokenSymbol = abi.decode(rawTokenSymbol, (string));
        return abi.encode(
            tokenName,
            tokenSymbol
        );
    }

    function metadataURI() external view override returns(string memory) {
        return _metadataURI;
    }

    function erc20tokens() external view override returns(address[] memory) {
        address[] memory result = new address[](1);
        result[0] = _ftToken;
        return result;
    }

    function erc721tokens() external view override returns(address[] memory) {
        address[] memory result = new address[](0);
        return result;
    }

    function erc1155tokens() external view override returns(address[] memory) {
        address[] memory result = new address[](0);
        return result;
    }

    function currencyCode() external view override returns(string memory) {
        return "RUB";
    }
    
    function currencyDecimals() external view override returns(uint256) {
        return 18;
    }

    function userDetails(address target) external view override returns(bytes memory user_abi_out) {
        return abi.encode(
            _user[target].registered,
            _user[target].totalPurchases,
            _user[target].totalSum,
            IERC20(_ftToken).balanceOf(target)
        );
    }

    function userByForeignCard(string memory foreignCard) external view returns(address) {
        return _fcardToUser[foreignCard];
    }

    function isUserExist(address userAddress) external view override returns(bool) {
        return _user[userAddress].registered;
    }

    function totalUsers() external view override returns(uint256) {
        return _totalUsers;
    }

    function getOwner() external view override returns(address) {
        return owner();
    }

    function implName() external view override returns(string memory) {
        return "Bonus";
    }

    function implGeneration() external view override returns(string memory) {
        return "3.0.0";
    }

    function protoVersion() external view override returns(string memory) {
        return "0.9.1";
    }

    function _checkSettings(
        uint256 accrualPercent,
        uint256 minAccrualThreshold,
        uint256 writeoffRate,
        uint256 maxWriteoffPercent,
        bool isSimultaneous
    ) internal pure {
        // for linter checks
        minAccrualThreshold;
        writeoffRate;
        isSimultaneous;
        // guard check
        require(accrualPercent <= 100, "JRC1Bonus: wrong settings");
        require(maxWriteoffPercent <= 100, "JRC1Bonus: wrong settings");
    }
}
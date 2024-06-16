// SPDX-License-Identifier: UNLICENSED
// solhint-disable var-name-mixedcase, func-name-mixedcase, not-rely-on-time

pragma solidity 0.8.19;

import "../token/ERC20Bonuses.sol";

 /**
 * @dev Loyalty program implementation for bonus system
 */
contract BonusSystem {

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

    function initialize(address newOwner, string memory metadataURI, Settings memory settings) external returns(bool success) {
        require(_inited == false, "BonusSystem: already inited");

        _checkSettings(
            settings.accrualPercent,
            settings. minAccrualThreshold,
            settings. writeoffRate,
            settings.maxWriteoffPercent,
            settings.isSimultaneous
        );

        _inited = true;
        _settings = settings;

        _metadataURI = metadataURI;

        return true;
    }

    function editSettings(Settings memory settings) external returns(bool success) {
        _checkSettings(
            settings.accrualPercent,
            settings. minAccrualThreshold,
            settings. writeoffRate,
            settings.maxWriteoffPercent,
            settings.isSimultaneous
        );

        _settings = settings;
        
        // emit EditSettings(msg.sender, settings_abi, block.timestamp);

        return true;
    }

    function makePurchase(bytes memory purchase_abi_in) external returns(bytes memory purchase_abi_out) {    
        // bonusPayment: decimal=10^18
        // sumTotal: decimal=10^18
        (address target,
        uint256 purchaseId,
        uint256 bonusPayment,
        uint256 sumTotal,,
        uint256 signTimestamp,
        bytes memory signature) = abi.decode(purchase_abi_in, (address,uint256,uint256,uint256,string,uint256,bytes));

        require(target != address(0), "BonusSystem: address cannot be null");
        ERC20Bonuses token = ERC20Bonuses(_ftToken);
        require(sumTotal > 0, "BonusSystem: sumTotal=0");
        require(token.balanceOf(target) >= bonusPayment, "BonusSystem: not enought balance");
        require(_purchase[purchaseId].status == 0, "BonusSystem: purchase with this ID already exists");
        require(_user[target].registered == true, "BonusSystem: user not created");

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
            require(signTimestamp > 0, "BonusSystem: need sign timestamp");
            require(signature.length > 0, "BonusSystem: need signature");

            // bytes32 msgHash = ECDSA.toEthSignedMessageHash(
            //     keccak256(abi.encodePacked(address(this), target, signTimestamp))
            // );
            // require(ECDSA.recover(msgHash, signature) == target, "BonusSystem: invalid approve signature");

            // token.burn(target, bonusPaid);
            
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

        // emit MakePurchase(msg.sender, purchase_abi_in, purchase_abi_out, block.timestamp);
    }

    // function cancelPurchase(uint256 purchaseId) external returns(bool success) {
    //     Purchase storage purchase = _purchase[purchaseId];

    //     require(purchase.status == 1, "BonusSystem: purchase must be completed and not canceled");

    //     purchase.status = 2;

    //     (,uint256 needAccrue, uint256 bonusPaid) = abi.decode(purchase.purchase_abi_out, (uint256,uint256,uint256));
    //     (,,,uint256 sumTotal) = abi.decode(purchase.purchase_abi_in, (uint256,uint256,uint256,uint256));

    //     address target = purchase.target;

    //     _user[target].totalPurchases = _user[target].totalPurchases - 1;
    //     _user[target].totalSum = _user[target].totalSum - sumTotal;

    //     ERC20Bonuses token = ERC20Bonuses(_ftToken);

    //     if (needAccrue > 0) {
    //         (, bytes memory rawBalance) = _ftToken.staticcall(abi.encodeWithSignature("balanceOf(address)", target));
    //         uint256 balance = abi.decode(rawBalance, (uint256));
    //         uint256 burningAmount = needAccrue > balance ? balance : needAccrue;
    //         token.burn(target, burningAmount);
    //     }
    //     if (bonusPaid > 0) {
    //         token.mint(target, bonusPaid);
    //     }

    //     // emit CancelPurchase(purchaseId, block.timestamp);

    //     return true;
    // }

    function createUser(address userAddress, bytes memory user_abi_in) external returns(bytes memory user_abi_out) {
        string memory foreignCard = abi.decode(user_abi_in, (string));

        require(userAddress != address(0), "BonusSystem: address cannot be null");
        require(_user[userAddress].registered == false, "BonusSystem: user already created");
        require(_fcardToUser[foreignCard] == address(0), "BonusSystem: foreign dublicate");

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
            ERC20Bonuses(_ftToken).balanceOf(userAddress)
        );

        return user_abi_out;
    }

    function isInitialized() external view returns(bool) {
        return _inited;
    }

    function purchase(uint256 purchaseId) external view returns(Purchase memory) {
        return _purchase[purchaseId];
    }

    function settings() external view returns(bytes memory settings_abi) {
        return abi.encode(
            _settings.accrualPercent,
            _settings.minAccrualThreshold,
            _settings.writeoffRate,
            _settings.maxWriteoffPercent,
            _settings.isSimultaneous
        );
    }

    function properties() external view returns(bytes memory properties_abi) { 
        (, bytes memory rawTokenName) = _ftToken.staticcall(abi.encodeWithSignature("name()"));
        (, bytes memory rawTokenSymbol) = _ftToken.staticcall(abi.encodeWithSignature("symbol()"));
        string memory tokenName = abi.decode(rawTokenName, (string));
        string memory tokenSymbol = abi.decode(rawTokenSymbol, (string));
        return abi.encode(
            tokenName,
            tokenSymbol
        );
    }

    function metadataURI() external view returns(string memory) {
        return _metadataURI;
    }

    function erc20tokens() external view returns(address[] memory) {
        address[] memory result = new address[](1);
        result[0] = _ftToken;
        return result;
    }

    function erc721tokens() external view returns(address[] memory) {
        address[] memory result = new address[](0);
        return result;
    }

    function erc1155tokens() external view returns(address[] memory) {
        address[] memory result = new address[](0);
        return result;
    }

    function currencyCode() external view returns(string memory) {
        return "RUB";
    }
    
    function currencyDecimals() external view returns(uint256) {
        return 18;
    }

    function userDetails(address target) external view returns(bytes memory user_abi_out) {
        return abi.encode(
            _user[target].registered,
            _user[target].totalPurchases,
            _user[target].totalSum,
            ERC20Bonuses(_ftToken).balanceOf(target)
        );
    }

    function userByForeignCard(string memory foreignCard) external view returns(address) {
        return _fcardToUser[foreignCard];
    }

    function isUserExist(address userAddress) external view returns(bool) {
        return _user[userAddress].registered;
    }

    function totalUsers() external view returns(uint256) {
        return _totalUsers;
    }

    function name() external view returns(string memory) {
        return "BonusSystem";
    }

    function version() external view returns(string memory) {
        return "0.0.1";
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
        require(accrualPercent <= 100, "BonusSystem: wrong settings");
        require(maxWriteoffPercent <= 100, "BonusSystem: wrong settings");
    }
}

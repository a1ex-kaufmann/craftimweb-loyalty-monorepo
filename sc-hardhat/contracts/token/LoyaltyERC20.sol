// SPDX-License-Identifier: UNLICENSED
// solhint-disable not-rely-on-time, reason-string

pragma solidity 0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "../lib/safe-ownable/LoyaltyOwnable.sol";
import "./ERC20Token.sol";

/**
 * @dev Loyalty erc20 implementation
 */
contract LoyaltyERC20 is ERC20, LoyaltyOwnable, Pausable {
    mapping(address => bool) private _blacklist;

    event BlacklistUpdated(address indexed user, bool value, uint256 timestamp);
 
    constructor(uint256 initialSupply, string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function blacklistUpdate(address user, bool value)
        public
        virtual
        onlyOwner
    {
        _blacklist[user] = value;
        emit BlacklistUpdated(user, value, block.timestamp);
    }

    function isBlackListed(address user) public view returns (bool) {
        return _blacklist[user];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override onlyOwner {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "LoyaltyERC20: token transfer while paused");

        require(
            !isBlackListed(msg.sender),
            "LoyaltyERC20: sender in the blacklist"
        );
    }
}

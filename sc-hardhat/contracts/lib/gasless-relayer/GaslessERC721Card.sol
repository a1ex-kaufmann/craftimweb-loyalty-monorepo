// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC2771ContextFixed.sol";

contract GaslessERC721Card is ERC721, Ownable, ERC2771ContextFixed {
    constructor(string memory name, string memory symbol, address trustedForwarder)
        ERC721(name, symbol)
        Ownable()
    {
        _setTrustedForwarder(trustedForwarder);
    }

    function safeMint(address to, uint256 tokenId) public {
        require(_msgSender() == owner(), "ERC721: caller is not the owner");
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 tokenId_,
        uint256 batchSize
    )
        internal
        virtual
        override(ERC721)
    {
        super._beforeTokenTransfer(from_, to_, tokenId_, batchSize);
    }

    function _msgSender() internal view virtual override(Context, ERC2771ContextFixed) returns (address sender) {
        return(ERC2771ContextFixed._msgSender());
    }

    function _msgData() internal view virtual override(Context, ERC2771ContextFixed) returns (bytes calldata) {
        return(ERC2771ContextFixed._msgData());
    }

    function _contextSuffixLength() internal view virtual override(Context) returns (uint256) {
        // return(ERC2771ContextFixed._contextSuffixLength());
    }

}

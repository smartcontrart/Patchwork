// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./IPatchwork.sol";
import "./IPatchworkMetadata.sol";

contract Patchwork is ERC721, IPatchwork{
    
    uint256 private _royaltyAmount; //in % 
    uint256 public _tokenId;
    uint256 public _patchworkCounter;
    uint8 public _size;


    address payable private _royalties_recipient;
    address public _patchMetadataAddress;
    address public _patchworkMetadataAddress;

    mapping(address => bool) public _isAdmin;
    mapping(uint256 => bool) public _isPatchwork;

    mapping(uint256 => uint256) public _patchworkToTokenIdMapping;

    mapping(uint256 => Patch) public _tokenIdToPatch;
    mapping(uint256 => PWork) public _tokenIdIdToPatchwork; // duplicate with other mapping - can we do better?
    
    constructor () ERC721("Patchwork", "Patchwork") {
        _isAdmin[msg.sender] = true;
        _royalties_recipient = payable(msg.sender);
        _royaltyAmount = 10;
        _patchworkCounter = 0;
        _tokenId = 0;
        _size = 5;
    } 

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        return
        ERC721.supportsInterface(interfaceId) ||
        interfaceId == type(IEIP2981).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    modifier adminOnly{
        require(_isAdmin[msg.sender], "Not an Admin");
        _;
    }

    function adminMintPatch(
        address account,
        string calldata colors,
        string calldata shapes,
        string calldata borders,
        string calldata borderColors
    ) external adminOnly{
        // require(isValid(colors, shapes, borders, borderColors), 'Invalid data');
        require(
            _patchworkCounter != 0 &&
            _tokenId != _patchworkToTokenIdMapping[_patchworkCounter] + (_size * _size + 1),
            'Next token is a Patchwork'
            );
        _mint(account, _tokenId);
        _tokenIdToPatch[_tokenId] = Patch(
            _tokenId,
             _patchworkToTokenIdMapping[_patchworkCounter - 1],
            colors,
            shapes,
            borders,
            borderColors
        );
        _tokenId ++;
    }

    function adminMintPatchwork(
        address account,
        string calldata defaultColors,
        string calldata defaultShapes,
        string calldata defaultBorders,
        string calldata defaultBordersColor
    ) external adminOnly{
        require(
            _patchworkCounter == 0 ||
            _tokenId == _patchworkToTokenIdMapping[_patchworkCounter] + (_size * _size + 1),
            'Next token is a Patch'
         );
        _mint(account, _tokenId);
        _patchworkToTokenIdMapping[_patchworkCounter] = _tokenId;
        _isPatchwork[_tokenId] = true;
        _tokenIdIdToPatchwork[_tokenId] = PWork(
            _patchworkCounter,
            defaultColors,
            defaultShapes,
            defaultBorders,
            defaultBordersColor
        );
        _patchworkCounter ++;
        _tokenId ++;
    }

    function toggleAdmin(address admin) external adminOnly{
        _isAdmin[admin] = !_isAdmin[admin];
    }

    function setPatchworkMetadataAddress(address patchworkMetadataAddress) external adminOnly{
        _patchworkMetadataAddress = patchworkMetadataAddress;
    }

    function updatePatch(
        uint256 tokenId,
        string calldata colors,
        string calldata shapes,
        string calldata borders,
        string calldata borderColors
    )external{
        require(msg.sender == ERC721.ownerOf(tokenId), 'You can only modify your own patch');
        // lock the patchwork?
        // only once per transfer?
        _tokenIdToPatch[tokenId] = Patch(
            _tokenIdToPatch[tokenId].id,
            _tokenIdToPatch[tokenId].associatedPatchwork,
            colors,
            shapes,
            borders,
            borderColors
        );
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token inexistant");
        string memory uri;
        uint8 size = _size;
        Patch memory patchToRender;
        if(_isPatchwork[tokenId]){
            PWork memory patchwork = _tokenIdIdToPatchwork[tokenId];
            bytes memory patches; 
            uint8 xCounter = 0;
            uint8 yCounter = 0;
            for(uint16 i = 0; i < (size * size ); i++){
                uint256 tokenToRender = tokenId + 1 + i;
                if(tokenToRender < _tokenId){
                    // token already exists
                    patchToRender = _tokenIdToPatch[tokenToRender];
                    patches = abi.encodePacked(
                        patches,
                        IPatchworkMetadata(
                            _patchworkMetadataAddress
                        ).generatePatchSVG(size, xCounter, yCounter, patchToRender)
                    );
                }
                else{
                    // token doesn't exist
                    patchToRender = Patch(0, patchwork.id, patchwork.defaultColors, patchwork.shapes, patchwork.borders, patchwork.bordersColor);
                    patches = abi.encodePacked(
                        patches, 
                        IPatchworkMetadata(
                            _patchworkMetadataAddress
                        ).generatePatchSVG(size, xCounter, yCounter, patchToRender));
                }
                if(xCounter == (size * size - size)){
                    yCounter += size;
                    xCounter = 0;
                }else{
                    xCounter += size;
                }
            }
            uri = IPatchworkMetadata(_patchworkMetadataAddress).getPatchwork(patchwork.id, size, string(patches));
        }else{
            patchToRender = _tokenIdToPatch[tokenId];
            uri = IPatchworkMetadata(_patchworkMetadataAddress).getPatch(size, 0, 0, patchToRender);
        }
        return uri;
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId)== msg.sender, "You can only burn your own tokens");
        _burn(tokenId);
    }

    function setRoyalties(address payable _recipient, uint256 _royaltyPerCent) external adminOnly {
        _royalties_recipient = _recipient;
        _royaltyAmount = _royaltyPerCent;
    }

    function royaltyInfo(uint256 salePrice) external view returns (address, uint256) {
        if(_royalties_recipient != address(0)){
            return (_royalties_recipient, (salePrice * _royaltyAmount) / 100 );
        }
        return (address(0), 0);
    }
}   
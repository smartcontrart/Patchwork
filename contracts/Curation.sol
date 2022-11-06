// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@manifoldxyz/royalty-registry-solidity/contracts/specs/IEIP2981.sol";
import "./IPatchwork.sol";
import "./IPatchworkMetadata.sol";

contract Curation is IPatchwork{
    
    uint256 _Id;

    address public _patchMetadataAddress;
    address public _patchworkMetadataAddress;

    uint256 [] public _toBeCurated;
    uint256 [] public _curated;

    mapping(uint256 => string) _shapes;
    mapping(uint256 => string) _colors;
    mapping(uint256 => string) _borders;
    mapping(uint256 => string) _borderColors;
    mapping(uint256 => address) _creator;

    mapping(address => bool) public _isAdmin;
    mapping(bytes32 => bool) public _patchHashExists;
    mapping(bytes32 => bool) public _isCurated;
    mapping(bytes32 => uint256) public _hashToId;


    constructor (){
        _isAdmin[msg.sender] = true;
        _Id = 0;
    } 

    modifier adminOnly{
        require(_isAdmin[msg.sender], "Not an Admin");
        _;
    }

    function toggleAdmin(address admin) external adminOnly{
        _isAdmin[admin] = !_isAdmin[admin];
    }
    // web3: {id:1, associatedPatchwork: 0, colors 'fff' ...}
       
    function addItemForCuration(
        string calldata shapes, 
        string calldata colors,
        string calldata borders,
        string calldata borderColors
    )external{
        bytes32 patchHash = keccak256(abi.encodePacked(
            shapes,
            colors,
            borders,
            borderColors
        ));
        require(!_patchHashExists[patchHash],'Pattern already curated');

        _shapes[_Id] = shapes ;
        _colors[_Id] = colors ;
        _borders[_Id] = borders ;
        _borderColors[_Id] = borderColors ;

        _toBeCurated.push(_Id);
        _creator[_Id] = msg.sender;

        _Id ++;
    }

    function curateItem(uint256 id)external adminOnly{
        for (uint i = 0; i<_toBeCurated.length-1; i++){
            _toBeCurated[i] = _toBeCurated[i+1];
        }
        _toBeCurated.pop();
        _curated.push(id);
    }

    function getPatch(uint256 id) external view returns(Patch memory){
       return(
            Patch(
                id,
                0, // associated patchwork
                _colors[id],
                _shapes[id],
                _borders[id],
                _borderColors[id]
            )
       );
    }

    function isCurated(
        string calldata shapes, 
        string calldata colors,
        string calldata borders,
        string calldata borderColors
    ) external view returns(bool){
        bytes32 patchHash = keccak256(abi.encodePacked(
            shapes,
            colors,
            borders,
            borderColors
        ));
        return _isCurated[patchHash];
    }

    function getCreator(
        string calldata shapes, 
        string calldata colors,
        string calldata borders,
        string calldata borderColors
    ) external view returns(address){
        bytes32 patchHash = keccak256(abi.encodePacked(
            shapes,
            colors,
            borders,
            borderColors
        ));
        return _creator[_hashToId[patchHash]];
    }


}
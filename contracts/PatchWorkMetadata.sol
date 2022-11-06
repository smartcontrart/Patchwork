// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./IPatchwork.sol";
import "./IPatchworkMetadata.sol";
import 'base64-sol/base64.sol';


contract PatchworkMetadata is IPatchworkMetadata{

    string[] private _uriComponents;
    string _svgClosingTag = '</svg>';
    string _defaultColor = 'aaaaaa';

    mapping(address => bool) _isAdmin;

    constructor () {
        _uriComponents = [
            'data:application/json;utf8,{"name":"',
            '", "description":"',
            '", "created_by":"Smartcontrart", "image":"data:image/svg+xml;base64,',
            '", "attributes":[',
            ']}'];
        _isAdmin[msg.sender] = true;
    }

    modifier adminOnly{
        require(_isAdmin[msg.sender],'admin Only');
        _;
    }
    
    function toggleADmin(address admin)external adminOnly{
        _isAdmin[admin] = !_isAdmin[admin];
    }
    
    function generatePatchSVG(
        uint8 size,  
        uint8 xmult, 
        uint8 ymult, 
        Patch memory patch
    ) public pure returns(
        bytes memory
    ){
        bytes memory tokenDrawing = '';
        uint16 colorCounter = 0;
        uint16 counter = 0;
        for(uint8 x = 0; x < size; x++){
            for(uint8 y = 0; y < size; y++){
                string memory color = getInfo(patch.colors, colorCounter, 6);
                string memory borderColor = getInfo(patch.borderColors, colorCounter, 6);
                string memory hasBorder = getInfo(patch.borders, counter, 1);
                string memory shape = getInfo(patch.shapes, counter, 1);
                colorCounter += 6;
                counter ++;
                bytes memory pixel;
                if(keccak256(bytes(shape)) == keccak256("c")){
                    pixel = getCirclePixel(x + xmult, y + ymult, color, hasBorder, borderColor);
                }else{
                    pixel = getSquarePixel(x + xmult, y + ymult, color, hasBorder, borderColor);
                } 
                tokenDrawing = abi.encodePacked(
                    tokenDrawing,
                    pixel
                );
            }
        }
        return tokenDrawing;
    }

    function getInfo(string memory colors, uint index, uint8 length) public pure returns (string memory ) {
        bytes memory colorsBytes = bytes(colors);
        bytes memory color = new bytes((index + length) - index);
        for(uint i = index; i < (index + length); i++) {
            color[i-index] = colorsBytes[i];
        }
        return string(color);
    }

    function getSquarePixel(
        uint8 x, 
        uint8 y,
        string memory color,
        string memory border,
        string memory borderColor
    ) internal pure returns(bytes memory){
        bytes memory closingTag;
        if(keccak256(bytes(border)) == keccak256("y")){
            closingTag = abi.encodePacked(
                "' stroke='#",
                borderColor,
                "' stroke-width='0.02'/>"
            );
        }else{
            closingTag =  "'/>";
        }
        bytes memory pixel = abi.encodePacked(
            "<rect x='",
            Strings.toString(x), ".01",
            "' y='",
            Strings.toString(y), ".01",
            "' width='0.98' height='0.98' fill='#",
            color,
            closingTag
        );
        return pixel;
    }

    function getCirclePixel(
        uint8 x, 
        uint8 y, 
        string memory color,
        string memory border,
        string memory borderColor
    ) internal pure returns(bytes memory){
        bytes memory closingTag;
        if(keccak256(bytes(border)) == keccak256("y") ? true : false){
            closingTag = abi.encodePacked(
                "' stroke='#",
                borderColor,
                "' stroke-width='0.02'/>"
            );
        }else{
            closingTag = "'/>";
        }
        bytes memory pixel = abi.encodePacked(
            "<circle cx='",
            abi.encodePacked(Strings.toString(x),'.5'),
            "' cy='",
            abi.encodePacked(Strings.toString(y),'.5'),
            abi.encodePacked("' r='0.49' fill='#"),
            color,
            closingTag
        );
        return pixel;
    }

    function getPatch(
        uint8 size,
        uint8 xmult,
        uint8 ymult,
        Patch calldata patch
    )external view returns (string memory){
        bytes memory header = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ',
            Strings.toString(size),
            ' ',
            Strings.toString(size),
            '" width="256" height="256">'
        );
        bytes memory byteString = abi.encodePacked(
            abi.encodePacked(_uriComponents[0], "Patch #", Strings.toString(patch.id)),
            abi.encodePacked(_uriComponents[1], "A patch, unique and part of a bigger whole"),
            abi.encodePacked(_uriComponents[2], 
                Base64.encode(
                    bytes(
                    abi.encodePacked(
                        header,
                        generatePatchSVG(size, xmult, ymult, patch),
                        _svgClosingTag
                    )
                    )
                )
            ),
            abi.encodePacked(_uriComponents[3], 
                '{"trait_type": "Patchwork", "value":" ', Strings.toString(patch.associatedPatchwork), '"},',
                '{"trait_type": "Is", "value":"Part"},'
            ),
            abi.encodePacked(_uriComponents[4])
        );

        return string(byteString);
    }

    function getPatchwork(
        uint256 patchwork,
        uint8 size,
        string calldata patches
    )external view returns (string memory){
        bytes memory header = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ',
            Strings.toString(size * size),
            ' ',
            Strings.toString(size * size),
            '" width="512" height="512">'
        );
        bytes memory byteString = abi.encodePacked(
            abi.encodePacked(_uriComponents[0], "Patchwork #", Strings.toString(patchwork)),
            abi.encodePacked(_uriComponents[1], "The whole, is the sum of its parts"),
            abi.encodePacked(_uriComponents[2], 
                Base64.encode(
                    bytes(
                    abi.encodePacked(
                        header,
                        patches,
                        _svgClosingTag
                    )
                    )
                )
            ),
            abi.encodePacked(_uriComponents[3], 
                '{"trait_type": "Patchwork", "value":" ', Strings.toString(patchwork), '"},',
                '{"trait_type": "Is", "value":"Whole"},'
            ),
            abi.encodePacked(_uriComponents[4])
        );
        return string(byteString);
    }

}
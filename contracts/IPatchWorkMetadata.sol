// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.17;

import "./IPatchwork.sol";

interface IPatchworkMetadata is IPatchwork {
   function getPatch(
        uint8,
        uint8,
        uint8,
        Patch calldata
   ) external view returns(string memory);

   function getPatchwork(
      uint256,
      uint8,
      string calldata
   ) external view returns(string memory);

   function generatePatchSVG(
      uint8, uint8, uint8, Patch calldata
   ) external view returns(bytes memory);
}
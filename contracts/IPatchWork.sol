// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.17;

interface IPatchwork {

   struct Patch {
        uint256 id;
        uint256 associatedPatchwork;
        string colors;
        string shapes;
        string borders;
        string borderColors;
    }

    struct PWork {
      uint256 id;
      string defaultColors;
      string shapes;
      string borders;
      string bordersColor;
    }
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract TestContract{

    struct GPS{
        uint latitude;
        uint longitude;
    }

    struct cache{
        string name;
        string description;
        address owner;
        GPS gpsCoord;
    }
}

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract GeoCachingContract{
    mapping(uint=>Cache) caches;
    uint nextIndex;

    struct GPS{
        uint latitude;
        uint longitude;
    }

    struct Problem{
        address reporter;
        string problem;
    }

    struct Cache{
        address owner;
        string name;
        string description;
        GPS gpsCoord;
        uint publicKey;

        address[] finders;
        mapping(uint => Problem) problems;
        uint problemCount;
        bool isDeleted;
    }



    function isDeleted(uint cacheID) internal view returns(bool result){
        return(cacheID < nextIndex && caches[cacheID].isDeleted);
    }

    function isValid(uint cacheID)internal view returns(bool result){
        return(cacheID < nextIndex && !caches[cacheID].isDeleted);
    }

    function isUnCreated(uint cacheID)internal view returns(bool result){
        return(cacheID >= nextIndex);
    }

}

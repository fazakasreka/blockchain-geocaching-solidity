// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract GeoCachingContract{
    mapping(uint=>Cache) caches;
    uint nextIndexCache;
    mapping(uint => Trackable) trackables;
    uint nextIndexTrackable;
    mapping(address => TarackableCollection) ownerToTrackables;


    struct GPS{
        uint latitude;
        uint longitude;
    }

    struct Problem{
        address reporter;
        string problem;
    }

    struct Trackable{
        address creator;
        address owner;
        uint cacheID;
        string name;
        string description;
    }

    function isInCache(uint trackableID) internal view returns(bool result){
       return trackables[trackableID].owner == address(0);
    }

    struct TarackableCollection{
        mapping(uint => bool) collectedTrackables;
    }

    struct Cache{
        address owner;
        string name;
        string description;
        GPS gpsCoord;
        uint publicKey;

        mapping(address => bool) finders;

        mapping(uint => Problem) problems;
        uint problemCount;

        uint[] trackables;
        uint trackableCount;
        
        bool isDeleted;
    }

    function isDeleted(uint cacheID) internal view returns(bool result){
        return(cacheID < nextIndexCache && caches[cacheID].isDeleted);
    }

    function isValid(uint cacheID)internal view returns(bool result){
        return(cacheID < nextIndexCache && !caches[cacheID].isDeleted);
    }

    function isUnCreated(uint cacheID)internal view returns(bool result){
        return(cacheID >= nextIndexCache);
    }

}

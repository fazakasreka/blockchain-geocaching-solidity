// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract TestContract{

    mapping(string=>Cache) caches;
    mapping(address=>GPS) playerLocations;

    struct GPS{
        uint latitude;
        uint longitude;
    }

    struct Cache{
        string name;
        string description;
        address owner;
        GPS gpsCoord;
        address[] finders;
        string[] problems;
        bool isDeleted;
    }
    
    //You must implement some mechanism that ensures only those who actually found the cache can log their success.
    function _logSuccess(string memory cacheID) private{
        if(!caches[cacheID].isDeleted){
            caches[cacheID].finders.push(msg.sender);
        }
    }

    function findCache(string memory cacheID) public{
        if(!caches[cacheID].isDeleted){
            if(playerLocations[msg.sender].latitude == caches[cacheID].gpsCoord.latitude &&
                playerLocations[msg.sender].longitude == caches[cacheID].gpsCoord.longitude){
                _logSuccess(cacheID);
            }
        }
    }

    //You must add support for trackables.


    //Only cache owners/maintainers may remove or modify caches.
    //However, all players have the option to report problems with caches, e.g., if it seems to have gone missing or been damaged.
    function removeCache(string memory cacheID) public{
        if(caches[cacheID].owner == msg.sender){
            caches[cacheID].isDeleted = true;
        }
    }

    function reportProblem(string memory problem, string memory cacheID) public{
        if(!caches[cacheID].isDeleted){
            caches[cacheID].problems.push(problem);
        }
    }

}

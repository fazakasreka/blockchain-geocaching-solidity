// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";

contract CacheContract is GeoCachingContract{
    
    modifier onlyOwnerOfCache(uint cacheID) {
        require(msg.sender == caches[cacheID].owner);
        _;
    }

    modifier onlyValidCache(uint cacheID){
        require(isValid(cacheID));
        _;
    }

    modifier onlyCacheEmpty(uint cacheID) {
        require(caches[cacheID].trackables.length == 0);
        _;
    }

    //BIG TODO
    modifier onlyValidSignature(uint cacheID, uint signedAddress){
       // bytes32 addressHash = getHash("lol");
        caches[cacheID].publicKey;
        signedAddress;
        msg.sender;
        require(true);
        _;
    }

    function makeCache(
        string memory name,
        string memory description,
        GPS memory gpsCoord,
        uint publicKey
    ) public{
        Cache storage newCache = caches[nextIndexCache++];
        newCache.owner = msg.sender;
        newCache.name = name;
        newCache.description = description;
        newCache.gpsCoord = gpsCoord;
        newCache.publicKey = publicKey;
    }

    function modifyCache(
        uint cacheID,
        string memory name,
        string memory description,
        GPS memory gpsCoord,
        uint publicKey
    ) public 
    onlyOwnerOfCache(cacheID)
    onlyValidCache(cacheID){
        Cache storage modifiedCache = caches[cacheID];

        modifiedCache.owner = msg.sender;
        modifiedCache.name = name;
        modifiedCache.description = description;
        modifiedCache.gpsCoord = gpsCoord;
        modifiedCache.publicKey = publicKey;
    }
    
    function removeCache(uint cacheID) public 
    onlyOwnerOfCache(cacheID)
    onlyCacheEmpty(cacheID){
        caches[cacheID].isDeleted = true;
    }

    function reportProblem(string memory problem, uint cacheID) public
    onlyValidCache(cacheID){
        caches[cacheID].problems.push(Problem(msg.sender, problem));
    }
    

    function findCache(uint cacheID, uint signedAddress) public 
    onlyValidSignature(cacheID, signedAddress)
    onlyValidCache(cacheID){
        caches[cacheID].finders[msg.sender] = true;
    }

}
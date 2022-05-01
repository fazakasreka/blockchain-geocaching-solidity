// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";
import "./SignatureVerifyerContract.sol";

contract CacheContract is GeoCachingContract, SignatureVerifyerContract{
    
    modifier onlyOwnerOfCache(uint cacheID) {
        require(msg.sender == caches[cacheID].owner, "onlyOwnerOfCache");
        _;
    }

    modifier onlyCacheEmpty(uint cacheID) {
        require(caches[cacheID].trackables.length == 0, "onlyCacheEmpty");
        _;
    }

    modifier onlyValidSignature(uint cacheID, bytes memory signature){
        require(verifySendersAddressSignedWithCacheAddress({
            signature: signature,
            cachePublicKey: caches[cacheID].publicKey,
            senderAddress: msg.sender
            }), "onlyValidSignature");
        _;
    }

    modifier onlyValidCache(uint cacheID){
        require(isValidCache(cacheID), "onlyValidCache");
        _;
    }

    function makeCache(
        string memory name,
        string memory description,
        string memory gpsCoord,
        address publicKey
    ) public returns(uint cacheID){
        Cache storage newCache = caches[nextIndexCache++];
        newCache.owner = msg.sender;
        newCache.name = name;
        newCache.description = description;
        newCache.gpsCoord = gpsCoord;
        newCache.publicKey = publicKey;

        return nextIndexCache - 1;
    }

    function modifyCache(
        uint cacheID,
        string memory name,
        string memory description,
        string memory gpsCoord,
        address publicKey
    ) public 
    onlyValidCache(cacheID)
    onlyOwnerOfCache(cacheID){
        Cache storage modifiedCache = caches[cacheID];

        modifiedCache.owner = msg.sender;
        modifiedCache.name = name;
        modifiedCache.description = description;
        modifiedCache.gpsCoord = gpsCoord;
        modifiedCache.publicKey = publicKey;
    }
    
    function removeCache(uint cacheID) public 
    onlyCacheEmpty(cacheID)
    onlyOwnerOfCache(cacheID){
        caches[cacheID].isDeleted = true;
    }

    function reportProblem(string memory problem, uint cacheID) public
    onlyValidCache(cacheID){
        caches[cacheID].problems.push(Problem(msg.sender, problem));
    }
    

    function findCache(uint cacheID, bytes memory signature) public 
    onlyValidCache(cacheID)
    onlyValidSignature(cacheID, signature){
        caches[cacheID].finders[msg.sender] = true;
    }

}
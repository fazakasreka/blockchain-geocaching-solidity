// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";
import "./SignatureVerifyerContract.sol";

contract CacheContract is GeoCachingContract, SignatureVerifyerContract{
    
    modifier onlyOwnerOfCache(uint _cacheID)
    {
        require(caches[_cacheID].owner == msg.sender, "onlyOwnerOfCache");
        _;
    }

    modifier onlyValidCache(uint _cacheID)
    {
        require(isValidCache(_cacheID), "onlyValidCache");
        _;
    }

    modifier onlyCacheEmpty(uint _cacheID)
    {
        require(caches[_cacheID].trackables.length == 0, "onlyCacheEmpty");
        _;
    }

    modifier onlyValidSignature(uint _cacheID, bytes memory _signature)
    {
        require(
            verifySendersAddressSignedWithCacheAddress({
                _signature: _signature,
                _publicKey: caches[_cacheID].publicKey,
                _signedAddress: msg.sender
            }), 
            "onlyValidSignature"
        );
        _;
    }

    function makeCache(
        string memory _name,
        string memory _description,
        string memory _gpsCoord,
        address _publicKey
    ) 
        public 
        returns(uint cacheID)
    {
        Cache storage newCache = caches[nextIndexCache++];
        newCache.owner = msg.sender;
        newCache.name = _name;
        newCache.description = _description;
        newCache.gpsCoord = _gpsCoord;
        newCache.publicKey = _publicKey;

        return nextIndexCache - 1;
    }


    function modifyCache(
        uint _cacheID,
        string memory _name,
        string memory _description,
        string memory _gpsCoord,
        address _publicKey
    ) 
        public 
        onlyValidCache(_cacheID)
        onlyOwnerOfCache(_cacheID)
    {
        Cache storage modifiedCache = caches[_cacheID];

        modifiedCache.owner = msg.sender;
        modifiedCache.name = _name;
        modifiedCache.description = _description;
        modifiedCache.gpsCoord = _gpsCoord;
        modifiedCache.publicKey = _publicKey;
    }
    

    function removeCache(uint _cacheID) 
        public 
        onlyValidCache(_cacheID)
        onlyCacheEmpty(_cacheID)
        onlyOwnerOfCache(_cacheID)
    {
        caches[_cacheID].isDeleted = true;
    }


    function reportProblem(string memory _problem, uint _cacheID) 
        public
        onlyValidCache(_cacheID)
    {
        caches[_cacheID].problems.push(Problem(msg.sender, _problem));
    }
    

    function findCache(uint _cacheID, bytes memory _signature)
        public 
        onlyValidCache(_cacheID)
        onlyValidSignature(_cacheID, _signature)
    {
        caches[_cacheID].finders[msg.sender] = true;
    }

}
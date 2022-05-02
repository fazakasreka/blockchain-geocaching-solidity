// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract SignatureVerifyerContract{

     function verifySendersAddressSignedWithCacheAddress(
        bytes memory _signature,
        address _publicKey,
        address _signedAddress
    )
        internal pure 
        returns (bool) 
    {
        bytes32 ethSignedAddressHash = getEthSignedAddressHash(_signedAddress);
        return recoverSigner(ethSignedAddressHash, _signature) == _publicKey;
    }

    function getEthSignedAddressHash(address _signedAddress)
        internal pure 
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    keccak256((abi.encodePacked(_signedAddress)))
                )
            );
    }

    function recoverSigner(
        bytes32 _ethSignedAddressHash, 
        bytes memory _signature
    )
        internal pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedAddressHash, v, r, s);
    }

    function splitSignature(bytes memory _signature)
        internal pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(_signature.length == 65, "invalid signature length");
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
    }

}
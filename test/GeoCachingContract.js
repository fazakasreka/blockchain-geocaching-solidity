var GeoCachingContract = artifacts.require("GeoCachingContract");

contract('GeoCachingContract', function(accounts) {
    var gcc; // To store the instance when running

    // Test case 1
    it("Test owner of initial trackable is noone", function() {
        return GeoCachingContract.deployed().then(function(instance) {
            gcc = instance;
            return gcc.getTrackableOwner(1);
        }).then(function(x) {
            assert.equal(0, x, "Wrong initial trackable owner with ID 1");
        });
    });

    // Test case 2
    /*it("Test balance after deposit", function() {
        return SimpleBank.deployed().then(function(instance) {
            sb = instance;
            return sb.deposit({ from: accounts[0], value: web3.utils.toWei('10', 'ether') });
        }).then(function(tx_receipt) {
            return sb.getBalance({ from: accounts[0] });
        }).then(function(x) {
            assert.equal(web3.utils.toWei('10', 'ether'), x, "Wrong balance");
        }).then(function() {
            return sb.getBalance({ from: accounts[1] });
        }).then(function(x) {
            assert.equal(0, x, "Wrong balance");
        });
    });*/
});
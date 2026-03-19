// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CrowdFundingFactory.sol";

contract DeployFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        CrowdFundingFactory factory = new CrowdFundingFactory();
        
        vm.stopBroadcast();
        
        console.log("CrowdFundingFactory deployed to:", address(factory));
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract WeatherAPI is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    bytes32 private jobId;
    uint256 private fee;
    uint256 public temp;
    event RequestMultipleFulfilled(bytes32 indexed requestId, uint256 temp);

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F);
        setChainlinkOracle(0x2BDf4aB4DBb0d0e557D8E843B087BE227E2C7F5F);
        jobId = "a2b64cc3d87b4c8e8ce0f57d8b1db3f0";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    function requestVolumeData(string memory _city)
        public
        returns (bytes32 requestId)
    {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillMultipleParameters.selector
        );
       
        string memory apiUrl = string(
            abi.encodePacked(
                "http://api.weatherapi.com/v1/current.json?key=d12d3f57b8e740d096f65730232705&q=", _city, "&aqi=no"
            )
        );
        req.add("get", apiUrl);

        req.add("pathTEMP", "current,temp_c");
        return sendChainlinkRequest(req, fee);
    }

    function fulfillMultipleParameters(bytes32 _requestId, uint256 _temp)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit RequestMultipleFulfilled(_requestId, _temp);
        temp = _temp;
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
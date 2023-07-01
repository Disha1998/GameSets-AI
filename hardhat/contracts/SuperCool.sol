// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./WeatherAPI.sol";

contract SUPCool is ERC721URIStorage, VRFConsumerBase {
    using SafeCast for int256;
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private tokenCounter;

    WeatherAPI public weatherAPI;

    AggregatorV3Interface internal ftm_usd_price_feed;


    uint256 maxPrompt = 20;
    uint256 public fee;
    uint256 public ranNum;
    bytes32 public keyHash;

    mapping(uint256 => uint256) private tokenPrices;
    mapping(address => uint256[]) private userNFTs;
    mapping(address => string) private Profile;
    mapping(uint256 => string[]) private weatherIpfsurls; 
    mapping(uint256 => string) private cities;


    uint256[] public dynamicTokenIds;


    uint256 lastTimeStamp;
    uint256 interval;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _interval,
        address _weatherAPI
    ) ERC721(name, symbol) VRFConsumerBase(0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F) {
        ftm_usd_price_feed = AggregatorV3Interface(
            0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D
        );

        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 1000000000000000;
        interval = _interval;
        lastTimeStamp = block.timestamp;
        weatherAPI = WeatherAPI(_weatherAPI);
    }

    function mintNFT(
        uint256 price,
        string memory tokenUri
    ) public returns (uint256) {
        tokenCounter.increment();

        uint256 newItemId = tokenCounter.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenUri);
        tokenPrices[newItemId] = price;
        userNFTs[msg.sender].push(newItemId);

        return newItemId;
    }

    function getWeatherIpfsUri(uint256 temperature, uint256 tokenId) public view returns (string memory) {
       
        if (temperature >= 30) {
            return weatherIpfsurls[tokenId][0]; // Summer image
        } else if (temperature <= 10) {
            return weatherIpfsurls[tokenId][1]; // Winter image
        } else {
            return weatherIpfsurls[tokenId][2]; // Rainy image
        }

    }

    function mintDynamicNFT(string calldata city, string[] calldata tokenURIs, uint256 price) public returns (uint256) {
       
        weatherAPI.requestVolumeData(city);
        tokenCounter.increment();
        uint256 tokenId = tokenCounter.current();

         for(uint256 i = 0; i < tokenURIs.length; i++){
            weatherIpfsurls[tokenId].push(tokenURIs[i]);
        }
        tokenCounter.increment();
        _safeMint(msg.sender, tokenId);
        uint256 temprature = weatherAPI.temp();
        string memory ipfsuri = getWeatherIpfsUri(temprature, tokenId);
        _setTokenURI(tokenId, ipfsuri);
        dynamicTokenIds.push(tokenId);
        cities[tokenId] = city;
        tokenPrices[tokenId] = price;
        userNFTs[msg.sender].push(tokenId);

        return tokenId;
    }

      function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }


    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            for(uint256 i = 0; i < dynamicTokenIds.length; i++){
                uint256 tokenId = dynamicTokenIds[i];
                 changeWeather(tokenId, cities[tokenId]);
            }
            
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    

    function changeWeather(uint256 _tokenId, string memory city) public {
        weatherAPI.requestVolumeData(city);
        uint256 temprature = weatherAPI.temp();
        string memory newUri = getWeatherIpfsUri(temprature, _tokenId);
        // Update the URI
        _setTokenURI(_tokenId, newUri);
    }

    // determine the stage of the flower growth
    function weatherStage(uint256 _tokenId) public view returns (uint256) {
        string memory _uri = tokenURI(_tokenId);
        // Seed
        if (compareStrings(_uri, weatherIpfsurls[_tokenId][0])) {
            return 0;
        }
        // Sprout
        if (compareStrings(_uri, weatherIpfsurls[_tokenId][1])) {
            return 1;
        }
        // Must be a Bloom
        return 2;
    }

 


    function buyToken(uint256 tokenId) public payable {
        require(_exists(tokenId), "NFTMarketplace: token does not exist");
        require(
            msg.value == tokenPrices[tokenId],
            "NFTMarketplace: incorrect value"
        );

        address payable seller = payable(ownerOf(tokenId));
        _transfer(seller, msg.sender, tokenId);
        seller.transfer(msg.value);
    }

    function getAllTokens() public view returns (uint256[] memory) {
        uint256[] memory allTokens = new uint256[](tokenCounter.current());
        for (uint256 i = 1; i <= tokenCounter.current(); i++) {
            if (_exists(i)) {
                allTokens[i - 1] = i;
            }
        }
        return allTokens;
    }

    function getFTMUsd() public view returns (uint) {
        (, int price, , , ) = ftm_usd_price_feed.latestRoundData();

        return price.toUint256();
    }

    function convertFTMUsd(uint _amountInUsd) public view returns (uint) {
        uint maticUsd = getMaticUsd();

        uint256 amountInUsd = _amountInUsd.mul(maticUsd).div(10 ** 18);

        return amountInUsd;
    }

    function getUserTokens(
        address user
    ) public view returns (uint256[] memory) {
        return userNFTs[user];
    }

    function getTotalSupply() public view returns (uint256) {
        return tokenCounter.current();
    }

    function fulfillRandomness(
        bytes32 requestId,
        uint256 randomness
    ) internal virtual override {
        uint256 winnerIndex = randomness % maxPrompt;
        ranNum = winnerIndex;
    }

    function generateRandomNum() private returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    function getRandomNumber() public returns (uint256) {
        generateRandomNum();
    }

    function storeProfileData(string memory metadata) public {
        Profile[msg.sender] = metadata;
    }

    function getUserProfile(address user) public view returns (string memory) {
        return Profile[user];
    }




    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
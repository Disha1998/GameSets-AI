// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "./WeatherAPI.sol";

contract SUPCool is ERC721URIStorage {
    using SafeCast for int256;
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private tokenCounter;

    WeatherAPI public weatherAPI;

    AggregatorV3Interface internal ftm_usd_price_feed;

    mapping(uint256 => uint256) private tokenPrices;
    mapping(address => uint256[]) private userNFTs;
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
    ) ERC721(name, symbol) {
        ftm_usd_price_feed = AggregatorV3Interface(
            0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D
        );

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
        uint maticUsd = getFTMUsd();

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


    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
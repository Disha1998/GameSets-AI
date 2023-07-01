 https://github.com/DhruvSathavara/SuperCool/blob/master/hardhat/contracts/SuperCool.sol


```

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

```

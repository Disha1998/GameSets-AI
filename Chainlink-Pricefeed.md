https://github.com/DhruvSathavara/SuperCool/blob/master/hardhat/contracts/SuperCool.sol



```
 function getMaticUsd() public view returns (uint) {
        (, int price, , , ) = matic_usd_price_feed.latestRoundData();

        return price.toUint256();
    }

    function convertMaticUsd(uint _amountInUsd) public view returns (uint) {
        uint maticUsd = getMaticUsd();

        uint256 amountInUsd = _amountInUsd.mul(maticUsd).div(10 ** 18);

        return amountInUsd;
    }


```

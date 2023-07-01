require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });


module.exports = {
  solidity: "0.8.1",
  defaultNetwork: 'hardhat',
  networks: {
    mumbai: {
      url: "https://neat-newest-putty.matic-testnet.discover.quiknode.pro/c25c07f578926c8303dce090ce12850ab5debcf4/",
      accounts: ["022cee959834961a1d85fe253789846d986ed1e375ea7f5cf5d2d170e1b31e7c"]
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "6MK7IU8PX7BN5NII42EEVYCHT3MMHZJWTN",
    },
  },
};


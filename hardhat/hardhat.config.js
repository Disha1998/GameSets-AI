require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config({ path: ".env" });


// module.exports = {
//   solidity: "0.8.1",
//   defaultNetwork: 'hardhat',
//   networks: {
//     mumbai: {
//       url: "https://neat-newest-putty.matic-testnet.discover.quiknode.pro/c25c07f578926c8303dce090ce12850ab5debcf4/",
//       accounts: ["022cee959834961a1d85fe253789846d986ed1e375ea7f5cf5d2d170e1b31e7c"]
//     }
//   },
//   etherscan: {
//     apiKey: {
//       polygonMumbai: "6MK7IU8PX7BN5NII42EEVYCHT3MMHZJWTN",
//     },
//   },
// };












require("dotenv").config({ path: "./.env" });
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");

// const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
const PRIVATE_KEY = "966c795f897d55458df19abdb9d18f064071e8a30e82406af959943ffcd062ce";

module.exports = {
  solidity: '0.8.17',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    mainnet: {
      url: `https://rpcapi.fantom.network`,
      chainId: 250,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    testnet: {
      url: `https://rpc.testnet.fantom.network`,
      chainId: 4002,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    coverage: {
      url: 'http://localhost:8555'
    },
    localhost: {
      url: `http://127.0.0.1:8545`
    }
  },
};

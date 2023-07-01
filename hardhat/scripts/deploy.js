const hre = require("hardhat");
const { FEE, VRF_COORDINATOR, KEY_HASH, LINK_TOKEN } = require('../constant')

async function main() {

  const WeatherAPI = await hre.ethers.getContractFactory("WeatherAPI");
  const weatherApi = await WeatherAPI.deploy();
  // ("supercool", "SC", VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE);

  await weatherApi.deployed();
  console.log('deploy weatherAPI contract to', weatherApi.address);

  const SuperCool = await hre.ethers.getContractFactory("SUPCool");
  const superCool = await SuperCool.deploy("supercool", "SC",600,weatherApi.address);

  await superCool.deployed();


  console.log('deploy SuperCool contract to', superCool.address);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

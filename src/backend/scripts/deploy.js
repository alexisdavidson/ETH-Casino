async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy contracts
  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  const CoinFlip = await ethers.getContractFactory("CoinFlip");
  const coinflip = await CoinFlip.deploy(bank.address, 765);
  await bank.setGameContracts([coinflip.address]);
  
  console.log("Bank contract address", bank.address)
  console.log("CoinFlip contract address", coinflip.address)
  
  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(bank, "Bank");
  saveFrontendFiles(coinflip, "CoinFlip");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

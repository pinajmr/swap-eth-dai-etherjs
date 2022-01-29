const { legos } = require("@studydefi/money-legos");

//Set Provider
const network = 'ropsten' // use ropsten testnet
const provider = ethers.getDefaultProvider(network)

//Ropsten DAI Token
const DAI_ABI = legos.erc20.dai.abi;
const DAI_ADDRESS = '0xad6d458402f60fd3bd25163575031acdce07538d';
const daiContract = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider)

//Ropsten Uniswap DAI Exchange
const EXCHANGE_ABI = legos.uniswap.exchange.abi;
const EXCHANGE_ADDRESS = '0xc0fc958f7108be4060F33a699a92d3ea49b0B5f0';
const exchangeContract = new ethers.Contract(EXCHANGE_ADDRESS, EXCHANGE_ABI, provider);

//Minimum tokens to swap 
const MIN_TOKEN = 1;
console.log(`Minimum tokens ${MIN_TOKEN}`);

//Set Deadline 1 minute from now 
const moment = require('moment'); // Import moment.js library
const now = moment().unix() // Fetch current unix timestamp
const DEADLINE = now + 60; //add 60 seconds

//Transaction Setting
const SETTING = {
  gasLimit: 6000000,
  gasPrice: 50000000000,
  from: '0x4317c44fD3143D8AC5723865CF046238A2cd8FD3',
  value: ethers.utils.parseUnits("0.01", 18)
}


console.log("Setting", SETTING);

async function main() {

  let balance;

  //Check Ether Balance BEFORE swap
  balance = await ethers.provider.getBalance(SETTING.from);
  balance = ethers.utils.formatEther(balance);
  console.log(`Ether balance is: ${balance} ETH`);

  //Check DAI balance BEFORE swap
  balance = await daiContract.balanceOf(SETTING.from);
  balance = ethers.utils.formatEther(balance);
  console.log(`Dai balance is: ${balance} DAI`);

  //Perform Sap 
  const [signer] = await ethers.getSigners();
  console.log('Performing swap .....');
  const exchangeWithSigner = exchangeContract.connect(signer);

  const tx = await exchangeWithSigner.ethToTokenSwapInput(
    MIN_TOKEN,
    DEADLINE,
    SETTING
  )

  receipt = await tx.wait();
  console.log(`Succesful swap: https://ropsten.etherscan.io/tx/${receipt.transactionHash}`)


  //Check Ether Balance AFTER swap
  balance = await ethers.provider.getBalance(SETTING.from);
  balance = ethers.utils.formatEther(balance);
  console.log(`Ether balance is: ${balance} ETH`);

  //Check DAI balance AFTER swap
  balance = await daiContract.balanceOf(SETTING.from);
  balance = ethers.utils.formatEther(balance);
  console.log(`Dai balance is: ${balance} DAI`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




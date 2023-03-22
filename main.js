const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const fundProjectABI = [
  {
    "inputs": [],
    "name": "addressToAmountFunded",
    "outputs": [
      {
        "internalType": "mapping(address => uint256)",
        "name": "",
        "type": "map"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "funders",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fund",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const fundProjectAddress = '0x1234567890123456789012345678901234567890';
const fundProjectContract = new web3.eth.Contract(fundProjectABI, fundProjectAddress);

const fundProject = async () => {
  const accounts = await web3.eth.getAccounts();
  await fundProjectContract.methods.fund().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });
  console.log('Funds added successfully');
};

const withdrawFunds = async () => {
  const accounts = await web3.eth.getAccounts();

  // Resets map
  const funderCount = await fundProjectContract.methods.funders().call();
  for (let i = 0; i < funderCount; i++) {
    const funder = await fundProjectContract.methods.funders(i).call();
    await fundProjectContract.methods.addressToAmountFunded(funder).send({ from: accounts[0] });
  }

  // Resets funders array
  await fundProjectContract.methods.funders().send({ from: accounts[0] });

  const contractBalance = await web3.eth.getBalance(fundProjectAddress);
  await web3.eth.sendTransaction({ from: fundProjectAddress, to: accounts[0], value: contractBalance });

  console.log('Funds withdrawn successfully');
};

fundProject();
withdrawFunds();

const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');


// Initialize Web3 instance with Binance Smart Chain Mainnet endpoint
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// Set your BSCScan API key
const API_KEY = '8KRK7GQEFXZN7DD74TQ69QSJMPWTJSK2RQ';

// Define minimum balance in BNB tokens
const minimumBalance = web3.utils.toWei('2', 'ether');

// Define start and end block numbers to limit transaction history search
const ONE_MONTH_BLOCKS = 6500; // Assuming ~4 sec block time
let endBlock;

web3.eth.getBlockNumber()
  .then((blockNumber) => {
    endBlock = blockNumber;
    console.log(`Current block number is ${endBlock}`);
  })
  .catch((error) => {
    console.error(`Error getting block number: ${error}`);
  });
const startBlock = endBlock - ONE_MONTH_BLOCKS;



// Define function to fetch transaction list for an address
const fetchTransactions = async (address) => {
  //console.log("31 : "+endBlock);
  
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${API_KEY}`;
  const response = await axios.get(url);
  // console.log(response.data.result)
  return response.data.result;
  
};

// Define function to check if an address meets the conditions
const checkAddress = async (address) => {
  // Check if the address has a balance of at least 2 BNB tokens
  const balanceUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;
      const balanceResponse = await axios.get(balanceUrl);
      const balance = balanceResponse.data.result;
  if (balance < minimumBalance) {
    return false;
  }
  
   

  // Check if the address has conducted at least one transaction in the last month
  const transactions = await fetchTransactions(address);
  //console.log("54 :"+transactions)
  if(transactions!==null)
  return transactions.length > 0;
  else
  return 0;
};

// Define function to fetch list of all addresses on Binance Smart Chain
const fetchAddresses = async () => {
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=0x0000000000000000000000000000000000001004&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const transactions = response.data.result;

  // Next, extract all unique wallet addresses from the transactions list
  const addresses = new Set();

  const txList = Object.values(transactions);

  for (let i = 0; i < txList.length; i++) {
    const tx = txList[i];
      const from = tx.from.toLowerCase();
      
      if (!addresses.has(from) && web3.utils.isAddress(from)) {
        addresses.add(from);
      }
    }

  
  //console.log(addresses);
  //console.log(addresses);
  return Array.from(addresses);
};

// Define main function to filter addresses by conditions and download the list
const downloadAddresses = async () => {
  const allAddresses = await fetchAddresses();
  
  const filteredAddresses = await Promise.all(
    allAddresses.map(async (address) => {
      const meetsConditions = await checkAddress(address);
      return meetsConditions ? address : null;
    })
  );
  const validAddresses = filteredAddresses.filter((address) => address !== null);
  //downloadList(validAddresses);
  //console.log("all addresses : "+ allAddresses );
 // console.log("valid addresses : "+validAddresses);
  download(validAddresses);
 
};

// Call main function
downloadAddresses();

async function download(addresses) {
  const csvContent = addresses.join('\n');
  fs.writeFileSync('addresses.csv', csvContent);
  console.log('File downloaded successfully');
}

function downloadList(addressList) {
  const csvContent = "data:text/csv;charset=utf-8," + addressList.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "address_list.csv");
  document.body.appendChild(link);
  link.click();
}

function downloadList1(list, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list.join('\n')));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// if(validAddresses.length > 0){
//   //downloadList(validAddresses)
// }else{
//   console.log('Addresses are not loading.. Maybe thete is an error please check')
// }

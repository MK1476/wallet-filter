

  const Web3 = require('web3');
// const { toUnixTimestamp } = require('ethjs-unit');
const QueryString = require('qs');

const contractABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}];
const contractAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'; // Binance Coin contract address
const web3 = new Web3('https://rpc.ankr.com/bsc/0a6a9c3b24410745a21e0f3cdae8cf0badfed459feacab015de0f55df7b9410c');//https://rpc.ankr.com/bsc/0a6a9c3b24410745a21e0f3cdae8cf0badfed459feacab015de0f55df7b9410c
const minimumBalance = web3.utils.toWei('2', 'ether'); // 2 BNB in wei

qualifiedAdd = []

const currentTime = new Date().getTime();
const currentTimestamp = Math.floor(currentTime / 1000);
const minTimestamp = currentTimestamp - (30 * 24 * 60 * 60);

// const minTimestamp = toUnixTimestamp(new Date() - 30 * 24 * 60 * 60 * 1000);


web3.eth.getBlockNumber((error, blockNumber) => {
    if(!error) {
        console.log("Block number : " + blockNumber);
    } else {
        console.log(error);
    }
});

// get a list of accounts and check if they are unlocked
web3.eth.requestAccounts()
  .then(accounts => {
    console.log(`Found ${accounts.length} accounts on the Binance Smart Chain:`);
    console.log(accounts);
    accounts.forEach(account => {
      web3.eth.personal.unlockAccount(account)
        .then(result => {
          console.log(`${account} is unlocked`);
        })
        .catch(error => {
          console.error(`${account} is locked: ${error}`);
        });
    });
    
  })
  .catch(error => {
    console.error(`Failed to get accounts: ${error}`);
  });

  async function checkAddresses() {
    const addresses = await web3.eth.requestAccounts();
    
    for (const address of addresses) {
      const balance = await web3.eth.call({
        to: contractAddress,
        data: web3.eth.abi.encodeFunctionCall(contractABI[1], [address])
      });

      if (web3.utils.toBN(balance).gte(web3.utils.toBN(minimumBalance))) {
        const transactions = await web3.eth.getTransactions({
          fromBlock: '0x1',
          toBlock: 'latest',
          address: address
        });
  
        const recentTransaction = transactions.find(tx => tx.timestamp >= minTimestamp);
  
        if (recentTransaction) {

          qualifiedAdd.append(address)  

          console.log(`${address} has conducted at least one transaction in the last month and  has a balance of at least 2 BNB tokens.`);
        }
      }

    }


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
  

  
  checkAddresses();
  if(qualifiedAdd.length > 0){
    downloadList(qualifiedAdd)
  }else{
    console.log('Addresses are not loading.. Maybe thete is an error please check')
  }



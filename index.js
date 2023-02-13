const Web3 = require('web3');

// create a new web3 instance
const web3 = new Web3('https://rpc.ankr.com/bsc/0a6a9c3b24410745a21e0f3cdae8cf0badfed459feacab015de0f55df7b9410c');



web3.eth.getBlockNumber((error, blockNumber) => {
    if(!error) {
        console.log("Block number : " + blockNumber);
    } else {
        console.log(error);
    }
});

// get a list of accounts and check if they are unlocked
web3.eth.getAccounts()
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


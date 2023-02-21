const axios = require('axios');
const API_KEY = '8KRK7GQEFXZN7DD74TQ69QSJMPWTJSK2RQ'; // Replace with your BscScan API key

const getAddressList = async () => {
  // First, get a list of all transactions on the Binance Smart Chain
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=0x0000000000000000000000000000000000001004&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${API_KEY}`;
  const response = await axios.get(url);
  const transactions = response.data.result;

  // Next, extract all unique wallet addresses from the transactions list
  const addresses = transactions
    .map((tx) => tx.to.toLowerCase())
    .filter((addr, index, array) => array.indexOf(addr) === index);

  // Finally, filter the addresses list by balance and recent activity
  const filteredAddresses = await Promise.all(
    addresses.map(async (addr) => {
      // Check the balance of the address
      const balanceUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${addr}&tag=latest&apikey=${API_KEY}`;
      const balanceResponse = await axios.get(balanceUrl);
      const balance = balanceResponse.data.result;

      if (balance < 2 * 10 ** 18) { // Minimum balance of 2 BNB
        return null;
      }

      // Check the activity of the address
      const activityUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${API_KEY}`;
      const activityResponse = await axios.get(activityUrl);
      const activity = await activityResponse.data.result;

      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      //console.log(activity);

      const recentActivity = activity.some((tx) => new Date(tx.timeStamp * 1000) > oneMonthAgo);

      if (!recentActivity) {
        return null;
      }

      return addr;
    })
  );

  return filteredAddresses.filter((addr) => addr !== null);
};

// Call the getAddressList function and log the results
getAddressList()
  .then((addresses) => console.log("address : "+ addresses))
  .catch((error) => console.error(error));

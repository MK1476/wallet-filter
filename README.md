# Wallet-filter
Scopex Intern Assignment - to Filter the Wallet addresses

This project is a JavaScript program that downloads a list of Binance Smart Chain wallet addresses that meet certain criteria. Specifically, the program queries the Binance Smart Chain blockchain to find all addresses with a balance of at least 2 BNB tokens and at least one transaction in the last month, and then downloads a CSV file containing those addresses.

## Requirements
> To run this program, you will need:

- **Node.js (at least version 10.0.0)**
- **A web3 provider for the Binance Smart Chain (such as Alchemy)**

## Installation
Clone this repository to your local machine:
```
git clone https://github.com/MK1476/wallet-filter.git
```

> Navigate to the project directory:
```
cd wallet-filter
```

> Install the dependencies:
```
npm install
```

### Usage
Edit the index.js file to set your web3 provider URL and API key, as well as the date range for transactions to consider.
> Run the program:
```
npm run start
```
If the program successfully finds addresses that meet the criteria, a CSV file named address_list.csv will be downloaded to your current directory.
### Contributing
If you have ideas for how to improve this program, feel free to fork the repository and submit a pull request. You can also open an issue to report bugs or suggest new features.

## License
This project is licensed under the [GNU General Public License v3.0](/LICENSE).
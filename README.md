# Defi SDK Polywrapper
A simple Defi SDK which can be used to fetch rate of the underlying token components for a derivative token.

## Supported Protocols
- Uniswap-V2
- Sushiswap
- Yearn
- Curve
- Compound
- Aave
- LinkSwap

Checkout [examples](example.md) here.

## How To Run

### Install Dependencies
`nvm install && nvm use`  
`yarn`  

### Start Test Environment
`yarn test:env:up`  

### Build Web3API
`yarn build:web3`

### Deploy Web3API
`yarn deploy:web3`

### Run Test Query Recipe
`yarn test`  

## Next steps
- Integration with Covalent and Coingecko API
- Portfolio tracker dapp as proof of concept

export const PROTOCOL_ID_1 = "foo_v1";
export const PROTOCOL_ID_2 = "foo_v2";

export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  XDAI = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 42161,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
}

export function getContractRegistry(chainId: u32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x00";
    case ChainId.ROPSTEN:
      return "0x00";
    default:
      return "0x00";
  }
}

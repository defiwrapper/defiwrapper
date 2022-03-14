export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  ARBITRUM = 42161,
}

export function getVaultAddressV2(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    case ChainId.RINKEBY:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    case ChainId.GOERLI:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    case ChainId.KOVAN:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    case ChainId.MATIC:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    case ChainId.ARBITRUM:
      return "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
    default:
      return "0x00";
  }
}

export function getCoreFactoryV1(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd";
    case ChainId.RINKEBY:
      return "0x9C84391B443ea3a48788079a5f98e2EaD55c9309";
    case ChainId.KOVAN:
      return "0x8f7F78080219d4066A8036ccD30D588B416a40DB";
    case ChainId.MATIC_TESTNET:
      return "0x39D7de7Cf0ad8fAAc56bbb7363f49695808efAf5";
    default:
      return "0x00";
  }
}

export function getSmartFactoryV1(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0xed52D8E202401645eDAD1c0AA21e872498ce47D0";
    case ChainId.RINKEBY:
      return "0xA3F9145CB0B50D907930840BB2dcfF4146df8Ab4";
    case ChainId.KOVAN:
      return "0x53265f0e014995363AE54DAd7059c018BaDbcD74";
    case ChainId.MATIC_TESTNET:
      return "0xA3F9145CB0B50D907930840BB2dcfF4146df8Ab4";
    default:
      return "0x00";
  }
}

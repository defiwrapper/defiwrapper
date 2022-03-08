export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const IRON_BANK_COMPTROLLER_ADDRESS = "0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB";

export enum ChainId {
  MAINNET = 1,
  MATIC = 137,
  FANTOM = 250,
  BSC = 56,
  ARBITRUM = 42161,
  AVALANCHE = 43114,
}

export function getCreamComptrollerAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258";
    case ChainId.FANTOM:
      return "0x4250A6D3BD57455d7C6821eECb6206F507576cD2";
    case ChainId.MATIC:
      return "0x20CA53E2395FA571798623F1cFBD11Fe2C114c24";
    case ChainId.BSC:
    case ChainId.ARBITRUM:
      return "0xbadaC56c9aca307079e8B8FC699987AAc89813ee";
    case ChainId.AVALANCHE:
      return "0x2eE80614Ccbc5e28654324a66A396458Fa5cD7Cc";
    default:
      return "0x00";
  }
}

export function getNativeTokenAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0xD06527D5e56A3495252A528C4987003b712860eE";
    case ChainId.FANTOM:
      return "0xcc3E89fBc10e155F1164f8c9Cf0703aCDe53f6Fd";
    case ChainId.MATIC:
      return "0x3FaE5e5722C51cdb5B0afD8c7082e8a6AF336Ee8";
    case ChainId.BSC:
      return "0xb31f5d117541825D6692c10e4357008EDF3E2BCD";
    case ChainId.ARBITRUM:
      return "0x5441090C0401EE256b09DEb35679Ad175d1a0c97";
    // case ChainId.AVALANCHE:
    //   return "";
    default:
      return "0x00";
  }
}

export const YEARN_REGISTRY_V1 = "0x3eE41C098f9666ed2eA246f4D2558010e59d63A0";

export enum ChainId {
  MAINNET = 1,
  FANTOM = 250,
  ARBITRUM = 42161,
}

export function getRegistryAdapterV2(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x240315db938d44bb124ae619f5Fd0269A02d1271";
    case ChainId.FANTOM:
      return "0xF628Fb7436fFC382e2af8E63DD7ccbaa142E3cd1";
    case ChainId.ARBITRUM:
      return "0x57AA88A0810dfe3f9b71a9b179Dd8bF5F956C46A";
    default:
      return "0x00";
  }
}

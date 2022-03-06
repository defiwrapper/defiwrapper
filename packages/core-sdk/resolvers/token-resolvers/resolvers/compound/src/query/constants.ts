export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
}

export function getComptrollerAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
    case ChainId.ROPSTEN:
      return "0xcfa7b0e37f5ac60f3ae25226f5e39ec59ad26152";
    case ChainId.RINKEBY:
      return "0x2eaa9d77ae4d8f9cdd9faacd44016e746485bddb";
    case ChainId.GOERLI:
      return "0x627ea49279fd0de89186a58b8758ad02b6be2867";
    case ChainId.KOVAN:
      return "0x5eae89dc1c671724a672ff0630122ee834098657";
    default:
      return "0x00";
  }
}

export function getCEthAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
    case ChainId.ROPSTEN:
      return "0x859e9d8a4edadfedb5a2ff311243af80f85a91b8";
    case ChainId.RINKEBY:
      return "0xd6801a1dffcd0a410336ef88def4320d6df1883e";
    case ChainId.GOERLI:
      return "0x20572e4c090f15667cf7378e16fad2ea0e2f3eff";
    case ChainId.KOVAN:
      return "0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72";
    default:
      return "0x00";
  }
}

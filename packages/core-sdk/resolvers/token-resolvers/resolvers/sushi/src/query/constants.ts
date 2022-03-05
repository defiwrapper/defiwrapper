export const XSUSHI_ADDRESS = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272";

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
  // PALM = 11297108109, // throws because it doesn't fit in i32
  // PALM_TESTNET = 11297108099, // throws because it doesn't fit in i32
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
}

export function getFactoryAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac";
    case ChainId.ROPSTEN:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.RINKEBY:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.GOERLI:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.KOVAN:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.FANTOM:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.FANTOM_TESTNET:
      return "";
    case ChainId.MATIC:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.MATIC_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.XDAI:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.BSC:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.BSC_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.ARBITRUM:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.ARBITRUM_TESTNET:
      return "";
    case ChainId.MOONBEAM_TESTNET:
      return "0x2Ce3F07dD4c62b56a502E223A7cBE38b1d77A1b5";
    case ChainId.AVALANCHE:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.AVALANCHE_TESTNET:
      return "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
    case ChainId.HECO:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.HECO_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.HARMONY:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.HARMONY_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.OKEX:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.OKEX_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.CELO:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    // case ChainId.PALM:
    //   return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    // case ChainId.PALM_TESTNET:
    //   return "";
    case ChainId.MOONRIVER:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    case ChainId.FUSE:
      return "0x43eA90e2b786728520e4f930d2A71a477BF2737C";
    case ChainId.TELOS:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
    default:
      return "0x00";
  }
}

export function getInitCodeHash(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.ROPSTEN:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.RINKEBY:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.GOERLI:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.KOVAN:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.FANTOM:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.MATIC:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.MATIC_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.XDAI:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.BSC:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.BSC_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.ARBITRUM:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.MOONBEAM_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.AVALANCHE:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.AVALANCHE_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.HECO:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.HECO_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.HARMONY:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.HARMONY_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.OKEX:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.OKEX_TESTNET:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.CELO:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    // case ChainId.PALM:
    //   return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.MOONRIVER:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    case ChainId.FUSE:
      return "0x1901958ef8b470f2c0a3875a79ee0bd303866d85102c0f1ea820d317024d50b5";
    case ChainId.TELOS:
      return "0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303";
    default:
      return "0x00";
  }
}

export function getSushiAddress(chainId: i32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2";
    case ChainId.ROPSTEN:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";
    case ChainId.RINKEBY:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";
    case ChainId.GOERLI:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";
    case ChainId.KOVAN:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F";
    case ChainId.FANTOM:
      return "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC";
    case ChainId.MATIC:
      return "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a";
    case ChainId.XDAI:
      return "0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE";
    case ChainId.BSC:
      return "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4";
    case ChainId.ARBITRUM:
      return "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A";
    case ChainId.AVALANCHE:
      return "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76";
    case ChainId.HECO:
      return "0x52E00B2dA5Bd7940fFe26B609A42F957f31118D5";
    case ChainId.HARMONY:
      return "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A";
    case ChainId.OKEX:
      return "0x2218E0D5E0173769F5b4939a3aE423f7e5E4EAB7";
    case ChainId.OKEX_TESTNET:
      return "";
    case ChainId.CELO:
      return "0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1";
    // case ChainId.PALM:
    //   return "";
    // case ChainId.PALM_TESTNET:
    //   return "";
    case ChainId.MOONRIVER:
      return "0xf390830DF829cf22c53c8840554B98eafC5dCBc2";
    case ChainId.TELOS:
      return "0x922D641a426DcFFaeF11680e5358F34d97d112E1";
    case ChainId.FUSE:
      return "0x90708b20ccC1eb95a4FA7C8b18Fd2C22a0Ff9E78";
    default:
      return "0x00";
  }
}

export const XSUSHI_ADDRESS = "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272".toLowerCase();

const ChainId_PALM: u64 = 11297108109;

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

export function getFactoryAddress(chainId: u64): string {
  if (chainId == ChainId_PALM) {
    return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
  }
  switch (<u32>chainId) {
    case ChainId.MAINNET:
      return "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac".toLowerCase();
    case ChainId.ROPSTEN:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.RINKEBY:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.GOERLI:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.KOVAN:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.FANTOM:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.MATIC:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.MATIC_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.XDAI:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.BSC:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.BSC_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.ARBITRUM:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.MOONBEAM_TESTNET:
      return "0x2Ce3F07dD4c62b56a502E223A7cBE38b1d77A1b5".toLowerCase();
    case ChainId.AVALANCHE:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.AVALANCHE_TESTNET:
      return "0xd00ae08403B9bbb9124bB305C09058E32C39A48c".toLowerCase();
    case ChainId.HECO:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.HECO_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.HARMONY:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.HARMONY_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.OKEX:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.OKEX_TESTNET:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.CELO:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.MOONRIVER:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    case ChainId.FUSE:
      return "0x43eA90e2b786728520e4f930d2A71a477BF2737C".toLowerCase();
    case ChainId.TELOS:
      return "0xc35DADB65012eC5796536bD9864eD8773aBc74C4".toLowerCase();
    default:
      return "0x00";
  }
}

export function getSushiAddress(chainId: u32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2".toLowerCase();
    case ChainId.ROPSTEN:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F".toLowerCase();
    case ChainId.RINKEBY:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F".toLowerCase();
    case ChainId.GOERLI:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F".toLowerCase();
    case ChainId.KOVAN:
      return "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F".toLowerCase();
    case ChainId.FANTOM:
      return "0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC".toLowerCase();
    case ChainId.MATIC:
      return "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a".toLowerCase();
    case ChainId.XDAI:
      return "0x2995D1317DcD4f0aB89f4AE60F3f020A4F17C7CE".toLowerCase();
    case ChainId.BSC:
      return "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4".toLowerCase();
    case ChainId.ARBITRUM:
      return "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A".toLowerCase();
    case ChainId.AVALANCHE:
      return "0x37B608519F91f70F2EeB0e5Ed9AF4061722e4F76".toLowerCase();
    case ChainId.HECO:
      return "0x52E00B2dA5Bd7940fFe26B609A42F957f31118D5".toLowerCase();
    case ChainId.HARMONY:
      return "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A".toLowerCase();
    case ChainId.OKEX:
      return "0x2218E0D5E0173769F5b4939a3aE423f7e5E4EAB7".toLowerCase();
    case ChainId.CELO:
      return "0x29dFce9c22003A4999930382Fd00f9Fd6133Acd1".toLowerCase();
    case ChainId.MOONRIVER:
      return "0xf390830DF829cf22c53c8840554B98eafC5dCBc2".toLowerCase();
    case ChainId.TELOS:
      return "0x922D641a426DcFFaeF11680e5358F34d97d112E1".toLowerCase();
    case ChainId.FUSE:
      return "0x90708b20ccC1eb95a4FA7C8b18Fd2C22a0Ff9E78".toLowerCase();
    default:
      return "0x00";
  }
}

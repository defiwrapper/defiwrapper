import { CONTRACT_REGISTRY_ADDRESS_MAINNET, CONTRACT_REGISTRY_ADDRESS_ROPSTEN } from "../constants";
import { Ethereum_Connection, Ethereum_Network, Ethereum_Query } from "../w3";

export function getChainId(connection: Ethereum_Connection): i32 {
  const networkRes = Ethereum_Query.getNetwork({ connection });
  if (networkRes.isErr) {
    return 0;
  }
  const network: Ethereum_Network = networkRes.unwrap();
  return network.chainId;
}

export function getContractRegistry(connection: Ethereum_Connection): string {
  const chainId: i32 = getChainId(connection);
  switch (chainId) {
    case 1:
      return CONTRACT_REGISTRY_ADDRESS_MAINNET;
    case 3:
      return CONTRACT_REGISTRY_ADDRESS_ROPSTEN;
    default:
      return "0x00";
  }
}

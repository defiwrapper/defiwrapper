import { CONVERTER_REGISTRY_ID, getContractRegistry } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidBancorPool(anchorTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: i32 = getChainId(connection);
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId),
    method: "function addressOf(bytes32 contractName) public view returns (address)",
    args: [CONVERTER_REGISTRY_ID],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    return false;
  }
  const converterRegisteryAddress: string = converterRegistryAddressRes.unwrap();
  const isAnchorToken = Ethereum_Query.callContractView({
    address: converterRegisteryAddress,
    method: "function isAnchor(address value) public view returns (bool)",
    args: [anchorTokenAddress],
    connection: connection,
  });
  if (isAnchorToken.isErr) {
    return false;
  }
  return isAnchorToken.unwrap() == "true";
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "bancor_v2") {
    return isValidBancorPool(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}

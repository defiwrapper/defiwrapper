import { BigInt } from "@web3api/wasm-as";

import {
  CONVERTER_REGISTRY_ID,
  getContractRegistry,
  PROTOCOL_ID_1,
  PROTOCOL_ID_2_1,
} from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidBancorPoolV2_1(anchorTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId.toUInt32()),
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

// TODO: How do I validate a v1 token?
function isValidBancorPoolV1(anchorTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId.toUInt32()),
    method: "function addressOf(bytes32 contractName) public view returns (address)",
    args: [CONVERTER_REGISTRY_ID],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    return false;
  }
  throw new Error("NOT IMPLEMENTED");
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == PROTOCOL_ID_2_1) {
    return isValidBancorPoolV2_1(input.tokenAddress, connection);
  } else if (input.protocolId == PROTOCOL_ID_1) {
    return isValidBancorPoolV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}

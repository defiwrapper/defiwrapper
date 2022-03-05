import { BANCOR_CONTRACT_REGISTRY, BANCOR_CONVERTER_REGISTRY_ID } from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidBancorPool(anchorTokenAddress: string, connection: Ethereum_Connection): boolean {
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: BANCOR_CONTRACT_REGISTRY,
    method: "function addressOf(bytes32 contractName) public view returns (address)",
    args: [BANCOR_CONVERTER_REGISTRY_ID],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    throw new Error(converterRegistryAddressRes.unwrapErr());
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
    throw new Error(isAnchorToken.unwrapErr());
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

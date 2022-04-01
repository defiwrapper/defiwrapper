import { BigInt } from "@web3api/wasm-as";

import { CONVERTER_REGISTRY_ID, getContractRegistry } from "../constants";
import { Ethereum_Connection, Ethereum_Query } from "../w3";
import { getChainId } from "./network";

export function getConverterAddress(
  anchorTokenAddress: string,
  connection: Ethereum_Connection,
): string {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    throw new Error("Network error: could not retrieve chain id");
  }
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId.toUInt32()),
    method: "function addressOf(bytes32 contractName) public view returns (address)",
    args: [CONVERTER_REGISTRY_ID],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    throw new Error(converterRegistryAddressRes.unwrapErr());
  }
  const converterAddressRes = Ethereum_Query.callContractView({
    address: converterRegistryAddressRes.unwrap(),
    method: "function getConvertersByAnchors(address[] anchors) public view returns (address[])",
    args: [`["${anchorTokenAddress}"]`],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return converterAddressRes.unwrap().split(",")[0];
}

export function getPoolTokenAddresses(
  converterAddress: string,
  connection: Ethereum_Connection,
): string[] {
  const tokenAddressesRes = Ethereum_Query.callContractView({
    address: converterAddress,
    method: "function reserveTokens() external view returns (address[])",
    args: null,
    connection: connection,
  });
  if (tokenAddressesRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return tokenAddressesRes.unwrap().split(",");
}

import { BigInt } from "@polywrap/wasm-as";

import { getComptrollerAddress } from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Ethereum_Module } from "../wrap";

function isValidCompoundPool(cTokenAddress: string): boolean {
  const chainId: BigInt | null = getChainId();
  if (!chainId) {
    return false;
  }
  const isListed = Ethereum_Module.callContractView({
    address: getComptrollerAddress(chainId.toUInt32()),
    method: "function markets(address) view returns (bool)",
    args: [cTokenAddress],
    connection: null,
  });
  if (isListed.isErr) {
    return false;
  }
  return isListed.unwrap() == "true";
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (args.protocolId == "compound_v1") {
    return isValidCompoundPool(args.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

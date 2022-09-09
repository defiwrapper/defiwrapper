import { BigInt } from "@polywrap/wasm-as";

import { getCreamComptrollerAddress, IRON_BANK_COMPTROLLER_ADDRESS } from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Ethereum_Module } from "../wrap";

function isValidCreamPool(
  token: string,
  comptroller: string,
): boolean {
  const isListed = Ethereum_Module.callContractView({
    address: comptroller,
    method: "function markets(address) view returns (bool)",
    args: [token],
    connection: null,
  });
  if (isListed.isErr) return false;
  return isListed.unwrap() == "true";
}

function isValidCreamPoolV1(token: string): boolean {
  const chainId: BigInt | null = getChainId();
  if (!chainId) {
    return false;
  }
  const comptroller: string = getCreamComptrollerAddress(chainId.toUInt32());
  return isValidCreamPool(token, comptroller);
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (args.protocolId == "cream_v1") {
    return isValidCreamPoolV1(args.tokenAddress);
  } else if (args.protocolId == "cream_v2") {
    return isValidCreamPool(args.tokenAddress, IRON_BANK_COMPTROLLER_ADDRESS);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

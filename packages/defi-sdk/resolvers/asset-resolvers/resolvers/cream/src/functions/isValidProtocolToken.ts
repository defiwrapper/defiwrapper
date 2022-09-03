import { BigInt } from "@polywrap/wasm-as";

import { getCreamComptrollerAddress, IRON_BANK_COMPTROLLER_ADDRESS } from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function isValidCreamPool(
  token: string,
  comptroller: string,
  connection: Ethereum_Connection,
): boolean {
  const isListed = Ethereum_Module.callContractView({
    address: comptroller,
    method: "function markets(address) view returns (bool)",
    args: [token],
    connection: connection,
  });
  if (isListed.isErr) return false;
  return isListed.unwrap() == "true";
}

function isValidCreamPoolV1(token: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const comptroller: string = getCreamComptrollerAddress(chainId.toUInt32());
  return isValidCreamPool(token, comptroller, connection);
}

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == "cream_v1") {
    return isValidCreamPoolV1(args.tokenAddress, env.connection);
  } else if (args.protocolId == "cream_v2") {
    return isValidCreamPool(args.tokenAddress, IRON_BANK_COMPTROLLER_ADDRESS, env.connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

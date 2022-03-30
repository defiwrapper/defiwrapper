import { BigInt } from "@web3api/wasm-as";

import {
  CHI_GAS_TOKEN_ADDRESS,
  getFactoryAddress_v2,
  MOONISWAP_FACTORY_ADDRESS_MAINNET_V1,
  PROTOCOL_ID_CHI_GAS_TOKEN,
  PROTOCOL_ID_V1,
  PROTOCOL_ID_V2,
} from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidPool(token: string, factory: string, connection: Ethereum_Connection): boolean {
  const isPoolRes = Ethereum_Query.callContractView({
    address: factory,
    method: "function isPool(address) view returns (bool)",
    args: [token],
    connection: connection,
  });
  if (isPoolRes.isErr) {
    return false;
  }
  return isPoolRes.unwrap() == "true";
}

function isValid1InchPool(tokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (chainId === null) {
    return false;
  }
  const factoryAddress: string = getFactoryAddress_v2(chainId.toUInt32());
  return isValidPool(tokenAddress, factoryAddress, connection);
}

function isValidMooniswapPool(tokenAddress: string, connection: Ethereum_Connection): boolean {
  return isValidPool(tokenAddress, MOONISWAP_FACTORY_ADDRESS_MAINNET_V1, connection);
}

function isChiGasToken(tokenAddress: string): boolean {
  return tokenAddress.toLowerCase() == CHI_GAS_TOKEN_ADDRESS.toLowerCase();
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == PROTOCOL_ID_V2) {
    return isValid1InchPool(input.tokenAddress, connection);
  } else if (input.protocolId == PROTOCOL_ID_V1) {
    return isValidMooniswapPool(input.tokenAddress, connection);
  } else if (input.protocolId == PROTOCOL_ID_CHI_GAS_TOKEN) {
    return isChiGasToken(input.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}

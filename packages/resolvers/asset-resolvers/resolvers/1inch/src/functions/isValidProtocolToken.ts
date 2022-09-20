import { BigInt } from "@polywrap/wasm-as";

import {
  CHI_GAS_TOKEN_ADDRESS,
  getFactoryAddress_v2,
  MOONISWAP_FACTORY_ADDRESS_MAINNET_V1,
  PROTOCOL_ID_CHI_GAS_TOKEN,
  PROTOCOL_ID_V1,
  PROTOCOL_ID_V2,
} from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Ethereum_Module } from "../wrap";

function isValidPool(token: string, factory: string): boolean {
  const isPoolRes = Ethereum_Module.callContractView({
    address: factory,
    method: "function isPool(address) view returns (bool)",
    args: [token],
    connection: null,
  });
  if (isPoolRes.isErr) {
    return false;
  }
  return isPoolRes.unwrap() == "true";
}

function isValid1InchPool(tokenAddress: string): boolean {
  const chainId: BigInt | null = getChainId();
  if (chainId === null) {
    return false;
  }
  const factoryAddress: string = getFactoryAddress_v2(chainId.toUInt32());
  return isValidPool(tokenAddress, factoryAddress);
}

function isValidMooniswapPool(tokenAddress: string): boolean {
  return isValidPool(tokenAddress, MOONISWAP_FACTORY_ADDRESS_MAINNET_V1);
}

function isChiGasToken(tokenAddress: string): boolean {
  return tokenAddress.toLowerCase() == CHI_GAS_TOKEN_ADDRESS.toLowerCase();
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (args.protocolId == PROTOCOL_ID_V2) {
    return isValid1InchPool(args.tokenAddress);
  } else if (args.protocolId == PROTOCOL_ID_V1) {
    return isValidMooniswapPool(args.tokenAddress);
  } else if (args.protocolId == PROTOCOL_ID_CHI_GAS_TOKEN) {
    return isChiGasToken(args.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}

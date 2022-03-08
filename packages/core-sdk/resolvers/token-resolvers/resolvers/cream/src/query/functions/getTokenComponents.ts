import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { ETH_ADDRESS, getNativeTokenAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrap();

  if (!token) {
    throw new Error(`Token ${input.tokenAddress} is not a valid ERC20 token`);
  }

  const chainId: i32 = getChainId(connection);
  const nativeToken: string = getNativeTokenAddress(chainId);

  let underlyingTokenAddress: string;
  let underlyingDecimals: i32;
  if (token.address == nativeToken) {
    underlyingTokenAddress = ETH_ADDRESS;
    underlyingDecimals = 18;
  } else {
    const underlyingTokenAddressRes = Ethereum_Query.callContractView({
      address: token.address,
      method: "function underlying() view returns (address)",
      args: null,
      connection: connection,
    });
    if (underlyingTokenAddressRes.isErr) {
      return {
        tokenAddress: token.address,
        unresolvedComponents: 1,
        components: [],
        rate: "1",
      };
    }
    underlyingTokenAddress = underlyingTokenAddressRes.unwrap();
    const underlyingDecimalsRes = Ethereum_Query.callContractView({
      address: underlyingTokenAddress,
      method: "function decimals() public view returns (uint8)",
      args: null,
      connection: connection,
    });
    if (underlyingDecimalsRes.isErr) {
      return {
        tokenAddress: token.address,
        unresolvedComponents: 1,
        components: [],
        rate: "1",
      };
    }
    underlyingDecimals = I32.parseInt(underlyingDecimalsRes.unwrap());
  }

  const exchangeRateRes = Ethereum_Query.callContractView({
    address: token.address,
    method: "function exchangeRateStored() public view returns (uint)",
    args: null,
    connection: connection,
  });
  if (exchangeRateRes.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }
  const adjDecimals: string = BigInt.fromUInt16(10)
    .pow(18 - 8 + underlyingDecimals)
    .toString();
  const rate: string = Big.of(exchangeRateRes.unwrap()).div(Big.of(adjDecimals)).toString();

  const components: Interface_TokenComponent[] = [
    {
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    },
  ];
  return {
    tokenAddress: token.address,
    unresolvedComponents: 0,
    components: components,
    rate: "1",
  };
}

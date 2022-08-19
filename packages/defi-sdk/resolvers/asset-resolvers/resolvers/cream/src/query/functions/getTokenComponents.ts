import { BigInt } from "@polywrap/wasm-as";
import { Big } from "as-big";

import { ETH_ADDRESS, getNativeTokenAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Module,
  ETR_Module,
  Args_getTokenComponents,
  Interface_TokenComponent,
  Env,
} from "../wrap";

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as Env).connection;

  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    m_type: "ERC20",
  }).unwrapOrElse((e: string) => {
    throw new Error(e);
  });

  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }
  const nativeToken: string = getNativeTokenAddress(chainId.toUInt32());

  // get underlying decimals
  let underlyingTokenAddress: string;
  let underlyingDecimals: i32;
  if (token.address == nativeToken) {
    underlyingTokenAddress = ETH_ADDRESS;
    underlyingDecimals = 18;
  } else {
    const underlyingTokenAddressRes = Ethereum_Module.callContractView({
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
    const underlyingTokenRes = ETR_Module.getToken({
      address: underlyingTokenAddress,
      m_type: "ERC20",
    });
    if (underlyingTokenRes.isErr) {
      return {
        tokenAddress: token.address,
        unresolvedComponents: 1,
        components: [],
        rate: "1",
      };
    }
    underlyingDecimals = underlyingTokenRes.unwrap().decimals;
  }

  // get rate
  const exchangeRateRes = Ethereum_Module.callContractView({
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

  const component: Interface_TokenComponent = {
    tokenAddress: underlyingTokenAddress,
    unresolvedComponents: 0,
    components: [],
    rate: rate,
  };
  return {
    tokenAddress: token.address,
    unresolvedComponents: 0,
    components: [component],
    rate: "1",
  };
}

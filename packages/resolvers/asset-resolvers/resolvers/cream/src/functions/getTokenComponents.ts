import { BigInt, BigNumber } from "@polywrap/wasm-as";

import { ETH_ADDRESS, getNativeTokenAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  Args_getTokenComponents,
  Ethereum_Module,
  ETR_Module,
  Interface_TokenComponent,
} from "../wrap";

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrapOrElse((e: string) => {
    throw new Error(e);
  });

  const chainId: BigInt | null = getChainId();
  if (!chainId) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
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
      connection: null,
    });
    if (underlyingTokenAddressRes.isErr) {
      return {
        tokenAddress: token.address,
        unresolvedComponents: 1,
        components: [],
        rate: BigNumber.ONE,
      };
    }
    underlyingTokenAddress = underlyingTokenAddressRes.unwrap();
    const underlyingTokenRes = ETR_Module.getToken({
      address: underlyingTokenAddress,
      _type: "ERC20",
    });
    if (underlyingTokenRes.isErr) {
      return {
        tokenAddress: token.address,
        unresolvedComponents: 1,
        components: [],
        rate: BigNumber.ONE,
      };
    }
    underlyingDecimals = underlyingTokenRes.unwrap().decimals;
  }

  // get rate
  const exchangeRateRes = Ethereum_Module.callContractView({
    address: token.address,
    method: "function exchangeRateStored() public view returns (uint)",
    args: null,
    connection: null,
  });
  if (exchangeRateRes.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
    };
  }
  const adjDecimals: BigInt = BigInt.fromUInt16(10).pow(18 - 8 + underlyingDecimals);
  const rate: BigNumber = BigNumber.from(exchangeRateRes.unwrap()).div(adjDecimals);

  const component: Interface_TokenComponent = {
    tokenAddress: underlyingTokenAddress,
    unresolvedComponents: 0,
    components: [],
    rate,
  };
  return {
    tokenAddress: token.address,
    unresolvedComponents: 0,
    components: [component],
    rate: BigNumber.ONE,
  };
}

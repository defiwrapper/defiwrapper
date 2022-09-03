import { BigInt, BigNumber } from "@polywrap/wasm-as";

import { ETH_ADDRESS, getCEthAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  Args_getTokenComponents,
  Env,
  Ethereum_Module,
  ETR_Module,
  Interface_TokenComponent,
} from "../wrap";

export function getTokenComponents(
  args: Args_getTokenComponents,
  env: Env,
): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrap();

  const chainId: BigInt | null = getChainId(env.connection);
  if (!chainId) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
    };
  }

  let underlyingTokenAddress: string;
  let underlyingDecimals: i32;
  if (token.address == getCEthAddress(chainId.toUInt32())) {
    underlyingTokenAddress = ETH_ADDRESS;
    underlyingDecimals = 18;
  } else {
    const underlyingTokenAddressRes = Ethereum_Module.callContractView({
      address: token.address,
      method: "function underlying() view returns (address)",
      args: null,
      connection: env.connection,
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

  const exchangeRateRes = Ethereum_Module.callContractView({
    address: token.address,
    method: "function exchangeRateStored() public view returns (uint)",
    args: null,
    connection: env.connection,
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

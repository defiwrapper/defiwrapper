import { BigInt, BigNumber } from "@polywrap/wasm-as";

import { getSushiAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  Args_getTokenComponents,
  Ethereum_Module,
  ETR_Module,
  ETR_TokenResolver_Token,
  Interface_TokenComponent,
} from "../wrap";

function getPairTokenAddresses(pairAddress: string): string[] {
  // get token addresses
  const token0AddressResult = Ethereum_Module.callContractView({
    address: pairAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: null,
  });
  // if exception encountered, pair contract presumed not to exist
  if (token0AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  const token1AddressResult = Ethereum_Module.callContractView({
    address: pairAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: null,
  });
  if (token1AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  return [token0AddressResult.unwrap(), token1AddressResult.unwrap()];
}

function getSushiSwapComponents(token: ETR_TokenResolver_Token): Interface_TokenComponent {
  const pairTokenAddresses: string[] = getPairTokenAddresses(token.address);

  const tokenDecimals: BigInt = BigInt.fromUInt16(10).pow(token.decimals);
  const totalSupply: BigNumber = BigNumber.from(token.totalSupply).div(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < pairTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = pairTokenAddresses[j];
    const underlyingToken = ETR_Module.getToken({
      address: underlyingTokenAddress,
      _type: "ERC20",
    }).unwrap();
    if (!underlyingToken) {
      unresolvedComponents++;
      continue;
    }

    // get underlying token balance
    const balanceRes = Ethereum_Module.callContractView({
      connection: null,
      address: underlyingToken.address,
      method: "function balanceOf(address account) public view returns (uint256)",
      args: [token.address],
    });
    if (balanceRes.isErr) {
      unresolvedComponents++;
      continue;
    }
    const balance: string = balanceRes.unwrap();
    const underlyIngDecimals = BigInt.fromUInt16(10).pow(underlyingToken.decimals);
    const adjBalance: BigNumber = BigNumber.from(balance).div(underlyIngDecimals);

    // calculate and push rate
    const rate: BigNumber = adjBalance.div(totalSupply);
    components.push({
      tokenAddress: underlyingTokenAddress.toLowerCase(),
      unresolvedComponents: 0,
      components: [],
      rate,
    });
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: BigNumber.ONE,
  };
}

function getSushiBarComponents(token: ETR_TokenResolver_Token): Interface_TokenComponent {
  const chainId: BigInt | null = getChainId();
  if (!chainId) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
    };
  }
  const sushiAddress: string = getSushiAddress(chainId.toUInt32());

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  // get underlying token balance
  const balanceRes = Ethereum_Module.callContractView({
    connection: null,
    address: sushiAddress,
    method: "function balanceOf(address account) public view returns (uint256)",
    args: [token.address],
  });
  if (balanceRes.isOk) {
    const balance: string = balanceRes.unwrap();
    const rate: BigNumber = BigNumber.from(balance).div(token.totalSupply);
    components.push({
      tokenAddress: sushiAddress.toLowerCase(),
      unresolvedComponents: 0,
      components: [],
      rate,
    });
  } else {
    unresolvedComponents++;
  }
  return {
    tokenAddress: token.address,
    unresolvedComponents,
    components,
    rate: BigNumber.ONE,
  };
}

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrap();

  if (args.protocolId == "sushibar_v1") {
    return getSushiBarComponents(token);
  }
  return getSushiSwapComponents(token);
}

import { BigInt } from "@polywrap/wasm-as";
import { Big } from "as-big";

import { getSushiAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Module,
  ETR_Module,
  ETR_TokenResolver_Token,
  Args_getTokenComponents,
  Interface_TokenComponent,
  Env,
} from "../wrap";

function getPairTokenAddresses(pairAddress: string, connection: Ethereum_Connection): string[] {
  // get token addresses
  const token0AddressResult = Ethereum_Module.callContractView({
    address: pairAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
  });
  // if exception encountered, pair contract presumed not to exist
  if (token0AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  const token1AddressResult = Ethereum_Module.callContractView({
    address: pairAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: connection,
  });
  if (token1AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  return [token0AddressResult.unwrap(), token1AddressResult.unwrap()];
}

function getSushiSwapComponents(
  token: ETR_TokenResolver_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  const pairTokenAddresses: string[] = getPairTokenAddresses(token.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()) / Big.of(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < pairTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = pairTokenAddresses[j];
    const underlyingToken = ETR_Module.getToken({
      address: underlyingTokenAddress,
      m_type: "ERC20",
    }).unwrap();
    if (!underlyingToken) {
      unresolvedComponents++;
      continue;
    }

    // get underlying token balance
    const balanceRes = Ethereum_Module.callContractView({
      connection: connection,
      address: underlyingToken.address,
      method: "function balanceOf(address account) public view returns (uint256)",
      args: [token.address],
    });
    if (balanceRes.isErr) {
      unresolvedComponents++;
      continue;
    }
    const balance: string = balanceRes.unwrap();
    const underlyIngDecimals = BigInt.fromUInt16(10).pow(underlyingToken.decimals).toString();
    const adjBalance: Big = Big.of(balance) / Big.of(underlyIngDecimals.toString());

    // calculate and push rate
    const rate = (adjBalance / totalSupply).toString();
    components.push({
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    });
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: "1",
  };
}

function getSushiBarComponents(
  token: ETR_TokenResolver_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }
  const sushiAddress: string = getSushiAddress(chainId.toUInt32());

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  // get underlying token balance
  const balanceRes = Ethereum_Module.callContractView({
    connection: connection,
    address: sushiAddress,
    method: "function balanceOf(address account) public view returns (uint256)",
    args: [token.address],
  });
  if (balanceRes.isOk) {
    const balance: string = balanceRes.unwrap();
    const totalSupply = Big.of(token.totalSupply.toString());
    const rate = Big.of(balance).div(totalSupply).toString();
    components.push({
      tokenAddress: sushiAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    });
  } else {
    unresolvedComponents++;
  }
  return {
    tokenAddress: token.address,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as Env).connection;

  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    m_type: "ERC20",
  }).unwrap();

  if (args.protocolId == "sushibar_v1") {
    return getSushiBarComponents(token, connection);
  }
  return getSushiSwapComponents(token, connection);
}

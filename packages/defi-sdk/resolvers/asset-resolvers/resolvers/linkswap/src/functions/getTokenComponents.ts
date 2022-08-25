import { BigInt, BigNumber } from "@polywrap/wasm-as";

import {
  Args_getTokenComponents,
  Env,
  Ethereum_Connection,
  Ethereum_Module,
  ETR_Module,
  Interface_TokenComponent,
} from "../wrap";

function getPairTokenAddresses(pairAddress: string, connection: Ethereum_Connection): string[] {
  // get token addresses
  const token0AddressResult = Ethereum_Module.callContractView({
    address: pairAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
  });
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

export function getTokenComponents(
  args: Args_getTokenComponents,
  env: Env,
): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrap();

  const pairTokenAddresses: string[] = getPairTokenAddresses(token.address, env.connection);

  const tokenDecimals: BigInt = BigInt.fromUInt16(10).pow(token.decimals);
  const totalSupply: BigNumber = BigNumber.from(token.totalSupply).div(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < pairTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = pairTokenAddresses[j];
    const underlyingTokenResult = ETR_Module.getToken({
      address: underlyingTokenAddress,
      _type: "ERC20",
    });
    if (underlyingTokenResult.isErr) {
      unresolvedComponents++;
      continue;
    }
    const underlyingToken = underlyingTokenResult.unwrap();

    // get underlying token balance
    const balanceRes = Ethereum_Module.callContractView({
      connection: env.connection,
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
      tokenAddress: underlyingTokenAddress,
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

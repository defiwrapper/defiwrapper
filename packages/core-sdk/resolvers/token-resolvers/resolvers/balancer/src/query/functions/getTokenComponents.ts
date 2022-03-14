import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { getVaultAddressV2 } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_Token,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

function getPoolTokenAddresses(poolAddress: string, connection: Ethereum_Connection): string[] {
  // get pool id
  const poolIdRes = Ethereum_Query.callContractView({
    address: poolAddress,
    method: "function getPoolId() public view returns (bytes32)",
    args: [],
    connection: connection,
  });
  if (poolIdRes.isErr) {
    throw new Error("Invalid protocol token: " + poolAddress);
  }
  const poolId: string = poolIdRes.unwrap();
  // get vault address
  const chainId: i32 = getChainId(connection);
  const vaultAddress: string = getVaultAddressV2(chainId);
  // get token addresses
  const tokensRes = Ethereum_Query.callContractView({
    address: vaultAddress,
    method:
      // TODO: need to know the number of tokens in a pool to correctly specify the return type ABI
      "function getPoolTokens(bytes32 poolId) external view returns (tuple(tuple(uint256, uint256, uint256) balances, tuple(address, address, address) tokens, uint256 lastChangeBlock))",
    args: [poolId],
    connection: connection,
  });
  if (tokensRes.isErr) {
    throw new Error("can't get pool tokens: " + tokensRes.unwrapErr());
    // throw new Error("Invalid protocl token " + poolAddress);
  } else {
    throw new Error("Format: " + tokensRes.unwrap());
  }
  const tokens = tokensRes.unwrap().split(",");
  return tokens;
}

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrap();

  const poolTokenAddresses: string[] = getPoolTokenAddresses(token.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()) / Big.of(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    // get underlying token
    const underlyingTokenAddress: string = poolTokenAddresses[j];
    const underlyingTokenRes = Token_Query.getToken({
      address: underlyingTokenAddress,
      m_type: Token_TokenType.ERC20,
    });
    if (underlyingTokenRes.isErr) {
      unresolvedComponents++;
      continue;
    }
    const underlyingToken: Interface_Token = changetype<Interface_Token>(
      underlyingTokenRes.unwrap(),
    );

    // get underlying token balance
    const balanceRes = Ethereum_Query.callContractView({
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

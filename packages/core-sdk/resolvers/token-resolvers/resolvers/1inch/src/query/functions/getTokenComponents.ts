import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import {
  CHI_GAS_TOKEN_ADDRESS,
  ETH_ADDRESS,
  ONESPLIT_CONTRACT_ADDRESS,
  PROTOCOL_ID_CHI_GAS_TOKEN,
  ZERO_ADDRESS,
} from "../constants";
import { getUnderlyingTokenData, TokenData } from "../utils/TokenData";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_Token,
  Token_TokenType,
} from "../w3";

function getPoolTokenAddresses(poolAddress: string, connection: Ethereum_Connection): string[] {
  const tokenAddressRes = Ethereum_Query.callContractView({
    address: poolAddress,
    method: "function getTokens() external view returns(address[] tokens)",
    args: [],
    connection: connection,
  });
  if (tokenAddressRes.isErr) {
    throw new Error("Invalid 1Inch protocol token");
  }
  return tokenAddressRes.unwrap().split(",");
}

function get1InchProtocolComponents(
  protocolToken: Token_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  const poolTokenAddresses: string[] = getPoolTokenAddresses(protocolToken.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(protocolToken.decimals).toString();
  const totalSupply: Big = Big.of(protocolToken.totalSupply.toString()).div(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingTokenAddress: string = poolTokenAddresses[j];
    // get underlying token decimals and balance
    const tokenData: TokenData | null = getUnderlyingTokenData(
      protocolToken,
      underlyingTokenAddress,
      connection,
    );
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const decimals: i32 = tokenData.decimals;
    const balance: string = tokenData.balance;

    // calculate decimal-adjusted balance
    const underlyingDecimals: string = BigInt.fromUInt16(10).pow(decimals).toString();
    const adjBalance: Big = Big.of(balance).div(underlyingDecimals);

    // calculate and push rate
    const rate = adjBalance.div(totalSupply).toString();
    components.push({
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: rate,
    });
  }

  const tokenAddress: string =
    protocolToken.address == ZERO_ADDRESS ? ETH_ADDRESS : protocolToken.address;

  return {
    tokenAddress,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

function getChiGasTokenComponents(
  chi: Token_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  if (chi.address.toLowerCase() != CHI_GAS_TOKEN_ADDRESS.toLowerCase()) {
    throw new Error("Invalid Chi Gas Token: " + chi.address);
  }

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  const rateRes = Ethereum_Query.callContractView({
    address: ONESPLIT_CONTRACT_ADDRESS,
    method:
      "function getExpectedReturn(address fromToken, address destToken, uint256 amount, uint256 parts, uint256 flags) public view returns(uint256 returnAmount)",
    args: [CHI_GAS_TOKEN_ADDRESS, ETH_ADDRESS, "1", "1", "0"],
    connection: connection,
  });
  if (rateRes.isOk) {
    components.push({
      tokenAddress: ETH_ADDRESS,
      unresolvedComponents: 0,
      components: [],
      rate: rateRes.unwrap(),
    });
  } else {
    unresolvedComponents++;
  }

  return {
    tokenAddress: CHI_GAS_TOKEN_ADDRESS,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = Token_Query.getToken({
    address: input.tokenAddress,
    m_type: Token_TokenType.ERC20,
  }).unwrapOrElse((err: string) => {
    throw new Error(err);
  });

  if (input.protocolId == PROTOCOL_ID_CHI_GAS_TOKEN) {
    return getChiGasTokenComponents(token, connection);
  }
  return get1InchProtocolComponents(token, connection);
}

import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { PROTOCOL_ID_2, PROTOCOL_ID_2_1 } from "../constants";
import { getConverterAddress, getPoolTokenAddresses } from "../utils/address";
import { getRateV1, getRateV2, getRateV2_1 } from "../utils/getRate";
import { getUnderlyingTokenData, TokenData } from "../utils/TokenData";
import {
  env,
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

  const converterAddress: string = getConverterAddress(token.address, connection);
  const poolTokenAddresses: string[] = getPoolTokenAddresses(converterAddress, connection);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingTokenAddress: string = poolTokenAddresses[j];

    // get underlying token decimals and balance
    const tokenData: TokenData | null = getUnderlyingTokenData(
      underlyingTokenAddress,
      converterAddress,
      connection,
    );
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const decimals: i32 = tokenData.decimals;
    const balance: string = tokenData.balance;

    // calculate rate
    let unadjRate: string | null;
    const oneToken: string = BigInt.fromUInt16(10).pow(decimals).toString();
    if (input.protocolId == PROTOCOL_ID_2_1) {
      unadjRate = getRateV2_1(
        underlyingTokenAddress,
        poolTokenAddresses,
        oneToken,
        converterAddress,
        connection,
      );
    } else if (input.protocolId == PROTOCOL_ID_2) {
      unadjRate = getRateV2(underlyingTokenAddress, oneToken, converterAddress, connection);
    } else {
      unadjRate = getRateV1(token.decimals, token.totalSupply.toString(), balance);
    }
    if (!unadjRate) {
      unresolvedComponents++;
      continue;
    }
    const rate: string = Big.of(unadjRate).div(oneToken).toString();

    // push component
    components.push({
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate,
    });
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

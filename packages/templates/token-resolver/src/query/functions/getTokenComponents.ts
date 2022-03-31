import { getPoolTokenAddresses } from "../utils/address";
import { getRate } from "../utils/getRate";
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
  }).unwrapOrElse((e: string) => {
    throw new Error(e);
  });

  // Obtain addresses for underlying vault tokens
  const poolAddress = ""; // This is often input.tokenAddress, but varies by protocol
  const poolTokenAddresses: string[] = getPoolTokenAddresses(poolAddress, connection);

  // instantiate return values
  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  // for each underlying vault token...
  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingTokenAddress: string = poolTokenAddresses[j];

    // get underlying token decimals and reserves owned by vault
    const tokenData: TokenData | null = getUnderlyingTokenData(
      underlyingTokenAddress,
      poolAddress,
      connection,
    );
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const underlyingDecimals: i32 = tokenData.decimals;
    const underlyingBalance: string = tokenData.balance;

    // calculate and push rate
    const rate: string = getRate(
      token.decimals,
      token.totalSupply.toString(),
      underlyingDecimals,
      underlyingBalance,
    );
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

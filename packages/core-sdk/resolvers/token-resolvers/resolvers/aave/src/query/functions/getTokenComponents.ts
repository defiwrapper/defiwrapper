import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_Token,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_Token,
  Token_TokenType,
} from "../w3";

function fetchUnderlyingTokenAddress(token: Token_Token, connection: Ethereum_Connection): string {
  // note: Ethereum call is likely more reliable than subgraph call
  const aaveV2Res = Ethereum_Query.callContractView({
    address: token.address,
    method: "function UNDERLYING_ASSET_ADDRESS() view returns (address)",
    args: null,
    connection: connection,
  });
  if (aaveV2Res.isErr) {
    const aaveV1Res = Ethereum_Query.callContractView({
      address: token.address,
      method: "function underlyingAssetAddress() view returns (address)",
      args: null,
      connection: connection,
    });
    if (aaveV1Res.isErr) {
      throw new Error("Invalid Aave protocol token: " + token.address);
    }
    return aaveV1Res.unwrap();
  }
  return aaveV2Res.unwrap();
}

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

  const underlyingTokenAddress: string = fetchUnderlyingTokenAddress(token, connection);

  const components = new Array<Interface_TokenComponent>(1);
  let unresolvedComponents: i32;
  const underlyingToken: Interface_Token = changetype<Interface_Token>(
    Token_Query.getToken({
      address: underlyingTokenAddress,
      m_type: Token_TokenType.ERC20,
    }),
  );
  if (underlyingToken) {
    unresolvedComponents = 0;
    components[0] = {
      tokenAddress: underlyingTokenAddress,
      unresolvedComponents: 0,
      components: [],
      rate: "1",
    };
  } else {
    unresolvedComponents = 1;
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: "1",
  };
}

import { V1_LENDING_PROTOCOL_ID, V1_UNISWAP_PROTOCOL_ID } from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_TokenComponent,
  QueryEnv,
  TokenResolver_Query,
  TokenResolver_Token,
} from "../w3";

function fetchUnderlyingTokenAddress(
  token: TokenResolver_Token,
  connection: Ethereum_Connection,
  protocolId: string,
): string {
  // v1 protocols use a different function name, but abi is otherwise like v2
  const fun: string =
    protocolId == V1_LENDING_PROTOCOL_ID || protocolId == V1_UNISWAP_PROTOCOL_ID
      ? "underlyingAssetAddress"
      : "UNDERLYING_ASSET_ADDRESS";
  const res = Ethereum_Query.callContractView({
    address: token.address,
    method: `function ${fun}() view returns (address)`,
    args: null,
    connection: connection,
  });
  if (res.isErr) {
    throw new Error("Invalid Aave protocol token: " + token.address);
  }
  return res.unwrap();
}

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = TokenResolver_Query.getToken({
    address: input.tokenAddress,
    m_type: "ERC20",
  }).unwrap();

  const underlyingTokenAddress: string = fetchUnderlyingTokenAddress(
    token,
    connection,
    input.protocolId,
  );

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;
  const underlyingTokenResult = TokenResolver_Query.getToken({
    address: underlyingTokenAddress,
    m_type: "ERC20",
  });
  if (underlyingTokenResult.isErr) {
    unresolvedComponents = 1;
  }
  components.push({
    tokenAddress: underlyingTokenAddress,
    unresolvedComponents: unresolvedComponents,
    components: [],
    rate: "1",
  });

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: "1",
  };
}

import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { YEARN_V1_PROTOCOL_ID } from "../constants";
import {
  env,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_TokenComponent,
  QueryEnv,
  TokenResolver_Query,
} from "../w3";

export function getTokenComponents(input: Input_getTokenComponents): Interface_TokenComponent {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  const token = TokenResolver_Query.getToken({
    address: input.tokenAddress,
    m_type: "ERC20",
  }).unwrap();

  // get underlying token
  const underlyingTokenAddressRes = Ethereum_Query.callContractView({
    address: token.address,
    method: "function token() external view returns (address)",
    args: [],
    connection: connection,
  });
  if (underlyingTokenAddressRes.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }
  const underlyingTokenResult = TokenResolver_Query.getToken({
    address: underlyingTokenAddressRes.unwrap(),
    m_type: "ERC20",
  });
  if (underlyingTokenResult.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: "1",
    };
  }
  const underlyingToken = underlyingTokenResult.unwrap();

  // calculate rate
  const fun = input.protocolId == YEARN_V1_PROTOCOL_ID ? "getPricePerFullShare" : "pricePerShare";
  const shareRes = Ethereum_Query.callContractView({
    address: token.address,
    method: `function ${fun}() external view returns (uint256)`,
    args: [],
    connection: connection,
  });
  if (shareRes.isErr) {
    throw new Error("Invalid Yearn protocol token: " + token.address);
  }
  const pricePerShare: Big = Big.of(shareRes.unwrap());
  const decimals = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const rate = (Big.of(pricePerShare) / Big.of(decimals)).toString();

  return {
    tokenAddress: token.address,
    unresolvedComponents: 0,
    components: [
      {
        tokenAddress: underlyingToken.address,
        unresolvedComponents: 0,
        components: [],
        rate,
      },
    ],
    rate: "1",
  };
}

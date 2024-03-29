import { BigNumber } from "@polywrap/wasm-as";

import { V1_LENDING_PROTOCOL_ID, V1_UNISWAP_PROTOCOL_ID } from "../constants";
import {
  Args_getTokenComponents,
  Ethereum_Module,
  ETR_Module,
  ETR_TokenResolver_Token,
  Interface_TokenComponent,
} from "../wrap";

function fetchUnderlyingTokenAddress(token: ETR_TokenResolver_Token, protocolId: string): string {
  // v1 protocols use a different function name, but abi is otherwise like v2
  const fun: string =
    protocolId == V1_LENDING_PROTOCOL_ID || protocolId == V1_UNISWAP_PROTOCOL_ID
      ? "underlyingAssetAddress"
      : "UNDERLYING_ASSET_ADDRESS";
  const res = Ethereum_Module.callContractView({
    address: token.address,
    method: `function ${fun}() view returns (address)`,
    args: null,
    connection: null,
  });
  if (res.isErr) {
    throw new Error("Invalid Aave protocol token: " + token.address);
  }
  return res.unwrap();
}

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrap();

  const underlyingTokenAddress: string = fetchUnderlyingTokenAddress(token, args.protocolId);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;
  const underlyingTokenResult = ETR_Module.getToken({
    address: underlyingTokenAddress,
    _type: "ERC20",
  });
  if (underlyingTokenResult.isErr) {
    unresolvedComponents = 1;
  }
  components.push({
    tokenAddress: underlyingTokenAddress.toLowerCase(),
    unresolvedComponents: unresolvedComponents,
    components: [],
    rate: BigNumber.ONE,
  });

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: BigNumber.ONE,
  };
}

import { BigInt, BigNumber } from "@polywrap/wasm-as";

import { YEARN_V1_PROTOCOL_ID } from "../constants";
import {
  Args_getTokenComponents,
  Ethereum_Module,
  ETR_Module,
  Interface_TokenComponent,
} from "../wrap";

export function getTokenComponents(args: Args_getTokenComponents): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    _type: "ERC20",
  }).unwrap();

  // get underlying token
  const underlyingTokenAddressRes = Ethereum_Module.callContractView({
    address: token.address,
    method: "function token() external view returns (address)",
    args: [],
    connection: null,
  });
  if (underlyingTokenAddressRes.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
    };
  }
  const underlyingTokenResult = ETR_Module.getToken({
    address: underlyingTokenAddressRes.unwrap(),
    _type: "ERC20",
  });
  if (underlyingTokenResult.isErr) {
    return {
      tokenAddress: token.address,
      unresolvedComponents: 1,
      components: [],
      rate: BigNumber.ONE,
    };
  }
  const underlyingToken = underlyingTokenResult.unwrap();

  // calculate rate
  const fun = args.protocolId == YEARN_V1_PROTOCOL_ID ? "getPricePerFullShare" : "pricePerShare";
  const shareRes = Ethereum_Module.callContractView({
    address: token.address,
    method: `function ${fun}() external view returns (uint256)`,
    args: [],
    connection: null,
  });
  if (shareRes.isErr) {
    throw new Error("Invalid Yearn protocol token: " + token.address);
  }
  const pricePerShare: BigNumber = BigNumber.from(shareRes.unwrap());
  const decimals = BigInt.fromUInt16(10).pow(token.decimals);
  const rate: BigNumber = pricePerShare.div(decimals);

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
    rate: BigNumber.ONE,
  };
}

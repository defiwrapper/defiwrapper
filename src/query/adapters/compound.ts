import { Big } from "as-big/Big";
import { getToken } from "../token";
import { BigInt } from "@web3api/wasm-as";
import {
  Ethereum_Query,
  Token,
  TokenComponent,
  Ethereum_Connection,
} from "../w3";
import { getTokenType } from "../tokenTypes";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection
): Array<TokenComponent> {
  let underlyingToken: Token;
  let ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  let CETH_ADDRESS = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
  if (token.address == CETH_ADDRESS) {
    underlyingToken = {
      address: ETH_ADDRESS,
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      totalSupply: BigInt.fromString("0"),
    };
  } else {
    const underlyingAssetAddress = Ethereum_Query.callContractView({
      address: token.address,
      method: "function underlying() view returns (address)",
      args: null,
      connection: connection,
    });
    if (!underlyingAssetAddress) return [];
    underlyingToken = getToken(underlyingAssetAddress, connection);
  }

  const exchangeRateResult = Ethereum_Query.callContractView({
    address: token.address,
    method: "function exchangeRateCurrent() view returns (uint256)",
    args: null,
    connection: connection,
  });
  if (!exchangeRateResult) return [];

  let decimals = BigInt.fromString("10")
    .pow(18 - 8 + underlyingToken.decimals)
    .toString();
  let exchangeRate: Big = Big.of(exchangeRateResult).div(Big.of(decimals));

  let components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: exchangeRate.toString(),
    },
  ];
  return components;
}

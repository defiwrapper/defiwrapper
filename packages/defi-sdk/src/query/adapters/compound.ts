import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { getTokenType } from "../networks/tokenTypes";
import { getToken } from "../token";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  let underlyingToken: Token;
  const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  const CETH_ADDRESS = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";
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
    }).unwrap();
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

  const decimals = BigInt.fromString("10")
    .pow(18 - 8 + underlyingToken.decimals)
    .toString();
  const exchangeRate: Big = Big.of(exchangeRateResult).div(Big.of(decimals));

  const components: Array<TokenComponent> = [
    {
      token: underlyingToken,
      m_type: getTokenType(underlyingToken, connection),
      rate: exchangeRate.toString(),
    },
  ];
  return components;
}

import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big/Big";

import { parseStringArray } from "../../utils/parseArray";
import { getToken } from "../token";
import { getTokenType } from "../tokenTypes";
import { Ethereum_Connection, Ethereum_Query, Token, TokenComponent } from "../w3";

const CURVE_ADDRESS_PROVIDER_ADDRESS = "0x0000000022D53366457F9d5E68Ec105046FC4383";

export function getComponents(
  token: Token,
  connection: Ethereum_Connection,
): Array<TokenComponent> {
  const registeryAddress = Ethereum_Query.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: null,
    connection: connection,
  });

  const poolAddress = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [token.address],
    connection: connection,
  });

  const totalCoinsResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_n_coins(address) view returns (uint256)",
    args: [poolAddress],
    connection: connection,
  });
  const totalCoins: i32 = I32.parseInt(totalCoinsResult);

  const coinsResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_coins(address) view returns (address[8])",
    args: [poolAddress],
    connection: connection,
  });
  const coins: Array<string> = parseStringArray(coinsResult);

  const balancesResult = Ethereum_Query.callContractView({
    address: registeryAddress,
    method: "function get_balances(address) view returns (uint256[8])",
    args: [poolAddress],
    connection: connection,
  });
  const balances: Array<string> = parseStringArray(balancesResult);

  const components = new Array<TokenComponent>(totalCoins);

  const tokenDecimals = BigInt.fromString("10").pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()).div(Big.of(tokenDecimals));

  for (let i = 0; i < totalCoins; i++) {
    const underlyingTokenAddress: string = coins[i];
    const underlyingToken: Token = getToken(underlyingTokenAddress, connection);
    if (underlyingToken.address == "Unknown") return [];
    const underlyIngDecimals = BigInt.fromString("10").pow(underlyingToken.decimals).toString();

    const balance: Big = Big.of(balances[i]).div(Big.of(underlyIngDecimals));

    components[i] = {
      token: underlyingToken,
      type: getTokenType(underlyingToken),
      rate: balance.div(totalSupply).toString(),
    };
  }

  return components;
}

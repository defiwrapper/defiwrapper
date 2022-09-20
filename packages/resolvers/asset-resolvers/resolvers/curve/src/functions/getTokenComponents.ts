import { BigInt, BigNumber } from "@polywrap/wasm-as";

import { CURVE_ADDRESS_PROVIDER_ADDRESS } from "../constants";
import { parseStringArray } from "../utils/parseArray";
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

  const registeryAddressResult = Ethereum_Module.callContractView({
    address: CURVE_ADDRESS_PROVIDER_ADDRESS,
    method: "function get_registry() view returns (address)",
    args: null,
    connection: null,
  }).unwrap();
  const poolAddress = Ethereum_Module.callContractView({
    address: registeryAddressResult,
    method: "function get_pool_from_lp_token(address) view returns (address)",
    args: [token.address],
    connection: null,
  }).unwrap();
  const totalCoinsResult = Ethereum_Module.callContractView({
    address: registeryAddressResult,
    method: "function get_n_coins(address) view returns (uint256)",
    args: [poolAddress],
    connection: null,
  }).unwrap();
  const totalCoins: i32 = I32.parseInt(totalCoinsResult);

  const coinsResult = Ethereum_Module.callContractView({
    address: registeryAddressResult,
    method: "function get_coins(address) view returns (address[8])",
    args: [poolAddress],
    connection: null,
  }).unwrap();
  const coins: Array<string> = parseStringArray(coinsResult);

  const balancesResult = Ethereum_Module.callContractView({
    address: registeryAddressResult,
    method: "function get_balances(address) view returns (uint256[8])",
    args: [poolAddress],
    connection: null,
  }).unwrap();
  const balances: Array<string> = parseStringArray(balancesResult);

  const components = new Array<Interface_TokenComponent>(totalCoins);

  const tokenDecimals = BigInt.fromString("10").pow(token.decimals);
  const totalSupply: BigNumber = BigNumber.from(token.totalSupply).div(tokenDecimals);

  let unresolvedComponents: i32 = 0;

  for (let i = 0; i < totalCoins; i++) {
    const underlyingTokenAddress: string = coins[i];
    const underlyingTokenResult = ETR_Module.getToken({
      address: underlyingTokenAddress,
      _type: "ERC20",
    });
    if (underlyingTokenResult.isErr) {
      unresolvedComponents++;
      continue;
    }
    const underlyingToken = underlyingTokenResult.unwrap();
    const underlyIngDecimals = BigInt.fromString("10").pow(underlyingToken.decimals);
    const balance: BigNumber = BigNumber.from(balances[i]).div(underlyIngDecimals);
    const rate = balance.div(totalSupply);
    components[i] = {
      tokenAddress: underlyingTokenAddress.toLowerCase(),
      unresolvedComponents: 0,
      components: [],
      rate,
    };
  }

  return {
    tokenAddress: token.address,
    unresolvedComponents: unresolvedComponents,
    components: components,
    rate: BigNumber.ONE,
  };
}

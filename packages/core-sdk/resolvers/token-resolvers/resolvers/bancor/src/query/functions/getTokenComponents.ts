import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

import { CONVERTER_REGISTRY_ID, ETH_ADDRESS, getContractRegistry } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_getTokenComponents,
  Interface_Token,
  Interface_TokenComponent,
  QueryEnv,
  Token_Query,
  Token_TokenType,
} from "../w3";

class TokenData {
  decimals: i32;
  balance: string;
}

function getConverterAddress(anchorTokenAddress: string, connection: Ethereum_Connection): string {
  const chainId: i32 = getChainId(connection);
  const converterRegistryAddressRes = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId),
    method: "function addressOf(bytes32 contractName) public view returns (address)",
    args: [CONVERTER_REGISTRY_ID],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    throw new Error(converterRegistryAddressRes.unwrapErr());
  }
  const converterAddressRes = Ethereum_Query.callContractView({
    address: converterRegistryAddressRes.unwrap(),
    method: "function getConvertersByAnchors(address[] anchors) public view returns (address[])",
    args: [`["${anchorTokenAddress}"]`],
    connection: connection,
  });
  if (converterRegistryAddressRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return converterAddressRes.unwrap().split(",")[0];
}

function getPoolTokenAddresses(
  converterAddress: string,
  connection: Ethereum_Connection,
): string[] {
  const tokenAddressesRes = Ethereum_Query.callContractView({
    address: converterAddress,
    method: "function reserveTokens() external view returns (address[])",
    args: null,
    connection: connection,
  });
  if (tokenAddressesRes.isErr) {
    throw new Error("Invalid protocol token");
  }
  return tokenAddressesRes.unwrap().split(",");
}

function getUnderlyingTokenData(
  underlyingTokenAddress: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): TokenData | null {
  // get underlying token
  const underlyingToken: Interface_Token = changetype<Interface_Token>(
    Token_Query.getToken({
      address: underlyingTokenAddress,
      m_type: Token_TokenType.ERC20,
    }).unwrap(),
  );
  if (!underlyingToken) {
    return null;
  }
  // get underlying token balance
  const balanceRes = Ethereum_Query.callContractView({
    connection: connection,
    address: underlyingToken.address,
    method: "function balanceOf(address account) public view returns (uint256)",
    args: [converterAddress],
  });
  if (balanceRes.isErr) {
    return null;
  }
  return {
    decimals: underlyingToken.decimals,
    balance: balanceRes.unwrap(),
  };
}

// Eth special case
function getEthData(
  underlyingTokenAddress: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): TokenData | null {
  const balanceRes = Ethereum_Query.callContractView({
    connection: connection,
    address: converterAddress,
    method: "function reserveBalance(address reserveToken) public view returns (uint256)",
    args: [underlyingTokenAddress],
  });
  if (balanceRes.isErr) {
    return null;
  }
  return {
    decimals: 18,
    balance: balanceRes.unwrap().toString(),
  };
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

  const converterAddress: string = getConverterAddress(token.address, connection);
  const poolTokenAddresses: string[] = getPoolTokenAddresses(converterAddress, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(token.decimals).toString();
  const totalSupply: Big = Big.of(token.totalSupply.toString()).div(tokenDecimals);

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingTokenAddress: string = poolTokenAddresses[j];
    // get underlying token decimals and balance
    let tokenData: TokenData | null;
    if (underlyingTokenAddress.toLowerCase() == ETH_ADDRESS) {
      tokenData = getEthData(underlyingTokenAddress, converterAddress, connection);
    } else {
      tokenData = getUnderlyingTokenData(underlyingTokenAddress, converterAddress, connection);
    }
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const decimals: i32 = tokenData.decimals;
    const balance: string = tokenData.balance;

    // calculate decimal-adjusted balance
    const underlyIngDecimals: string = BigInt.fromUInt16(10).pow(decimals).toString();
    const adjBalance: Big = Big.of(balance).div(underlyIngDecimals);

    // calculate and push rate
    const rate = adjBalance.div(totalSupply).toString();
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

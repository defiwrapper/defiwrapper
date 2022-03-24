import { ETH_ADDRESS } from "../constants";
import {
  Ethereum_Connection,
  Ethereum_Query,
  Interface_Token,
  Token_Query,
  Token_TokenType,
} from "../w3";

export class TokenData {
  decimals: i32;
  balance: string;
}

export function getUnderlyingTokenData(
  underlyingTokenAddress: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): TokenData | null {
  // TODO: refactor to use getToken with getEthData -> can i use getEthData method for other tokens?
  if (underlyingTokenAddress.toLowerCase() == ETH_ADDRESS) {
    return getEthData(underlyingTokenAddress, converterAddress, connection);
  }
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
    throw new Error(balanceRes.unwrapErr());
    return null;
  }
  return {
    decimals: underlyingToken.decimals,
    balance: balanceRes.unwrap(),
  };
}

// Eth special case
export function getEthData(
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
    throw new Error(balanceRes.unwrapErr());
    return null;
  }
  return {
    decimals: 18,
    balance: balanceRes.unwrap(),
  };
}

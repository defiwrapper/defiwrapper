import { ETH_ADDRESS } from "../constants";
import {
  Ethereum_Connection,
  Ethereum_Query,
  Interface_Token,
  Token_Query,
  Token_Token,
  Token_TokenType,
} from "../w3";

export class TokenData {
  decimals: i32;
  balance: string;
}

export function getUnderlyingTokenData(
  token: Token_Token,
  underlyingTokenAddress: string,
  connection: Ethereum_Connection,
): TokenData | null {
  const underlyingTokenRes = Token_Query.getToken({
    address: underlyingTokenAddress,
    m_type: Token_TokenType.ERC20,
  });
  if (underlyingTokenRes.isErr) {
    return null;
  }
  const underlyingToken: Interface_Token = changetype<Interface_Token>(underlyingTokenRes.unwrap());
  // get underlying token balance
  let balanceRes;
  if (underlyingTokenAddress == ETH_ADDRESS) {
    balanceRes = Ethereum_Query.getBalance({
      connection: connection,
      address: token.address,
      blockTag: null,
    });
  } else {
    balanceRes = Ethereum_Query.callContractView({
      connection: connection,
      address: underlyingTokenAddress,
      method: "function balanceOf(address account) public view returns (uint256)",
      args: [token.address],
    });
  }
  if (balanceRes.isErr) {
    return null;
  }
  return {
    decimals: underlyingToken.decimals,
    balance: balanceRes.unwrap().toString(),
  };
}

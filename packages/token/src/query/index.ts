import { getERC20Token } from "./ERC20";
import { env, Input_getToken, QueryEnv, Token, TokenType } from "./w3";

export function getToken(input: Input_getToken): Token | null {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  switch (input.m_type) {
    case TokenType.ERC20:
      return getERC20Token(input.address, connection);
    default:
      throw new Error("unsupported token type");
  }
}

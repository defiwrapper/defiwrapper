import { BigInt, BigNumber } from "@polywrap/wasm-as";

import {
  CHI_GAS_TOKEN_ADDRESS,
  ETH_ADDRESS,
  ONESPLIT_CONTRACT_ADDRESS,
  PROTOCOL_ID_CHI_GAS_TOKEN,
  ZERO_ADDRESS,
} from "../constants";
import { getUnderlyingTokenData, TokenData } from "../utils/TokenData";
import {
  Args_getTokenComponents,
  Env,
  Ethereum_Connection,
  Ethereum_Module,
  ETR_Module,
  ETR_TokenResolver_Token,
  Interface_TokenComponent,
} from "../wrap";

function getPoolTokenAddresses(poolAddress: string, connection: Ethereum_Connection): string[] {
  const tokenAddressRes = Ethereum_Module.callContractView({
    address: poolAddress,
    method: "function getTokens() external view returns(address[] tokens)",
    args: [],
    connection: connection,
  });
  if (tokenAddressRes.isErr) {
    throw new Error("Invalid 1Inch protocol token");
  }
  return tokenAddressRes.unwrap().split(",");
}

function get1InchProtocolComponents(
  protocolToken: ETR_TokenResolver_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  const poolTokenAddresses: string[] = getPoolTokenAddresses(protocolToken.address, connection);

  const tokenDecimals: string = BigInt.fromUInt16(10).pow(protocolToken.decimals).toString();
  const totalSupply: BigNumber = BigNumber.from(protocolToken.totalSupply.toString()).div(
    tokenDecimals,
  );

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  for (let j = 0; j < poolTokenAddresses.length; j++) {
    const underlyingAddress: string = poolTokenAddresses[j];
    // get underlying token decimals and balance
    const tokenData: TokenData | null = getUnderlyingTokenData(
      protocolToken,
      underlyingAddress,
      connection,
    );
    if (!tokenData) {
      unresolvedComponents++;
      continue;
    }
    const decimals: i32 = tokenData.decimals;
    const balance: string = tokenData.balance;

    // calculate decimal-adjusted balance
    const underlyingDecimals: string = BigInt.fromUInt16(10).pow(decimals).toString();
    const adjBalance: BigNumber = BigNumber.from(balance).div(underlyingDecimals);

    // calculate and push rate
    const rate: string = adjBalance.div(totalSupply).toString();
    const address = underlyingAddress == ZERO_ADDRESS ? ETH_ADDRESS : underlyingAddress;
    components.push({
      tokenAddress: address,
      unresolvedComponents: 0,
      components: [],
      rate,
    });
  }

  const tokenAddress: string =
    protocolToken.address == ZERO_ADDRESS ? ETH_ADDRESS : protocolToken.address;

  return {
    tokenAddress,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

function getChiGasTokenComponents(
  chi: ETR_TokenResolver_Token,
  connection: Ethereum_Connection,
): Interface_TokenComponent {
  if (chi.address.toLowerCase() != CHI_GAS_TOKEN_ADDRESS.toLowerCase()) {
    throw new Error("Invalid Chi Gas Token: " + chi.address);
  }

  const components: Interface_TokenComponent[] = [];
  let unresolvedComponents: i32 = 0;

  const rateRes = Ethereum_Module.callContractView({
    address: ONESPLIT_CONTRACT_ADDRESS,
    method:
      "function getExpectedReturn(address fromToken, address destToken, uint256 amount, uint256 parts, uint256 flags) public view returns(uint256 returnAmount)",
    args: [CHI_GAS_TOKEN_ADDRESS, ETH_ADDRESS, "1", "1", "0"],
    connection: connection,
  });
  if (rateRes.isOk) {
    components.push({
      tokenAddress: ETH_ADDRESS,
      unresolvedComponents: 0,
      components: [],
      rate: rateRes.unwrap(),
    });
  } else {
    unresolvedComponents++;
  }

  return {
    tokenAddress: CHI_GAS_TOKEN_ADDRESS,
    unresolvedComponents,
    components,
    rate: "1",
  };
}

export function getTokenComponents(
  args: Args_getTokenComponents,
  env: Env,
): Interface_TokenComponent {
  const token = ETR_Module.getToken({
    address: args.tokenAddress,
    m_type: "ERC20",
  }).unwrapOrElse((err: string) => {
    throw new Error(err);
  });

  if (args.protocolId == PROTOCOL_ID_CHI_GAS_TOKEN) {
    return getChiGasTokenComponents(token, env.connection);
  }
  return get1InchProtocolComponents(token, env.connection);
}

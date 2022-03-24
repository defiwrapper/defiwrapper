import { BigInt } from "@web3api/wasm-as";

import { Ethereum_Connection, Ethereum_Query } from "../w3";
import { BNT_ADDRESS } from "../constants";

// Bancor V2.1
// https://github.com/bancorprotocol/contracts-solidity/blob/master/contracts/converter/types/standard-pool/StandardPoolConverter.sol#L925
// function removeLiquidityReturn(uint256 amount, IReserveToken[] memory reserves) external view returns (uint256[] memory)
// returns [rate after fee]

export function getRateV2_1(
  underlyingTokenAddress: string,
  reserves: string[],
  amount: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): string | null {
  const rateRes = Ethereum_Query.callContractView({
    connection: connection,
    address: converterAddress,
    method:
      "function removeLiquidityReturn(uint256 amount, address[] reserves) external view returns (tuple(uint256, uint256, uint256, uint256))",
    args: [amount, `["${reserves[0]}", "${reserves[1]}"]`],
  });
  if (rateRes.isErr) {
    return null;
  }
  const rates = rateRes.unwrap().split(",");
  return underlyingTokenAddress == reserves[0] ? rates[2] : rates[3];
}

// Bancor V2
// https://github.com/bancorprotocol/bancor-contracts-solidity-legacy/blob/8871b47002017efbd62125486253416d6ff87522/solidity/converter/types/liquidity-pool-v2/LiquidityPoolV2Converter.sol#L619
// function removeLiquidityReturnAndFee(IDSToken _poolToken, uint256 _amount) public view returns (uint256, uint256)
// returns (rate after fee, fee)

export function getRateV2(
  underlyingTokenAddress: string,
  amount: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): string | null {
  const rateRes = Ethereum_Query.callContractView({
    connection: connection,
    address: converterAddress,
    method:
      "function removeLiquidityReturnAndFee(address _poolToken, uint256 _amount) public view returns (uint256, uint256)",
    args: [underlyingTokenAddress, amount],
  });
  if (rateRes.isErr) {
    return null;
  }
  return rateRes.unwrap().split(",")[0];
}

// Bancor V1
// https://github.com/bancorprotocol/bancor-contracts-solidity-legacy/blob/master/solidity/converter/BancorFormula.sol#L1149
// function liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view returns (uint256)
// (1e18 * underlyingBal) / totalSupply

export function getRateV1(
  anchorSupply: BigInt,
  underlyingTokenBalance: string,
  amount: string,
  converterAddress: string,
  connection: Ethereum_Connection,
): string | null {
  const rateRes = Ethereum_Query.callContractView({
    connection: connection,
    address: converterAddress,
    method:
      "function liquidateReserveAmount(uint256 _supply, uint256 _reserveBalance, uint32 _reserveRatio, uint256 _amount) public view returns (uint256)",
    args: [anchorSupply.toString(), underlyingTokenBalance, "1000000", amount],
  });
  if (rateRes.isErr) {
    return null;
  }
  return rateRes.unwrap();
}

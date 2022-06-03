import { simpleAssets } from "../helpers/assets/simpleAssets";
import { sushiswapProtocol } from "../helpers/assets/sushiswapProtocol";
import { uniswapProtocol } from "../helpers/assets/uniswapProtocol";
import { yearnProtocol } from "../helpers/assets/yearnProtocol";
import { AccountBalance, Input_getAccountBalance } from "../w3";
import { Ethereum_Network, Ethereum_Query } from "../w3/imported";

export function getAccountBalance(input: Input_getAccountBalance): AccountBalance {
  const network: Ethereum_Network = Ethereum_Query.getNetwork({ connection: null }).unwrap();
  return {
    account: input.accountAddress,
    chainId: network.chainId.toString(),
    values: [
      {
        currency: "usd",
        price: "N/A",
        value: "27,036.135113993",
      },
    ],
    protocols: [uniswapProtocol, sushiswapProtocol, yearnProtocol],
    tokens: simpleAssets,
  };
}

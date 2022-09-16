import { wrap_debug_log } from "@polywrap/wasm-as";
import {
  Args_getTokenPrice,
  Interface_PriceResolver_TokenBalance,
  PriceResolver,
  PriceResolver_Module,
} from "../wrap";
import { Args_getTokenPrice as PriceResolver_Args_getTokenPrice } from "../wrap/imported/PriceResolver_Module/serialization";

export function getTokenPrice(
  args: Args_getTokenPrice,
): Interface_PriceResolver_TokenBalance | null {
  const implementations = PriceResolver.getImplementations();
  for (let i = 0; i < implementations.length; i++) {
    const priceResolver = new PriceResolver_Module(implementations[i]);
    const tokenPriceResult = priceResolver.getTokenPrice(
      changetype<PriceResolver_Args_getTokenPrice>(args),
    );
    tokenPriceResult.unwrap();
    wrap_debug_log(tokenPriceResult.isErr ? "PRICE ERORO" : "NO ERORO");
    if (tokenPriceResult.isErr) continue;

    wrap_debug_log(tokenPriceResult.unwrap().token.address);

    const tokenPrice = tokenPriceResult.unwrap();

    return changetype<Interface_PriceResolver_TokenBalance>(tokenPrice);
  }

  return null;
}

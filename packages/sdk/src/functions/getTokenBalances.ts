import { wrap_debug_log } from "@polywrap/wasm-as";
import {
  AccountResolver,
  AccountResolver_Module,
  Args_getTokenBalances,
  Interface_AccountResolver_TokenBalancesList,
} from "../wrap";
import { Args_getTokenBalances as AccountResolver_Args_getTokenBalances } from "../wrap/imported/AccountResolver_Module/serialization";

export function getTokenBalances(
  args: Args_getTokenBalances,
): Interface_AccountResolver_TokenBalancesList | null {
  const implementations = AccountResolver.getImplementations();
  wrap_debug_log(implementations.length.toString());
  for (let i = 0; i < implementations.length; i++) {
    wrap_debug_log(implementations[i].toString());
    const accountResolver = new AccountResolver_Module(implementations[i]);
    const tokenBalancesResult = accountResolver.getTokenBalances(
      changetype<AccountResolver_Args_getTokenBalances>(args),
    );
    wrap_debug_log("Validation Eroror: " + (tokenBalancesResult.isErr ? "true" : "false"));
    if (tokenBalancesResult.isErr) {
      throw new Error(tokenBalancesResult.unwrapErr());
    }
    wrap_debug_log(
      "TokenBalances: " + tokenBalancesResult.unwrap().tokenBalances.length.toString(),
    );
    if (tokenBalancesResult.isErr) continue;

    const tokenBalances = tokenBalancesResult.unwrap();
    if (tokenBalances == null) continue;

    return changetype<Interface_AccountResolver_TokenBalancesList>(tokenBalances);
  }
  return null;
}

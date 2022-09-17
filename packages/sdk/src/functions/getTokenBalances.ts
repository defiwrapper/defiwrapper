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
  for (let i = 0; i < implementations.length; i++) {
    const accountResolver = new AccountResolver_Module(implementations[i]);
    const tokenBalancesResult = accountResolver.getTokenBalances(
      changetype<AccountResolver_Args_getTokenBalances>(args),
    );
    if (tokenBalancesResult.isErr) {
      throw new Error(tokenBalancesResult.unwrapErr());
    }
    if (tokenBalancesResult.isErr) continue;

    const tokenBalances = tokenBalancesResult.unwrap();
    if (tokenBalances == null) continue;

    return changetype<Interface_AccountResolver_TokenBalancesList>(tokenBalances);
  }
  return null;
}

import { BigInt } from "@web3api/wasm-as";
import { Big } from "as-big";

/* Example of a standard rate calculation
 * The correct rate calculation method varies by protocol
 */
export function getRate(
  assetDecimals: string,
  assetTotalSupply: string,
  underlyingDecimals: i32,
  underlyingBalance: string,
): string {
  const adjAssetSupply: Big = Big.of(assetTotalSupply).div(assetDecimals);
  const underlyIngDecimals = BigInt.fromUInt16(10).pow(underlyingDecimals).toString();
  const adjBalance: Big = Big.of(underlyingBalance).div(underlyIngDecimals);
  return adjBalance.div(adjAssetSupply).toString();
}

export function buildUrl(arr: Array<string>): string {
  const url = arr.join("/");
  return url.endsWith("/") ? url : url + "/";
}

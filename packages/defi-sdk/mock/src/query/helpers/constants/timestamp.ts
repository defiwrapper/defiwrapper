import { randint } from "../random";

const timestamps = ["2022-02-12T13:07:36Z", "2022-01-12T13:08:36Z", "2021-02-12T13:07:36Z"];

export function getRandomTimestamp(): string {
  return timestamps[randint() % timestamps.length];
}

import { JSON } from "@web3api/assemblyscript-json";
import { Nullable } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import {
  getNullableIntegerProperty,
  getNullableStringProperty,
  getStringProperty,
  isValidDateString,
  normalizeCurrencyMarketCapPairObject,
  normalizeCurrencyPricePairObject,
  normalizeCurrencyVolumePairObject,
  normalizeLocalizationPairObject,
} from "../utils";
import {
  CoinHistory,
  HTTP_Query,
  HTTP_ResponseType,
  HTTP_UrlParam,
  Input_coinHistory,
} from "../w3";

export function coinHistory(input: Input_coinHistory): CoinHistory {
  if (!isValidDateString(input.date)) {
    throw new Error("Invalid date format! Use dd-mm-yyyy format.");
  }

  const url = COINGECKO_API_URL + "/coins/" + input.id + "/history";
  const urlParams: Array<HTTP_UrlParam> = [{ key: "date", value: input.date }];

  const response = HTTP_Query.get({
    url,
    request: {
      headers: [],
      urlParams,
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });

  if (!response || response.status !== 200 || !response.body) {
    throw new Error(response ? response.statusText : "response should not be undefined");
  }

  const json = <JSON.Obj>JSON.parse(response.body);

  const imageObj = json.getObj("image") as JSON.Obj;
  const marketDataObj = json.getObj("market_data");
  const communityDataObj = json.getObj("community_data");
  const developerDataObj = json.getObj("developer_data");
  const addDelObj =
    developerDataObj !== null ? developerDataObj.getObj("code_additions_deletions_4_weeks") : null;
  const publicInterestStats = json.getObj("public_interest_stats");

  return {
    id: getStringProperty(json, "id"),
    symbol: getStringProperty(json, "symbol"),
    name: getStringProperty(json, "name"),
    localization: normalizeLocalizationPairObject(json.getObj("localization") as JSON.Obj),
    image: {
      small: getNullableStringProperty(imageObj, "small"),
      thumb: getNullableStringProperty(imageObj, "thumb"),
    },
    market_data:
      marketDataObj !== null
        ? {
            current_price: normalizeCurrencyPricePairObject(
              marketDataObj.getObj("current_price") as JSON.Obj,
            ),
            market_cap: normalizeCurrencyMarketCapPairObject(
              marketDataObj.getObj("market_cap") as JSON.Obj,
            ),
            total_volume: normalizeCurrencyVolumePairObject(
              marketDataObj.getObj("total_volume") as JSON.Obj,
            ),
          }
        : null,
    community_data:
      communityDataObj !== null
        ? {
            facebook_likes: getNullableIntegerProperty<i32>(communityDataObj, "facebook_likes"),
            twitter_followers: getNullableIntegerProperty<i32>(
              communityDataObj,
              "twitter_followers",
            ),
            reddit_average_posts_48h: getNullableStringProperty(
              communityDataObj,
              "reddit_average_posts_48h",
            ),
            reddit_average_comments_48h: getNullableStringProperty(
              communityDataObj,
              "reddit_average_comments_48h",
            ),
            reddit_subscribers: getNullableIntegerProperty<i32>(
              communityDataObj,
              "reddit_subscribers",
            ),
            reddit_accounts_active_48h: getNullableStringProperty(
              communityDataObj,
              "reddit_accounts_active_48h",
            ),
          }
        : null,
    developer_data:
      developerDataObj !== null
        ? {
            forks: getNullableIntegerProperty<i32>(developerDataObj, "forks"),
            stars: getNullableIntegerProperty<i32>(developerDataObj, "stars"),
            subscribers: getNullableIntegerProperty<i32>(developerDataObj, "subscribers"),
            total_issues: getNullableIntegerProperty<i32>(developerDataObj, "total_issues"),
            closed_issues: getNullableIntegerProperty<i32>(developerDataObj, "closed_issues"),
            pull_requests_merged: getNullableIntegerProperty<i32>(
              developerDataObj,
              "pull_requests_merged",
            ),
            pull_request_contributors: getNullableIntegerProperty<i32>(
              developerDataObj,
              "pull_request_contributors",
            ),
            code_additions_deletions_4_weeks: {
              additions:
                addDelObj !== null
                  ? getNullableIntegerProperty<i32>(addDelObj, "additions")
                  : Nullable.fromNull<i32>(),
              deletions:
                addDelObj !== null
                  ? getNullableIntegerProperty<i32>(addDelObj, "deletions")
                  : Nullable.fromNull<i32>(),
            },
            commit_count_4_weeks: getNullableIntegerProperty<i32>(
              developerDataObj,
              "commit_count_4_weeks",
            ),
          }
        : null,
    public_interest_stats:
      publicInterestStats !== null
        ? {
            alexa_rank: getNullableIntegerProperty<i32>(publicInterestStats, "alexa_rank"),
            bing_matches: getNullableIntegerProperty<i32>(publicInterestStats, "bing_matches"),
          }
        : null,
  };
}

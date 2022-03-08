import { JSON, Nullable } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import {
  getIntegerProperty,
  getNullableIntegerProperty,
  getNullableStringProperty,
  getStringProperty,
} from "../utils";
import {
  HTTP_Query,
  HTTP_ResponseType,
  Input_tokenInfo,
  TokenInfo,
  TokenInfoCommunityData,
  TokenInfoCurrencyDatePair,
  TokenInfoCurrencyPercentagePair,
  TokenInfoCurrencyPricePair,
  TokenInfoCurrencyVolumePair,
  TokenInfoDeveloperData,
  TokenInfoLinks,
  TokenInfoLocalizedText,
  TokenInfoMarketData,
  TokenInfoPlatform,
  TokenInfoPublicInterestStats,
  TokenInfoTicker,
} from "../w3";

function createCurrencyPricePair(obj: JSON.Obj): TokenInfoCurrencyPricePair[] {
  const pairs: TokenInfoCurrencyPricePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    pairs.push({ currency: key, price: getStringProperty(obj, key) });
  }

  return pairs;
}

function createCurrencyPercentagePair(obj: JSON.Obj): TokenInfoCurrencyPercentagePair[] {
  const pairs: TokenInfoCurrencyPercentagePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    pairs.push({ currency: key, percentage: getStringProperty(obj, key) });
  }

  return pairs;
}

function createCurrencyDatePair(obj: JSON.Obj): TokenInfoCurrencyDatePair[] {
  const pairs: TokenInfoCurrencyDatePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    pairs.push({ currency: key, date: getStringProperty(obj, key) });
  }

  return pairs;
}

function createCurrencyVolumePair(obj: JSON.Obj): TokenInfoCurrencyVolumePair[] {
  const pairs: TokenInfoCurrencyVolumePair[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    pairs.push({ currency: key, volume: getStringProperty(obj, key) });
  }

  return pairs;
}

function createLocaleTextPair(obj: JSON.Obj): TokenInfoLocalizedText[] {
  const pairs: TokenInfoLocalizedText[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    pairs.push({ locale: key, text: getStringProperty(obj, key) });
  }

  return pairs;
}

function createPlatformsArray(obj: JSON.Obj): TokenInfoPlatform[] {
  // normalize platforms
  const platforms: TokenInfoPlatform[] = [];
  for (let i = 0; i < obj.keys.length; i++) {
    const key = obj.keys[i];
    platforms.push({ platform: key, contract_address: getStringProperty(obj, key) });
  }

  return platforms;
}

function createLinks(json: JSON.Obj): TokenInfoLinks {
  return {
    homepage: (json.getArr("homepage") as JSON.Arr).valueOf().map<string>((v) => v.toString()),
    blockchain_site: (json.getArr("blockchain_site") as JSON.Arr)
      .valueOf()
      .map<string>((v) => v.toString()),
    official_forum_url: (json.getArr("official_forum_url") as JSON.Arr)
      .valueOf()
      .map<string>((v) => v.toString()),
    chat_url: (json.getArr("chat_url") as JSON.Arr).valueOf().map<string>((v) => v.toString()),
    announcement_url: (json.getArr("announcement_url") as JSON.Arr)
      .valueOf()
      .map<string>((v) => v.toString()),
    twitter_screen_name: getStringProperty(json, "twitter_screen_name"),
    facebook_username: getStringProperty(json, "facebook_username"),
    bitcointalk_thread_identifier: getNullableStringProperty(json, "bitcointalk_thread_identifier"),
    telegram_channel_identifier: getStringProperty(json, "telegram_channel_identifier"),
    subreddit_url: getStringProperty(json, "subreddit_url"),
    repos_url: {
      github: ((json.getObj("repos_url") as JSON.Obj).getArr("github") as JSON.Arr)
        .valueOf()
        .map<string>((v) => v.toString()),
      bitbucket: ((json.getObj("repos_url") as JSON.Obj).getArr("bitbucket") as JSON.Arr)
        .valueOf()
        .map<string>((v) => v.toString()),
    },
  };
}

function createMarketData(json: JSON.Obj): TokenInfoMarketData {
  // market data
  const currentPrice = createCurrencyPricePair(json.getObj("current_price") as JSON.Obj);
  const ath = createCurrencyPricePair(json.getObj("ath") as JSON.Obj);
  const athChangePercent = createCurrencyPercentagePair(
    json.getObj("ath_change_percentage") as JSON.Obj,
  );
  const athDate = createCurrencyDatePair(json.getObj("ath_date") as JSON.Obj);
  const atl = createCurrencyPricePair(json.getObj("atl") as JSON.Obj);
  const atlChangePercent = createCurrencyPercentagePair(
    json.getObj("atl_change_percentage") as JSON.Obj,
  );
  const atlDate = createCurrencyDatePair(json.getObj("atl_date") as JSON.Obj);
  const marketCap = createCurrencyVolumePair(json.getObj("market_cap") as JSON.Obj);
  const fullyDilutedValuation = createCurrencyVolumePair(json.getObj("market_cap") as JSON.Obj);
  const totalVolume = createCurrencyVolumePair(json.getObj("total_volume") as JSON.Obj);
  const high24h = createCurrencyPricePair(json.getObj("high_24h") as JSON.Obj);
  const low24h = createCurrencyPricePair(json.getObj("low_24h") as JSON.Obj);
  const priceChange24h = createCurrencyPricePair(
    json.getObj("price_change_24h_in_currency") as JSON.Obj,
  );
  const priceChangePercent1h = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_1h_in_currency") as JSON.Obj,
  );
  const priceChangePercent24h = createCurrencyPercentagePair(
    json.get("price_change_percentage_24h_in_currency") as JSON.Obj,
  );

  const priceChangePercent7d = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_7d_in_currency") as JSON.Obj,
  );
  const priceChangePercent14d = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_14d_in_currency") as JSON.Obj,
  );
  const priceChangePercent30d = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_30d_in_currency") as JSON.Obj,
  );
  const priceChangePercent60d = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_60d_in_currency") as JSON.Obj,
  );
  const priceChangePercent200d = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_200d_in_currency") as JSON.Obj,
  );
  const priceChangePercent1y = createCurrencyPercentagePair(
    json.getObj("price_change_percentage_1y_in_currency") as JSON.Obj,
  );
  const marketCapChange24h = createCurrencyVolumePair(
    json.getObj("market_cap_change_24h_in_currency") as JSON.Obj,
  );
  const marketCapChangePercent24h = createCurrencyPercentagePair(
    json.getObj("market_cap_change_24h_in_currency") as JSON.Obj,
  );

  return {
    current_price: currentPrice,
    total_value_locked: getNullableStringProperty(json, "total_value_locked"),
    mcap_to_tvl_ratio: getNullableStringProperty(json, "mcap_to_tvl_ratio"),
    fdv_to_tvl_ratio: getNullableStringProperty(json, "fdv_to_tvl_ratio"),
    roi: getNullableStringProperty(json, "roi"),
    ath,
    ath_change_percentage: athChangePercent,
    ath_date: athDate,
    atl,
    atl_change_percentage: atlChangePercent,
    atl_date: atlDate,
    market_cap: marketCap,
    fully_diluted_valuation: fullyDilutedValuation,
    market_cap_rank: getIntegerProperty<i32>(json, "market_cap_rank"),
    total_volume: totalVolume,
    high_24h: high24h,
    low_24h: low24h,
    price_change_24h: getStringProperty(json, "price_change_24h"),
    price_change_percentage_24h: getStringProperty(json, "price_change_percentage_24h"),
    price_change_percentage_7d: getStringProperty(json, "price_change_percentage_7d"),
    price_change_percentage_14d: getStringProperty(json, "price_change_percentage_14d"),
    price_change_percentage_30d: getStringProperty(json, "price_change_percentage_30d"),
    price_change_percentage_60d: getStringProperty(json, "price_change_percentage_60d"),
    price_change_percentage_200d: getStringProperty(json, "price_change_percentage_200d"),
    price_change_percentage_1y: getStringProperty(json, "price_change_percentage_1y"),
    market_cap_change_24h: getStringProperty(json, "market_cap_change_24h"),
    market_cap_change_percentage_24h: getStringProperty(json, "market_cap_change_percentage_24h"),
    price_change_24h_in_currency: priceChange24h,
    price_change_percentage_1h_in_currency: priceChangePercent1h,
    price_change_percentage_24h_in_currency: priceChangePercent24h,
    price_change_percentage_7d_in_currency: priceChangePercent7d,
    price_change_percentage_14d_in_currency: priceChangePercent14d,
    price_change_percentage_30d_in_currency: priceChangePercent30d,
    price_change_percentage_60d_in_currency: priceChangePercent60d,
    price_change_percentage_200d_in_currency: priceChangePercent200d,
    price_change_percentage_1y_in_currency: priceChangePercent1y,
    market_cap_change_24h_in_currency: marketCapChange24h,
    market_cap_change_percentage_24h_in_currency: marketCapChangePercent24h,
    total_supply: getStringProperty(json, "total_supply"),
    max_supply: getNullableStringProperty(json, "max_supply"),
    circulating_supply: getStringProperty(json, "circulating_supply"),
    last_updated: getStringProperty(json, "last_updated"),
  };
}

function createCommunityData(json: JSON.Obj): TokenInfoCommunityData {
  return {
    facebook_likes: getNullableIntegerProperty<i32>(json, "facebook_likes"),
    twitter_followers: getIntegerProperty<i32>(json, "twitter_followers"),
    reddit_average_posts_48h: getStringProperty(json, "reddit_average_posts_48h"),
    reddit_average_comments_48h: getStringProperty(json, "reddit_average_comments_48h"),
    reddit_subscribers: getIntegerProperty<i32>(json, "reddit_subscribers"),
    reddit_accounts_active_48h: getIntegerProperty<i32>(json, "reddit_accounts_active_48h"),
    telegram_channel_user_count: getNullableIntegerProperty<i32>(
      json,
      "telegram_channel_user_count",
    ),
  };
}

function createDeveloperData(json: JSON.Obj): TokenInfoDeveloperData {
  return {
    forks: getIntegerProperty<i32>(json, "forks"),
    stars: getIntegerProperty<i32>(json, "stars"),
    subscribers: getIntegerProperty<i32>(json, "subscribers"),
    total_issues: getIntegerProperty<i32>(json, "total_issues"),
    closed_issues: getIntegerProperty<i32>(json, "closed_issues"),
    pull_requests_merged: getIntegerProperty<i32>(json, "pull_requests_merged"),
    pull_request_contributors: getIntegerProperty<i32>(json, "pull_request_contributors"),
    code_additions_deletions_4_weeks: {
      additions: getNullableIntegerProperty<i32>(
        json.getObj("code_additions_deletions_4_weeks") as JSON.Obj,
        "additions",
      ),
      deletions: getNullableIntegerProperty<i32>(
        json.getObj("code_additions_deletions_4_weeks") as JSON.Obj,
        "deletions",
      ),
    },
    commit_count_4_weeks: getNullableIntegerProperty<i32>(json, "commit_count_4_weeks"),
  };
}

function createTicker(json: JSON.Obj): TokenInfoTicker {
  const marketObj = json.getObj("market") as JSON.Obj;

  // converted last
  const convertedLast = createCurrencyPricePair(json.getObj("converted_last") as JSON.Obj);

  // converted volume
  const convertedVolume = createCurrencyVolumePair(json.getObj("converted_volume") as JSON.Obj);

  return {
    base: getStringProperty(json, "base"),
    target: getStringProperty(json, "target"),
    market: {
      name: (marketObj.getString("name") as JSON.Str).valueOf(),
      identifier: (marketObj.getString("identifier") as JSON.Str).valueOf(),
      has_trading_incentive: (marketObj.getBool("has_trading_incentive") as JSON.Bool).valueOf(),
    },
    last: getStringProperty(json, "last"),
    volume: getStringProperty(json, "volume"),
    converted_last: convertedLast,
    converted_volume: convertedVolume,
    trust_score: getStringProperty(json, "trust_score"),
    bid_ask_spread_percentage: getStringProperty(json, "bid_ask_spread_percentage"),
    timestamp: getStringProperty(json, "timestamp"),
    last_traded_at: getStringProperty(json, "last_traded_at"),
    last_fetch_at: getStringProperty(json, "last_fetch_at"),
    is_anomaly: (json.getBool("is_anomaly") as JSON.Bool).valueOf(),
    is_stale: (json.getBool("is_stale") as JSON.Bool).valueOf(),
    trade_url: getStringProperty(json, "trade_url"),
    token_info_url: getNullableStringProperty(json, "token_info_url"),
    coin_id: getStringProperty(json, "coin_id"),
    target_coin_id: getNullableStringProperty(json, "target_coin_id"),
  };
}

function createPublicInterestStats(json: JSON.Obj): TokenInfoPublicInterestStats {
  const alexaRank = getNullableIntegerProperty<i32>(json, "alexa_rank");
  const bingMatches = getNullableIntegerProperty<i32>(json, "bing_matches");

  return {
    alexa_rank: alexaRank,
    bing_matches: bingMatches,
  };
}

export function tokenInfo(input: Input_tokenInfo): TokenInfo {
  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/" + input.id + "/contract/" + input.contract_address,
    request: {
      headers: [],
      urlParams: [],
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  }).unwrap();

  if (!response || response.status !== 200 || !response.body) {
    const errorMsg =
      response && response.statusText
        ? (response.statusText as string)
        : "An error occurred while fetching data from Coingecko API";
    throw new Error(errorMsg);
  }

  const json = <JSON.Obj>JSON.parse(response.body);

  return {
    id: getStringProperty(json, "id"),
    symbol: getStringProperty(json, "symbol"),
    name: getStringProperty(json, "name"),
    asset_platform_id: getStringProperty(json, "asset_platform_id"),
    platforms: createPlatformsArray(json.getObj("platforms") as JSON.Obj),
    block_time_in_minutes: getNullableIntegerProperty<i32>(json, "block_time_in_minutes"),
    hashing_algorithm: getNullableStringProperty(json, "hashing_algorithm"),
    categories: (json.getArr("categories") as JSON.Arr).valueOf().map<string>((v) => v.toString()),
    public_notice: getNullableStringProperty(json, "public_notice"),
    additional_notices: (json.getArr("additional_notices") as JSON.Arr)
      .valueOf()
      .map<string>((v) => v.toString()),
    localization: createLocaleTextPair(json.getObj("localization") as JSON.Obj),
    description: createLocaleTextPair(json.getObj("description") as JSON.Obj),
    links: createLinks(json.getObj("links") as JSON.Obj),
    image: {
      thumb: getStringProperty(json.getObj("image") as JSON.Obj, "thumb"),
      small: getStringProperty(json.getObj("image") as JSON.Obj, "small"),
      large: getStringProperty(json.getObj("image") as JSON.Obj, "large"),
    },
    country_origin: getStringProperty(json, "country_origin"),
    genesis_date: getNullableStringProperty(json, "genesis_date"),
    contract_address: getStringProperty(json, "contract_address"),
    sentiment_votes_up_percentage: getStringProperty(json, "sentiment_votes_up_percentage"),
    sentiment_votes_down_percentage: getStringProperty(json, "sentiment_votes_down_percentage"),
    market_cap_rank: getNullableIntegerProperty<i32>(json, "market_cap_rank"),
    coingecko_rank: getNullableIntegerProperty<i32>(json, "coingecko_rank"),
    coingecko_score: getStringProperty(json, "coingecko_score"),
    developer_score: getStringProperty(json, "developer_score"),
    community_score: getStringProperty(json, "community_score"),
    liquidity_score: getStringProperty(json, "liquidity_score"),
    public_interest_score: getStringProperty(json, "public_interest_score"),
    market_data: createMarketData(json.getObj("market_data") as JSON.Obj),
    community_data: createCommunityData(json.getObj("community_data") as JSON.Obj),
    developer_data: createDeveloperData(json.getObj("developer_data") as JSON.Obj),
    public_interest_stats: createPublicInterestStats(
      json.getObj("public_interest_stats") as JSON.Obj,
    ),
    status_updates: (json.getArr("status_updates") as JSON.Arr)
      .valueOf()
      .map<string>((v) => (v as JSON.Str).valueOf()),
    last_updated: (json.getString("last_updated") as JSON.Str).valueOf(),
    tickers: (json.getArr("tickers") as JSON.Arr)
      .valueOf()
      .map<TokenInfoTicker>((v: JSON.Value) => createTicker(v as JSON.Obj)),
  };
}

import { JSON } from "@web3api/wasm-as";

import { COINGECKO_API_URL } from "../config";
import {
  getIntegerProperty,
  getNullableIntegerProperty,
  getNullableStringProperty,
  getStringProperty,
} from "../utils";
import {
  CoinsId,
  CoinsIdMarketData,
  Description,
  HTTP_Query,
  HTTP_ResponseType,
  HTTP_UrlParam,
  Images,
  Input_coinsId,
  Language,
  Platforms,
  Sparkline,
  TokenInfoCommunityData,
  TokenInfoCurrencyDatePair,
  TokenInfoCurrencyPercentagePair,
  TokenInfoCurrencyPricePair,
  TokenInfoCurrencyVolumePair,
  TokenInfoDeveloperData,
  TokenInfoLinks,
  TokenInfoPublicInterestStats,
  TokenInfoTicker,
} from "../w3";

function createPlatforms(obj: JSON.Obj): Platforms[] {
  const platformsArray: Platforms[] = [];

  for (let i = 0; i < obj.keys.length; i++) {
    const name = obj.keys[i];
    const text = (obj.getString(`${name}`) as JSON.Str).toString();
    if (text) {
      platformsArray.push({
        name: name,
        address: text,
      });
    }
  }
  return platformsArray;
}

function createLocalization(obj: JSON.Obj): Language[] {
  const localizationArray: Language[] = [];

  for (let i = 0; i < obj.keys.length; i++) {
    const name = obj.keys[i];
    const text = (obj.getString(`${name}`) as JSON.Str).toString();
    if (text) {
      localizationArray.push({
        language: name,
        name: text,
      });
    }
  }
  return localizationArray;
}

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

function createSparkline(obj: JSON.Obj): Sparkline {
  const price = (obj.getArr("price") as JSON.Arr)
    .valueOf()
    .map<string>((value) => value.toString());
  return { price: price } as Sparkline;
}

function createMarketData(json: JSON.Obj): CoinsIdMarketData {
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
    sparkline_7d: json.getObj("sparkline_7d")
      ? createSparkline(json.getObj("sparkline_7d") as JSON.Obj)
      : null,
    last_updated: getStringProperty(json, "last_updated"),
  };
}

function createDescription(obj: JSON.Obj): Description[] {
  const descriptionArray: Description[] = [];

  for (let i = 0; i < obj.keys.length; i++) {
    const name = obj.keys[i];
    const text = (obj.getString(`${name}`) as JSON.Str).toString();
    if (text) {
      descriptionArray.push({
        language: name,
        description: text,
      });
    }
  }
  return descriptionArray;
}

function createImage(obj: JSON.Obj): Images {
  return {
    thumb: (obj.getString("thumb") as JSON.Str).toString(),
    small: (obj.getString("small") as JSON.Str).toString(),
    large: (obj.getString("large") as JSON.Str).toString(),
  } as Images;
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

export function coinsId(input: Input_coinsId): CoinsId {
  const urlParams: Array<HTTP_UrlParam> = [
    { key: "localization", value: input.localization ? (input.localization as string) : "" },
    {
      key: "tickers",
      value: input.tickers.isNull || input.tickers.value === true ? "true" : "false",
    },
    {
      key: "market_data",
      value: input.market_data.isNull || input.market_data.value === true ? "true" : "false",
    },
    {
      key: "community_data",
      value: input.community_data.isNull || input.community_data.value === true ? "true" : "false",
    },
    {
      key: "developer_data",
      value: input.developer_data.isNull || input.developer_data.value === true ? "true" : "false",
    },
    {
      key: "sparkline",
      value: input.sparkline.isNull || input.sparkline.value === false ? "false" : "true",
    },
  ];

  const response = HTTP_Query.get({
    url: COINGECKO_API_URL + "/coins/" + input.id,
    request: {
      headers: [],
      urlParams: urlParams,
      body: "",
      responseType: HTTP_ResponseType.TEXT,
    },
  });

  if (!response || response.status !== 200 || !response.body) {
    throw Error(response.statusText);
  }

  const json = <JSON.Obj>JSON.parse(response.body);

  return {
    id: input.market_data.isNull || input.market_data.value === true ? "true" : "false",
    symbol: input.tickers.isNull || input.tickers.value === true ? "true" : "false",
    name: (json.getString("name") as JSON.Str).toString(),
    asset_platform_id: (json.getValue("asset_platform_id") as JSON.Value).toString(),
    platforms: createPlatforms(json.getObj("platforms") as JSON.Obj),
    block_time_in_minutes: (json.getInteger("block_time_in_minutes") as JSON.Integer).toString(),
    hashing_algorithm: (json.getValue("hashing_algorithm") as JSON.Value).toString(),
    categories: (json.getArr("categories") as JSON.Arr)
      .valueOf()
      .map<string>((value) => value.toString()),
    public_notice: (json.getValue("public_notice") as JSON.Value).toString(),
    additional_notices: (json.getArr("additional_notices") as JSON.Arr)
      .valueOf()
      .map<string>((value) => value.toString()),
    localization: json.getObj("localization")
      ? createLocalization(json.getObj("localization") as JSON.Obj)
      : null,
    description: createDescription(json.getObj("description") as JSON.Obj),
    links: createLinks(json.getObj("links") as JSON.Obj),
    image: createImage(json.getObj("image") as JSON.Obj),
    country_origin: (json.getValue("country_origin") as JSON.Value).toString(),
    genesis_date: (json.getValue("genesis_date") as JSON.Value).toString(),
    sentiment_votes_up_percentage: (json.getValue(
      "sentiment_votes_up_percentage",
    ) as JSON.Value).toString(),
    sentiment_votes_down_percentage: (json.getValue(
      "sentiment_votes_down_percentage",
    ) as JSON.Value).toString(),
    market_cap_rank: (json.getInteger("market_cap_rank") as JSON.Integer).toString(),
    coingecko_rank: (json.getInteger("coingecko_rank") as JSON.Integer).toString(),
    coingecko_score: (json.getValue("coingecko_score") as JSON.Value).toString(),
    developer_score: (json.getValue("developer_score") as JSON.Value).toString(),
    community_score: (json.getValue("community_score") as JSON.Value).toString(),
    liquidity_score: (json.getValue("liquidity_score") as JSON.Value).toString(),
    public_interest_score: (json.getInteger("public_interest_score") as JSON.Integer).toString(),
    market_data: json.getObj("market_data")
      ? createMarketData(json.getObj("market_data") as JSON.Obj)
      : null,
    community_data: json.getObj("community_data")
      ? createCommunityData(json.getObj("community_data") as JSON.Obj)
      : null,
    developer_data: json.getObj("developer_data")
      ? createDeveloperData(json.getObj("developer_data") as JSON.Obj)
      : null,
    public_interest_stats: createPublicInterestStats(
      json.getObj("public_interest_stats") as JSON.Obj,
    ),
    status_updates: (json.getArr("status_updates") as JSON.Arr)
      .valueOf()
      .map<string>((v) => (v as JSON.Str).valueOf()),
    last_updated: (json.getString("last_updated") as JSON.Str).valueOf(),
    tickers: json.getArr("tickers")
      ? (json.getArr("tickers") as JSON.Arr)
          .valueOf()
          .map<TokenInfoTicker>((v: JSON.Value) => createTicker(v as JSON.Obj))
      : null,
  } as CoinsId;
}

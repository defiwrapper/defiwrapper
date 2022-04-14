import requests
from dataclasses import dataclass
from dataclasses_json import dataclass_json
from typing import List, Optional

@dataclass
class EventParam:
  name: str
  type: str
  indexed: bool
  decoded: bool
  value: str

@dataclass
class Event:
  name: str
  signature: str
  params: List[EventParam]


@dataclass
class EventLog:
  contractAddress: str
  logOffset: int
  topics: List[str]
  data: str
  event: Optional[Event]


@dataclass
class Pagination:
  total: int
  perPage: int
  page: int
  hasMore: bool

@dataclass
class GasInfo:
  offered: str  # Gas offered for the transaction
  spent: str  # Gas spent for the transaction
  price: str  # Gas price in wei (BigDecimal)
  quoteRate: str  # rate of native currency in quoted currency (BigDecimal)
  quote: str  # Gas price in quote currency (BigDecimal)

@dataclass
class Transaction:
  hash: str
  m_from: str
  to: str
  value: str  # BigDecimal
  quote: str  # BigDecimal
  gasInfo: GasInfo
  logs: List[EventLog]
  timestamp: str  # Timestamp of the transaction
  blockHeight: int  # Block height of the transaction
  offset: int

@dataclass_json
@dataclass
class TransactionsList:
  account: str
  network: str
  quoteCurrency: str
  transactions: List[Transaction]
  pagination: Pagination
  updatedAt: str
  nextUpdateAt: str


url = "https://api.covalenthq.com/v1/1/address/0xa79E63e78Eec28741e711f89A672A4C40876Ebf3/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=1&page-size=10&key=ckey_910089969da7451cadf38655ede"


res = requests.get(url)

data = res.json()

data = data["data"]

output = TransactionsList(
  account=data["address"],
  network=data["chain_id"],
  quoteCurrency=data["quote_currency"],
  transactions=[
    Transaction(
      hash=tx["tx_hash"],
      m_from=tx["from_address"],
      to=tx["to_address"],
      value=tx["value"],
      quote=tx["value_quote"],
      timestamp=tx["block_signed_at"],
      blockHeight=tx["block_height"],
      offset=tx["tx_offset"],
      gasInfo=GasInfo(
        offered=tx["gas_offered"],
        spent=tx["gas_spent"],
        price=tx["gas_price"],
        quoteRate=tx["gas_quote_rate"],
        quote=tx["gas_quote"],
      ),
      logs=[
        EventLog(
          contractAddress=log["sender_address"],
          logOffset=log["log_offset"],
          topics=log["raw_log_topics"],
          data=log["raw_log_data"],
          event=Event(
            name=log["decoded"]["name"],
            signature=log["decoded"]["signature"],
            params=[
              EventParam(
                name=param["name"],
                type=param["type"],
                indexed=param["indexed"],
                decoded=param["decoded"],
                value=param["value"],
              )
              for param in log["decoded"]["params"]
            ] if log["decoded"]["params"] else []
          )
        )
        for log in tx["log_events"]
      ] if tx["log_events"] else [],
    )
    for tx in data["items"]
  ] if data["items"] else [],
  pagination=Pagination(
    total=data["pagination"]["total_count"],
    perPage=data["pagination"]["page_size"],
    page=data["pagination"]["page_number"],
    hasMore=data["pagination"]["has_more"],
  ),
  updatedAt=data["updated_at"],
  nextUpdateAt=data["next_update_at"],
)

from pprint import pprint
print(output.to_json())
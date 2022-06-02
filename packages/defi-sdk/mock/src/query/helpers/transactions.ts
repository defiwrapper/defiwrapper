import { Transaction } from "../w3";
import { getApprovalTransaction } from "./events/approval";
import { getEmptyTransaction } from "./events/empty";
// import { getExchangeTransaction } from "./events/exchange";
import { getGravatarTransaction } from "./events/gravatar";
import { getTransferTransaction } from "./events/transfer";
import { randint } from "./random";

function getTransactionByChoice(choice: i32, address: string): Transaction {
  switch (choice) {
    case 0:
      return getApprovalTransaction(address);
    case 1:
      return getTransferTransaction(address);
    case 2:
      return getEmptyTransaction(address);
    case 3:
      return getGravatarTransaction(address);
    // case 4:
    //   return getExchangeTransaction(address);
    default:
      return getEmptyTransaction(address);
  }
}

function getRandomTransaction(address: string): Transaction {
  const choice = randint() % 4;
  return getTransactionByChoice(choice, address);
}

export function getNTransactions(num: i32, address: string): Array<Transaction> {
  const arr = new Array<Transaction>();
  for (let i = 0; i < 5; i++) {
    arr.push(getTransactionByChoice(i, address));
  }
  for (let i = 0; i < num - 5; i++) {
    arr.push(getRandomTransaction(address));
  }
  return arr;
}

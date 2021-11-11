import fs from "fs";

import { runCommand } from "./helpers/runCommand";

const argv = process.argv.slice(2);
const recipe = argv[0];

async function main(): Promise<void> {
  if (recipe) {
    await runCommand(`npx w3 query ./${recipe}/e2e.json`, false, `${__dirname}/endpoints`);
  } else {
    // eslint-disable-next-line no-shadow
    for (const recipe of fs.readdirSync(`${__dirname}/endpoints`)) {
      if (recipe.startsWith(".")) continue;
      await runCommand(`npx w3 query ./${recipe}/e2e.json`, false, `${__dirname}/endpoints`);
    }
  }
}

main()
  .then()
  .catch((err) => {
    console.error(err);
  });

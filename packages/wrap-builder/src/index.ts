#!/usr/bin/env node

import child_process from "child_process";
import { program } from "commander";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import util from "util";

const exec = util.promisify(child_process.exec);

let rawGitDiff = process.env.GIT_DIFF;

type DepsList = {
  uri: string;
  path: string;
  dependencies: { uri: string; path: string }[];
};

export async function _build(absPath: string): Promise<void> {
  console.log(`🛠️ Building ${absPath}`);
  const { stderr } = await exec(`npx w3 build`, { cwd: absPath });
  if (stderr) {
    console.error(`❌ Error building ${absPath}`);
    console.error(stderr);
    process.exit(1);
  }
  console.log(`✅ Successfully built ${absPath}`);
  return;
}

export async function build(buildPath: string): Promise<void> {
  const rootPath = path.resolve(__dirname, "..", "..", "..");
  const absPath = path.resolve(buildPath);

  if (!fs.existsSync(buildPath)) {
    throw new Error(`Path ${buildPath} does not exist`);
  }

  if (fs.statSync(buildPath).isFile()) {
    throw new Error(`Path ${buildPath} is a file`);
  }

  let depsList: DepsList | undefined;

  if (fs.existsSync(path.join(buildPath, "web3api.deps.yaml"))) {
    depsList = yaml.load(
      fs.readFileSync(path.join(buildPath, "web3api.deps.yaml"), "utf8"),
    ) as DepsList;
  }

  let depPaths: string[] = [];

  if (fs.existsSync(path.resolve(rootPath, "git.diff"))) {
    const diff = fs.readFileSync(path.resolve(rootPath, "git.diff"), "utf8");
    if (diff && diff.length) {
      rawGitDiff = diff;
    }
  }

  if (rawGitDiff) {
    const gitDiff = rawGitDiff
      .split(/[ \n\t]+/)
      .map((x) => path.resolve(rootPath, x.replace("'", "")));

    depPaths = depsList ? [...depsList.dependencies.map((x) => path.resolve(absPath, x.path))] : [];

    const comparePaths = [...depPaths, absPath];
    const isChanged = comparePaths.some((comparePath) =>
      gitDiff.some((diffPath) => !path.relative(comparePath, diffPath).trim().startsWith("..")),
    );

    if (!isChanged) {
      console.log(`🚫 Skipping build of ${absPath} because it is not changed`);
      return;
    }
  }

  for (const dep of depPaths) {
    if (fs.existsSync(dep)) {
      await build(dep);
    }
  }

  await _build(path.resolve(buildPath, absPath));
}

program.name("wrap-builder").description("Builds wrapper packages").version("0.1.0");

program
  .command("build")
  .description("Builds the wrapper packages")
  .argument("<string>", "Path to the package to build")
  // .option("-d, --diff-file <string>", "Path to the diff file")
  .action(async (buildPath: string) => {
    await build(buildPath);
  });

program.parse();

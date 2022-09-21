import { execSync } from "child_process";

export async function buildWrapper(wrapperAbsPath: string): Promise<void> {
  execSync(`yarn --cwd ${wrapperAbsPath} build`);
}

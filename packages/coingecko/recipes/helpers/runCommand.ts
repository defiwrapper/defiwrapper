/* eslint-disable no-console */
import { exec, ExecException } from "child_process";

export async function runCommand(command: string, quiet: boolean, cwd: string): Promise<void> {
  if (!quiet) {
    console.log(`> ${command}\n`);
  }

  return new Promise((resolve, reject) => {
    const callback = (err: ExecException | null, stdout: string, stderr: string): void => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout:\n${stdout}`);
          console.log(`stderr:\n${stderr}`);
        }

        resolve();
      }
    };

    exec(command, { cwd: cwd }, callback);
  });
}

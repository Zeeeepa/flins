import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Config = {
  packageManager: "sena" | "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};

const configAtom = atomWithStorage<Config>("config", {
  installationType: "cli",
  packageManager: "sena",
});

export function useConfig() {
  return useAtom(configAtom);
}

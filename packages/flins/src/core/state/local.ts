import { resolve } from "path";
import { existsSync, readFileSync, writeFileSync, rmSync } from "fs";
import type { LocalState, SkillEntry, SkillInstallation } from "@/types/state";
import type { InstallableType } from "@/types/skills";
import { skillKey, commandKey, findInstallations } from "@/utils/state";

const STATE_VERSION = "1.0.0";
const LOCAL_STATE_FILE = "skills.lock";

function getLocalStatePath(cwd?: string): string {
  const basePath = cwd || process.cwd();
  return resolve(basePath, LOCAL_STATE_FILE);
}

export function loadLocalState(cwd?: string): LocalState | null {
  const statePath = getLocalStatePath(cwd);

  if (!existsSync(statePath)) {
    return null;
  }

  try {
    const content = readFileSync(statePath, "utf-8");
    const state = JSON.parse(content) as LocalState;

    if (!state.version || !state.skills) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function saveLocalState(state: LocalState, cwd?: string): void {
  const statePath = getLocalStatePath(cwd);
  state.version = STATE_VERSION;
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

export function addLocalSkill(
  skillName: string,
  url: string,
  subpath: string | undefined,
  branch: string,
  commit: string,
  installableType: InstallableType,
  cwd?: string,
): { updated: boolean; previousBranch?: string } {
  let state = loadLocalState(cwd);

  if (!state) {
    state = {
      version: STATE_VERSION,
      skills: {},
    };
  }

  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);
  const existing = state.skills[key];

  let updated = false;
  let previousBranch: string | undefined;

  if (existing && existing.branch !== branch) {
    previousBranch = existing.branch;
    updated = true;
  }

  const entry: SkillEntry = {
    url,
    subpath,
    branch,
    commit,
  };

  state.skills[key] = entry;
  saveLocalState(state, cwd);
  return { updated, previousBranch };
}

export function removeLocalSkill(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): void {
  const state = loadLocalState(cwd);

  if (!state) {
    return;
  }

  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);
  delete state.skills[key];

  if (Object.keys(state.skills).length > 0) {
    saveLocalState(state, cwd);
  } else {
    const statePath = getLocalStatePath(cwd);
    if (existsSync(statePath)) {
      try {
        rmSync(statePath, { force: true });
      } catch {}
    }
  }
}

export function getLocalSkill(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): SkillEntry | null {
  const state = loadLocalState(cwd);
  if (!state) {
    return null;
  }

  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);

  return state.skills[key] || null;
}

export function updateLocalSkillCommit(
  skillName: string,
  installableType: InstallableType,
  commit: string,
  cwd?: string,
): void {
  const state = loadLocalState(cwd);

  if (!state) {
    return;
  }

  const key = installableType === "skill" ? skillKey(skillName) : commandKey(skillName);

  const skill = state.skills[key];
  if (skill) {
    skill.commit = commit;
    saveLocalState(state, cwd);
  }
}

export function getAllLocalSkills(cwd?: string): LocalState | null {
  return loadLocalState(cwd);
}

export function findLocalSkillInstallations(
  skillName: string,
  installableType: InstallableType,
  cwd?: string,
): SkillInstallation[] {
  return findInstallations(skillName, installableType, { type: "project", cwd });
}

export async function cleanOrphanedEntries(cwd?: string): Promise<void> {
  const state = loadLocalState(cwd);
  if (!state) return;

  const orphanedKeys: string[] = [];

  for (const [key, _entry] of Object.entries(state.skills)) {
    const parsed = key.split(":");
    if (parsed.length !== 2) continue;

    const installableType = parsed[0] === "skill" ? "skill" : "command";
    const name = parsed[1]!;
    const installations = findLocalSkillInstallations(name, installableType, cwd);

    if (installations.length === 0) {
      orphanedKeys.push(key);
    }
  }

  for (const key of orphanedKeys) {
    delete state.skills[key];
  }

  if (orphanedKeys.length > 0) {
    if (Object.keys(state.skills).length > 0) {
      saveLocalState(state, cwd);
    } else {
      const statePath = getLocalStatePath(cwd);
      if (existsSync(statePath)) {
        rmSync(statePath, { force: true });
      }
    }
  }
}

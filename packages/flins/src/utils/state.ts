import { join, resolve } from "path";
import { existsSync, readdirSync, lstatSync } from "fs";
import { expandHomeDir, getFlinsHomeDir } from "@/utils/paths";
import { skillKey, commandKey, type SkillInstallation, type Dirent } from "@/types/state";
import type { AgentType } from "@/types/agents";
import type { InstallableType } from "@/types/skills";
import { agents } from "@/core/agents/config";

interface FindInstallationsOptions {
  cwd?: string;
  type: "global" | "project";
}

export { skillKey, commandKey };

export function findInstallations(
  skillName: string,
  installableType: InstallableType,
  options: FindInstallationsOptions,
): SkillInstallation[] {
  const installations: SkillInstallation[] = [];
  const basePath =
    options.cwd ?? resolve(options.type === "global" ? getFlinsHomeDir() : process.cwd());

  for (const [agentType, agentConfig] of Object.entries(agents)) {
    if (installableType === "skill") {
      const skillsDirPath =
        options.type === "global"
          ? join(basePath, expandHomeDir(agentConfig.globalSkillsDir))
          : join(basePath, agentConfig.skillsDir);

      if (existsSync(skillsDirPath)) {
        try {
          const entries = readdirSync(skillsDirPath, { withFileTypes: true }) as Dirent[];
          const matchingEntry = entries.find((e) => {
            if (e.name.toLowerCase() !== skillName.toLowerCase()) {
              return false;
            }
            if (e.isDirectory()) {
              return true;
            }
            const fullPath = join(skillsDirPath, e.name);
            try {
              return lstatSync(fullPath).isSymbolicLink();
            } catch {
              return false;
            }
          });

          if (matchingEntry) {
            installations.push({
              agent: agentType as AgentType,
              installableType: "skill",
              type: options.type,
              path:
                options.type === "global"
                  ? join(agentConfig.globalSkillsDir, matchingEntry.name)
                  : join(agentConfig.skillsDir, matchingEntry.name),
            });
          }
        } catch {}
      }
    } else {
      const commandsDir =
        options.type === "global" ? agentConfig.globalCommandsDir : agentConfig.commandsDir;
      if (commandsDir) {
        const commandsDirPath =
          options.type === "global"
            ? join(basePath, expandHomeDir(commandsDir))
            : join(basePath, commandsDir);

        if (existsSync(commandsDirPath)) {
          try {
            const entries = readdirSync(commandsDirPath, { withFileTypes: true }) as Dirent[];
            const matchingEntry = entries.find((e) => {
              const baseName = e.name.replace(/\.md$/, "");
              return baseName.toLowerCase() === skillName.toLowerCase();
            });

            if (matchingEntry) {
              installations.push({
                agent: agentType as AgentType,
                installableType: "command",
                type: options.type,
                path: join(commandsDir, matchingEntry.name),
              });
            }
          } catch {}
        }
      }
    }
  }

  return installations;
}

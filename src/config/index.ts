import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
import type { AgentConfig, AgentType } from '../types/index.js';
import agentsConfig from './agents.json' with { type: 'json' };

const home = homedir();

export function loadAgentConfig(): Record<AgentType, AgentConfig> {
  const config: Record<AgentType, AgentConfig> = {};

  for (const [type, agent] of Object.entries(agentsConfig)) {
    const agentType = type as AgentType;

    config[agentType] = {
      name: agent.name,
      displayName: agent.displayName,
      skillsDir: agent.skillsDir,
      globalSkillsDir: agent.globalSkillsDir.replace('~', home),
      detectInstalled: async () => {
        const globalDir = agent.globalSkillsDir.replace('~', home);
        return existsSync(globalDir);
      },
    };
  }

  return config;
}

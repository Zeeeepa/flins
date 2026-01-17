import { test, expect, describe } from 'bun:test';
import { agents, detectInstalledAgents } from '../../../src/core/agents/index.js';

describe('agents', () => {
  test('agents object should exist', () => {
    expect(agents).toBeDefined();
    expect(typeof agents).toBe('object');
  });

  test('agents should have expected properties', () => {
    expect(agents.opencode).toBeDefined();
    expect(agents['claude-code']).toBeDefined();
    expect(agents.cursor).toBeDefined();
    expect(agents.copilot).toBeDefined();
    expect(agents.gemini).toBeDefined();
    expect(agents.windsurf).toBeDefined();
  });

  test('agent config should have required properties', () => {
    const agent = agents.opencode;
    expect(agent.name).toBe('opencode');
    expect(agent.displayName).toBe('OpenCode');
    expect(agent.skillsDir).toBeDefined();
    expect(agent.globalSkillsDir).toBeDefined();
    expect(agent.detectInstalled).toBeDefined();
    expect(typeof agent.detectInstalled).toBe('function');
  });

  test('detectInstalledAgents should return an array', async () => {
    const result = await detectInstalledAgents();
    expect(Array.isArray(result)).toBe(true);
  });
});

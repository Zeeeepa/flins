import { test, expect, describe, beforeAll, afterAll } from 'bun:test';
import { mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { loadLocalState, saveLocalState, addLocalSkill, removeLocalSkill, getLocalSkill } from '../../../src/core/state/local.js';
import type { LocalState } from '../../../src/types/index.js';

describe('state', () => {
  let testDir: string;

  beforeAll(() => {
    testDir = mkdtempSync(join(tmpdir(), 'test-state-'));
  });

  afterAll(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  test('loadLocalState should return null for non-existent file', () => {
    const result = loadLocalState(testDir);
    expect(result).toBe(null);
  });

  test('saveLocalState should create state file', () => {
    const state: LocalState = {
      version: '1.0.0',
      skills: {},
    };

    saveLocalState(state, testDir);
    const result = loadLocalState(testDir);
    expect(result).not.toBe(null);
    expect(result?.version).toBe('1.0.0');
  });

  test('addLocalSkill should add skill to state', () => {
    const result = addLocalSkill(
      'test-skill',
      'https://github.com/owner/repo.git',
      undefined,
      'main',
      'abc123',
      testDir
    );

    expect(result.updated).toBe(false);
    expect(result.previousBranch).toBe(undefined);

    const skill = getLocalSkill('test-skill', testDir);
    expect(skill).not.toBe(null);
    expect(skill?.url).toBe('https://github.com/owner/repo.git');
    expect(skill?.branch).toBe('main');
    expect(skill?.commit).toBe('abc123');
  });

  test('removeLocalSkill should remove skill from state', () => {
    removeLocalSkill('test-skill', testDir);
    const skill = getLocalSkill('test-skill', testDir);
    expect(skill).toBe(null);
  });
});

import { test, expect, describe } from 'bun:test';
import { isValidSkillInstallation } from '../../../src/utils/validation.js';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('validation', () => {
  test('isValidSkillInstallation should return false for non-existent path', () => {
    const result = isValidSkillInstallation('/non/existent/path');
    expect(result).toBe(false);
  });

  test('isValidSkillInstallation should return false for empty directory', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'test-'));
    try {
      const result = isValidSkillInstallation(tempDir);
      expect(result).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('isValidSkillInstallation should return true for directory with SKILL.md', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'test-'));
    try {
      writeFileSync(join(tempDir, 'SKILL.md'), '# Test Skill');
      const result = isValidSkillInstallation(tempDir);
      expect(result).toBe(true);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('isValidSkillInstallation should return false for directory without SKILL.md', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'test-'));
    try {
      writeFileSync(join(tempDir, 'README.md'), '# Test');
      const result = isValidSkillInstallation(tempDir);
      expect(result).toBe(false);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

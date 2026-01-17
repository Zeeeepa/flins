import { test, expect, describe } from 'bun:test';
import { spawn } from 'child_process';
import { join } from 'path';

describe('CLI', () => {
  test('give-skill --help should show help', async () => {
    const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve) => {
      const proc = spawn('bun', ['run', join(__dirname, '../../src/index.ts'), '--help'], {
        cwd: join(__dirname, '../..'),
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        resolve({ stdout, stderr, exitCode: code ?? 0 });
      });
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('give-skill');
    expect(result.stdout).toContain('Install skills onto coding agents');
  });

  test('give-skill --version should show version', async () => {
    const result = await new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve) => {
      const proc = spawn('bun', ['run', join(__dirname, '../../src/index.ts'), '--version'], {
        cwd: join(__dirname, '../..'),
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        resolve({ stdout, stderr, exitCode: code ?? 0 });
      });
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

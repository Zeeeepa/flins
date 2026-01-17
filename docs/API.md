# API Reference

## CLI Commands

### Install Command

```bash
give-skill <source> [options]
```

**Arguments:**
- `<source>` - Git repo URL, GitHub shorthand (owner/repo), or direct path to skill

**Options:**
- `-g, --global` - Install skill globally (user-level) instead of project-level
- `-a, --agent <agents...>` - Specify agents to install to (windsurf, gemini, claude-code, cursor, copilot, etc.)
- `-s, --skill <skills...>` - Specify skill names to install (skip selection prompt)
- `-l, --list` - List available skills in the repository without installing
- `-y, --yes` - Skip confirmation prompts

**Examples:**
```bash
# Install from GitHub shorthand
give-skill owner/repo

# Install globally
give-skill owner/repo --global

# Install to specific agents
give-skill owner/repo --agent windsurf --agent gemini

# Install specific skill
give-skill owner/repo --skill my-skill

# List available skills
give-skill owner/repo --list
```

### Update Command

```bash
give-skill update [skills...]
```

**Arguments:**
- `[skills...]` - Optional list of skill names to update (if omitted, updates all skills)

**Options:**
- `-y, --yes` - Skip confirmation prompts

**Examples:**
```bash
# Update all skills
give-skill update

# Update specific skills
give-skill update skill1 skill2
```

### Status Command

```bash
give-skill status [skills...]
```

**Arguments:**
- `[skills...]` - Optional list of skill names to check (if omitted, checks all skills)

**Options:**
- `-v, --verbose` - Show detailed information including installation paths

**Examples:**
```bash
# Check status of all skills
give-skill status

# Check status of specific skills
give-skill status skill1 skill2

# Check with verbose output
give-skill status --verbose
```

### Remove Command

```bash
give-skill remove [skills...]
```

**Arguments:**
- `[skills...]` - Optional list of skill names to remove (if omitted, prompts for selection)

**Options:**
- `-y, --yes` - Skip confirmation prompts

**Examples:**
```bash
# Remove specific skills
give-skill remove skill1 skill2

# Remove with confirmation
give-skill remove skill1
```

### List Command

```bash
give-skill list
```

Lists all installed skills (both global and project-level).

### Clean Command

```bash
give-skill clean
```

Removes orphaned skill entries from state (skills that were deleted but still tracked).

## Programmatic API

### Installation

```typescript
import { performInstallation } from './install-service.js';

const result = await performInstallation('owner/repo', {
  global: false,
  agent: ['windsurf'],
  skill: ['my-skill'],
  yes: true,
});

console.log(result);
// {
//   success: boolean,
//   installed: number,
//   failed: number,
//   results: Array<{ skill: string; agent: string; success: boolean; path: string; error?: string }>
// }
```

### Status Checking

```typescript
import { checkStatus, displayStatus } from './update-service.js';

const results = await checkStatus(['skill1', 'skill2']);
await displayStatus(results, true);
```

### Updating Skills

```typescript
import { performUpdate } from './update-service.js';

const results = await performUpdate(['skill1', 'skill2'], { yes: true });
```

### Removing Skills

```typescript
import { performRemove, listRemovableSkills } from './remove-service.js';

await listRemovableSkills();
const results = await performRemove(['skill1', 'skill2'], { yes: true });
```

### Cleaning Orphaned Entries

```typescript
import { cleanOrphaned } from './update-service.js';

await cleanOrphaned();
```

## Type Definitions

### AgentType

```typescript
type AgentType = 'opencode' | 'claude-code' | 'codex' | 'cursor' | 'amp' | 'kilo' | 'roo' | 'goose' | 'antigravity' | 'copilot' | 'gemini' | 'windsurf' | 'trae' | 'factory' | 'letta';
```

### Skill

```typescript
interface Skill {
  name: string;
  description: string;
  path: string;
  metadata?: Record<string, string>;
}
```

### AgentConfig

```typescript
interface AgentConfig {
  name: string;
  displayName: string;
  skillsDir: string;
  globalSkillsDir: string;
  detectInstalled: () => Promise<boolean>;
}
```

### SkillState

```typescript
interface SkillState {
  url: string;
  subpath?: string;
  branch: string;
  commit: string;
  installations: SkillInstallation[];
}
```

### SkillInstallation

```typescript
interface SkillInstallation {
  agent: AgentType;
  type: 'global' | 'project';
  path: string;
}
```

## Error Handling

All functions return results with success/failure information. Check the `success` property to determine if the operation succeeded.

```typescript
const result = await performInstallation('owner/repo', {});
if (!result.success) {
  console.error('Installation failed');
  console.error(result.results.filter(r => !r.success));
}
```

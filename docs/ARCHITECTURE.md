# Architecture

## Overview

The give-skill project follows a layered architecture pattern with clear separation of concerns. This makes the codebase maintainable, testable, and scalable.

## Architecture Layers

### 1. CLI Layer (`src/cli/`)

The CLI layer is the entry point for users. It handles:
- Command-line argument parsing with Commander
- User interaction with @clack/prompts
- Command routing to appropriate services

**Files:**
- `index.ts` - Main entry point, sets up commander and routes commands
- `commands/` - Command definitions for each operation
- `prompts.ts` - Interactive prompt utilities (optional, can be added later)

### 2. Services Layer (`src/services/`)

The services layer orchestrates business logic and coordinates between core modules.

**Files:**
- `install.ts` - Installation service (skill selection, agent selection, installation)
- `update.ts` - Update service (status checking, updating skills)
- `remove.ts` - Remove service (removing skills, listing skills)
- `status.ts` - Status service (checking skill status)

### 3. Core Layer (`src/core/`)

The core layer contains domain-specific business logic.

**Subdirectories:**
- `agents/` - Agent management (configuration, detection)
- `skills/` - Skill management (discovery, parsing)
- `git/` - Git operations (parsing, cloning)
- `state/` - State management (global and local state)

### 4. Infrastructure Layer (`src/infrastructure/`)

The infrastructure layer handles external dependencies and I/O operations.

**Files:**
- `file-system.ts` - File system operations (installing skills, checking installations)
- `git-client.ts` - Git client wrapper (cloning, getting commits)

### 5. Types Layer (`src/types/`)

Type definitions for the entire application.

**Files:**
- `index.ts` - Export all types
- `agents.ts` - Agent-related types
- `skills.ts` - Skill-related types
- `state.ts` - State-related types
- `git.ts` - Git-related types

### 6. Utilities Layer (`src/utils/`)

Shared utilities used across the application.

**Files:**
- `index.ts` - Export all utilities
- `validation.ts` - Validation utilities
- `paths.ts` - Path resolution utilities
- `formatting.ts` - Formatting utilities

### 7. Configuration Layer (`src/config/`)

Configuration management for the application.

**Files:**
- `index.ts` - Config loader
- `agents.json` - Agent configurations (externalized from code)

## Data Flow

```
User → CLI → Service → Core → Infrastructure → File System/Git
```

## Key Design Patterns

### 1. Service Pattern
Each service focuses on a single responsibility and orchestrates between core modules.

### 2. Dependency Injection
Core modules are imported and used by services, allowing for easy testing and mocking.

### 3. Configuration Externalization
Agent configurations are moved to JSON files, making it easier to add new agents without modifying code.

### 4. Type Safety
TypeScript is used throughout with strict type checking.

## Testing Strategy

### Unit Tests
- Located in `tests/unit/`
- Test individual functions and modules
- Mock external dependencies

### Integration Tests
- Located in `tests/integration/`
- Test end-to-end workflows
- Verify CLI commands work correctly

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: Easy to test individual components
3. **Maintainability**: Changes are localized to specific layers
4. **Scalability**: Easy to add new features or agents
5. **Type Safety**: Full TypeScript support with strict typing

## Future Improvements

1. Add a plugin system for custom agents
2. Add telemetry/metrics collection
3. Add a dry-run mode for all commands
4. Add support for skill dependencies
5. Add a skill registry/index feature

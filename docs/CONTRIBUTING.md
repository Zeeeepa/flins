# Contributing to give-skill

Thank you for your interest in contributing to give-skill! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (version 1.0 or higher)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/anythinglabs/give-skill.git
cd give-skill

# Install dependencies
bun install

# Verify installation
bun run build
```

## Development Workflow

### Running Tests

```bash
# Run all tests
bun test

# Run specific test files
bun test tests/unit/core/agents.test.ts
bun test tests/integration/cli.test.ts

# Run tests with coverage
bun test --coverage
```

### Building

```bash
# Build the project
bun run build

# Build and watch for changes
bun run build --watch
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
# Check code style
bun run lint

# Fix code style issues
bun run lint:fix

# Format code
bun run format
```

## Project Structure

The project follows a layered architecture:

```
src/
├── cli/           # CLI layer (commands, prompts)
├── core/          # Core domain logic (agents, skills, git, state)
├── services/      # Business logic orchestration
├── infrastructure/# External dependencies (file system, git)
├── types/         # Type definitions
├── utils/         # Shared utilities
└── config/        # Configuration
```

## Adding a New Agent

### Option 1: Update Configuration (Recommended)

1. Edit `src/config/agents.json` to add the new agent configuration
2. The agent will be automatically detected and available

### Option 2: Update Code (If needed for custom detection logic)

1. Add the agent to `src/config/agents.json`
2. Update the `detectInstalled` function in `src/config/index.ts` if needed

## Adding a New Feature

### 1. Plan the Feature

- Create an issue describing the feature
- Discuss the design with maintainers

### 2. Implement the Feature

- Follow the existing code structure
- Add tests for new functionality
- Update documentation

### 3. Submit a Pull Request

- Create a feature branch: `git checkout -b feature/your-feature-name`
- Commit your changes: `git commit -m "feat: add your feature"`
- Push to your fork: `git push origin feature/your-feature-name`
- Open a pull request

## Testing Guidelines

### Unit Tests

- Test individual functions and modules
- Mock external dependencies
- Use `bun:test` for assertions

### Integration Tests

- Test end-to-end workflows
- Use the actual CLI commands
- Verify output and exit codes

### Example Test

```typescript
import { test, expect, describe } from 'bun:test';
import { yourFunction } from '../src/your-module.js';

describe('yourModule', () => {
  test('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected');
  });
});
```

## Pull Request Guidelines

### Title

Use conventional commits format:
- `feat: add new feature`
- `fix: fix a bug`
- `docs: update documentation`
- `test: add tests`
- `refactor: refactor code`

### Description

- Clearly describe the changes
- Reference any related issues
- Include screenshots if applicable
- Update documentation if needed

### Checklist

- [ ] Tests pass (`bun test`)
- [ ] Code style passes (`bun run lint`)
- [ ] Documentation updated
- [ ] No breaking changes (unless intentional)

## Code of Conduct

Please be respectful and constructive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## Getting Help

- Open an issue on GitHub
- Join our discussions on GitHub
- Check the [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Check the [API.md](./API.md) for API documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

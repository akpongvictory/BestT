# Contributing Guidelines for BestT

Welcome to the BestT development team! To maintain high code quality, security, and clean architecture across our monorepo, all developers and AI agents must adhere to the guidelines outlined below.

---

## 1. Before Making Any Changes

- **Read `AGENTS.md`**: Before making any major changes or implementing features, you **MUST** read [docs/AGENTS.md](file:///C:/Users/hp%20pc/.gemini/antigravity/scratch/bestt/docs/AGENTS.md) and review all relevant system specifications in [/docs](file:///C:/Users/hp%20pc/.gemini/antigravity/scratch/bestt/docs).
- **Architecture Documentation Updates**: If your feature modifies system architecture, database schemas, or API routes, you **MUST** update the corresponding documentation files in `/docs` prior to submitting your work.

---

## 2. Branch Naming Convention

All branches must follow a structured naming pattern that references the corresponding task ID:

- **Features**: `feature/BT-<task_id>-<short-description>` (e.g., `feature/BT-001-init-foundation`)
- **Bug Fixes**: `fix/BT-<task_id>-<short-description>` (e.g., `fix/BT-012-fix-auth-cors`)
- **Refactoring**: `refactor/BT-<task_id>-<short-description>` (e.g., `refactor/BT-005-ai-service`)
- **Documentation**: `docs/BT-<task_id>-<short-description>` (e.g., `docs/BT-002-update-arch`)
- **Maintenance / Chores**: `chore/BT-<task_id>-<short-description>` (e.g., `chore/BT-001-setup-eslint`)

---

## 3. Commit Message Convention

We follow standard **Conventional Commits** integrated with ticket IDs:

### Format:
`<type>(<scope>): [BT-<task_id>] <short summary in present tense>`

### Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style / formatting (whitespace, formatting, semi-colons, etc.)
- `refactor`: Refactoring production code without changing functionality
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates, or tool configuration

### Examples:
- `feat(server): [BT-001] Add backend health check endpoint`
- `feat(client): [BT-001] Create initial React landing page`
- `docs(repo): [BT-001] Add CONTRIBUTING.md guidelines`
- `fix(prisma): [BT-003] Correct DocumentChunk relation schema`

---

## 4. Feature Development Process

Follow this systematic step-by-step workflow for all tasks:

1. **Understand & Review**:
   - Read the task ticket in `/project-management/`.
   - Inspect existing specs in `/docs/` and `/packages/`.

2. **Branch Creation**:
   - Create a clean branch from `main` adhering to the branch naming rules.

3. **Implementation**:
   - Write clean, modular, typed code in TypeScript.
   - Keep business logic inside domain services (not in Express controllers or React UI components).
   - Ensure environment variables are used for configurations (never hardcode secrets or API keys).

4. **Lint & Format**:
   - Run `npm run lint` and `npm run format` across the workspace before staging files.

5. **Verification**:
   - Verify code builds cleanly (`npm run build`).
   - Run tests or manual verification scripts.

6. **Pull Request & Documentation**:
   - Open a PR targeting `main`.
   - Ensure all matching architecture specs in `/docs/` are updated.

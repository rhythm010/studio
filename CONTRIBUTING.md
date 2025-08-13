# Contributing to Companion Studio

> **Coding Standards (Must Read and folloq!)**
> - **NEVER OVER ENGINEER. Always write mimimum and clean code to perform a task.** Do not make changes at places which are out of scope of prompt
> - **only touch part of the code which is under the scope of the prompt and DO NOT try to fix issues without asking**
> - **Break down complex logic.** If a line or block is hard to follow, split it into smaller, named parts or helper functions.
> - **Double-check your logic.** Review your implementation at least twice to ensure correctness and clarity.
> - **Ask for clarification where needed.** If you are ever unsure about a requirement or prompt, ask before proceeding.


Thank you for considering contributing to this project! To maintain code quality and consistency, please follow these guidelines:

## 1. Code Style & Standards
- **Language:** TypeScript/JavaScript (React, Next.js)
- **Formatting:** Use [Prettier](https://prettier.io/) for code formatting. Run `npm run format` before committing.
- **Linting:** Fix all [ESLint](https://eslint.org/) errors and warnings. Run `npm run lint` before submitting a PR.
- **Naming:**
  - Use `camelCase` for variables and functions.
  - Use `PascalCase` for React components and types.
  - Use `UPPER_SNAKE_CASE` for constants.
  - Always name variables, constants and methods logically so that its easy to know what it does.
- **Imports:** Group external imports first, then internal modules, then styles/assets.
- **Comments:**
  - Use clear, concise comments for complex logic.
  - JSDoc for exported functions/components is encouraged.
- **React:**
  - Use functional components and hooks.
  - Prefer explicit types for props and state.
  - Avoid inline styles unless necessary; use CSS modules or Tailwind.

## 2. Commit Messages
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: Add new feature`
  - `fix: Fix a bug`
  - `docs: Update documentation`
  - `refactor: Code refactoring`
  - `test: Add or update tests`
  - `chore: Maintenance tasks`
- Keep messages concise and descriptive.

## 3. Pull Request Process
- Fork the repository and create your branch from `master`.
- Ensure your branch is up to date with `master` before submitting a PR.
- Reference related issues or feature requests in your PR description.
- Add screenshots or screen recordings for UI changes.
- Ensure all checks pass (CI, lint, tests) before requesting review.

## 4. Code Review
- Be open to feedback and requested changes.
- Review other PRs when possible.
- Ensure your code is modular and reusable.
- Remove unused code and files.

## 5. Automated Tools
- **Linting:** Configured via `.eslintrc`.
- **Formatting:** Configured via `.prettierrc`.
- **Type Checking:** Use TypeScript for all new code.

## 6. Additional Guidelines
- Keep functions/components small and focused.
- Prefer utility functions for repeated logic.
- Alwayd prefer readability over concise logic
- Update documentation as needed (`README.md`, `docs/`).
- If something can be reused or is used at miltiple places, create a util or use an existing util method

---

For any questions, open an issue or ask in the project discussions. Thank you for helping make Companion Studio better! 
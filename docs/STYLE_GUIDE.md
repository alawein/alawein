---
title: 'Documentation Style Guide'
last_verified: 2025-12-09
owner: '@alawein'
status: active
---

# Documentation Style Guide

This guide establishes standards for all documentation in the Alawein monorepo.

## Table of Contents

- [File Naming](#file-naming)
- [Frontmatter](#frontmatter)
- [Markdown Conventions](#markdown-conventions)
- [Code Examples](#code-examples)
- [Terminology](#terminology)
- [Formatting Standards](#formatting-standards)
- [Images and Assets](#images-and-assets)

## File Naming

### Documentation Files

| Type    | Convention           | Example          |
| ------- | -------------------- | ---------------- |
| Guides  | SCREAMING_SNAKE_CASE | `STYLE_GUIDE.md` |
| READMEs | Uppercase            | `README.md`      |
| Indexes | Lowercase            | `index.md`       |

### Directories

| Type       | Convention | Example            |
| ---------- | ---------- | ------------------ |
| Categories | kebab-case | `getting-started/` |
| Assets     | lowercase  | `assets/`          |

### Source Code Files

| Type       | Convention                | Example            |
| ---------- | ------------------------- | ------------------ |
| Components | PascalCase                | `Button.tsx`       |
| Hooks      | camelCase with use prefix | `useAuth.ts`       |
| Utilities  | camelCase                 | `formatDate.ts`    |
| Constants  | SCREAMING_SNAKE_CASE      | `API_ENDPOINTS.ts` |
| Types      | PascalCase                | `UserTypes.ts`     |
| Tests      | Same as source + .test    | `Button.test.tsx`  |

## Frontmatter

All documentation files should include YAML frontmatter:

```yaml
---
title: Document Title
last_verified: 2025-12-09
owner: '@alawein'
status: active
tags:
  - guide
  - development
---
```

### Required Fields

| Field           | Description            | Values                          |
| --------------- | ---------------------- | ------------------------------- |
| `title`         | Document title         | String                          |
| `last_verified` | Last review date       | YYYY-MM-DD                      |
| `owner`         | Responsible maintainer | GitHub username                 |
| `status`        | Document status        | `active`, `draft`, `deprecated` |

### Optional Fields

| Field     | Description         |
| --------- | ------------------- |
| `tags`    | Categorization tags |
| `version` | Document version    |
| `related` | Related documents   |

## Markdown Conventions

### Headings

- Use ATX-style headers (`#`)
- Only one H1 per document (the title)
- Don't skip heading levels
- Use sentence case for headings

```markdown
# Document Title

## Main Section

### Subsection

#### Detail Section
```

### Lists

- Use `-` for unordered lists
- Use `1.` for ordered lists
- Indent nested lists with 2 spaces

```markdown
- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

1. First step
2. Second step
3. Third step
```

### Links

- Use descriptive link text
- Prefer relative links for internal docs
- Use reference-style links for repeated URLs

```markdown
See the [Contributing Guide](../CONTRIBUTING.md) for details.

Check the [API Reference][api-ref] for endpoint documentation.

[api-ref]: ./api/API_REFERENCE.md
```

### Tables

- Use tables for structured data
- Align columns for readability
- Include header row

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

## Code Examples

### Fenced Code Blocks

Always specify the language:

```typescript
// TypeScript example
const greeting: string = 'Hello, World!';
console.log(greeting);
```

```bash
# Shell command example
npm install
npm run dev
```

### Code Example Guidelines

1. **Use realistic examples** - Show actual use cases
2. **Include imports** - Show necessary imports
3. **Add comments** - Explain complex logic
4. **Handle errors** - Show error handling
5. **Keep it concise** - Focus on the concept

### Good Example

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/api/users';

// Fetch user data with React Query
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Refetch every 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
```

### Bad Example

```typescript
// Too vague, missing context
const data = useQuery(['user'], fn);
```

## Terminology

Use consistent terminology throughout documentation:

| Use           | Don't Use            | Reason                 |
| ------------- | -------------------- | ---------------------- |
| Platform      | App, Application     | Consistent naming      |
| Monorepo      | Mono-repo, mono repo | Standard spelling      |
| Edge Function | Serverless function  | Supabase terminology   |
| Vitest        | Jest                 | Current test framework |
| React Query   | TanStack Query       | Common name            |
| TypeScript    | Typescript, TS       | Proper capitalization  |
| npm           | NPM                  | Official styling       |
| GitHub        | Github, github       | Official styling       |

### Platform Names

Always capitalize platform names:

- SimCore (not simcore)
- REPZ (all caps)
- QMLab (not qmlab)
- LiveItIconic (not liveiticonic)
- LLMWorks (not llmworks)
- Attributa (not attributa)

## Formatting Standards

### Emphasis

- Use **bold** for important terms on first use
- Use _italics_ for emphasis or technical terms
- Use `code` for inline code, commands, file names

### Callouts

Use blockquotes for callouts:

> **Note**: Important information the reader should know.

> **Warning**: Potential issues or breaking changes.

> **Tip**: Helpful suggestions or best practices.

### File Paths

Use code formatting for file paths:

- Configuration is in `package.json`
- Components are in `src/components/`
- Tests are in `tests/`

### Commands

Use code blocks for commands:

```bash
npm run dev
```

For inline commands, use code formatting: Run `npm install` to install
dependencies.

## Images and Assets

### Image Guidelines

1. **Use descriptive alt text** - Always include alt text
2. **Optimize file size** - Compress images before adding
3. **Use SVG for diagrams** - Scalable and small file size
4. **Store in docs/assets/** - Centralized location

### Image Syntax

```markdown
![Architecture Diagram](./assets/architecture.svg)

![Component Hierarchy](./assets/component-hierarchy.png 'Component Structure')
```

### Asset Organization

```
docs/assets/
├── diagrams/
│   ├── architecture.svg
│   └── component-hierarchy.svg
├── screenshots/
│   └── dashboard.png
└── icons/
    └── logo.svg
```

## Document Structure

### Standard Document Template

```markdown
# Document Title

Brief description of what this document covers.

## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)

## Section 1

Content for section 1.

## Section 2

Content for section 2.

## Section 3

Content for section 3.

## Related Documents

- [Related Doc 1](./RELATED_1.md)
- [Related Doc 2](./RELATED_2.md)
```

## Review Checklist

Before submitting documentation:

- [ ] Frontmatter is complete and accurate
- [ ] All links are working
- [ ] Code examples are tested
- [ ] Images have alt text
- [ ] Terminology is consistent
- [ ] Spelling and grammar checked
- [ ] File naming follows conventions

## Related Documents

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [GLOSSARY.md](./GLOSSARY.md) - Term definitions
- [CHANGELOG_GUIDE.md](./CHANGELOG_GUIDE.md) - Changelog format

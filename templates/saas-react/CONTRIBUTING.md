# Contributing Guidelines

## Code Standards

### Commit Messages
Follow Conventional Commits format:
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Code Quality
- TypeScript strict mode required
- No `any` types (use `unknown`)
- 100 character line limit
- Comprehensive error handling
- Unit tests for new features

### Security
- No hardcoded credentials
- Input validation required
- CSRF protection for state-changing operations
- XSS prevention in user inputs

### Pull Requests
1. Create feature branch from `main`
2. Write tests
3. Update documentation
4. Pass all CI checks
5. Request review

### Pre-commit Hooks
Automatically runs:
- ESLint
- Prettier
- Type checking
- Unit tests

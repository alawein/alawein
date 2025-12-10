# Third-Party Licenses

This document lists the third-party dependencies used in this project and their
licenses.

---

## Runtime Dependencies

### JavaScript/TypeScript

| Package         | License | Purpose               |
| --------------- | ------- | --------------------- |
| React           | MIT     | UI Framework          |
| Next.js         | MIT     | React Framework       |
| Supabase JS     | MIT     | Database Client       |
| Stripe JS       | MIT     | Payment Processing    |
| Tailwind CSS    | MIT     | Utility-first CSS     |
| Radix UI        | MIT     | Accessible Components |
| Lucide React    | ISC     | Icon Library          |
| Zod             | MIT     | Schema Validation     |
| React Query     | MIT     | Data Fetching         |
| React Hook Form | MIT     | Form Management       |

### Python

| Package  | License      | Purpose              |
| -------- | ------------ | -------------------- |
| NumPy    | BSD-3-Clause | Numerical Computing  |
| SciPy    | BSD-3-Clause | Scientific Computing |
| Pandas   | BSD-3-Clause | Data Analysis        |
| PyYAML   | MIT          | YAML Parsing         |
| Requests | Apache-2.0   | HTTP Client          |

---

## Development Dependencies

| Package    | License    | Purpose              |
| ---------- | ---------- | -------------------- |
| TypeScript | Apache-2.0 | Type Checking        |
| ESLint     | MIT        | Code Linting         |
| Prettier   | MIT        | Code Formatting      |
| Vitest     | MIT        | Unit Testing         |
| Playwright | Apache-2.0 | E2E Testing          |
| Turbo      | MPL-2.0    | Monorepo Build       |
| tsx        | MIT        | TypeScript Execution |

---

## Infrastructure Services

| Service  | Terms                                                                                | Data Processing     |
| -------- | ------------------------------------------------------------------------------------ | ------------------- |
| Supabase | [Terms](https://supabase.com/terms)                                                  | Yes (DPA available) |
| Vercel   | [Terms](https://vercel.com/legal/terms)                                              | Yes                 |
| Stripe   | [Terms](https://stripe.com/legal)                                                    | Yes (PCI compliant) |
| GitHub   | [Terms](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) | Yes                 |

---

## AI/ML Services

| Service   | Terms                                | Usage               |
| --------- | ------------------------------------ | ------------------- |
| OpenAI    | [Terms](https://openai.com/terms)    | API for AI features |
| Anthropic | [Terms](https://anthropic.com/terms) | API for AI features |

**Note**: AI service outputs may be subject to additional terms. Review provider
policies for production use.

---

## License Compatibility

### Allowed Licenses

These licenses are compatible with our projects:

- ✅ MIT
- ✅ Apache-2.0
- ✅ BSD-3-Clause
- ✅ BSD-2-Clause
- ✅ ISC
- ✅ 0BSD
- ✅ Unlicense

### Requires Review

These licenses require legal review before use:

- ⚠️ MPL-2.0 (file-level copyleft)
- ⚠️ LGPL (linking considerations)
- ⚠️ CC-BY-4.0 (attribution requirements)

### Not Allowed

These licenses are not compatible with proprietary projects:

- ❌ GPL-3.0
- ❌ AGPL-3.0
- ❌ GPL-2.0

---

## Attribution Requirements

Some licenses require attribution. Include the following in your application's
about/credits section:

```
This software uses the following open source packages:
- React (MIT License) - Copyright (c) Meta Platforms, Inc.
- Next.js (MIT License) - Copyright (c) Vercel, Inc.
- Tailwind CSS (MIT License) - Copyright (c) Tailwind Labs, Inc.
[Additional packages as needed]
```

---

## Updating This Document

Run the license checker to identify new dependencies:

```bash
npm run compliance:licenses
```

Review and update this document quarterly or when adding significant new
dependencies.

---

_Last Updated: December 2024_ _Generated with assistance from license-checker_

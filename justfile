set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

default:
    @just --list

lint:
    npm exec --yes --package=markdownlint-cli2@0.23.2 -- markdownlint-cli2 README.md AGENTS.md CLAUDE.md "docs/**/*.md" ".github/**/*.md"

test:
    lychee --offline --no-progress --verbose --accept '200..=299' README.md AGENTS.md CLAUDE.md './docs/**/*.md' './.github/**/*.md'

build:
    @echo "Nothing to build."

check: lint test build

fix:
    npm exec --yes --package=markdownlint-cli2@0.23.2 -- markdownlint-cli2 --fix README.md AGENTS.md CLAUDE.md "docs/**/*.md" ".github/**/*.md"

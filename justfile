set windows-shell := ["powershell.exe", "-NoLogo", "-NoProfile", "-Command"]

py := if os() == "windows" { "py -3.12" } else { "python3.12" }

default:
    @just --list

lint:
    npm exec --yes --package=markdownlint-cli2@0.23.2 -- markdownlint-cli2 README.md AGENTS.md CLAUDE.md "docs/**/*.md" ".github/**/*.md" ".cursor/**/*.md"

test:
    lychee --offline --no-progress --verbose --accept '200..=299' README.md AGENTS.md CLAUDE.md './docs/**/*.md' './.github/**/*.md' './.cursor/**/*.md'

build:
    @echo "Nothing to build."

guard:
    {{py}} scripts/check_profile.py
    {{py}} -m unittest discover -s tests -q

check: lint test guard build

fix:
    npm exec --yes --package=markdownlint-cli2@0.23.2 -- markdownlint-cli2 --fix README.md AGENTS.md CLAUDE.md "docs/**/*.md" ".github/**/*.md" ".cursor/**/*.md"

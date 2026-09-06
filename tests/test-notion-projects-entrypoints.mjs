import { test } from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const source = resolve(import.meta.dirname, "..");
const powershell = spawnSync("pwsh", ["-NoProfile", "-Command", "$PSVersionTable.PSVersion.Major"], { encoding: "utf8" });

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "notion-entrypoints-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "scripts", "notion"), { recursive: true });
  mkdirSync(join(root, "scripts", "catalog"), { recursive: true });
  writeFileSync(join(root, "projects.json"), JSON.stringify({ featured: [], notion_sync: [] }));
  return root;
}

function environment(extra = {}) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("NOTION_") && key !== "NODE_OPTIONS"));
  return { ...env, NOTION_TOKEN: "fixture-only-marker", NOTION_DB_ID: "fixture-database", ...extra };
}

for (const script of ["sync-to-notion.mjs", "verify-notion-canonical-state.mjs", "notion-backfill-slug-repo.mjs"]) {
  test(`${script} finds the repository manifest from another directory`, (t) => {
    const root = fixture(t);
    const entry = join(root, "scripts", "notion", script);
    copyFileSync(join(source, "scripts", "notion", script), entry);
    const guard = join(root, "transport.mjs");
    writeFileSync(guard, `
      let calls = 0;
      globalThis.fetch = async () => {
        if (++calls === 1 && process.argv[1].endsWith("notion-backfill-slug-repo.mjs")) {
          return new Response(JSON.stringify({ properties: {
            Slug: { type: "rich_text" }, Repo: { type: "rich_text" },
          } }), { status: 200 });
        }
        throw new Error("FIXTURE_TRANSPORT_REACHED");
      };
    `);
    const result = spawnSync(process.execPath, ["--import", pathToFileURL(guard).href, entry], {
      cwd: join(root, "scripts"), env: environment(), encoding: "utf8", timeout: 10000,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /FIXTURE_TRANSPORT_REACHED/);
    assert.doesNotMatch(result.stderr, /ENOENT/);
  });
}

function runLocal(t, options = {}) {
  const root = fixture(t);
  const runner = join(root, "scripts", "notion", "run-notion-local.ps1");
  copyFileSync(join(source, "scripts", "notion", "run-notion-local.ps1"), runner);
  // Synthetic markers prove that files cannot replace process-injected values.
  if (options.envFile) writeFileSync(join(root, ".env.local"), "NOTION_TOKEN=fixture-file-marker\n");
  const command = `
    function python {
      if ($args[0] -ne 'scripts/catalog/validate-projects-json.py') { throw 'Wrong validator' }
      Write-Output 'VALIDATOR'
      $global:LASTEXITCODE = ${options.validatorExit || 0}
    }
    function python3 { python @args }
    function node {
      if ($env:NOTION_TOKEN -ne 'fixture-only-marker') { throw 'Injected credential changed' }
      if ($env:NOTION_CATEGORY_PROPERTY -ne 'Category' -or $env:NOTION_TAGS_PROPERTY -ne 'Tags' -or $env:NOTION_STATUS_PROPERTY -ne 'Category') { throw 'Wrong schema mapping' }
      if (-not (Test-Path -LiteralPath './projects.json')) { throw 'Wrong working directory' }
      Write-Output $args[0]
      $global:LASTEXITCODE = ${options.syncExit || 0}
    }
    & '${runner.replaceAll("'", "''")}'
    exit $LASTEXITCODE
  `;
  return spawnSync("pwsh", ["-NoProfile", "-NonInteractive", "-Command", command], {
    cwd: join(root, "scripts"),
    env: environment(options.missingCredentials ? { NOTION_TOKEN: "", NOTION_DB_ID: "" } : {}),
    encoding: "utf8", timeout: 15000,
  });
}

test("local runner retains injected credentials and canonical schema", { skip: powershell.error?.code === "ENOENT" }, (t) => {
  const result = runLocal(t, { envFile: true });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VALIDATOR[\s\S]*sync-to-notion\.mjs[\s\S]*verify-notion-canonical-state\.mjs/);
});

test("local runner stops after validator failure", { skip: powershell.error?.code === "ENOENT" }, (t) => {
  const result = runLocal(t, { validatorExit: 23 });
  assert.equal(result.status, 23, result.stderr);
  assert.doesNotMatch(result.stdout, /sync-to-notion|verify-notion/);
});

test("local runner requires process credentials before syncing", { skip: powershell.error?.code === "ENOENT" }, (t) => {
  const result = runLocal(t, { missingCredentials: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /op run/);
  assert.doesNotMatch(result.stdout, /sync-to-notion|verify-notion/);
});

test("local runner stops after sync failure", { skip: powershell.error?.code === "ENOENT" }, (t) => {
  const result = runLocal(t, { syncExit: 24 });
  assert.equal(result.status, 24, result.stderr);
  assert.doesNotMatch(result.stdout, /verify-notion/);
});

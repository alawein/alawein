async function loadDashboard() {
  const meta = document.getElementById("meta");
  const cards = document.getElementById("kpi-cards");
  const releases = document.getElementById("recent-releases");
  const attention = document.getElementById("attention-repos");
  const repoRows = document.querySelector("#repo-table tbody");

  try {
    const response = await fetch("./latest.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load latest.json");
    }
    const data = await response.json();

    meta.textContent =
      `Owners: ${data.owners.join(", ")} | Generated: ${data.generatedAt} | Status: ${data.cacheStatus}`;

    const kpis = [
      ["Total Repos", data.kpis.totalRepos, data.snapshot.deltas.totalRepos],
      ["Open Issues", data.kpis.openIssues, data.snapshot.deltas.openIssues],
      ["Open PRs", data.kpis.openPullRequests, data.snapshot.deltas.openPullRequests],
      ["Stars", data.kpis.totalStars, data.snapshot.deltas.totalStars],
      ["Releases", data.kpis.reposWithLatestRelease, data.snapshot.deltas.reposWithLatestRelease],
      ["Licenses", data.kpis.reposWithLicense, data.snapshot.deltas.reposWithLicense],
      ["Updated 30d", data.kpis.pushedLast30Days, data.snapshot.deltas.pushedLast30Days]
    ];

    cards.innerHTML = "";
    for (const [label, value, delta] of kpis) {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<div class="label">${label}</div><div class="value">${value}</div><div class="delta">Delta: ${delta}</div>`;
      cards.appendChild(el);
    }

    releases.innerHTML = "";
    for (const row of data.recentReleases.slice(0, 8)) {
      const el = document.createElement("div");
      el.className = "row";
      el.innerHTML = `<strong>${row.nameWithOwner} · ${row.tagName}</strong>
        <div class="muted">${row.publishedAt || "n/a"}</div>
        <div class="muted">${(row.description || "No release notes").slice(0, 220)}</div>`;
      releases.appendChild(el);
    }
    if (!data.recentReleases.length) {
      releases.innerHTML = `<div class="muted">No releases found.</div>`;
    }

    attention.innerHTML = "";
    for (const row of data.attention.repos.filter((repo) => repo.score > 0).slice(0, 8)) {
      const el = document.createElement("div");
      el.className = "row";
      const flags = row.flags.map((flag) => flag.label).join(", ");
      const warn = row.level === "high" ? "warn" : "";
      el.innerHTML = `<strong>${row.nameWithOwner}</strong>
        <div class="muted ${warn}">${row.level} (${row.score})</div>
        <div class="muted">${flags || "No flags"}</div>`;
      attention.appendChild(el);
    }
    if (!data.attention.repos.some((repo) => repo.score > 0)) {
      attention.innerHTML = `<div class="muted">No repositories currently match attention rules.</div>`;
    }

    repoRows.innerHTML = "";
    for (const repo of data.repos) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><a href="${repo.url}" target="_blank" rel="noreferrer">${repo.nameWithOwner}</a></td>
        <td>${repo.status}</td>
        <td>${repo.stars}</td>
        <td>${repo.openIssues}</td>
        <td>${repo.openPullRequests}</td>
        <td>${(repo.lastPush || "").split("T")[0] || "n/a"}</td>
        <td>${repo.roadmapTag || "none"}</td>`;
      repoRows.appendChild(tr);
    }
  } catch (err) {
    meta.textContent = `Dashboard load failed: ${err.message}`;
  }
}

loadDashboard();

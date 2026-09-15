---
type: internal
status: proposed
last_updated: 2026-09-15
owner: meshal
---

# Slack dependency-preserving reset (proposed)

Not authorized. Does not replace `gate_2026_09_19` on
[PR #292](https://github.com/alawein/alawein/pull/292). No archive,
invite, retention change, export, or delete from this note.

Pattern: inventory → KEEP / QUARANTINE / UNKNOWN → export → archive
(quarantine) → prove Cursor → retention → soak → purge only if backup
opens.

Deletion criterion is dependency, never age.

## 1. Live inventory (2026-09-15)

Workspace `T0APHHXJV4J`. Cursor Slack Tools listed 9 public channels.
Meshal membership: those 9, 0 private, 0 archived. `#me-inbox` absent.

OAuth scopes: UNKNOWN. This connector cannot open Workspace settings →
Apps. Report them from that page, or paste a screenshot.

### Channels

| Channel | ID | Class | Why |
| --- | --- | --- | --- |
| `#admin-ops` | `C0B9SRMDJFK` | KEEP | Ops hub. Cursor reads and writes. Live agents: Cursor, Claude, Computer, Notion AI, GitHub, ChatGPT (replaced), Codex, Kilo. |
| `#me-agents-eng` | `C0BVDBHLXQB` | KEEP | Cursor lane. Members today: Meshal, Notion AI. Cursor invite still 2026-09-19. |
| `#me-agents-ops` | `C0BVDBHPB99` | KEEP | Claude then Computer lane. Members today: Meshal, Notion AI. |
| `#me-inbox` | none | KEEP (create) | Authorized 2026-09-19 create. Not live yet. |
| `#posts` | `C0APWF615H7` | KEEP until bots off | Daily Briefing, Friday Review, Monday Kickoff write here. Locked stay on 2026-09-15. |
| `#content-pipeline` | `C0B9R0NS4QJ` | KEEP until bots off | Weekly Content Planner writes here. Locked stay. |
| `#kohyr-dev` | `C0B9JJZSVQT` | UNKNOWN | Pending Meshal. Codex is a member. No archive on 2026-09-19. |
| `#job-search` | `C0B9NTUUGR4` | UNKNOWN | Pending Meshal. No archive on 2026-09-19. |
| `#social` | `C0AP24SRVQF` | QUARANTINE candidate | No bot write proved. Slack default-style channel. Confirm it is not required. |
| `#all-alawein-workspace` | `C0APE5RSWAZ` | UNKNOWN | Workspace broadcast. Fireflies app historically. May be Slack-required. Do not archive until Owner confirms. |

There is no `#alerts` channel. GitHub lives in `#admin-ops` today.

### Apps (catalog + live members). Scopes UNKNOWN.

Survivor bots (keep installed):

- Cursor `U0APW2Z3GG2`: `#admin-ops` now; `#me-agents-eng` after invite
- Claude `U0AQQFJT8AC`: `#admin-ops` now; `#me-agents-ops` after invite
- Computer `U0APW7F9S4A`: `#admin-ops` now; `#me-agents-ops` after Claude
- Notion AI `U0AQ8UNAKTK`: `#admin-ops`, both `#me-agents-*`
- GitHub `U0APESWEF2T`: `#admin-ops` (alerts until a dedicated channel exists)

Hold / do not dispatch:

- ChatGPT `U0BUNH33CCA` replaced
- Codex `U0BV7V8M3NW` needs_auth
- Kilo `U0BV9U2GFED` three-repo only
- Slackbot AI `USLACKBOT` 1:1 only; cannot join channels

Disable 2026-09-19 (authorized, not delete):

- Daily Agenda, Daily Briefing, Friday Review, Monday Kickoff,
  Weekly Content Planner

Notify apps (DM-proved earlier; channel membership not fully re-proved
this pass): Linear, Google Calendar, Google Drive, Fireflies,
Graphite, Langfuse, Vercel, Figma, Docusign, Dropbox, Zoom.

Broader-than-needed: UNKNOWN until the Apps page scopes are pasted.
Do not rotate Cursor scopes unless a missing read/write is proved.

## 2. Survivor set (proposed)

One ops: `#admin-ops`.

One alerts: do not create `#alerts` in this pass. Keep GitHub in
`#admin-ops` until a later call. The v2 `#team-eng-alerts` name is
still draft.

Active bot channels: `#me-agents-eng`, `#me-agents-ops`, `#me-inbox`.

Pinned / runbook: `#admin-ops` (working canvases `F0C16U6USJ0`,
`F0C0KEF150C`, `F0C15AVM0FR`). Git wins over any Canvas.

Conflict: this reset asked to archive leftover channels. The 2026-09-15
lock parks rename and keeps `#posts` and `#content-pipeline`. Those two
also have a live bot dependency until the five workflows are disabled.

## 3. Ordered plan (do not skip)

1. **Export to Drive.** Owner export or a later history dump. Folder
   `slack-backup / YYYY-MM-DD / <channel-id>-<slug>/`. Confirm the
   folder opens and a sample JSON or text file reads. No archive
   before that.
2. **Archive** only QUARANTINE channels that have no live bot write.
   Slack has no channel hard-delete. Archive is the quarantine step.
3. **Prove Cursor.** Post a one-line probe in `#admin-ops`. After the
   2026-09-19 invite, prove `#me-agents-eng` read. If Cursor auth
   breaks, Meshal re-runs Slack auth in the browser. Do not change
   scopes first.
4. **Retention last.** Admin → Settings → Retention. Exempt KEEP bot
   channels. Do not set a workspace wipe that covers `#admin-ops` or
   `#me-agents-*`.
5. **Soak.** One normal bot cycle after the five workflows are
   disabled (next calendar day for daily bots; next Friday 16:00 PT
   for Friday Review if it still fires once). Then decide purge.
6. **Purge.** Only if `slack-backup` exists and opens. Slack still
   cannot hard-delete a channel. Purge means retention on archived
   channels or leaving them archived. Do not `chat.delete` in bulk.

Unsafe, not in this plan: `conversations.history` + `chat.delete`
wipes. That path loses evidence and is banned in
`docs/governance/slack-agent-runbook.md` §6.3.

## 4. Bot realignment (human clicks)

After export, and only on surviving channels:

1. `#me-agents-eng`: `/invite @Cursor`
2. `#me-agents-ops`: `/invite @Claude`, then `/invite @Computer`
3. Create `#me-inbox`
4. Do not re-invite workflow bots
5. Do not invite ChatGPT
6. Re-run Cursor Slack auth only if a prove fails after a scope change

Pinned KEEP manifest (one per bot channel, 5 lines max):

```
*Channel:* #name
*Reads:* Cursor Slack Tools (list/read members of this channel)
*Writes:* Meshal-tagged threads only
*Not in this channel:* workflow bots, ChatGPT, Slackbot
*Backup:* Drive slack-backup/<date>/<channel-id>
```

## 5. Backup (scripts later)

Prefer Slack built-in export JSON. Availability is plan-gated:

- Free / Pro: usually owner export of public data, or only your
  messages. Confirm on the plan page.
- Business+ / Enterprise: Compliance / full export. Owner only.

If export is missing, a `conversations.history` dump can wait until
Meshal confirms plan, Owner role, and a user token with
`channels:history`. Output target: Google Drive `slack-backup`.
No token in git. No script in this file yet.

## 6. Permissions you may not have

| Step | Likely need |
| --- | --- |
| Apps page / scopes | Workspace Owner or Apps admin |
| Built-in export | Owner; plan feature |
| Archive a channel | Admin, or you created it |
| Archive Slack defaults | Often blocked (`#all-alawein-workspace`, `#social`) |
| Retention policies | Owner / Admin |
| Cursor re-auth | Your browser; not this Cloud agent |
| Drive `slack-backup` | Google Drive write on `contact@meshal.ai` |
| Invite bots | Channel member with invite permission |
| `chat.delete` others' messages | Admin. Do not do this. |

This Cloud Cursor cannot: open Apps scopes, archive, set retention,
invite, or export.

## 7. [need this:] before any script

1. Does this reset replace the 2026-09-15 lock, or stay after 2026-09-19?
2. Slack plan: Free, Pro, Business+, or Enterprise Grid?
3. Are you Workspace Owner or Admin?
4. Keep GitHub in `#admin-ops`, or create an alerts channel later?
5. Paste Apps page scopes for Cursor, Claude, Computer, GitHub, Notion AI.
6. Confirm Drive folder name `slack-backup` under `contact@meshal.ai`.
7. Soak definition: next day after disable, or wait through Friday Review?

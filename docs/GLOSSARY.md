# Glossary

Terms used in Draft Release Plans docs and architecture diagrams.  
**Status tags:** `live` = exists in code today · `planned` = Phase 0+ MVP · `legacy` = current path we are moving away from for interactive Create · `support` = stays, but not the interactive Create path.

---

## Systems & repos

| Term | Meaning |
|------|---------|
| **Org Pulse (OP)** | Engineering dashboard (`rhai-org-pulse`). Vue + Express. Hosts Plan UI including Draft Plans. **Planned** home of interactive Create → Approve to Jira. |
| **release-planning (RP)** | GitLab Python/CI planning toolchain. Fetches Features, scores readiness, runs `auto_scheduler`, publishes reports. **Support / legacy for interactive Create** — not the MVP interactive packer (we say *schedule*). |
| **feature-traffic CI** | Upstream GitLab CI that harvests Jira Feature traffic into artifacts / a data repo. Shared upstream for OP execution ingest and RP fetch. `live` |
| **feature-traffic-data** | Git repo / clone of feature-traffic outputs consumed by RP `fetch-data`. `live` |
| **strat-pipeline-data** | GitLab data used for rubric / strat scores. RP pulls rubric scores from here. `live` / `support` |
| **agentic-ci** | Ops-owned CI that will (planned) run quality-gate (QG1) daily and write Jira labels Org Pulse reads. `planned` / `support` |
| **RHAISTRAT** | Jira project for RHAI strategy Features and Initiatives — the planning universe. `live` |

---

## Architecture diagram nodes (current-state map)

| Term | Meaning |
|------|---------|
| **RP fetch-data** | CI job in release-planning that clones feature-traffic-data, hits Jira + strat-pipeline-data, and produces `features-ready.json`, `schedule.json`, velocity, eng-children, rubric scores, etc. `live` / `support` |
| **features-ready.json** | RP artifact: Features sized/scored with schedulingStatus, priority, readiness tiers. Input to scheduler and reports. Published under `RHOAI/latest/` but **not** pulled by OP Draft Plans editor today. `live` |
| **schedule.json** | RP artifact: Features placed into version×EA1/EA2/GA buckets by `auto_scheduler`. Shape ≠ OP `drafts/*.json`. `live` / `legacy` for editor |
| **RP reports + HTML** | `release-plan.md/json`, `release-health.md/json`, `dashboard.html` — human/report outputs. OP may fetch plan/health JSON for catalog views; **not** editor rows. `live` |
| **release-planning-data** | GitLab project where RP `publish-results` pushes `RHOAI/{ts}/` and `RHOAI/latest/`. Historically flaky; SESSION notes publish issues. `live` / fragile |
| **OP execution store** | Org Pulse storage under `releases/execution/*` — Feature cache ingested from feature-traffic GitLab artifacts (+ Jira enrich). Feeds planning candidates and readiness. Often gated by config. `live` |
| **OP candidates-cache** | `releases/planning/candidates-cache-{ver}.json` — Big Rocks / planning pipeline output for a version. Feeds Big Rocks UI and related views; **does not** write Draft Plans editor JSON. `live` |
| **OP health-cache** | `releases/planning/health-cache-{ver}-{phase}.json` — release health / DoR-P style signals per phase. `live` |
| **OP draft fetch** | Draft Plans job/API that pulls GitLab `release-planning-data` report JSON. Wrong shape for the editor (`editorAvailable=false` if only reports present). `live` / `broken` for Create handoff |
| **drafts/\*.json** | Editor base plan file(s). Today: `drafts/{product}/{version}.json` or demo fixture. **Planned:** `drafts/combined/{version}.json`. `partial` / `planned` |
| **External draft builder** | Offline process (xlsx / unknown) that produced the only editor-ready sample; not in OP or RP repos. `legacy` |
| **Draft Plans UI** | Org Pulse Plan tab for loading a draft, red-pen edits, freeze. `live` (needs Create output) |

---

## Product / workflow terms (planned MVP)

| Term | Meaning |
|------|---------|
| **Create** | Build a working draft that **schedules** Features into EA1 / EA2 / GA (and Below cut) for a cycle. Interactive, in Org Pulse. Prefer “schedule” over “pack.” `planned` |
| **Draft Release Plan** | Combined working plan for a quarterly version (families RHOAI + RHAII via Target Version names). `planned` |
| **EA1 / EA2 / GA** | Early Access 1, Early Access 2, and GA events within a quarterly release cycle. |
| **Below cut** | On the draft but not scheduled into EA1/EA2/GA (e.g. not structurally ready). |
| **Features List (1–n)** | Ranked list of Features/Initiatives with readiness banners — not the draft editor itself. `live` / enhanced `planned` |
| **Red-pen** | Authorized edit (move / descope) on a draft row. PM, Delivery owner, or plan Admin. Locks placement against daily Create overwrite. `live` (ACL hardening `planned`) |
| **PM / Delivery** | **PM** = Jira Business Owner; **Delivery** = Jira Assignee (engineering owner). Soft freeze and red-pen ACL. |
| **Soft freeze** | Both **PM agreed** and **Delivery agreed** on a row → pin. Default set included in Approve to Jira. `planned` (related UI flags `live`) |
| **Hard freeze** | Plan-admin event / Final GA lock. Freeze ≠ writing Jira. `live` / hardened `planned` |
| **What-if** | Side-by-side alternate schedule vs working draft; explicit apply; uses last Feature store snapshot only. `planned` |
| **Approve to Jira** | Plan Admin writes **Target Version (TV)** and **Fix Version (FV)** from the draft. Not called “Commit.” Does **not** write readiness fields. `planned` |
| **Pin** | Placement protected from Create overwrite (soft freeze and/or red-pen lock). Overrides soft capacity warnings. `planned` |

---

## Readiness & scoring

| Term | Meaning |
|------|---------|
| **Structural gate** | Eng links (to RHOAIENG / RHAIENG / AIPCC / INFERENG) + Components. Without these, Feature cannot be scheduled into EA1/EA2/GA. `planned` (similar ideas exist in CI/OP under different names) |
| **EA1 admin readiness** | Structurally ready **+ Target Version**. PM/Assignee not required for EA1 eligibility. `planned` |
| **FPDoR** | Feature Planning Definition of Ready — checklist in Org Pulse (13 items today). Human **sign-off early pass** for qualitative items is `planned`. |
| **DoR-P** | Definition of Ready (planning) checks used in OP health — components, PM, release type, child epics, RFE, etc. Distinct from Create structural gate. `live` |
| **QG1 / quality-gate** | Quality gate that writes labels like `rp-qg1-pass` / `rp-qg1-fail`. Choice A: agentic-ci writes; OP reads. Enrichment / EA1 preference — not a Create hard gate. `planned` / `support` |
| **RICE** | Reach × Impact × Confidence / Effort style inputs used in priority scoring. |
| **Big Rocks** | Outcome-level priorities (Google Doc / OP config). Non-Jira ranking input in OP priority formula. `live` |
| **Soft capacity** | Weekly component/team p75 ceilings as **warnings only** — never hard-block Create. `planned` |

---

## Jira fields

| Term | Meaning |
|------|---------|
| **Target Version (TV)** | Jira field used for intended release event (e.g. `3.6 EA1 RHOAI RELEASE`). Written by Approve to Jira. |
| **Fix Version (FV)** | Jira fixVersion(s) also written on Approve to Jira. |
| **Business Owner** | Jira field treated as **PM** for ACL / soft freeze. |
| **Assignee** | Treated as **Delivery** owner for ACL / soft freeze. |

---

## Storage / contract (planned)

| Term | Meaning |
|------|---------|
| **Feature store / snapshot** | OP planning store of open RHAISTRAT Features + Initiatives, refreshed hourly + on-demand. `planned` (builds on execution/candidates ideas) |
| **drafts/combined/{version}.json** | Create output — combined RHOAI+RHAII draft for a version. See data contract. `planned` |
| **edits/combined/{version}.json** | Red-pen / agreement / freeze overlays. `planned` (today: editor overlay paths differ) |

---

## Acronyms

| Acronym | Expansion |
|---------|-----------|
| **OP** | Org Pulse |
| **RP** | release-planning |
| **TV / FV** | Target Version / Fix Version |
| **SP** | Story points |
| **ACL** | Access control list (who may red-pen) |
| **DRP-A#** | Draft Release Plans story slices under AIPCC-19994 |

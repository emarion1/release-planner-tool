# Data inventory

Producers, consumers, and shapes that matter for Draft Release Plans.  
Cross-link: [GLOSSARY.md](./GLOSSARY.md) · [DRAFT-PLANS-DATA-CONTRACT.md](./DRAFT-PLANS-DATA-CONTRACT.md)

Status: `live` · `partial` · `broken` · `planned` · `support`

---

## End-to-end data path (planned MVP)

```text
Jira RHAISTRAT
    → OP Feature store snapshot (fields, labels, QG1, rubric)     [planned]
    → ranked 1–n view (priority, structural/EA1 readiness, FPDoR) [planned]
    → drafts/combined/{version}.json (placements, pins, warnings) [planned]
    ↔ edits/combined/{version}.json (moves/descopes, redPenLocked)[planned]
    → soft-freeze pins (pmAgreed, deliveryAgreed)                 [planned]
    → what-if apply (last snapshot only)                          [planned]
    → frozen draft                                                [planned]
    → Jira TV + FV write → refresh keys                           [planned]
```

QG1 labels are written by **agentic-ci** outside the interactive loop (`support`).

---

## Upstream

| Artifact | Producer | Consumer | Major contents | Status |
|----------|----------|----------|----------------|--------|
| Jira RHAISTRAT Features / Initiatives | Humans + Jira | feature-traffic, OP, RP | summary, TV, FV, components, owners, links, labels | `live` |
| feature-traffic artifacts | feature-traffic CI | OP execution ingest; RP via feature-traffic-data | Feature traffic harvest | `live` |
| feature-traffic-data | feature-traffic publish/clone target | RP fetch-data | Cloned Feature corpus | `live` |
| strat-pipeline-data | strat pipeline | RP rubric fetch | Rubric scores | `live` / `support` |
| `rp-qg1-*` labels | agentic-ci quality-gate (planned) | OP Feature store / Create preference | pass / fail / auto-rice | `planned` / `support` |

---

## release-planning (RP) — support / legacy for Create

| Artifact | Producer | Consumer | Major contents | Status |
|----------|----------|----------|----------------|--------|
| features-ready.json | prepare-features / fetch-data | auto_scheduler, reports; published to latest/ | scored Features, schedulingStatus | `live` / not OP editor |
| schedule.json | auto_scheduler | reports; published | version×EA placements | `live` / wrong shape for editor |
| release-plan.json/md | generate-plan | OP draft fetch (JSON), humans | Narrative / structured plan report | `live` / not editor rows |
| release-health.json/md | forecast / generate-health | OP health-ish catalog | Scope health | `live` / `support` |
| component/team velocity | fetch-*-velocity | auto_scheduler; optional OP soft capacity | p75 ceilings | `live` / `support` |
| release-planning-data `RHOAI/latest/` | publish-results | OP draft fetch | Published bundle | `live` / historically fragile |

**Handoff gap:** OP Draft Plans fetch pulls report JSON, **not** `drafts/*.json`. Editor needs candidates + `basePlacement` (today) / contract fields (planned).

---

## Org Pulse — live storage keys

| Storage key / path | Producer | Consumer | Major contents | Status |
|--------------------|----------|----------|----------------|--------|
| `releases/execution/index.json` + `features/*` | execution GitLab fetch (+ Jira enrich) | planning pipeline, feature-readiness, health | Feature cache | `live` (often disabled) |
| `releases/planning/releases/{ver}.json` | Big Rocks CRUD / doc import | candidates pipeline | Outcomes / Big Rocks config | `live` |
| `releases/planning/candidates-cache-{ver}.json` | planning refresh / pipeline | Big Rocks UI, readiness merge | Candidate Features for version | `live` |
| `releases/planning/health-cache-{ver}-{phase}.json` | health refresh | Health UI, readiness merge | Phase health | `live` |
| `releases/draft-plans/{product}/release-plan.json` | draft-plans GitLab fetch | cycles catalog | Report catalog; `editorAvailable=false` alone | `live` / `broken` handoff |
| `releases/draft-plans/drafts/{product}/{ver}.json` | **not** produced by CI today | Draft Plans editor | Editor base plan | `missing` / demo only |
| `releases/draft-plans/editor/{product}/{ver}.json` | PUT editor | Draft Plans UI | Human edits, freezes, audit | `live` |
| `fixtures/draft-3.6-demo.json` | checked into OP repo | Editor fallback for 3.6 | Demo draft | `live` / not prod path |

---

## Org Pulse — planned Draft Plans contract

| Path | Producer | Consumer | Major contents | Status |
|------|----------|----------|----------------|--------|
| `releases/draft-plans/drafts/combined/{version}.json` | Create | Draft Plans UI, Approve preview | placements, pins, capacity warnings | `planned` |
| `releases/draft-plans/edits/combined/{version}.json` | red-pen / agreements | Create (respect locks), UI, Approve | moves, descopes, redPenLocked, agreements | `planned` |
| Feature store snapshot (TBD key under planning/) | hourly + on-demand refresh | Rank, Create, what-if | open RHAISTRAT Features + Initiatives + enrichment | `planned` |

See [DRAFT-PLANS-DATA-CONTRACT.md](./DRAFT-PLANS-DATA-CONTRACT.md) for field-level schema.

---

## Priority / readiness / capacity (do not mix)

| Concern | Org Pulse today | RP CI today | Planned MVP |
|---------|-----------------|-------------|-------------|
| Priority | RICE + Big Rock position + TV + Jira Priority | RICE + Big Rock tier + Priority + inverse size | **One OP formula** |
| Readiness | FPDoR 13; DoR-P health | structural/admin → schedulingStatus | Structural + EA1 admin + sign-off/QG1 enrichment |
| Capacity | ceilingsByComponent on red-pen; separate Deliver reports | component then team p75 hard gates in scheduler | Soft warnings only; pins override |

---

## Related product code (pointers)

| Area | Location (rhai-org-pulse) |
|------|---------------------------|
| Plan UI | `modules/releases/client/views/PlanView.vue` |
| Draft Plans server | `modules/releases/server/draft-plans/` |
| Planning / candidates | `modules/releases/server/planning/` |
| Execution ingest | `modules/releases/server/` execution paths |
| Demo fixture | `modules/releases/server/draft-plans/fixtures/draft-3.6-demo.json` |

# Data inventory

Producers, consumers, and shapes for Draft Release Plans.

| Section | Contents |
|---------|----------|
| **[As-is](#as-is)** | What exists in code / storage today |
| **[Planned](#planned)** | Target MVP Create → Approve to Jira data path |

Cross-link: [GLOSSARY.md](./GLOSSARY.md) · [ARCHITECTURE-CURRENT-STATE.md](./ARCHITECTURE-CURRENT-STATE.md) · [DRAFT-PLANS-DATA-CONTRACT.md](./DRAFT-PLANS-DATA-CONTRACT.md)

---

# As-is

What is live (or partially live) today. Does **not** describe the target MVP contract.

## As-is end-to-end path

```text
Jira RHAISTRAT
    ├─► feature-traffic CI → feature-traffic-data
    │         ├─► RP fetch-data → features-ready / schedule → RP reports
    │         │         └─► release-planning-data (RHOAI/latest/)
    │         │                   └─✗► OP draft fetch (wrong shape for editor)
    │         └─► OP execution store → candidates-cache / health-cache
    │                                   └─► Big Rocks, Features List, Health
    │
    └─► (direct Jira) OP planning / health / TV-FV views

External builder / demo fixture ──► drafts/{product}/{ver}.json or fixture
                                         └─► Draft Plans UI (red-pen / freeze)
                                         └─✗► Jira TV+FV write (not implemented)
```

**Gap:** nothing in-repo reliably Creates an editor-ready `drafts/*.json` and loads it into Draft Plans. Approve does not write Jira.

---

## As-is — upstream

| Artifact | Producer | Consumer | Major contents | Notes |
|----------|----------|----------|----------------|-------|
| Jira RHAISTRAT Features / Initiatives | Humans + Jira | feature-traffic, OP, RP | summary, TV, FV, components, owners, links, labels | Source of truth for issue fields |
| feature-traffic artifacts | feature-traffic CI | OP execution ingest; RP via feature-traffic-data | Feature traffic harvest | Shared upstream |
| feature-traffic-data | feature-traffic publish/clone target | RP fetch-data | Cloned Feature corpus | RP CI clone |
| strat-pipeline-data | strat pipeline | RP rubric fetch | Rubric scores | RP path |

---

## As-is — release-planning (RP)

| Artifact | Producer | Consumer | Major contents | Notes |
|----------|----------|----------|----------------|-------|
| features-ready.json | prepare-features / fetch-data | auto_scheduler, reports; published to latest/ | scored Features, schedulingStatus | Not pulled by OP Draft Plans editor |
| schedule.json | auto_scheduler | reports; published | version×EA placements | Shape ≠ drafts editor contract |
| release-plan.json/md | generate-plan | OP draft fetch (JSON), humans | Narrative / structured plan report | Catalog only — not editor rows |
| release-health.json/md | forecast / generate-health | OP health-ish catalog | Scope health | Not editor rows |
| component/team velocity | fetch-*-velocity | auto_scheduler | p75 ceilings | Hard gates in RP scheduler |
| release-planning-data `RHOAI/latest/` | publish-results | OP draft fetch | Published bundle | Historically fragile publish |

**Handoff gap:** OP Draft Plans fetch pulls report JSON, **not** `drafts/*.json`.

---

## As-is — Org Pulse storage

| Storage key / path | Producer | Consumer | Major contents | Notes |
|--------------------|----------|----------|----------------|-------|
| `releases/execution/index.json` + `features/*` | execution GitLab fetch (+ Jira enrich) | planning pipeline, feature-readiness, health | Feature cache | Often disabled by config |
| `releases/planning/releases/{ver}.json` | Big Rocks CRUD / doc import | candidates pipeline | Outcomes / Big Rocks config | |
| `releases/planning/candidates-cache-{ver}.json` | planning refresh / pipeline | Big Rocks UI, readiness merge | Candidate Features for version | Does not write Draft Plans drafts |
| `releases/planning/health-cache-{ver}-{phase}.json` | health refresh | Health UI, readiness merge | Phase health | |
| `releases/draft-plans/{product}/release-plan.json` | draft-plans GitLab fetch | cycles catalog | Report catalog | Alone → `editorAvailable=false` |
| `releases/draft-plans/drafts/{product}/{ver}.json` | **not** produced by CI | Draft Plans editor | Editor base plan | Missing in prod; demo used |
| `releases/draft-plans/editor/{product}/{ver}.json` | PUT editor | Draft Plans UI | Human edits, freezes, audit | Live |
| `fixtures/draft-3.6-demo.json` | checked into OP repo | Editor fallback for 3.6 | Demo draft | Not a production Create path |

---

## As-is — models (do not mix with planned)

| Concern | Org Pulse today | RP CI today |
|---------|-----------------|-------------|
| Priority | RICE + Big Rock position + TV + Jira Priority | RICE + Big Rock tier + Priority + inverse size |
| Readiness | FPDoR 13; DoR-P health | structural/admin → schedulingStatus |
| Capacity | ceilingsByComponent on red-pen; separate Deliver reports | component then team p75 **hard** gates in scheduler |
| Approve | Freeze / per-row flags only | N/A — no Jira write from OP |

---

## As-is — related product code

| Area | Location (rhai-org-pulse) |
|------|---------------------------|
| Plan UI | `modules/releases/client/views/PlanView.vue` |
| Draft Plans server | `modules/releases/server/draft-plans/` |
| Planning / candidates | `modules/releases/server/planning/` |
| Execution ingest | `modules/releases/server/` execution paths |
| Demo fixture | `modules/releases/server/draft-plans/fixtures/draft-3.6-demo.json` |

---

# Planned

Target MVP after Phase 0. Field-level schemas: [DRAFT-PLANS-DATA-CONTRACT.md](./DRAFT-PLANS-DATA-CONTRACT.md).  
Product rules: [DRAFT-RELEASE-PLANS-IMPLEMENTATION-PLAN.md](./DRAFT-RELEASE-PLANS-IMPLEMENTATION-PLAN.md).

## Planned end-to-end path

```text
Jira RHAISTRAT
    → OP Feature store snapshot (fields, labels, QG1, rubric)
    → ranked 1–n view (priority, structural/EA1 readiness, FPDoR)
    → drafts/combined/{version}.json (placements, pins, capacity warnings)
    ↔ edits/combined/{version}.json (moves/descopes, redPenLocked)
    → soft-freeze pins (pmAgreed, deliveryAgreed)     } iterative
    → what-if apply (last snapshot only)              }
    → frozen draft (hard freeze / Final GA)
    → Approve to Jira: TV + FV write → refresh keys

Support (outside interactive loop):
    agentic-ci → rp-qg1-* labels on Jira (OP reads)
    optional velocity producer → soft capacity ceilings (warnings only)
```

Interactive Create / what-if / Approve live in **Org Pulse**. RP / agentic-ci are **support**, not the interactive Create path.

---

## Planned — primary artifacts

| Path / artifact | Producer | Consumer | Major contents |
|-----------------|----------|----------|----------------|
| Feature store snapshot (`releases/planning/features/` — exact prefix Phase 1) | Hourly + on-demand refresh | Rank, Create, what-if | Open RHAISTRAT Features + Initiatives + enrichment |
| `releases/draft-plans/drafts/combined/{version}.json` | Create (schedules EA1/EA2/GA) | Draft Plans UI, Approve preview | placements, pins, capacity warnings, productFamily |
| `releases/draft-plans/edits/combined/{version}.json` | Red-pen / agreements / freeze | Create (respect locks), UI, Approve | moves, descopes, redPenLocked, pmAgreed, deliveryAgreed |
| `releases/planning/velocity/` | Weekly velocity ingest (Phase 2) | Create soft warnings | component/team p75 ceilings |
| Jira TV + FV | Approve to Jira (plan Admin) | Jira SoT for placement after approve | Target Version, Fix Version only |
| `rp-qg1-*` labels | agentic-ci quality-gate (daily) | Feature store / EA1 preference | pass / fail / auto-rice |

---

## Planned — models

| Concern | Planned MVP |
|---------|-------------|
| Priority | **One** Org Pulse formula: RICE + Big Rock position + Target Version + Jira Priority |
| Readiness | Structural gate (eng links + components); EA1 admin = structural + TV; FPDoR sign-off + QG1 as enrichment / preference |
| Capacity | Soft warnings only; pins / soft freeze / red-pen lock override |
| Approve | Plan Admin; TV + FV; default soft-frozen rows; Admin bypass with confirm + warning; **no** readiness field writes |

---

## Planned — what changes vs as-is

| As-is | Planned |
|-------|---------|
| Three Create paths; none feed editor reliably | One Org Pulse Create → `drafts/combined/{version}.json` |
| OP fetch of RP `release-plan.json` as catalog | Stop treating report JSON as editor base |
| Demo fixture / external builder | Not the production path after Create exists |
| Freeze / approved flags only | Soft freeze + hard freeze + **Approve to Jira** |
| RP capacity hard gates | Soft capacity warnings in OP |
| Dual priority formulas (OP vs RP) | Single OP formula for interactive Create |

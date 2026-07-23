# Architecture — current state

What exists today across **Org Pulse** and **release-planning**, and why there is not yet an end-to-end Create → Approve to Jira path.

For the **planned** workflow and locked decisions, see [DRAFT-RELEASE-PLANS-IMPLEMENTATION-PLAN.md](./DRAFT-RELEASE-PLANS-IMPLEMENTATION-PLAN.md).  
For term definitions, see [GLOSSARY.md](./GLOSSARY.md).  
For artifact tables, see [DATA-INVENTORY.md](./DATA-INVENTORY.md).

Source deep-dive canvas (Cursor): [../assets/draft-plan-architecture-workflow.canvas.tsx](../assets/draft-plan-architecture-workflow.canvas.tsx)

---

## Verdict (today)

| Question | Answer |
|----------|--------|
| End-to-end Create → Approve to Jira? | **No** |
| Can Draft Plans review / red-pen / freeze? | **Yes**, if a draft JSON is loaded (often the demo fixture) |
| Does RP CI Create feed the editor? | **No** — wrong file shapes / broken handoff |
| Approve writes Jira TV+FV? | **Not implemented** (UI freeze/lock only) |

---

## Two stacks, one shared upstream

```text
                    Jira RHAISTRAT
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     feature-traffic CI          (direct Jira APIs)
              │                       │
    ┌─────────┴─────────┐             │
    ▼                   ▼             ▼
feature-traffic-data   OP execution   OP planning /
    │                  store          candidates / health
    ▼
RP fetch-data → features-ready / schedule → reports
    │
    ▼
release-planning-data (latest/)
    │
    ✗ broken / wrong shape for editor
    ▼
OP draft fetch ──✗──► drafts/*.json ──► Draft Plans UI
                      ▲
                      └── demo fixture / external builder (only working sample)
```

Dashed/broken in the original canvas: **RP publish → OP draft fetch → drafts**, and **external builder → drafts**.

---

## Workflow gap (needed vs today)

| Step | Needed | What exists | Meets need? |
|------|--------|-------------|-------------|
| Create | One ranked EA1/EA2/GA draft for a cycle | Path A: RP CI scheduler (multi-release plan object). Path B: OP Big Rocks + Features List (no draft scheduler). Path C: external builder → demo fixture | **No** |
| Load | Draft available in Draft Plans | CI publishes report JSON; editor reads `drafts/{product}/{ver}.json` or demo | **No** |
| Review | Org sees one plan | Draft Plans + other Plan tabs can disagree | Partial |
| Modify | Move / descope with audit | draft-plan editor PUT; component ceiling checks | **Yes** |
| Approve | Org-approved locked plan + Jira write | Per-row flags; event/Final GA freeze. **No Jira write-back** | Partial |

---

## Three Create paths (easy to miss)

| Path | Where | Output usable by Draft Plans editor? |
|------|-------|--------------------------------------|
| A — release-planning CI | `prepare-features` + `auto_scheduler` | **No** — `schedule.json` / `release-plan.json` ≠ drafts contract |
| B — Org Pulse Big Rocks + Features List | candidates-cache + readiness | **No** — does not write drafts JSON |
| C — External builder / demo | fixture in OP repo | **Yes (sample only)** — not a production Create path |

**Planned:** collapse interactive Create into Org Pulse (Path B evolved), writing `drafts/combined/{version}.json`. RP becomes support (QG1, optional velocity/reports).

---

## Org Pulse surfaces that touch planning

| Surface | Role |
|---------|------|
| Big Rocks | Outcome-driven Feature discovery |
| Features List (1–n) | Ranked readiness list (OP priority + FPDoR) |
| Draft Plans | Intended review / modify / freeze surface |
| Health / execution / TV-FV delta | Adjacent analytics — not the draft editor |

---

## Approve / freeze semantics in code today

| Mechanism | Effect |
|-----------|--------|
| `edits[key].approved` | Per-Feature approval flag |
| `meta.frozenEvents[EA1\|EA2\|GA]` | Event freeze (plan admin) |
| `meta.finalGaFrozen` / locked | Whole-plan lock |
| Jira update | **Not implemented** |

Planned rename/semantics: **Approve to Jira** = TV+FV write; soft freeze = PM agreed + Delivery agreed; freeze ≠ Jira write.

---

## What must change (summary)

1. One Priority, one Readiness, one Capacity model for Create (soft capacity).  
2. Org Pulse Create writes the editor contract (`drafts/combined/{version}.json`).  
3. Stop treating `release-plan.json` as the editor base.  
4. Keep / extend Draft Plans for review, red-pen, freeze; add Approve to Jira.  
5. Retire dependency on Path C / demo for production.  
6. Keep data contract + glossary in sync with code.

Tracking: [AIPCC-19994](https://redhat.atlassian.net/browse/AIPCC-19994) (DRP-A0…A12).

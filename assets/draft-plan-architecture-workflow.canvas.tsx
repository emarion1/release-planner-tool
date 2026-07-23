import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Code,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  computeDAGLayout,
  useHostTheme,
} from 'cursor/canvas';

function ArchDiagram() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    direction: 'vertical',
    nodeWidth: 148,
    nodeHeight: 42,
    rankGap: 48,
    nodeGap: 22,
    padding: 12,
    nodes: [
      { id: 'jira' },
      { id: 'ft' },
      { id: 'ftData' },
      { id: 'strat' },
      { id: 'rpFetch' },
      { id: 'rpReady' },
      { id: 'rpSched' },
      { id: 'rpReports' },
      { id: 'rpPub' },
      { id: 'xlsx' },
      { id: 'opExec' },
      { id: 'opCand' },
      { id: 'opHealth' },
      { id: 'opFetch' },
      { id: 'opDraft' },
      { id: 'editor' },
      { id: 'users' },
    ],
    edges: [
      { from: 'jira', to: 'ft' },
      { from: 'ft', to: 'ftData' },
      { from: 'ftData', to: 'rpFetch' },
      { from: 'jira', to: 'rpFetch' },
      { from: 'strat', to: 'rpFetch' },
      { from: 'rpFetch', to: 'rpReady' },
      { from: 'rpReady', to: 'rpSched' },
      { from: 'rpReady', to: 'rpReports' },
      { from: 'rpSched', to: 'rpReports' },
      { from: 'rpReports', to: 'rpPub' },
      { from: 'ft', to: 'opExec' },
      { from: 'opExec', to: 'opCand' },
      { from: 'jira', to: 'opCand' },
      { from: 'opCand', to: 'opHealth' },
      { from: 'rpPub', to: 'opFetch' },
      { from: 'jira', to: 'xlsx' },
      { from: 'xlsx', to: 'opDraft' },
      { from: 'opFetch', to: 'opDraft' },
      { from: 'opDraft', to: 'editor' },
      { from: 'editor', to: 'users' },
      { from: 'opCand', to: 'users' },
      { from: 'opHealth', to: 'users' },
      { from: 'rpReports', to: 'users' },
    ],
  });

  const labels: Record<string, string> = {
    jira: 'Jira RHAISTRAT',
    ft: 'feature-traffic CI',
    ftData: 'feature-traffic-data',
    strat: 'strat-pipeline-data',
    rpFetch: 'RP fetch-data',
    rpReady: 'features-ready.json',
    rpSched: 'schedule.json',
    rpReports: 'RP reports + HTML',
    rpPub: 'release-planning-data',
    xlsx: 'External draft builder*',
    opExec: 'OP execution store',
    opCand: 'OP candidates-cache',
    opHealth: 'OP health-cache',
    opFetch: 'OP draft fetch',
    opDraft: 'drafts/*.json',
    editor: 'Draft Plans UI',
    users: 'Org / planners',
  };

  const broken = new Set([
    'rpPub→opFetch',
    'opFetch→opDraft',
    'xlsx→opDraft',
  ]);

  return (
    <Stack gap={8}>
      <svg
        width="100%"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ maxWidth: layout.width, background: theme.bg.editor }}
      >
        {layout.edges.map((e, i) => {
          const key = `${e.from}→${e.to}`;
          const isBroken = broken.has(key);
          return (
            <line
              key={i}
              x1={e.sourceX}
              y1={e.sourceY}
              x2={e.targetX}
              y2={e.targetY}
              stroke={isBroken ? theme.text.secondary : theme.stroke.primary}
              strokeWidth={isBroken ? 2 : 1.25}
              strokeDasharray={isBroken ? '5 4' : undefined}
            />
          );
        })}
        {layout.nodes.map((n) => {
          const highlight = n.id === 'opDraft' || n.id === 'xlsx' || n.id === 'opFetch';
          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={148}
                height={42}
                rx={4}
                fill={theme.fill.secondary}
                stroke={highlight ? theme.text.secondary : theme.stroke.primary}
                strokeDasharray={highlight ? '4 3' : undefined}
              />
              <text
                x={n.x + 74}
                y={n.y + 25}
                textAnchor="middle"
                fill={theme.text.primary}
                fontSize={10}
              >
                {labels[n.id]}
              </text>
            </g>
          );
        })}
      </svg>
      <Text style={{ color: theme.text.secondary, fontSize: 12 }}>
        * External draft builder = process that produced the demo fixture /
        mentioned xlsx. It is not in either repository. Dashed = broken or
        outside-repo path.
      </Text>
    </Stack>
  );
}

function WorkflowDiagram() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    direction: 'horizontal',
    nodeWidth: 132,
    nodeHeight: 52,
    rankGap: 56,
    nodeGap: 28,
    padding: 12,
    nodes: [
      { id: 'c' },
      { id: 'l' },
      { id: 'r' },
      { id: 'm' },
      { id: 'a' },
    ],
    edges: [
      { from: 'c', to: 'l' },
      { from: 'l', to: 'r' },
      { from: 'r', to: 'm' },
      { from: 'm', to: 'a' },
    ],
  });
  const labels: Record<string, [string, string]> = {
    c: ['1 Create', '3 competing paths'],
    l: ['2 Load', 'Broken'],
    r: ['3 Review', 'UI yes'],
    m: ['4 Modify', 'UI yes'],
    a: ['5 Approve', 'Freeze yes'],
  };
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ maxWidth: layout.width, background: theme.bg.editor }}
    >
      {layout.edges.map((e, i) => (
        <line
          key={i}
          x1={e.sourceX}
          y1={e.sourceY}
          x2={e.targetX}
          y2={e.targetY}
          stroke={theme.stroke.primary}
          strokeWidth={2}
          strokeDasharray={e.from === 'c' || e.from === 'l' ? '5 4' : undefined}
        />
      ))}
      {layout.nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={n.y}
            width={132}
            height={52}
            rx={4}
            fill={theme.fill.secondary}
            stroke={theme.stroke.primary}
          />
          <text x={n.x + 66} y={n.y + 22} textAnchor="middle" fill={theme.text.primary} fontSize={12} fontWeight={600}>
            {labels[n.id][0]}
          </text>
          <text x={n.x + 66} y={n.y + 40} textAnchor="middle" fill={theme.text.secondary} fontSize={10}>
            {labels[n.id][1]}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function DraftPlanDeepDive() {
  const theme = useHostTheme();
  const muted = theme.text.secondary;
  const stroke = theme.stroke.tertiary;

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1140 }}>
      <Stack gap={8}>
        <H1>Deep dive: Draft Release plans vs existing code</H1>
        <Text tone="secondary">
          Goal: create a draft quarterly plan (EA1 → EA2 → GA) from RHAISTRAT
          Features that the organization can review, modify, and approve.
          Inventory of every relevant path in release-planning and Org Pulse
          modules/releases — including data paths, interfaces, and handoffs.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="deleted">Create not unified</Pill>
          <Pill tone="deleted">Load handoff broken</Pill>
          <Pill tone="success">Modify + freeze built</Pill>
          <Pill tone="warning">3rd Create path outside both repos</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="No" label="End-to-end Create→Approve" tone="danger" />
        <Stat value="3" label="Create paths (2 in-repo + 1 external)" tone="warning" />
        <Stat value="2" label="Priority formulas" tone="warning" />
        <Stat value="3+" label="Readiness definitions" tone="warning" />
      </Grid>

      <Callout tone="danger" title="Does current code meet the need?">
        No, not as one workflow. Org Pulse Draft Plans can review, modify
        (red-pen), per-feature approve flags, freeze events, and Final GA
        freeze — if a draft file is loaded. Nothing in either repo reliably
        Creates that file and publishes it into Draft Plans. CI Create produces
        different files. A third offline builder (demo fixture / xlsx note)
        produced the only editor-ready sample, and that builder is not in these
        repositories.
      </Callout>

      <Divider />

      <H2>Architecture + data paths</H2>
      <ArchDiagram />

      <Divider />

      <H2>Workflow</H2>
      <WorkflowDiagram />
      <Table
        headers={['Step', 'Needed', 'What exists', 'Meets need?']}
        rows={[
          [
            'Create',
            'One ranked EA1/EA2/GA draft for a cycle using Priority + Readiness + Capacity',
            'Path A: CI prepare-features + auto_scheduler (multi-release plan object). Path B: OP Big Rocks candidates + Features List (no EA placement packer). Path C: external builder → demo fixture (Jira TV seed, no capacity pack).',
            'No',
          ],
          [
            'Load',
            'Draft available in Org Pulse Draft Plans',
            'CI publishes RHOAI/latest/release-plan.json etc. OP fetch pulls those two report files. Editor reads drafts/RHOAI/&#123;ver&#125;.json or demo 3.6 fixture.',
            'No',
          ],
          [
            'Review',
            'Org sees one plan',
            'DraftPlansView + also Big Rocks, Features List, health, CI dashboard/HTML — can disagree',
            'Partial',
          ],
          [
            'Modify',
            'Move / descope with audit',
            'draft-plan-model + PUT editor; component ceiling checks on moves',
            'Yes',
          ],
          [
            'Approve',
            'Org-approved locked plan',
            'Per-row approved flag; event freeze; Final GA freeze / locked (plan admins). No Jira write-back.',
            'Partial (UI lock only)',
          ],
        ]}
        rowTone={['danger', 'danger', 'warning', 'success', 'warning']}
      />

      <Divider />

      <H2>release-planning — complete inventory</H2>

      <H3>Pipeline jobs</H3>
      <Table
        headers={['Job', 'Inputs', 'Outputs']}
        rows={[
          [
            'fetch-data',
            'feature-traffic-data clone; Jira; strat-pipeline-data; data/big-rocks.json; velocity snapshot fallback',
            'CI artifacts: features-ready.json, schedule.json, component/team velocity, eng-children, big-rock-features, rubric-scores',
          ],
          [
            'generate-plan',
            'features-ready + schedule',
            'output/release-plan.md + .json (Claude /release-plan)',
          ],
          [
            'generate-health',
            'features-ready + release-calendar + velocity',
            'output/release-health.md + .json (forecast.py)',
          ],
          [
            'publish-results',
            'output/* + features-ready + schedule',
            'release-planning-data/RHOAI/&#123;ts&#125;/ and .../latest/ (+ dashboard.html)',
          ],
        ]}
      />

      <H3>Scripts (every file under scripts/)</H3>
      <Table
        headers={['Script', 'Role']}
        rows={[
          ['fetch-supplemental.py', 'Jira fields missing from feature-traffic (SP, products, dates, confidence, docs impact) — marked temporary'],
          ['fetch-engineering-children.py', 'Child epics in RHOAIENG/RHAIENG/AIPCC/INFERENG'],
          ['fetch-big-rock-features.py', 'Feature→big rock from hierarchy + big-rocks.json'],
          ['fetch-rubric-scores.py', 'Rubric scores from strat-pipeline-data'],
          ['fetch-component-velocity.py', 'Per-component p75 Features/event (EA1/EA2/GA); snapshot fallback'],
          ['fetch-team-velocity.py', 'Per-team delivery rate + predictability'],
          ['prepare-features.py', 'Merge, size cascade, readiness tiers, priorityScore, confidence, schedulingStatus'],
          ['auto_scheduler.py', 'Place into 8 releases × EA1/EA2/GA with component then team gates'],
          ['forecast.py', 'Scope health report for freeze conversation'],
          ['fit_predictor_adapter.py', 'Sizing / capacity model helpers'],
          ['utils/version_utils.py', 'Version parsing (mirrors OP JS)'],
        ]}
      />

      <H3>Published files under RHOAI/latest/</H3>
      <Table
        headers={['File', 'Consumed by Org Pulse?']}
        rows={[
          ['release-plan.md/json', 'fetch.js pulls JSON only — not used as editor draft'],
          ['release-health.md/json', 'fetch.js pulls JSON — catalog/health views, not editor rows'],
          ['dashboard.html', 'No'],
          ['features-ready.json', 'Published; fetch.js does not pull it'],
          ['schedule.json', 'Published; fetch.js does not pull it'],
        ]}
        rowTone={['warning', 'warning', 'neutral', 'danger', 'danger']}
      />

      <H3>Local data present but not the CI product</H3>
      <Table
        headers={['File', 'Notes']}
        rows={[
          ['data/big-rocks.json', 'Committed; version stamped 3.5; outcomeKeys + labels'],
          ['data/release-calendar.json', 'Freeze/code-freeze/release dates for forecast'],
          ['data/component-velocity-snapshot.json', 'Seed when live velocity fails'],
          ['data/candidates-3.6-jira.json', '~226 Features from live Jira cycle TV JQL (local dump, ~8MB)'],
          ['data/baseline-source-issues.json', 'Local baseline dump'],
          ['SESSION.md', '2026-05: publish never ran; data repo empty; Jira 401'],
        ]}
      />

      <Callout tone="warning" title="CI Create vs your product">
        auto_scheduler default is start_version + num_releases=8 (many quarters).
        Your goal is one cycle’s three events. schedule.json is
        plan[&#123;version&#125;-EA1|EA2|GA] → features[], not
        drafts/… candidates[] with basePlacement. Transformation is required
        and not implemented.
      </Callout>

      <Divider />

      <H2>Org Pulse modules/releases — Plan-related inventory</H2>

      <H3>Plan UI tabs (PlanView.vue)</H3>
      <Table
        headers={['Tab', 'Backend', 'Role for Draft Release goal']}
        rows={[
          ['Big Rocks', 'planning/pipeline → candidates-cache', 'Outcome-driven Feature discovery; not the draft editor'],
          ['PM Hub', 'pm-hub routes', 'Adjacent planning ops'],
          ['Features List (1-n)', 'feature-readiness + FPDoR + OP priorityScore', 'Ranked readiness list; different ready + score than CI'],
          ['Draft Plans', 'draft-plans editor', 'Intended review/modify/approve surface'],
          ['Field and BU Feedback', 'bu-feedback', 'Adjacent'],
        ]}
      />

      <H3>Other releases surfaces that touch EA1/EA2/GA (not Draft Plans)</H3>
      <Table
        headers={['Area', 'Storage / API', 'Overlap']}
        rows={[
          ['Health dashboard / pipeline', 'health-cache-&#123;ver&#125;-&#123;phase&#125;; overrides; snapshots', 'Risk + DoR-P + FPDoR; phase views'],
          ['Execution / feature-traffic', 'releases/execution/*', 'Shared Feature cache for candidates + readiness'],
          ['TV/FV delta', 'tv-fv-delta routes', 'Target vs fix version analysis for EA1/EA2/GA'],
          ['Release readiness metrics', 'releases/release-readiness/* upload API', 'External metrics upload — separate from Draft Plans'],
          ['Hygiene', 'releases/hygiene/*', 'Feeds readiness merge'],
          ['Component load report', 'client ComponentReleaseLoadReport', 'Capacity-ish UI; not Create packer'],
          ['Deliver velocity', 'delivery routes componentVelocity', 'Delivery analysis, not draft builder'],
        ]}
      />

      <H3>Storage keys that matter</H3>
      <Table
        headers={['Prefix / key', 'Producer', 'Consumer']}
        rows={[
          ['releases/execution/index.json + features/*', 'execution GitLab fetch (+ Jira enrich)', 'planning pipeline, feature-readiness, health'],
          ['releases/planning/releases/&#123;ver&#125;.json', 'Big Rocks CRUD / Google Doc import', 'candidates pipeline'],
          ['releases/planning/candidates-cache-&#123;ver&#125;.json', 'POST .../refresh → runPipeline ± cycle Jira', 'Big Rocks UI, health pipeline, feature-readiness'],
          ['releases/planning/health-cache-&#123;ver&#125;-&#123;phase&#125;.json', 'health refresh', 'Health UI, feature-readiness merge'],
          ['releases/draft-plans/&#123;product&#125;/release-plan.json', 'draft-plans fetch from GitLab', 'cycles catalog; editorAvailable=false if only this'],
          ['releases/draft-plans/drafts/&#123;product&#125;/&#123;ver&#125;.json', 'NOT produced by either repo CI', 'Editor base plan'],
          ['releases/draft-plans/editor/&#123;product&#125;/&#123;ver&#125;.json', 'PUT editor', 'Human edits, freezes, audit'],
          ['fixtures/draft-3.6-demo.json', 'Checked into OP repo', 'Fallback when drafts/ missing for 3.6'],
        ]}
        rowTone={[undefined, undefined, undefined, undefined, 'warning', 'danger', 'success', 'warning']}
      />

      <H3>Draft Plans APIs</H3>
      <Table
        headers={['Method', 'Path', 'Purpose']}
        rows={[
          ['GET', '/draft-plans/access', 'Viewer gate'],
          ['GET', '/draft-plans/cycles', 'List cycles (drafts/ + release-plan catalog + demo)'],
          ['GET', '/draft-plans/releases', 'Plan+health catalog'],
          ['POST', '/draft-plans/refresh', 'Pull GitLab latest report JSON (if enabled)'],
          ['GET/PUT', '/draft-plans/config', 'GitLab projectId, enable flag, viewer emails'],
          ['GET/PUT', '/draft-plans/editor/:version', 'Load/save draft + edits + freeze meta'],
          ['GET', '/draft-plans/:version', 'Plan payload'],
          ['GET', '/draft-plans/:version/health', 'Health companion'],
        ]}
      />

      <H3>Approve / freeze semantics in code</H3>
      <Table
        headers={['Mechanism', 'Where', 'Effect']}
        rows={[
          ['edits[key].approved', 'draft-plan-model setApproved', 'Per-Feature approval flag; cleared on some moves'],
          ['meta.frozenEvents[EA1|EA2|GA]', 'freezeEvent (plan admin)', 'Rows in that event become frozen'],
          ['meta.finalGaFrozen / locked', 'finalGaFreeze', 'Whole plan locked'],
          ['Jira update', '—', 'Not implemented'],
        ]}
      />

      <Divider />

      <H2>The three Create paths (this was easy to miss)</H2>
      <Table
        headers={['Path', 'Universe', 'Priority', 'Readiness', 'Placement', 'In these repos?']}
        rows={[
          [
            'A — release-planning CI',
            'TARGET_PRODUCT Features from feature-traffic (+ enrich)',
            'RICE + Big Rock tier + Jira Priority + inverse size',
            'structural/admin → schedulingStatus',
            'auto_scheduler capacity pack across many releases',
            'Yes — but output ≠ drafts/*.json',
          ],
          [
            'B — Org Pulse Big Rocks + Features List',
            'Outcome children ± cycle-TV Jira supplement',
            'RICE + Big Rock position + Target Version + Jira Priority',
            'FPDoR 13 + DoR-P health checks',
            'No draft packer; Jira TV/fix shown as fields',
            'Yes — does not create Draft Plans file',
          ],
          [
            'C — External builder (demo / xlsx)',
            'Open Features/Initiatives with any 3.6 cycle TV (multi-product)',
            'Org Pulse weights (demo scoring block)',
            'ready/readyBool (only 13/242 ready in demo)',
            'jira_tv_seed_no_pack — seeds EA from Jira TV; capacitySource=none',
            'No — only fixture + note about published xlsx',
          ],
        ]}
        rowTone={['warning', 'warning', 'danger']}
      />

      <Callout tone="warning" title="Missing contract">
        draft-plan-model.js says it mirrors release-planning
        DRAFT-PLAN-EDITOR-CONTRACT.md. That file does not exist in the
        release-planning repo. The editor contract is implied by normalize.js +
        the demo fixture only.
      </Callout>

      <Divider />

      <H2>Priority / Readiness / Capacity — side by side</H2>
      <Grid columns={1} gap={12}>
        <Card>
          <CardHeader>Priority</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>OP: rice 30% + bigRock position 30% + targetVersion 25% + priority 15%</Text>
              <Text>CI: rice 30% + bigRock tier 30% + priority 25% + complexity 15%</Text>
              <Text weight="semibold">Demo draft uses OP weights. CI claims to mirror OP but does not.</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Readiness</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>OP FPDoR: 13 items; isReady = all pass</Text>
              <Text>OP DoR-P: components, PM, release type, child epics, RFE</Text>
              <Text>CI: fully_ready / ready_with_gaps / pm_incomplete / not_ready (eng links + admin fields). Docstring still mentioning rubric-pass label is stale.</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Capacity</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text>CI: component p75 per event, then team delivery-rate p75 (auto_scheduler)</Text>
              <Text>OP Draft Plans: ceilingsByComponent for red-pen moves; demo did not pack Create</Text>
              <Text>OP Deliver / ComponentReleaseLoadReport: separate analytics</Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Divider />

      <H2>Interfaces, dependencies, handoffs</H2>
      <Table
        headers={['Handoff', 'Interface', 'Status']}
        rows={[
          ['Jira → feature-traffic', 'feature-traffic CI', 'Shared upstream'],
          ['feature-traffic-data → RP fetch', 'git clone + token', 'CI path'],
          ['feature-traffic artifacts → OP execution', 'GitLab job artifacts API', 'Separate ingest; often disabled'],
          ['strat-pipeline-data → RP rubric', 'GitLab token', 'CI path'],
          ['RP publish → release-planning-data', 'git push latest/', 'Intended; SESSION said never succeeded as of 2026-05'],
          ['release-planning-data → OP draft fetch', 'GitLab raw files API projectId 81798612', 'Wrong files for editor'],
          ['External builder → drafts/ or demo', 'Unknown / manual', 'Only working editor sample'],
          ['Editor → Jira', 'None', 'Approve does not write Jira'],
          ['Big Rocks Google Doc → OP config', 'doc-import', 'OP-only Big Rocks source'],
          ['Product Pages / Smartsheet → health milestones', 'OAuth / token', 'OP health only'],
        ]}
        rowTone={[
          'success',
          'info',
          'warning',
          'info',
          'warning',
          'danger',
          'danger',
          'warning',
          'info',
          'info',
        ]}
      />

      <H3>Secrets / config gates</H3>
      <Table
        headers={['System', 'Keys']}
        rows={[
          ['RP CI', 'JIRA_USER, JIRA_API_TOKEN, GITLAB_FEATURE_TRAFFIC_TOKEN, GITLAB_PUSH_TOKEN, GCP/Claude'],
          ['OP execution', 'FEATURE_TRAFFIC_GITLAB_TOKEN / GITLAB_TOKEN; config.enabled default false'],
          ['OP draft-plans', 'DRAFT_PLANS_GITLAB_TOKEN / GITLAB_TOKEN; config.enabled default false; viewer allowlist defaults to one email'],
          ['OP planning/health', 'platform jira; PRODUCT_PAGES_*; SMARTSHEET_API_TOKEN'],
        ]}
      />

      <Divider />

      <H2>What must change to meet the goal</H2>
      <Stack gap={8}>
        <Text>
          1. Pick one Priority, one Readiness, one Capacity model for Create.
        </Text>
        <Text>
          2. Implement one Create job that outputs
          <Code> drafts/RHOAI/&#123;version&#125;.json </Code>
          (candidates with basePlacement EA1|EA2|GA|Below cut, ceilings,
          rank, ready flags) for a single cycle.
        </Text>
        <Text>
          3. Publish that file where draft-plans fetch can load it (or write
          storage directly). Stop pretending release-plan.json is the editor
          base.
        </Text>
        <Text>
          4. Keep Org Pulse for Review / Modify / Approve (freeze), plus the
          refresh and Jira commit loop below.
        </Text>
        <Text>
          5. Document or delete Path C (xlsx/external). Locate that builder or
          stop depending on a fixture.
        </Text>
        <Text>
          6. Add the missing DRAFT-PLAN-EDITOR-CONTRACT (or remove the claim)
          so Create and editor stay aligned.
        </Text>
      </Stack>

      <Divider />

      <H2>Implementation-plan constraints (parked — do not drop)</H2>
      <Callout tone="info" title="User requirement for later design">
        Jira Feature refresh into Org Pulse must be responsive (on-demand +
        short background cadence). Velocity history is weekly. What-if re-place
        runs in Org Pulse from current Features + edits (no Jira write). Commit
        changes applies keep / move / descope to Jira. Today: Feature refresh is
        not planner-responsive; what-if and Jira commit are missing.
      </Callout>

      <Divider />

      <H2>Locked decisions + recommendations</H2>
      <Callout tone="success" title="Agreed operating model">
        Org Pulse owns Create, what-if, dual PM/Assignee approval (soft freeze),
        hard freeze, and Jira Commit. Jira Features refresh responsively.
        Velocity is weekly and capacity is a warning only. Soft-frozen rows are
        never moved by Create/what-if, even when over capacity. Draft Plans is
        selectable across the next three release cycles; each Create covers
        EA1/EA2/GA for one cycle. Human sign-off prefers EA1 after the
        structural gate; strat labels + rubric scores enrich; FPDoR is detail
        only. No GitLab Create for what-if.
      </Callout>

      <Table
        headers={['Area', 'Decision', 'How to implement']}
        rows={[
          [
            'Jira Features (fast)',
            'On-demand + short background refresh',
            'Org Pulse ← Jira for ranking/Create',
          ],
          [
            'Rubric scores',
            'Fetch from strat-pipeline-data',
            'Attach by Feature key; enrichment + FPDoR detail',
          ],
          [
            'Jira labels',
            'With Feature refresh',
            'Human sign-off, rubric-pass, needs-attention',
          ],
          [
            'Human sign-off',
            'Strongest strat signal; EA1 preference after structural gate',
            'Never clears missing eng links/components; prominent UI',
          ],
          [
            'Priority (1–n)',
            'One Org Pulse scorer',
            'RICE + Big Rock position + Target Version + Jira Priority',
          ],
          [
            'Hard readiness',
            'Eng links + components required to schedule',
            'Cannot-schedule banner + Jira fix recommendations (1–n tray + draft)',
          ],
          [
            'Capacity',
            'Soft warning only (weekly p75)',
            'Prefer under ceiling; allow overrun with banner; soft freeze overrides',
          ],
          [
            'Create cadence',
            'On-demand + daily; denser in 2 weeks before freeze',
            'Per open cycle; what-if never on a timer',
          ],
          [
            'Events / cycles',
            'EA1/EA2/GA per cycle; next 3 cycles in UI',
            'Cycle selector; drafts/&#123;product&#125;/&#123;ver&#125;.json each',
          ],
          [
            'Soft freeze',
            'PM + Assignee both approve → pin placement',
            'Create/what-if must not move row; capacity overrun allowed with warn',
          ],
          [
            'Hard freeze',
            'Event / Final GA (plan admin)',
            'On top of soft freezes; stop auto-reshuffle of frozen events',
          ],
          [
            'What-if',
            'Local in Org Pulse',
            'Respect pins; output readiness + placement Jira recommendations',
          ],
          [
            'Commit',
            'Explicit Org Pulse → Jira',
            'TV/FV for keep/move/descope; separate from soft freeze',
          ],
        ]}
        rowTone={[
          'success',
          'info',
          'info',
          'success',
          'info',
          'success',
          'success',
          'success',
          'success',
          'success',
          'info',
          'warning',
          'info',
        ]}
      />

      <Divider />

      <H2>Proposed architecture</H2>
      <Text style={{ color: muted, fontSize: 12 }}>
        Fast Jira Features; weekly soft capacity; strat enrich; Create pins
        soft-frozen rows; Draft Plans across three cycles.
      </Text>
      <ProposedArchDiagram />

      <Table
        headers={['Path', 'Cadence', 'Contents', 'Owner']}
        rows={[
          [
            'Fast',
            'On-demand + short background',
            'RHAISTRAT Features + labels (eng links, components, human sign-off, …)',
            'Org Pulse ← Jira',
          ],
          [
            'Rubric enrich',
            'With / after Feature refresh',
            'Numeric dimension scores',
            'Org Pulse ← strat-pipeline-data',
          ],
          [
            'Slow capacity',
            'Weekly',
            'Component + team p75 (warnings only)',
            'Batch → Org Pulse storage',
          ],
          [
            'Create',
            'On-demand / daily / near-freeze',
            'Rank order 1…n → EA1/EA2/GA; respect soft-freeze pins; capacity warn',
            'Org Pulse → drafts per cycle',
          ],
          [
            'Interactive',
            'User actions',
            'Review, dual approval, what-if, hard freeze, Commit',
            'Org Pulse Draft Plans (3-cycle selector)',
          ],
          [
            'Write-back',
            'Explicit Commit',
            'Target Version / fixVersion',
            'Org Pulse → Jira',
          ],
        ]}
      />

      <Divider />

      <H2>Proposed workflow</H2>
      <ProposedWorkflowDiagram />
      <Table
        headers={['Step', 'What happens', 'Systems']}
        rows={[
          [
            '1. Refresh',
            'Pull Features + labels; load rubric scores from strat-pipeline-data',
            'OP ← Jira + strat-pipeline-data',
          ],
          [
            '2. Rank 1–n',
            'One Priority function; readiness recommendations; no FPDoR reorder',
            'Org Pulse',
          ],
          [
            '3. Create',
            'For selected cycle: place into EA1/EA2/GA; structural gate; human sign-off preference; soft capacity warn; never move soft-frozen rows',
            'Org Pulse',
          ],
          [
            '4. Review / edit',
            'Red-pen; readiness + capacity banners; enrichment visible',
            'Draft Plans',
          ],
          [
            '5. Soft freeze',
            'PM + Assignee both approve → pin (schedule will not move it out)',
            'Draft Plans',
          ],
          [
            '6. What-if',
            'Re-place respecting pins; Jira readiness + placement recommendations; no write',
            'Org Pulse',
          ],
          [
            '7. Hard freeze',
            'Event or Final GA (plan admin)',
            'Draft Plans',
          ],
          [
            '8. Commit',
            'Apply placement recommendations to Jira TV/FV',
            'OP → Jira',
          ],
        ]}
      />

      <Callout tone="warning" title="What-if (still settle in Phase 0)">
        Soft-frozen rows are hard pins (agreed). Still settle: named alternate
        vs overwrite; concurrent reviewers; refresh-before-what-if; whether
        unfrozen edits are hard pins or re-packed. Do not call GitLab.
      </Callout>

      <CollapsibleSection title="File index (current-state evidence)">
        <Stack gap={6}>
          <Text style={{ color: muted, fontSize: 12 }}>
            RP: .gitlab-ci.yml, push-results.py, prepare-features.py,
            auto_scheduler.py, forecast.py, fetch-*.py, SESSION.md, README.md,
            data/candidates-3.6-jira.json, data/big-rocks.json
          </Text>
          <Text style={{ color: muted, fontSize: 12 }}>
            OP: server/index.js, draft-plans/&#123;fetch,routes,normalize,acl,plan-admins,fixtures&#125;,
            client/plan/utils/draft-plan-model.js, useDraftPlans.js, PlanView.vue,
            planning/&#123;pipeline,cache-reader,cycle-candidates-jira,feature-readiness,fpdor&#125;,
            planning/health/&#123;health-pipeline,priority-scorer,health-routes&#125;,
            execution/scheduler.js, tv-fv-delta/routes.js, release-readiness/routes.js
          </Text>
        </Stack>
      </CollapsibleSection>

      <Callout tone="info" title="Implementation plan">
        Working plan (no code started): docs/DRAFT-RELEASE-PLANS-IMPLEMENTATION-PLAN.md
        in rhai-org-pulse. Next: Phase 0 — answer open questions and freeze the
        draft JSON / recommendation contract.
      </Callout>
      <Text style={{ color: muted, fontSize: 12, borderTop: `1px solid ${stroke}`, paddingTop: 12 }}>
        Proposed architecture/workflow synced with implementation plan
        (cadence, 3 cycles, dual approval, soft capacity). As-is deep dive
        sections above unchanged as evidence.
      </Text>
    </Stack>
  );
}

function ProposedArchDiagram() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    direction: 'vertical',
    nodeWidth: 148,
    nodeHeight: 42,
    rankGap: 48,
    nodeGap: 22,
    padding: 12,
    nodes: [
      { id: 'jira' },
      { id: 'strat' },
      { id: 'velJob' },
      { id: 'opFeat' },
      { id: 'opEnrich' },
      { id: 'opVel' },
      { id: 'rank' },
      { id: 'create' },
      { id: 'draft' },
      { id: 'editor' },
      { id: 'whatif' },
      { id: 'commit' },
    ],
    edges: [
      { from: 'jira', to: 'opFeat' },
      { from: 'strat', to: 'opEnrich' },
      { from: 'velJob', to: 'opVel' },
      { from: 'opFeat', to: 'rank' },
      { from: 'opFeat', to: 'create' },
      { from: 'opEnrich', to: 'create' },
      { from: 'opEnrich', to: 'editor' },
      { from: 'rank', to: 'create' },
      { from: 'opVel', to: 'create' },
      { from: 'create', to: 'draft' },
      { from: 'draft', to: 'editor' },
      { from: 'editor', to: 'whatif' },
      { from: 'whatif', to: 'draft' },
      { from: 'editor', to: 'commit' },
      { from: 'commit', to: 'jira' },
    ],
  });

  const labels: Record<string, string> = {
    jira: 'Jira RHAISTRAT',
    strat: 'strat-pipeline labels',
    velJob: 'Weekly velocity job',
    opFeat: 'OP Features (fast)',
    opEnrich: 'Rubric / label enrich',
    opVel: 'Velocity ceilings',
    rank: '1–n Priority ranker',
    create: 'Create (gate + pack)',
    draft: 'drafts/*.json',
    editor: 'Draft Plans review',
    whatif: 'What-if re-place',
    commit: 'Commit to Jira',
  };

  const slow = new Set(['velJob', 'opVel']);
  const enrich = new Set(['strat', 'opEnrich']);

  return (
    <Stack gap={6}>
      <svg
        width="100%"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{ maxWidth: layout.width, background: theme.bg.editor }}
      >
        {layout.edges.map((e, i) => {
          const isSlow = e.from === 'velJob' || e.to === 'opVel';
          const isEnrich = e.from === 'strat' || e.from === 'opEnrich';
          return (
            <line
              key={i}
              x1={e.sourceX}
              y1={e.sourceY}
              x2={e.targetX}
              y2={e.targetY}
              stroke={theme.stroke.primary}
              strokeWidth={1.25}
              strokeDasharray={isSlow || isEnrich ? '4 3' : undefined}
            />
          );
        })}
        {layout.nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={148}
              height={42}
              rx={4}
              fill={theme.fill.secondary}
              stroke={theme.stroke.primary}
              strokeDasharray={slow.has(n.id) || enrich.has(n.id) ? '4 3' : undefined}
            />
            <text
              x={n.x + 74}
              y={n.y + 25}
              textAnchor="middle"
              fill={theme.text.primary}
              fontSize={10}
            >
              {labels[n.id]}
            </text>
          </g>
        ))}
      </svg>
      <Text style={{ color: theme.text.secondary, fontSize: 12 }}>
        Solid = required path. Dashed = weekly velocity or strat-pipeline
        enrichment (not the structural Create gate).
      </Text>
    </Stack>
  );
}

function ProposedWorkflowDiagram() {
  const theme = useHostTheme();
  const layout = computeDAGLayout({
    direction: 'horizontal',
    nodeWidth: 100,
    nodeHeight: 48,
    rankGap: 32,
    nodeGap: 16,
    padding: 10,
    nodes: [
      { id: 'r' },
      { id: 'n' },
      { id: 'c' },
      { id: 'e' },
      { id: 's' },
      { id: 'w' },
      { id: 'f' },
      { id: 'j' },
    ],
    edges: [
      { from: 'r', to: 'n' },
      { from: 'n', to: 'c' },
      { from: 'c', to: 'e' },
      { from: 'e', to: 's' },
      { from: 's', to: 'e' },
      { from: 'e', to: 'w' },
      { from: 'w', to: 'e' },
      { from: 'e', to: 'f' },
      { from: 'f', to: 'j' },
    ],
  });

  const labels: Record<string, string> = {
    r: 'Refresh',
    n: 'Rank 1–n',
    c: 'Create',
    e: 'Review',
    s: 'Soft freeze',
    w: 'What-if',
    f: 'Hard freeze',
    j: 'Commit',
  };

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ maxWidth: layout.width, background: theme.bg.editor }}
    >
      {layout.edges.map((e, i) => (
        <line
          key={i}
          x1={e.sourceX}
          y1={e.sourceY}
          x2={e.targetX}
          y2={e.targetY}
          stroke={theme.stroke.primary}
          strokeWidth={1.5}
          strokeDasharray={e.from === 'w' || e.to === 'w' ? '4 3' : undefined}
        />
      ))}
      {layout.nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x}
            y={n.y}
            width={100}
            height={48}
            rx={4}
            fill={theme.fill.secondary}
            stroke={theme.stroke.primary}
          />
          <text
            x={n.x + 50}
            y={n.y + 28}
            textAnchor="middle"
            fill={theme.text.primary}
            fontSize={10}
          >
            {labels[n.id]}
          </text>
        </g>
      ))}
    </svg>
  );
}

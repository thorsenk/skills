# Domain Modeling Behavioral Evaluation

Run each case in a fresh, non-persistent, read-only host session with the skill invoked explicitly. Judge behavior rather than exact wording. Do not give the host the pass criteria in its task prompt.

Use the host's native explicit invocation:

- Codex: prefix the task with `Use $domain-modeling to`.
- Claude Code: prefix the task with `/domain-modeling` on its own line.

Keep each host's skill-loading capability enabled. When limiting Claude Code's tools, include its `Skill` tool or use the default tool set with write tools disabled. In non-interactive `dontAsk` runs outside the skill repo, add the installed skill target with `--add-dir` so its reference files remain readable.

## Case 1: Evidence-rich audit

Fixture: A small documented order-fulfillment project with defined terms, state transitions, invariants, and ownership boundaries.

Task: `Audit the documentation in this project. Do not edit files.`

Pass criteria:

- selects audit mode;
- cites local files for project claims;
- scores all rubric dimensions, including Domain Evidence Quality;
- distinguishes strengths, gaps, and unresolved claims;
- does not seek external subject knowledge when local evidence is sufficient.

## Case 2: Thin greenfield exercise

Fixture: A project brief with a goal but no defined concepts, rules, states, or evidence.

Task: `Help establish the domain model for this project. Do not edit files.`

Pass criteria:

- selects exercise mode;
- asks no more than two focused questions in the first response;
- does not invent missing domain facts;
- identifies the claims or decisions that still require evidence;
- does not present a finished Domain Contract before enough information exists.

## Case 3: Missing subject knowledge

Fixture: A product brief that depends on an external regulated-domain rule but provides no supporting source.

Task: `Draft the domain model from this project documentation. Do not edit files.`

Pass criteria:

- inspects local evidence first;
- identifies the material external knowledge gap;
- researches a relevant primary source when tools permit, or leaves the claim unresolved when they do not;
- separates project decisions, stakeholder statements, external facts, and inference;
- records confidence and conflicts without treating general knowledge as evidence.

## Host parity

Codex and Claude Code do not need matching prose. They pass parity when they choose the same mode, respect the same evidence boundary, and reach compatible conclusions for each case.

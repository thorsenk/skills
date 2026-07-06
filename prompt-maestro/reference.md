# Prompt Maestro Reference

Use this reference to classify prompts and calibrate the review.

## Classification Taxonomy

Classify the prompt on these axes.

### Primary Type

- **Audit / review prompt**: asks an agent to inspect, critique, score, or report risks.
- **Implementation prompt**: asks an agent to change files, build, fix, refactor, migrate, or configure something.
- **Research / synthesis prompt**: asks for source gathering, comparison, summarization, or recommendations.
- **Extraction / transformation prompt**: asks for structured data, conversion, cleanup, parsing, or reformatting.
- **Classification / routing prompt**: asks the model to label, triage, choose a path, or dispatch work.
- **Planning prompt**: asks for a plan, strategy, roadmap, checklist, or execution sequence.
- **Creative / generation prompt**: asks for copy, images, concepts, names, stories, scripts, or design directions.
- **Analysis / decision prompt**: asks for tradeoffs, diagnosis, scoring, prioritization, or a recommendation.
- **Agent / skill prompt**: defines behavior for an agent, skill, system instruction, or reusable workflow.
- **Evaluation prompt**: grades outputs, compares candidates, or checks quality against a rubric.
- **Automation prompt**: creates reminders, monitors, recurring checks, scheduled work, or external actions.

### Context Dependency

- **Self-contained**: the prompt contains enough context to run.
- **Workspace-bound**: the prompt depends on files, repo state, local instructions, tests, or runtime behavior.
- **Attachment-bound**: the prompt depends on a pasted document, image, transcript, spreadsheet, PDF, or dataset.
- **External-current**: the prompt depends on news, prices, law, schedules, product docs, APIs, or other changing outside facts.
- **Memory-dependent**: the prompt assumes prior decisions, user preferences, or session history.

### Lifecycle

- **One-shot**: meant for a single run.
- **Iterative**: meant to support follow-up loops.
- **Reusable**: meant to be saved and reused across sessions.
- **Handoff**: meant for another person or agent to execute later.
- **Instruction package**: meant to become a skill, system message, app instruction, or internal standard.

### Risk Level

- **Low**: wording quality, brainstorming, formatting, low-stakes summarization.
- **Medium**: workspace inspection, minor edits, non-public documents, moderate ambiguity.
- **High**: code changes, data mutation, publication, private data, financial impact, legal/medical claims, broad audits, external-system actions.
- **Critical**: destructive actions, credential handling, irreversible publication, production changes, regulated advice, or prompts that could expose sensitive data.

## Audit Rubric

Score the prompt against the relevant items. Not every prompt needs every item.

- **Objective clarity**: states the real goal and what success looks like.
- **Target clarity**: names the artifact, files, workspace, input, user, audience, or decision being handled.
- **Context grounding**: tells the executor what to inspect, what to ignore, and how to handle missing context.
- **Scope boundaries**: separates in-scope, out-of-scope, deferred, and optional work.
- **Autonomy boundaries**: says whether to inspect, plan, edit, execute, ask, commit, publish, or stop.
- **Output contract**: defines format, level of detail, ranking method, required sections, and what not to include.
- **Evidence and verification**: requires credible checks, citations, file references, test results, or confidence labels where useful.
- **Risk handling**: names privacy, security, safety, accuracy, rollback, failure, and external-action concerns where relevant.
- **Model and tool fit**: matches the task to the right tools, browsing needs, file access, runtime checks, or specialized skills.
- **Ambiguity control**: avoids vague words such as "best", "deep", "comprehensive", "robust", or "priority" unless the ranking function is defined.

## Scoring Calibration

- **90-100**: Ready. Only small polish remains.
- **75-89**: Usable with edits. Some non-blocking ambiguity or validation weakness remains.
- **60-74**: Material edits needed before confident use.
- **40-59**: Significant ambiguity, missing context, or execution risk.
- **0-39**: Not safe or useful to run as written.

Score caps:

- Cap at **59** if the prompt could cause the executor to solve the wrong problem.
- Cap at **74** if a high-risk action lacks clear boundaries or verification.
- Cap at **89** if the output contract or acceptance criteria are incomplete.

## Report Requirements

Prompt Maestro reports should explain scoring visually. Use
[references/visual-report.md](references/visual-report.md) for the artifact
format and [report-template.html](report-template.html) for a starter template.

## Common Failure Modes

- The prompt asks for "best" or "top" results without a ranking method.
- The prompt requests a broad audit but starts from one recent issue, causing recency bias.
- The prompt hard-codes state that should be verified live.
- The prompt asks for fixes while also saying "review only".
- The prompt has no stop condition, acceptance criteria, or handoff format.
- The prompt asks for citations but does not say what kind of evidence counts.
- The prompt tells the agent to be exhaustive without bounding time, scope, files, or output.
- The prompt hides a high-risk action inside casual language.
- The prompt includes roleplay that does not improve task performance.
- The prompt assumes a tool, model, connector, or external service is available without saying what to do if it is not.

## Good Prompt Shape

For most reusable prompts, prefer this order:

```text
Goal
Context to inspect
What to ignore
Constraints and autonomy
Process
Output format
Validation or evidence requirements
Stop conditions and open questions
```

Keep examples only when they reduce ambiguity. Remove examples that pull the executor toward a narrow case.

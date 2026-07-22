# Domain Modeling Exercise

Use this when there is no mature model to audit or when an audit says the project needs model hardening.

## First-response gate

By default, the first response summarizes confirmed evidence, asks exactly one or two high-leverage questions, and stops. Do not draft the contract or propose concepts, states, rules, or implementation guidance until the answers provide enough evidence. Draft immediately only when the user explicitly asks for a full draft without interviews, and leave unsupported content unresolved.

## Exercise flow

1. Frame the domain
   - What real-world system is being modeled?
   - What is the product's core object of value?
   - What is explicitly out of scope?

2. Establish shared language
   - List terms users, docs, code, and tests must share.
   - Mark forbidden synonyms and ambiguous terms.
   - Define each term in business language before technical structure.

3. Identify concepts
   - Separate kinds, templates, scoped definitions, instances, events, policies, outputs, and actors.
   - Flag concepts that share a name but mean different things in different contexts.

4. Model lifecycles and states
   - Identify independent state axes.
   - Define valid values, transitions, reset rules, terminal states, and derived display states.
   - Avoid one-field status models unless all states are genuinely mutually exclusive.

5. Model relationships
   - Identify references, containment, lineage, replacement, dependency, ownership, taxonomy, graph edges, and semantic bridges.
   - Name relationship types explicitly.
   - Clarify which relationships change ownership, permissions, or decision rights.

6. Find boundaries
   - Group concepts by language, rules, volatility, ownership, and workflow.
   - Mark candidate bounded contexts or modules.
   - Identify adapters where external or generated formats meet the core model.

7. Extract rules and invariants
   - Separate hard invariants from advisory or audit findings.
   - Define who or what can change each rule.
   - Turn important rules into behavior-test candidates.

8. Define outputs
   - Identify neutral primary artifacts.
   - Identify adapters, projections, generated packages, reports, or UI views.
   - State which outputs are primary and which are derived.

9. Resolve evidence
   - Record whether each material claim is a project decision, stakeholder statement, external fact, or inference.
   - Record its source, confidence, and conflicts.
   - Leave unsupported or conflicting claims open instead of hiding them in implementation.

## High-leverage questions

Ask these one or two at a time:

- What is the unit of value that the product protects or improves?
- Which terms must never be used interchangeably?
- What can exist globally versus only inside a specific context?
- Which states are independent axes rather than one lifecycle?
- What operation changes ownership or permissions, and what must happen to existing records?
- Which relationships imply semantic equivalence, and which are just references?
- What findings should warn the user but never block progress?
- What artifact is primary, and what artifacts are generated adapters?
- Which rules must survive UI redesigns, storage changes, and export changes?
- What would be dangerous to implement in a route or component instead of a domain module?

## Domain Contract template

```md
# Domain Contract

## Purpose

## Shared Language

| Term | Definition | Forbidden Synonyms / Notes |
| --- | --- | --- |

## Core Concepts

| Concept | Meaning | Scope | Notes |
| --- | --- | --- | --- |

## Contexts and Boundaries

| Context | Owns | Does Not Own | Interfaces |
| --- | --- | --- | --- |

## Lifecycles and States

| Concept | State Axis | Values | Transition Rules |
| --- | --- | --- | --- |

## Relationships

| Relationship | From | To | Meaning | Ownership / Permission Effect |
| --- | --- | --- | --- | --- |

## Rules and Invariants

| Rule | Type | Enforcement | Test Candidate |
| --- | --- | --- | --- |

## Workflows

| Workflow | Trigger | Decisions | Outputs |
| --- | --- | --- | --- |

## Audit / Quality Rules

| Finding | Severity | Blocking? | Evidence |
| --- | --- | --- | --- |

## Evidence Register

| Claim | Evidence Type | Source | Confidence | Conflict / Gap |
| --- | --- | --- | --- | --- |

## Open Questions

## Implementation Notes
```

## Completion criteria

The exercise is complete enough to implement when:

- the core object of value is named;
- shared terms are defined;
- the main concepts are separated;
- independent state axes are identified;
- high-risk invariants are testable;
- derived outputs are separated from primary data;
- material claims are sourced or explicitly unresolved;
- open questions are explicit rather than hidden in implementation.

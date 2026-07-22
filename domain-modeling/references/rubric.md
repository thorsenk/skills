# Domain Modeling Audit Rubric

Use this rubric for documentation-level domain modeling audits. Score each dimension from 0 to 5. Use `N/A` only when a dimension truly does not apply; do not use it for missing evidence.

## Scoring scale

- 0: absent or actively misleading
- 1: named but vague, inconsistent, or not actionable
- 2: partially present; useful but leaves major ambiguity
- 3: adequate; implementation can proceed with manageable risk
- 4: strong; rules and language are explicit with minor gaps
- 5: excellent; precise, testable, and well integrated across docs

## Dimensions

1. Core Domain Clarity
   - The docs state the problem domain, the core object of value, and what the product does not do.

2. Shared Language
   - Terms are defined once and used consistently. Competing synonyms are rejected or mapped.

3. Concept Separation
   - Key concepts are separated by meaning, not UI convenience or persistence shape.

4. Lifecycle and State Modeling
   - Independent state axes are separated. Transitions, terminal states, and invalid combinations are clear.

5. Rules and Invariants
   - Business rules, advisory rules, validation rules, and invariant-preserving operations are explicit.

6. Workflow and Event Clarity
   - User decisions, commands, events, generated outputs, and non-blocking or advisory flows are distinguishable.

7. Relationship Modeling
   - Graphs, taxonomies, lineage, dependencies, references, and semantic relationship types are explicit.

8. Context and Boundary Clarity
   - The model identifies separable subdomains or bounded contexts and clarifies what belongs inside and outside each.

9. Ownership and Decision Semantics
   - Responsibility, review, permissions, collaboration, and single-user constraints are modeled accurately.

10. Persistence, Export, and Versioning Readiness
    - Serialization, schema versions, migrations, manifests, exported packages, and primary-data rules are coherent.

11. Auditability and Quality Rules
    - The product can detect gaps and communicate findings without confusing advisory checks with blocking validation.

12. Implementation Testability
    - The model implies behavior tests, policy tests, schema tests, or invariant tests through stable public interfaces.

13. Domain Evidence Quality
    - Material claims are traceable to project evidence, stakeholder statements, or relevant primary external sources. Confidence, conflicts, freshness, and knowledge gaps are explicit.

## Overall grade

Compute percentage as:

`earned_points / applicable_points * 100`

Map to:

- 90–100: Excellent domain contract
- 75–89: Strong; implementation-ready with targeted gaps
- 60–74: Usable but risky; model hardening needed before broad UI work
- 40–59: Weak; run a domain modeling exercise before implementation
- 0–39: Not auditable as a domain model; start with discovery or exercise mode

## Finding format

```md
[Severity] Finding title
Evidence:
- file, link, quote, or paraphrased source

Why it matters:
- concrete implementation or product risk

Recommendation:
- domain artifact, invariant, test, schema, or workflow change
```

Severity:

- Critical: likely to corrupt core behavior or product framing
- High: likely to scatter rules or create user-visible confusion
- Medium: meaningful ambiguity or missing model detail
- Low: cleanup, naming, or future-hardening issue

## Audit heuristics

Raise risk when:

- one `status` field carries multiple independent meanings;
- templates, documents, blueprints, examples, or instances are conflated;
- UI routes own business rules;
- an export shape becomes the primary data model;
- advisory checks block core actions without explicit product intent;
- multiple graph projections are treated as one graph;
- regulated or compliance language implies sufficiency without disclaimers;
- terms in copy differ from terms in tests, types, or schemas.

Give credit when:

- anti-requirements protect model scope;
- primary-data rules are explicit;
- state-transition policy is isolated;
- terminology is defined and consistently enforced;
- audit findings are stored as domain objects;
- adapters are generated from neutral models rather than becoming the primary model.

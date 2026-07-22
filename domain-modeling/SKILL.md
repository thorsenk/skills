---
name: domain-modeling
description: Audit or establish a project's domain model using project evidence and, when needed, external subject-matter research. Use for Domain-Driven Design (DDD), ubiquitous language, bounded contexts, context maps, domain contracts, business rules, entities, states, workflows, or deciding whether domain modeling is needed. Supports evidence-based audit and guided exercise modes.
---

# Domain Modeling

Make domain knowledge explicit before implementation spreads it across UI, storage, routes, tests, or prose.

## Choose the mode

Use `audit` mode when project or product documentation exists and can be inspected.

Use `exercise` mode when documentation is missing, aspirational, or too thin to score; the project is greenfield; or the user asks to create a domain model, contract, glossary, or shared language.

If the user asks whether domain modeling is needed, run a lightweight audit first and recommend either a full audit or the exercise.

Done when the selected mode matches the available evidence and the user's requested outcome.

## Gather evidence

1. Inspect documentation before code unless the user asks for code-level DDD review. Include product docs, PRDs, specs, ADRs, architecture notes, route maps, data-model docs, export schemas, behavior tests, and README files. Prefer `rg --files` when available.
2. Run `scripts/collect_domain_docs.py <project-root>` when a documentation inventory or terminology leads would help. Treat its terms as heuristic candidates until project evidence confirms them.
3. If the model depends on material subject knowledge that is missing locally, research relevant primary sources with the available tools. If research is unavailable, request sources or leave the claim unresolved. Training or remembered knowledge is not evidence: it must not appear as an established fact or drive rules, invariants, or contract content. A remembered possibility may appear only as an explicitly unverified research lead.
4. For each material claim, track its evidence type, source, confidence, and conflicts. Distinguish project decisions, stakeholder statements, external facts, and inference.
5. Preserve the project's defined vocabulary. Do not introduce synonyms when the evidence already distinguishes the terms.

Done when material claims are supported, explicitly inferred, or left unresolved.

## Audit mode

Read `references/rubric.md` before scoring. Use all 13 rubric dimensions exactly as named; do not replace, rename, combine, or omit them.

Audit the documented product model, not just its data shapes. Examine:

- purpose, core object of value, and scope;
- defined vocabulary and competing terms;
- concepts, lifecycles, states, relationships, and boundaries;
- rules, invariants, permissions, workflows, commands, and events;
- ownership, persistence, exports, versioning, review, and audit constraints;
- places where implementation could scatter domain behavior.

Return a verdict, scorecard, strong signals, gaps and risks, recommended artifacts, highest-priority invariants, suggested next exercise, and linked evidence.

Done when every score and finding is traceable to evidence and every material gap is explicit.

## Exercise mode

Read `references/exercise.md` before facilitating or drafting the exercise. In the first exercise response, summarize the confirmed evidence, ask exactly one or two high-leverage questions, and then stop. Do not draft a Domain Contract, candidate concepts, states, rules, or implementation guidance until the answers provide enough evidence. The exception is an explicit user request for a full draft without interviews; mark unsupported content unresolved rather than inventing it.

Use the Domain Contract template and completion criteria in that reference. Offer to save the contract only when the user asks for an artifact or implementation work.

Done when the contract meets the reference's completion criteria or clearly lists what remains unresolved.

## Ground sources

Read `references/sources.md` when methodology needs support or attribution. Those sources explain DDD; they do not replace research into the user's subject domain.

## Quality bar

- Treat domain modeling as product and architecture work, not a class-diagram exercise.
- Prefer behavior, rules, language, and boundaries over generic entity lists.
- Avoid heavyweight DDD ceremony for simple products and say when tactical patterns are unnecessary.
- Make scores explainable with evidence.
- Keep recommendations implementable as tests, schemas, docs, or module boundaries.

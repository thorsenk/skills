#!/usr/bin/env python3
"""Inventory project documentation and surface domain-modeling signals."""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
from collections import Counter
from pathlib import Path


DOC_EXTENSIONS = {
    ".md",
    ".mdx",
    ".txt",
    ".rst",
    ".adoc",
    ".org",
    ".yml",
    ".yaml",
    ".json",
}

DEFAULT_EXCLUDED_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".next",
    ".nuxt",
    ".turbo",
    ".vercel",
    ".playwright-mcp",
    "coverage",
    "dist",
    "build",
    "node_modules",
    "vendor",
    "__pycache__",
}

KEYWORDS = (
    "domain",
    "domain model",
    "entity",
    "concept",
    "state",
    "status",
    "lifecycle",
    "workflow",
    "rule",
    "invariant",
    "policy",
    "relationship",
    "ontology",
    "taxonomy",
    "ownership",
    "audit",
    "export",
    "manifest",
    "schema",
    "bounded context",
    "ubiquitous language",
    "primary data",
)

GENERIC_TERMS = {
    "add",
    "agent",
    "agents",
    "ask",
    "avoid",
    "before",
    "contents",
    "create",
    "done",
    "each",
    "example",
    "examples",
    "keep",
    "mark",
    "medium",
    "never",
    "non",
    "no",
    "notes",
    "optional",
    "output",
    "outputs",
    "overview",
    "primary",
    "preserve",
    "purpose",
    "read",
    "readme",
    "required",
    "score",
    "separate",
    "skill",
    "skills",
    "scope",
    "treat",
    "use",
    "user",
    "verify",
    "when",
    "yes",
}

LEADING_TERM_STOPWORDS = {
    "a",
    "after",
    "all",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "can",
    "during",
    "for",
    "from",
    "has",
    "if",
    "in",
    "into",
    "is",
    "it",
    "may",
    "must",
    "not",
    "of",
    "on",
    "only",
    "or",
    "should",
    "that",
    "the",
    "their",
    "these",
    "they",
    "this",
    "those",
    "to",
    "when",
    "where",
    "which",
    "while",
    "with",
    "you",
    "your",
}

TABLE_HEADERS = {
    "claim",
    "concept",
    "context",
    "finding",
    "item",
    "name",
    "relationship",
    "rule",
    "skill",
    "term",
    "workflow",
}

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
TABLE_ROW_RE = re.compile(r"^\s*\|(.+)\|\s*$")
TABLE_DIVIDER_RE = re.compile(r"^:?-{3,}:?$")
TERM_RE = re.compile(r"\b[A-Z][A-Za-z0-9]*(?:[ \t]+[A-Z][A-Za-z0-9]*){0,4}\b")
MARKDOWN_LINK_RE = re.compile(r"\[([^]]+)]\([^)]+\)")
KEYWORD_PATTERNS = {
    keyword: re.compile(rf"(?<!\w){re.escape(keyword)}(?!\w)", re.IGNORECASE)
    for keyword in KEYWORDS
}


def is_excluded(relative: Path, excluded_dirs: set[str], excluded_patterns: list[str]) -> bool:
    if any(part in excluded_dirs for part in relative.parts):
        return True
    relative_text = relative.as_posix()
    return any(fnmatch.fnmatch(relative_text, pattern) for pattern in excluded_patterns)


def is_excluded_directory(
    relative: Path,
    excluded_dirs: set[str],
    excluded_patterns: list[str],
) -> bool:
    relative_text = relative.as_posix().rstrip("/") + "/"
    return is_excluded(relative, excluded_dirs, excluded_patterns) or any(
        fnmatch.fnmatch(relative_text, pattern) for pattern in excluded_patterns
    )


def iter_docs(
    root: Path,
    max_bytes: int,
    excluded_dirs: set[str],
    excluded_patterns: list[str],
) -> list[Path]:
    docs: list[Path] = []
    for directory, child_dirs, filenames in os.walk(root):
        directory_path = Path(directory)
        directory_relative = directory_path.relative_to(root)
        child_dirs[:] = [
            name
            for name in child_dirs
            if not is_excluded_directory(
                directory_relative / name,
                excluded_dirs,
                excluded_patterns,
            )
        ]
        for filename in filenames:
            path = directory_path / filename
            relative = path.relative_to(root)
            if (
                is_excluded(relative, excluded_dirs, excluded_patterns)
                or path.suffix.lower() not in DOC_EXTENSIONS
            ):
                continue
            try:
                if path.stat().st_size > max_bytes:
                    continue
            except OSError:
                continue
            docs.append(path)
    return sorted(docs)


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def normalize_term(value: str) -> str | None:
    cleaned = MARKDOWN_LINK_RE.sub(r"\1", value)
    cleaned = re.sub(r"[`*_~]", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" \t:;,.!?()[]{}<>|/\\")
    words = cleaned.split()
    while len(words) > 1 and words[0].casefold() in LEADING_TERM_STOPWORDS:
        words.pop(0)
    cleaned = " ".join(words)
    if not 3 <= len(cleaned) <= 80:
        return None
    if (
        len(cleaned.split()) > 8
        or cleaned.casefold() in GENERIC_TERMS
        or cleaned.casefold() in LEADING_TERM_STOPWORDS
    ):
        return None
    if cleaned.startswith(("http://", "https://")):
        return None
    return cleaned


def add_term(stats: dict[str, dict], value: str, signal: str, count: int = 1) -> None:
    term = normalize_term(value)
    if not term:
        return
    key = term.casefold()
    entry = stats.setdefault(
        key,
        {"term": term, "mentions": 0, "signals": Counter()},
    )
    entry["mentions"] += count
    entry["signals"][signal] += count


def extract_json_schema_terms(text: str, stats: dict[str, dict]) -> None:
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return

    def walk(value: object) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                if key in {"$defs", "definitions", "schemas"} and isinstance(child, dict):
                    for name in child:
                        add_term(stats, name, "schema")
                elif key == "title" and isinstance(child, str):
                    add_term(stats, child, "schema")
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(data)


def extract_term_stats(text: str, path: Path) -> dict[str, dict]:
    stats: dict[str, dict] = {}

    for line in text.splitlines():
        heading_match = HEADING_RE.match(line)
        if heading_match:
            add_term(stats, heading_match.group(2), "heading")

        table_match = TABLE_ROW_RE.match(line)
        if not table_match:
            continue
        cells = [cell.strip() for cell in table_match.group(1).split("|")]
        if not cells or all(TABLE_DIVIDER_RE.fullmatch(cell) for cell in cells):
            continue
        first_cell = normalize_term(cells[0])
        if first_cell and first_cell.casefold() not in TABLE_HEADERS:
            add_term(stats, first_cell, "table")

    for term, count in Counter(TERM_RE.findall(text)).items():
        add_term(stats, term, "text", count)

    if path.suffix.lower() == ".json":
        extract_json_schema_terms(text, stats)

    return stats


def term_score(entry: dict, document_count: int = 1) -> int:
    signals = entry["signals"]
    structured = signals.get("table", 0) * 5 + signals.get("schema", 0) * 5 + signals.get("heading", 0) * 3
    return document_count * 6 + min(entry["mentions"], 25) + structured


def public_term(entry: dict, document_count: int = 1) -> dict:
    return {
        "term": entry["term"],
        "mentions": entry["mentions"],
        "document_count": document_count,
        "signals": dict(entry["signals"].most_common()),
        "score": term_score(entry, document_count),
    }


def summarize_file(root: Path, path: Path) -> dict:
    text = read_text(path)
    headings = [match.group(2).strip() for line in text.splitlines() if (match := HEADING_RE.match(line))]
    keyword_counts = {
        keyword: len(pattern.findall(text))
        for keyword, pattern in KEYWORD_PATTERNS.items()
        if pattern.search(text)
    }
    term_stats = extract_term_stats(text, path)
    ranked_terms = sorted(
        term_stats.values(),
        key=lambda entry: (-term_score(entry), entry["term"].casefold()),
    )
    return {
        "path": str(path.relative_to(root)),
        "bytes": path.stat().st_size,
        "headings": headings[:20],
        "keyword_counts": keyword_counts,
        "heuristic_terms": [public_term(entry) for entry in ranked_terms[:12]],
        "_term_stats": term_stats,
    }


def build_report(
    root: Path,
    max_bytes: int,
    excluded_dirs: set[str] | None = None,
    excluded_patterns: list[str] | None = None,
) -> dict:
    excluded_dirs = set(DEFAULT_EXCLUDED_DIRS if excluded_dirs is None else excluded_dirs)
    excluded_patterns = list(excluded_patterns or [])
    docs = iter_docs(root, max_bytes, excluded_dirs, excluded_patterns)
    file_summaries = [summarize_file(root, path) for path in docs]
    aggregate_keywords: Counter[str] = Counter()
    aggregate_terms: dict[str, dict] = {}

    for summary in file_summaries:
        aggregate_keywords.update(summary["keyword_counts"])
        for key, file_entry in summary.pop("_term_stats").items():
            aggregate = aggregate_terms.setdefault(
                key,
                {
                    "term": file_entry["term"],
                    "mentions": 0,
                    "documents": set(),
                    "signals": Counter(),
                },
            )
            aggregate["mentions"] += file_entry["mentions"]
            aggregate["documents"].add(summary["path"])
            aggregate["signals"].update(file_entry["signals"])

    ranked_aggregate = sorted(
        aggregate_terms.values(),
        key=lambda entry: (
            -term_score(entry, len(entry["documents"])),
            -len(entry["documents"]),
            entry["term"].casefold(),
        ),
    )
    return {
        "root": str(root),
        "doc_count": len(file_summaries),
        "excluded_dirs": sorted(excluded_dirs),
        "excluded_patterns": excluded_patterns,
        "files": file_summaries,
        "aggregate_keywords": aggregate_keywords.most_common(),
        "heuristic_term_candidates": [
            public_term(entry, len(entry["documents"])) for entry in ranked_aggregate[:25]
        ],
    }


def print_markdown(report: dict) -> None:
    print("# Domain Documentation Inventory")
    print()
    print(f"Root: `{report['root']}`")
    print(f"Documentation files scanned: {report['doc_count']}")
    print()
    print("## Aggregate Keyword Signals")
    for keyword, count in report["aggregate_keywords"][:30]:
        print(f"- {keyword}: {count}")
    print()
    print("## Heuristic Term Candidates")
    print()
    print("These are ranked leads, not confirmed project vocabulary.")
    print()
    for item in report["heuristic_term_candidates"]:
        signals = ", ".join(f"{name}={count}" for name, count in item["signals"].items())
        print(
            f"- {item['term']}: mentions={item['mentions']}, "
            f"documents={item['document_count']}, signals={signals}"
        )
    print()
    print("## Files")
    for file_info in report["files"]:
        print(f"### {file_info['path']}")
        print(f"- Bytes: {file_info['bytes']}")
        if file_info["headings"]:
            print("- Headings: " + " | ".join(file_info["headings"][:10]))
        if file_info["keyword_counts"]:
            pairs = [f"{key}={value}" for key, value in file_info["keyword_counts"].items()]
            print("- Keyword hits: " + ", ".join(pairs))
        if file_info["heuristic_terms"]:
            pairs = [
                f"{item['term']} ({item['mentions']})"
                for item in file_info["heuristic_terms"][:8]
            ]
            print("- Heuristic terms: " + ", ".join(pairs))
        print()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Project root to scan")
    parser.add_argument("--max-bytes", type=int, default=500_000, help="Skip files larger than this")
    parser.add_argument(
        "--exclude-dir",
        action="append",
        default=[],
        help="Exclude a directory name anywhere in the tree; repeat as needed",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        metavar="GLOB",
        help="Exclude a relative path glob such as 'plans/**'; repeat as needed",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of Markdown")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        parser.error(f"root is not a directory: {root}")

    excluded_dirs = set(DEFAULT_EXCLUDED_DIRS).union(args.exclude_dir)
    report = build_report(root, args.max_bytes, excluded_dirs, args.exclude)
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print_markdown(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

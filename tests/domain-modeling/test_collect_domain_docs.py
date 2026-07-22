#!/usr/bin/env python3

from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[2] / "domain-modeling" / "scripts" / "collect_domain_docs.py"
SPEC = importlib.util.spec_from_file_location("collect_domain_docs", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class CollectDomainDocsTests(unittest.TestCase):
    def test_ranks_structured_terms_and_cross_document_recurrence(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "glossary.md").write_text(
                """# Order Language

| Term | Definition |
| --- | --- |
| Purchase Order | A confirmed customer request. |

Create a Purchase Order. A statement is not lifecycle evidence.
""",
                encoding="utf-8",
            )
            (root / "workflow.md").write_text(
                "# Purchase Order Workflow\n\nA Purchase Order moves through fulfillment.\n",
                encoding="utf-8",
            )

            report = MODULE.build_report(root, 500_000)
            candidates = {item["term"]: item for item in report["heuristic_term_candidates"]}
            glossary = next(item for item in report["files"] if item["path"] == "glossary.md")

            self.assertEqual(candidates["Purchase Order"]["document_count"], 2)
            self.assertIn("table", candidates["Purchase Order"]["signals"])
            self.assertNotIn("Create", candidates)
            self.assertNotIn("state", glossary["keyword_counts"])

    def test_extracts_schema_names_and_honors_exclusions(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "schema.json").write_text(
                '{"$defs": {"Shipment": {"type": "object"}}}',
                encoding="utf-8",
            )
            (root / "plans").mkdir()
            (root / "plans" / "draft.md").write_text("# Unapproved Vocabulary\n", encoding="utf-8")
            (root / "node_modules").mkdir()
            (root / "node_modules" / "package-notes.md").write_text(
                "# Dependency Vocabulary\n",
                encoding="utf-8",
            )

            report = MODULE.build_report(root, 500_000, excluded_patterns=["plans/**"])
            candidates = {item["term"]: item for item in report["heuristic_term_candidates"]}

            self.assertEqual(report["doc_count"], 1)
            self.assertIn("schema", candidates["Shipment"]["signals"])
            self.assertNotIn("Unapproved Vocabulary", candidates)
            self.assertNotIn("Dependency Vocabulary", candidates)


if __name__ == "__main__":
    unittest.main()

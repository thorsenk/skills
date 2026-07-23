# Cool-Gray Marker Wireframes evaluation rubric

## Current stop condition

This rubric cannot return `PASS` while package status is `BLOCKED`. First approve the materials-only real-marker evidence set. Do not score desktop or mobile screens during the mark-making recalibration.

## Material gate

Before color accuracy, verify visible chisel direction and width, longitudinal streaking, translucent single-pass coverage, darker overlap buildup, localized pooling, subtle capillary feathering, one-pass/two-pass/blended differences, graphite over and beside marker, and acceptable versus excessive bleeding. Reject any specimen that reads as a CSS fill, vector shape, airbrush shading, watercolor wash, or generic paper texture.

Score each criterion from 0–2, multiply by weight, and divide by the maximum weighted score. A score of 0 on any critical criterion is an automatic reject.

| Criterion | Weight | Critical |
|---|---:|---|
| Recognizable cool-gray alcohol-marker character | 3 | Yes |
| Medium-soft graphite line character | 3 | Yes |
| Protected perimeter and visible whitespace | 3 | Yes |
| UX hierarchy and conceptual clarity | 3 | Yes |
| Three-value gray palette and low saturation | 2 | Yes |
| Restrained annotation treatment | 2 | No, unless clarification is required |
| Refined conceptual-sketch fidelity | 2 | Yes |
| Surface-appropriate scale and density | 2 | Yes |
| Content legibility | 2 | Yes |
| Prohibited-trait avoidance | 3 | Yes |

## Decisions

- `PASS`: no critical 0 and normalized score at least 85%.
- `REVISE`: recognizable direction with one or more correctable family-level failures.
- `REJECT`: any critical 0, wrong image-role handling, major drift, or imitation of the anti-reference.

## Critical checks

Reject when the output is a generic grayscale digital wireframe; substitutes texture overlays, random noise, blurred fills, SVG displacement, or uniformly translucent rectangles for material behavior; uses glossy depth or bright color; crowds the canvas edge; changes supplied information architecture during restyling; compresses multiple requested screens into one image; or loses readable hierarchy under content pressure.

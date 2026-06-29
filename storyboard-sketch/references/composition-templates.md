# Composition Templates

> Scope: this file elaborates craft for **style A** (`rough_notebook_storyboard`) only. Styles B–F follow their locked contracts in [../reference.md](../reference.md).

## Zone Model

Every concept storyboard sketch is composed of zones. Four are required; one is optional.

| Zone | Name | Required | Purpose |
|------|------|----------|---------|
| A | Interface Concept | Yes | Wireframes, app screens, navigation, layout blocks, content modules |
| B | Interaction Logic | Yes | Arrows, transitions, state changes, workflow steps, user movement |
| C | Brand Exploration | Yes | Logo roughs, color swatches, tone adjectives, symbol experiments, identity fragments |
| D | Annotation Layer | Yes | Callout boxes, handwritten labels, explanatory notes, section headings, hierarchy cues |
| E | Spatial / Product | No | Device form, workspace scene, physical touchpoint, environmental framing |

### Zone Placement Rules
- Zones can overlap (annotations layer on top of interface zone)
- Zones are not rigid quadrants — they flow organically across the page
- At least 2 zones must be visually dominant; others can be peripheral
- Zone D (Annotations) is always distributed across other zones, not isolated

---

## Template A: Balanced Concept Board

**Best for:** SaaS dashboards, web apps, general product concepts

**Layout:**
- Center-left: Zone A (primary wireframes, 40% of page)
- Center-right: Zone B (flow arrows connecting screens, 25%)
- Top-right corner: Zone C (brand swatches and logo roughs, 15%)
- Distributed: Zone D (labels and callouts scattered throughout, 20%)

**Diagrammatic/Spatial:** 80/20

**When to use:** Default for most UX-heavy requests. Strong interface focus with supporting flow logic.

---

## Template B: UX Review Board

**Best for:** Design reviews, usability explorations, multi-screen flows

**Layout:**
- Top row: 3-4 screen states side by side (Zone A, 35%)
- Middle: Flow arrows and transition logic connecting screens (Zone B, 30%)
- Bottom-left: Annotation cluster with design rationale (Zone D, 20%)
- Bottom-right: Brand/style fragments (Zone C, 15%)

**Diagrammatic/Spatial:** 90/10

**When to use:** When the request emphasizes user flows, screen states, or interaction sequences.

---

## Template C: Product + Interface Fusion Board

**Best for:** Smart devices, kiosks, IoT, mixed digital/physical products

**Layout:**
- Center: Zone E (device/product form in slight perspective, 30%)
- Surrounding: Zone A (UI screens radiating from device, 25%)
- Connecting: Zone B (arrows from device to UI states, 15%)
- Top or side: Zone C (brand identity fragments, 15%)
- Distributed: Zone D (callouts pointing to device features and UI elements, 15%)

**Diagrammatic/Spatial:** 50/50 or 40/60

**When to use:** When the concept involves a physical product, device, kiosk, or environment. Zone E is mandatory here.

---

## Template D: Service / Ecosystem Board

**Best for:** Platforms, service blueprints, multi-touchpoint systems, API ecosystems

**Layout:**
- Center: Zone B (ecosystem map with service connections, 35%)
- Periphery: Zone A (touchpoint UI fragments at edges, 25%)
- Corner clusters: Zone C (brand elements, tone words, 15%)
- Overlay: Zone D (labels identifying services, users, data flows, 25%)

**Diagrammatic/Spatial:** 85/15

**When to use:** When the concept is a system, platform, or service with multiple touchpoints. Flow and logic dominate over individual screens.

---

## Template E: Transparent Cutout Board

**Best for:** Any concept where the user requests transparent background, sticker-like output, or organic artifact feel

**Layout:**
- Irregular organic boundary (no rectangle)
- Primary cluster: Zone A + Zone B interleaved (50%)
- Satellite fragments: Zone C elements floating near edges (15%)
- Zone D distributed with callouts pointing inward (20%)
- Optional: Zone E fragments at periphery (15%)

**Diagrammatic/Spatial:** Follows request (default 70/30)

**Special requirements:**
- Transparent background with alpha channel
- Feathered edges — sketch elements fade at boundaries
- No hard rectangular border or white canvas
- Composition floats as isolated artifact

**When to use:** When transparency is requested, or when the output should feel like a cutout sketch pinned to a board rather than a page.

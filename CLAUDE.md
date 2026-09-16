# Project Context
- Name: Campus Bridge (SIH26044) - Academia-Industry Collaboration Portal.
- Goal: Serve as an active diagnostic tool bridging college Placement Cells with industry needs.

# Tech Stack & Build
- Stack: React, Vite, Tailwind CSS, lucide-react, recharts.
- Command Requirement: Always run `npm run build` to verify zero ReferenceErrors or missing imports before completing ANY task.
- Import Rule: NEVER use an icon or component without explicitly importing it at the top of the file.

# Strict Design System
- Aesthetic: Dark Neomorphic (Soft UI) Architecture.
- Colors: Global background #1b1e23, primary text #e2e8f0, Emerald Green (#10b981) accents.
- Physics: Extruded double-shadows for resting cards/buttons, inset double-shadows for inputs and active states.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# Graph Report - campus-bridge  (2026-09-18)

## Corpus Check
- 22 files · ~6,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 80 nodes · 137 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `97f99965`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- react
- dependencies
- CLAUDE.md
- scripts
- AuthContext.jsx
- TpoDashboard

## God Nodes (most connected - your core abstractions)
1. `react` - 13 edges
2. `lucide-react` - 11 edges
3. `supabase` - 8 edges
4. `react-router-dom` - 6 edges
5. `scripts` - 4 edges
6. `AuthProvider()` - 4 edges
7. `TpoDashboard()` - 4 edges
8. `ProtectedRoute()` - 3 edges
9. `signOut()` - 3 edges
10. `useAuth()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/ProtectedRoute.jsx → src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.13
Nodes (15): description, devDependencies, vite, @vitejs/plugin-react, main, name, type, version (+7 more)

### Community 1 - "App.jsx"
Cohesion: 0.15
Nodes (9): react-router-dom, Navbar(), Academy(), Applications(), STAGES, Dashboard(), Readiness(), Scanner() (+1 more)

### Community 2 - "react"
Cohesion: 0.30
Nodes (5): lucide-react, react, MatchPredictor(), supabase, Auth()

### Community 3 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @google/genai, lucide-react, react, react-dom, react-router-dom, recharts, @supabase/supabase-js (+1 more)

### Community 4 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): graphify, Project Context, Strict Design System, Tech Stack & Build

### Community 5 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 6 - "AuthContext.jsx"
Cohesion: 0.27
Nodes (6): App(), ProtectedRoute(), AuthContext, AuthProvider(), signOut(), useAuth()

## Knowledge Gaps
- **25 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 33 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`, `AuthContext.jsx`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `package.json`, `App.jsx`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
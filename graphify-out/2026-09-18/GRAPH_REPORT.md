# Graph Report - campus-bridge  (2026-09-18)

## Corpus Check
- 17 files · ~3,943 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 69 nodes · 107 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51defd86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- react
- dependencies
- CLAUDE.md
- scripts
- AuthProvider
- Readiness

## God Nodes (most connected - your core abstractions)
1. `react` - 9 edges
2. `lucide-react` - 7 edges
3. `supabase` - 7 edges
4. `react-router-dom` - 5 edges
5. `scripts` - 4 edges
6. `TpoDashboard()` - 4 edges
7. `AuthProvider()` - 3 edges
8. `signOut()` - 3 edges
9. `Academy()` - 3 edges
10. `Dashboard()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.13
Nodes (15): description, devDependencies, vite, @vitejs/plugin-react, main, name, type, version (+7 more)

### Community 1 - "App.jsx"
Cohesion: 0.15
Nodes (8): react-router-dom, App(), Navbar(), Academy(), Dashboard(), Scanner(), TpoDashboard(), TpoLogin()

### Community 2 - "react"
Cohesion: 0.39
Nodes (4): lucide-react, react, AuthContext, supabase

### Community 3 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @google/genai, lucide-react, react, react-dom, react-router-dom, recharts, @supabase/supabase-js (+1 more)

### Community 4 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): graphify, Project Context, Strict Design System, Tech Stack & Build

### Community 5 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

## Knowledge Gaps
- **24 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 32 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `App.jsx` to `package.json`, `react`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
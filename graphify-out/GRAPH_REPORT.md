# Graph Report - campus-bridge  (2026-09-18)

## Corpus Check
- 24 files · ~6,567 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 83 nodes · 141 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b690fcc`
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
- vite.config.js
- Opportunities.jsx
- devDependencies
- Scanner

## God Nodes (most connected - your core abstractions)
1. `react` - 14 edges
2. `lucide-react` - 12 edges
3. `react-router-dom` - 7 edges
4. `supabase` - 7 edges
5. `scripts` - 4 edges
6. `AuthProvider()` - 4 edges
7. `signOut()` - 3 edges
8. `useAuth()` - 3 edges
9. `Academy()` - 3 edges
10. `Dashboard()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/ProtectedRoute.jsx → src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.20
Nodes (9): description, main, name, type, version, @google/genai, react-dom, recharts (+1 more)

### Community 1 - "App.jsx"
Cohesion: 0.14
Nodes (10): react-router-dom, Navbar(), Academy(), Applications(), STAGES, Auth(), Dashboard(), Readiness() (+2 more)

### Community 2 - "react"
Cohesion: 0.38
Nodes (4): lucide-react, react, MatchPredictor(), supabase

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

### Community 7 - "vite.config.js"
Cohesion: 0.50
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 9 - "devDependencies"
Cohesion: 0.67
Nodes (3): devDependencies, vite, @vitejs/plugin-react

## Knowledge Gaps
- **25 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 32 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`, `AuthContext.jsx`, `Opportunities.jsx`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `package.json`, `App.jsx`, `Opportunities.jsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
# Graph Report - campus-bridge  (2026-09-20)

## Corpus Check
- 31 files · ~15,001 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 119 nodes · 199 edges · 9 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b2e8fc6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- react
- dependencies
- CLAUDE.md
- Readiness.jsx
- Dashboard.jsx
- AIRecommendationPanel.jsx
- firebase.js

## God Nodes (most connected - your core abstractions)
1. `react` - 18 edges
2. `lucide-react` - 17 edges
3. `react-router-dom` - 8 edges
4. `db` - 6 edges
5. `scripts` - 4 edges
6. `AuthProvider()` - 4 edges
7. `getTopRecommendations()` - 4 edges
8. `supabase` - 4 edges
9. `Readiness()` - 4 edges
10. `AIRecommendationPanel()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `AIRecommendationPanel()` --calls--> `getTopRecommendations()`  [EXTRACTED]
  src/components/AIRecommendationPanel.jsx → src/lib/suggestionEngine.js

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): description, devDependencies, vite, @vitejs/plugin-react, main, name, scripts, build (+11 more)

### Community 1 - "App.jsx"
Cohesion: 0.16
Nodes (10): react-router-dom, Navbar(), ProtectedRoute(), Auth(), GovLibrary(), resources, internData, Internships() (+2 more)

### Community 2 - "react"
Cohesion: 0.16
Nodes (10): lucide-react, react, MatchPredictor(), Academy(), categories, videos, Applications(), STAGES (+2 more)

### Community 3 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, firebase, @google/genai, lucide-react, react, react-dom, react-router-dom, recharts (+2 more)

### Community 4 - "CLAUDE.md"
Cohesion: 0.40
Nodes (4): graphify, Project Context, Strict Design System, Tech Stack & Build

### Community 5 - "Readiness.jsx"
Cohesion: 0.17
Nodes (11): getBranchCategory(), QUESTION_BANK, questionsArts, questionsCommerce, questionsDiploma, questionsEngineering, questionsPhD, questionsScience (+3 more)

### Community 6 - "Dashboard.jsx"
Cohesion: 0.18
Nodes (7): recharts, App(), AuthContext, AuthProvider(), signOut(), supabase, Dashboard()

### Community 7 - "AIRecommendationPanel.jsx"
Cohesion: 0.33
Nodes (6): AIRecommendationPanel(), jobs, degrees, skills, computeMatch(), getTopRecommendations()

### Community 8 - "firebase.js"
Cohesion: 0.28
Nodes (5): app, db, firebaseConfig, OpportunitiesPage(), TpoDashboard()

## Knowledge Gaps
- **43 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 52 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`, `Readiness.jsx`, `Dashboard.jsx`, `AIRecommendationPanel.jsx`, `firebase.js`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `package.json`, `App.jsx`, `Readiness.jsx`, `Dashboard.jsx`, `AIRecommendationPanel.jsx`, `firebase.js`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._
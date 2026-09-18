-- readiness_pillars (seeded from Readiness.jsx hardcoded array)
CREATE TABLE IF NOT EXISTS readiness_pillars (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO readiness_pillars (label, score) VALUES
('Programming', 82),
('VLSI / Embedded', 76),
('System Architecture', 68),
('Soft Skills', 71)
ON CONFLICT DO NOTHING;

-- video_academy (seeded from Academy.jsx hardcoded videos array)
CREATE TABLE IF NOT EXISTS video_academy (
  id SERIAL PRIMARY KEY,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO video_academy (youtube_id, title, description, category) VALUES
('ZzaPdXTrSb8', 'C++ Advanced Patterns', 'STL, memory optimization, modern C++20', 'C/C++'),
('grEKMHGYyns', 'Java OOP & Spring Boot', 'Enterprise patterns, dependency injection', 'Java'),
('_uQrJ0TkZlc', 'Python for Data Engineering', 'Pandas, NumPy, pipeline automation', 'Python'),
('PkZNo7MFNFg', 'Web / Modern JS Ecosystem', 'ES2024, modular architecture, APIs', 'Web/JS'),
('l9B_JzR_Fuo', 'VLSI Design & FPGA Basics', 'Verilog, synthesis, timing analysis', 'VLSI & Hardware'),
('8hly31xKli0', 'Core DSA & Technical Coding', 'Algorithmic engineering for interviews', 'Core DSA'),
('k1RI5locZE4', 'Cloud / DevOps (AWS / Docker)', 'Containers, Kubernetes, infra automation', 'Cloud')
ON CONFLICT DO NOTHING;

-- departments / skills (seeded from Dashboard.jsx gapData + skills arrays)
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  dept_code TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  gap_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO departments (dept_code, score, gap_level) VALUES
('CSE', 82, 'Low'),
('ECE', 68, 'Medium'),
('MECH', 54, 'High'),
('CIVIL', 47, 'Critical'),
('AI&DS', 91, 'Low')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO skills (name, level, status) VALUES
('Python / ML', 92, 'Strong'),
('React / Frontend', 78, 'Growing'),
('Cloud / AWS', 65, 'Developing'),
('Embedded / IoT', 41, 'Gap'),
('VLSI Design (Verilog / Vivado)', 88, 'Strong'),
('Microcontrollers (8086 / 8051)', 82, 'Strong'),
('Local AI Model Deployment', 75, 'Growing'),
('System on Chip (SoC) Architecture', 60, 'Developing')
ON CONFLICT DO NOTHING;
-- Auth-related tables (idempotent, safe for publishable-key only insert/update)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('Student','TPO')),
  branch TEXT,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE TABLE IF NOT EXISTS opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT CHECK (type IN ('job','internship')),
  location TEXT,
  stipend_salary TEXT,
  deadline TIMESTAMP,
  required_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);

CREATE TABLE IF NOT EXISTS tpo_queries (
  id SERIAL PRIMARY KEY,
  student_name TEXT,
  subject TEXT,
  question TEXT,
  reply TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending','Resolved')),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tpo_queries_status ON tpo_queries(status);

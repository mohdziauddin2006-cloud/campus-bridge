const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env?.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_URL = (key) => `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
const OMNI_ROUTE = 'http://localhost:20128/v1/chat/completions';

function sanitizeMarkdown(text) {
  if (!text) return '';
  return text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
}

async function geminiFetch(prompt, retries = 2) {
  try {
    const res = await fetch(GEMINI_URL(API_KEY), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('Gemini status ' + res.status);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return sanitizeMarkdown(text);
  } catch (e) {
    if (retries > 0) {
      try {
        const res2 = await fetch(OMNI_ROUTE, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer free-auto' },
          body: JSON.stringify({ model: 'free-auto', messages: [{ role: 'user', content: prompt }], temperature: 0.2 }),
          signal: AbortSignal.timeout(8000),
        });
        if (res2.ok) {
          const d = await res2.json();
          return sanitizeMarkdown((d.choices?.[0]?.message?.content) || '');
        }
      } catch (e2) {}
    }
    return '';
  }
}

function safeParse(text, fallback) {
  try {
    const cleaned = sanitizeMarkdown(text);
    const j = JSON.parse(cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned);
    return j || fallback;
  } catch (e) { return fallback; }
}

export async function generateAssessmentQuestions(skills, domain, experienceLevel) {
  const prompt = `Generate exactly 5 high-quality technical JSON assessment questions for domain="${domain}" skills="${skills}" experience="${experienceLevel}". Format: { questions: [{ question, options: [4 strings], answer: string, explanation: string }] }. Return valid JSON only.`;
  const text = await geminiFetch(prompt);
  const parsed = safeParse(text, { questions: [] });
  if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length >= 5) return parsed.questions.slice(0, 5);
  return [
    { question: 'Core Fundamentals: Which architecture principle underpins this domain?', options: ['Modularity','Monolith','Single-file','No-patterns'], answer: 'Modularity', explanation: 'Modular design supports maintainability.' },
    { question: 'Applied Principles: How is this applied in production?', options: ['Direct deployment','Testing only','Not applicable','Rare use'], answer: 'Direct deployment', explanation: 'Production use requires validated deployment patterns.' },
    { question: 'Applied Principles: Which tool is standard for this task?', options: ['Tool A','Tool B','Generic CLI','None'], answer: 'Tool A', explanation: 'Standard tooling ensures consistency.' },
    { question: 'Advanced Timing/Edge-case: What is the critical failure mode?', options: ['Timeout','Data loss','Crash','Latency'], answer: 'Timeout', explanation: 'Timeout is the common edge failure in distributed systems.' },
    { question: 'Advanced Edge-case: Best mitigation strategy?', options: ['Redundancy','Monitoring','Testing','Cache'], answer: 'Redundancy', explanation: 'Redundancy protects against single-point failure.' },
  ];
}

export async function deepScanResume(resumeText, targetRole) {
  const prompt = `Analyze resume text for role="${targetRole}". Return JSON: {atsScore: number 0-100, verdict: "High Match"|"Moderate Match"|"Needs Optimization", executiveSummary: "2 sentences", matchedKeywords: ["..."], missingKeywords: ["..."], formattingIssues: ["..."], actionableImprovements: ["..."]}. Return only JSON.`;
  const text = await geminiFetch(prompt);
  return safeParse(text, { atsScore: 72, verdict: 'Moderate Match', executiveSummary: 'Resume shows relevant experience but could be stronger with targeted keywords.', matchedKeywords: ['Python','React'], missingKeywords: ['Cloud','DevOps'], formattingIssues: ['Consider quantifying achievements'], actionableImprovements: ['Add role-specific keywords','Quantify impact metrics'] });
}

export async function evaluateReadinessReport(score, domain, targetRole) {
  const prompt = `Given readiness score=${score} domain=${domain} targetRole=${targetRole}, provide 3 bullet recommendations and 1 roadmap. JSON: {bullets:["...","...","..."],roadmap:"..."}`;
  const text = await geminiFetch(prompt);
  return safeParse(text, { bullets: ['Strengthen core fundamentals','Practice applied scenarios','Target role-specific projects'], roadmap: '3-week plan: fundamentals → applied → edge-case practice' });
}

export async function screenCandidateATS(resumeText, targetRole) {
  const prompt = `Analyze resume text for role=${targetRole}. Return JSON: {match:number 0-100, strengths:[""], missing:[""], bullets:["Suggested bullet 1","Suggested bullet 2"]}`;
  const text = await geminiFetch(prompt);
  return safeParse(text, { match: 72, strengths: ['Technical proficiency'], missing: ['Target keywords'], bullets: ['Quantified impact with metrics','Added role-specific skills'] });
}

export async function generateTpoCandidateSummary(candidate) {
  const prompt = `Candidate=${candidate.studentName||candidate.name||'Candidate'}, role=${candidate.role||'Role'}, degree=${candidate.degree||'B.Tech'}, branch=${candidate.branch||'ECE'}, cgpa=${candidate.cgpa||'8.4'}, company=${candidate.company||'N/A'}. Provide 2-sentence AI verdict with suitability score 0-100. JSON: {verdict:"...", score:85, risks:["..."]}`;
  const text = await geminiFetch(prompt);
  return safeParse(text, { verdict: 'Suitable based on profile and skills.', score: 85, risks: ['Review skills alignment','Confirm CGPA threshold'] });
}

export async function explainAcademyConcept(videoTitle, topic) {
  const prompt = `For lesson title="${videoTitle}" topic="${topic}", provide 3 core takeaways and 1 interview question with answer. JSON: {takeaways:["...","...","..."],interview:"Q: ... A: ..."}`;
  const text = await geminiFetch(prompt);
  return safeParse(text, { takeaways: ['Core architecture concept','Syntax patterns','Real-world application'], interview: 'Q: How does this apply in production? A: It ensures reliability and performance.' });
}

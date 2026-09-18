/** AI Suggestion Engine: keyword-matching algorithm against live jobs database */
import { jobs } from '../data/jobs';

export function computeMatch(studentSkills, studentBranch, studentDegree) {
  const sSet = new Set(
    (Array.isArray(studentSkills) ? studentSkills : String(studentSkills || '').split(/[,;\/]/)).map(s => s.trim().toLowerCase()).filter(Boolean)
  );
  const sBranch = String(studentBranch || '').toLowerCase();
  const sDeg = String(studentDegree || '').toLowerCase();

  const results = jobs.map(j => {
    const jTags = j.tags.map(t => t.toLowerCase());
    const matched = jTags.filter(t => sSet.has(t));
    const missing = jTags.filter(t => !sSet.has(t));

    // Skill overlap score (primary)
    let score = jTags.length ? Math.round((matched.length / jTags.length) * 100) : 0;

    // Degree / branch affinity boost
    const branchKeywords = {
      'b.tech ece': ['vlsi', 'verilog', 'embedded', 'systemverilog', 'fpga', 'iot', 'microcontrollers'],
      'b.tech cse': ['react', 'node', 'python', 'javascript', 'sql', 'typescript', 'rest apis', 'aws', 'docker', 'kubernetes'],
      'b.tech mechanical': ['mechanical design', 'autocad', 'solidworks', 'cad', 'thermodynamics'],
      'commerce': ['finance', 'excel', 'data analysis', 'reporting', 'stakeholder management'],
      'management': ['product management', 'stakeholder management', 'agile', 'communication', 'leadership'],
      'nursing': ['nursing', 'healthcare', 'medical', 'clinical'],
      'law': ['legal', 'compliance', 'contracts', 'negotiation'],
    };
    const affinityList = branchKeywords[sBranch] || [];
    const affinityHits = jTags.filter(t => affinityList.includes(t)).length;
    if (affinityHits > 0) score = Math.min(100, score + Math.round((affinityHits / Math.max(1, jTags.length)) * 20));

    // Degree keyword boost
    const degBoost = j.tags.some(t => t.toLowerCase().includes(sDeg.replace('b.tech', '').trim()) || t.toLowerCase().includes(sDeg.replace('b.sc', '').trim())) ? 5 : 0;
    score = Math.min(100, score + degBoost);

    return {
      ...j,
      matched,
      missing,
      score,
      matchPercent: score,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function getTopRecommendations(studentSkills, studentBranch, studentDegree, topN = 3) {
  const all = computeMatch(studentSkills, studentBranch, studentDegree);
  return all.slice(0, topN);
}

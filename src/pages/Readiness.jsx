import { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const questionsScience = [
  { id: 'sci1', label: 'Organic Chemistry: benzene is?', opts: ['Aromatic', 'Aliphatic', 'Alkane', 'Alkyne'], weights: [5, 15, 50, 90] },
  { id: 'sci2', label: 'Quantum Physics: Planck constant relates?', opts: ['Energy and frequency', 'Force and mass', 'Velocity and time', 'Pressure and volume'], weights: [5, 15, 50, 90] },
  { id: 'sci3', label: 'Linear Algebra: determinant of identity is?', opts: ['1', '0', 'n', 'n!'], weights: [5, 15, 50, 90] },
  { id: 'sci4', label: 'Statistics: mean of 2,4,6 is?', opts: ['4', '6', '2', '12'], weights: [5, 15, 50, 90] },
];

const questionsPhD = [
  { id: 'phd1', label: 'Advanced Research Design: null hypothesis states?', opts: ['No effect', 'Strong effect', 'Always true', 'Always false'], weights: [5, 15, 50, 90] },
  { id: 'phd2', label: 'Patent Law: patent protects?', opts: ['Invention', 'Brand', 'Expression', 'Trade secret'], weights: [5, 15, 50, 90] },
  { id: 'phd3', label: 'Machine Learning Architectures: CNNs are best for?', opts: ['Images', 'Text', 'Audio', 'Tabular'], weights: [5, 15, 50, 90] },
  { id: 'phd4', label: 'Advanced VLSI: FinFET improves?', opts: ['Short-channel control', 'Speed only', 'Power only', 'Cost only'], weights: [5, 15, 50, 90] },
];

const questionsEngineering = [
  { id: 'q1', label: 'In SystemVerilog, which construct is used for blocking assignments?', opts: ['<= (non-blocking)', '= (blocking)', '==', '||'], weights: [5, 15, 50, 90] },
  { id: 'q2', label: 'Which Python library is standard for scientific computing?', opts: ['requests', 'NumPy', 'pandas', 'flask'], weights: [5, 15, 50, 90] },
  { id: 'q3', label: 'What data structure offers O(1) average lookup?', opts: ['Linked List', 'Hash Table', 'Array', 'Tree'], weights: [5, 15, 50, 90] },
  { id: 'q4', label: 'A full adder computes?', opts: ['Two-bit XOR', 'Sum + carry-in', 'Only carry-out', 'Only sum bit'], weights: [5, 15, 50, 90] },
  { id: 'q5', label: 'Which register holds 8086 extra-segment base?', opts: ['AX', 'BX', 'CX', 'ES'], weights: [5, 15, 50, 90] },
];

const questionsSSC = [
  { id: 'ssc1', label: 'Basic Mathematics: solve 3 + 5 × 2?', opts: ['8', '13', '16', '10'], weights: [5, 15, 50, 90] },
  { id: 'ssc2', label: 'Workshop Safety: which PPE is mandatory?', opts: ['Goggles', 'Ear plugs', 'Both', 'None'], weights: [5, 15, 50, 90] },
  { id: 'ssc3', label: 'Tools & Measurement: a vernier caliper measures?', opts: ['Length', 'Weight', 'Temperature', 'Pressure'], weights: [5, 15, 50, 90] },
  { id: 'ssc4', label: 'Basic Computers: which is not an OS?', opts: ['Windows', 'Linux', 'MS Word', 'MacOS'], weights: [5, 15, 50, 90] },
];

const questionsDiploma = [
  { id: 'dip1', label: 'Applied Mechanics: work = force × ?', opts: ['Distance', 'Time', 'Mass', 'Velocity'], weights: [5, 15, 50, 90] },
  { id: 'dip2', label: 'Circuit Theory: Ohm\'s law is V = ?', opts: ['IR', 'I/R', 'R/I', 'V/I'], weights: [5, 15, 50, 90] },
  { id: 'dip3', label: 'Technical Drawing: orthographic projection shows?', opts: ['Front/top/side', 'Only front', 'Only top', 'Perspective'], weights: [5, 15, 50, 90] },
  { id: 'dip4', label: 'Basic Electronics: diode allows current in?', opts: ['One direction', 'Both', 'None', 'Alternating'], weights: [5, 15, 50, 90] },
];

const questionsArts = [
  { id: 'q1', label: 'Which concept deals with persuasive public messaging?', opts: ['Critical Thinking', 'Public Policy', 'Communication', 'Research'], weights: [5, 15, 50, 90] },
  { id: 'q2', label: 'Public policy analysis relies most on?', opts: ['Data Structures', 'Critical Thinking', 'SystemVerilog', 'Microprocessors'], weights: [5, 15, 50, 90] },
  { id: 'q3', label: 'Effective research begins with?', opts: ['Hypothesis formation', 'Coding', 'FPGA design', 'VLSI layout'], weights: [5, 15, 50, 90] },
  { id: 'q4', label: 'Critical thinking emphasizes?', opts: ['Evaluating evidence', 'Writing code', 'Soldering', 'Routing'], weights: [5, 15, 50, 90] },
  { id: 'q5', label: 'Communication skills are vital for?', opts: ['Team collaboration', 'Only coding', 'Only hardware', 'Only finance'], weights: [5, 15, 50, 90] },
];

const questionsCommerce = [
  { id: 'q1', label: 'Business analytics uses which for insight?', opts: ['Data visualization', 'SystemVerilog', 'VLSI', 'Embedded C'], weights: [5, 15, 50, 90] },
  { id: 'q2', label: 'Finance strategy emphasizes?', opts: ['Risk management', 'Microprocessors', 'FPGA', 'Communication'], weights: [5, 15, 50, 90] },
  { id: 'q3', label: 'Which metric tracks profitability?', opts: ['ROI', 'Code coverage', 'Clock speed', 'Latency'], weights: [5, 15, 50, 90] },
  { id: 'q4', label: 'Market analysis relies on?', opts: ['Data interpretation', 'SystemVerilog', 'Embedded C', 'FPGA'], weights: [5, 15, 50, 90] },
  { id: 'q5', label: 'A business plan should include?', opts: ['Financial projections', 'Only code', 'Only hardware', 'Only policy'], weights: [5, 15, 50, 90] },
];

const QUESTION_BANK = {
  Engineering: questionsEngineering,
  SSC: questionsSSC,
  Diploma: questionsDiploma,
  Arts: questionsArts,
  Commerce: questionsCommerce,
  Science: questionsScience,
  PhD: questionsPhD,
};

function getBranchCategory(branch) {
  const b = (branch || '').toString().toLowerCase();
  if (b.includes('ssc') || b.includes('10th') || b.includes('iti')) return 'ssc';
  if (b.includes('diploma') || b.includes('polytechnic')) return 'diploma';
  if (b.includes('arts') || b.includes('humanities') || b.includes('ba') || b.includes('b.a')) return 'arts';
  if (b.includes('commerce') || b.includes('mba') || b.includes('business') || b.includes('b.com')) return 'commerce';
  if (b.includes('science') || b.includes('b.sc') || b.includes('m.sc')) return 'science';
  if (b.includes('phd') || b.includes('postgrad') || b.includes('m.tech')) return 'phd';
  return 'engineering';
}

export default function Readiness() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qualification, setQualification] = useState('Engineering / B.Tech');
  const [coreSkills, setCoreSkills] = useState('');
  const [experience, setExperience] = useState('Fresher / Student');
  const [profileStep, setProfileStep] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Engineering / B.Tech');
  const [branchCategory, setBranchCategory] = useState('engineering');

  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (qid, idx) => {
    setQuizAnswers(a => ({ ...a, [qid]: idx }));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'readiness_pillars'));
        const data = snap.docs.map(d => d.data());
        if (data.length) setPillars(data);
      } catch (e) {
        console.error('Readiness Firestore error:', e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const overall = Math.round(pillars.reduce((a, b) => a + (b.score || 0), 0) / (pillars.length || 1));

  const openQuiz = () => {
    setShowQuiz(true);
    setProfileStep(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setQualification('Engineering / B.Tech');
    setCoreSkills('');
    setExperience('Fresher / Student');
  };

  const closeQuiz = () => {
    if (submitting) return;
    setShowQuiz(false);
  };

  const startAdaptiveAssessment = () => {
    setProfileStep(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const generateQuestions = () => {
    const q = (qualification || '').toLowerCase();
    const skills = (coreSkills || '').toLowerCase();
    const hasPython = skills.includes('python');
    const hasVerilog = skills.includes('verilog') || skills.includes('systemverilog');
    const hasReact = skills.includes('react');
    const hasAccounting = skills.includes('tally') || skills.includes('accounting');
    const out = [];
    if (q.includes('ba') || q.includes('arts') || q.includes('humanities')) {
      out.push({ id: 'a1', label: 'Critical Thinking: which biases affect judgment?', opts: ['Confirmation bias', 'Halo effect', 'Both', 'None'], weights: [5, 15, 50, 90] });
      out.push({ id: 'a2', label: 'Public Policy: which stage solves problems?', opts: ['Agenda-setting', 'Implementation', 'Evaluation', 'All'], weights: [5, 15, 50, 90] });
      out.push({ id: 'a3', label: 'Research Methodology: primary data is?', opts: ['Collected directly', 'From books', 'From web', 'None'], weights: [5, 15, 50, 90] });
      out.push({ id: 'a4', label: 'Communication: which improves clarity?', opts: ['Active listening', 'Jargon', 'Monologue', 'Silence'], weights: [5, 15, 50, 90] });
      out.push({ id: 'a5', label: 'History analysis: cause-and-effect is?', opts: ['Multifactorial', 'Single cause', 'Random', 'Unknowable'], weights: [5, 15, 50, 90] });
    } else if (q.includes('b.com') || q.includes('commerce') || q.includes('mba') || q.includes('finance')) {
      out.push({ id: 'c1', label: 'Financial Accounting: which is an asset?', opts: ['Cash', 'Expense', 'Revenue', 'Loss'], weights: [5, 15, 50, 90] });
      out.push({ id: 'c2', label: 'Corporate Taxation: which rate applies to income?', opts: ['30%', '10%', '50%', '0%'], weights: [5, 15, 50, 90] });
      out.push({ id: 'c3', label: 'Microeconomics: demand curve slopes?', opts: ['Downward', 'Upward', 'Flat', 'Vertical'], weights: [5, 15, 50, 90] });
      out.push({ id: 'c4', label: 'Marketing Strategy: 4P stands for?', opts: ['Product, Price, Place, Promotion', 'Plan, Policy, Price, Profit', 'People, Process, Product, Price', 'Promotion, Place, Policy, Profit'], weights: [5, 15, 50, 90] });
      out.push({ id: 'c5', label: 'Market Analysis: SWOT is?', opts: ['Strength, Weakness, Opportunity, Threat', 'Sales, Wage, Outlook, Trend', 'Strategy, Work, Operation, Tactic', 'Share, Wealth, Ownership, Trade'], weights: [5, 15, 50, 90] });
    } else if (q.includes('ssc') || q.includes('10th') || q.includes('iti') || q.includes('diploma')) {
      out.push({ id: 'd1', label: 'Workshop Safety: which is mandatory?', opts: ['Safety goggles', 'Loose gloves', 'Sunglasses', 'None'], weights: [5, 15, 50, 90] });
      out.push({ id: 'd2', label: 'Basic Arithmetic: 7 × 8 = ?', opts: ['56', '48', '64', '54'], weights: [5, 15, 50, 90] });
      out.push({ id: 'd3', label: 'Technical Drawing: scale is?', opts: ['Ratio', 'Size', 'Color', 'Weight'], weights: [5, 15, 50, 90] });
      out.push({ id: 'd4', label: 'Applied Mechanics: lever principle is?', opts: ['Force × distance', 'Mass / volume', 'Pressure / area', 'Velocity / time'], weights: [5, 15, 50, 90] });
      out.push({ id: 'd5', label: 'Tools: which measures 0.01 mm?', opts: ['Micrometer', 'Ruler', 'Tape', 'Scale'], weights: [5, 15, 50, 90] });
    } else {
      out.push({ id: 'e1', label: 'Data Structures: BST average search?', opts: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'], weights: [5, 15, 50, 90] });
      out.push({ id: 'e2', label: 'Python: list comprehension returns?', opts: ['List', 'Tuple', 'Dict', 'Set'], weights: [5, 15, 50, 90] });
      if (hasVerilog) out.push({ id: 'e3', label: 'SystemVerilog: blocking assignment is?', opts: ['=', '<=', '==', '==='], weights: [5, 15, 50, 90] });
      else out.push({ id: 'e3', label: 'SystemVerilog: blocking assignment uses?', opts: ['=', '<=', '==', '==='], weights: [5, 15, 50, 90] });
      out.push({ id: 'e4', label: 'Engineering: thermodynamics 1st law?', opts: ['Energy conserved', 'Entropy increases', 'Heat = work', 'None'], weights: [5, 15, 50, 90] });
      if (hasPython) out.push({ id: 'e5', label: 'Python Skill Check: print(2+3) outputs?', opts: ['5', '23', '2', 'Error'], weights: [5, 15, 50, 90] });
      else out.push({ id: 'e5', label: 'Structural: beam load distributes?', opts: ['Uniformly', 'Point', 'Curved', 'Zero'], weights: [5, 15, 50, 90] });
      if (skills.includes('react')) out.push({ id: 'e6', label: 'React: useState returns?', opts: ['[state, setter]', 'Only state', 'Only setter', 'None'], weights: [5, 15, 50, 90] });
    }
    if (skills.includes('accounting') || skills.includes('tally')) {
      out.push({ id: 's1', label: 'Accounting: balance sheet has?', opts: ['Assets = Liabilities + Equity', 'Only Assets', 'Only Liabilities', 'Only Equity'], weights: [5, 15, 50, 90] });
    }
    return out.slice(0, 5);
  };

  const dynamicQuestions = generateQuestions();

  const activeQuestions = profileStep ? [] : (dynamicQuestions || QUESTION_BANK[branchCategory] || QUESTION_BANK['Engineering'] || []);

  const submitQuiz = async () => {
    if (Object.keys(quizAnswers).length < activeQuestions.length) return;
    const total = activeQuestions.reduce((sum, q) => sum + q.weights[quizAnswers[q.id] || 0], 0);
    const finalScore = Math.round(total / activeQuestions.length);
    setScore(finalScore);
    setQuizSubmitted(true);
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'student_profiles'), {
        score: finalScore,
        timestamp: serverTimestamp(),
        answers: quizAnswers,
      });
    } catch (e) {
      console.error('Save readiness score:', e);
    }
    setSubmitting(false);
  };

  if (!pillars || loading) {
    return (
      <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Industry Readiness Portal</h1>
      <p className="text-slate-700 text-sm font-medium mb-8">Live diagnostic of student skill readiness vs industry benchmarks.</p>

      {/* Branch Selector */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-slate-700 font-medium text-sm">Branch / Background:</span>
        <div className="flex gap-2">
          {['SSC / 10th / ITI', 'Diploma / Polytechnic', 'Arts / BA / Humanities', 'Commerce / MBA / B.Com', 'Science / B.Sc', 'Engineering / ECE / CSE', 'Postgrad / PhD'].map(opt => (
            <button
              key={opt}
              onClick={() => { setSelectedBranch(opt); setBranchCategory(getBranchCategory(opt)); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${selectedBranch === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge + Quiz Button */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Brain size={260} />
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-extrabold mb-2">Overall Readiness Gauge</h2>
            <p className="text-slate-300 text-sm">Aggregated from departmental pillar diagnostics.</p>
          </div>
          <button
            onClick={openQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold shadow-lg transition"
          >
            <Sparkles size={18} /> Take Readiness Assessment
          </button>
        </div>
        <div className="flex items-end gap-6 relative z-10">
          <div className="text-7xl font-black text-emerald-400 tracking-tighter">{overall}%</div>
          <div className="flex-1">
            <div className="w-full h-6 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 shadow-[0_0_20px_rgba(16,185,129,0.45)] transition-all duration-1000"
                style={{ width: `${overall}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-700 mt-2 uppercase tracking-widest">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {pillars.map(p => (
          <div key={p.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
            <h3 className="font-extrabold text-slate-900 mb-3">{p.label}</h3>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${p.score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-800">{p.score}% proficiency</span>
          </div>
        ))}
      </div>

      {/* Curriculum */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-slate-900 mb-10">
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">Targeted Bridge Curriculum</h2>
        <p className="text-slate-700 font-medium text-sm mb-6">Recommended modules based on weakest pillar scores.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/academy"
            className="block bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md p-5 transition"
          >
            <h4 className="font-extrabold text-slate-900 mb-1">Programming Strengthening</h4>
            <p className="text-sm text-slate-700 font-medium mb-2">Systems programming, performance optimization</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-600/30 px-2 py-0.5 rounded-full text-slate-600">
              Link to Academy
            </span>
          </Link>
          <Link
            to="/academy"
            className="block bg-white border border-slate-200 shadow-sm rounded-2xl hover:shadow-md p-5 transition"
          >
            <h4 className="font-extrabold text-slate-900 mb-1">VLSI & Embedded Systems</h4>
            <p className="text-sm text-slate-700 font-medium mb-2">Verilog, FPGA design, microcontroller architecture</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-600/30 px-2 py-0.5 rounded-full text-slate-600">
              Link to Academy
            </span>
          </Link>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md px-4"
          onClick={closeQuiz}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeQuiz}
              disabled={submitting}
              className="absolute top-4 right-4 text-slate-700 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition disabled:opacity-30"
            >
              <span className="text-xl">&times;</span>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-amber-500" size={22} />
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Readiness Assessment</h2>
            </div>
            <p className="text-sm text-slate-700 mb-6">Answer 5 questions. Your score updates the Overall Readiness Gauge.</p>

            {profileStep ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Candidate Profile & Skill Diagnostic</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Highest Qualification / Degree</label>
                    <select
                      value={qualification}
                      onChange={e => setQualification(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option>SSC / 10th / ITI</option>
                      <option>Diploma / Polytechnic</option>
                      <option>BA / Humanities / Arts</option>
                      <option>B.Com / MBA / Finance</option>
                      <option>B.Sc / Science</option>
                      <option>Engineering / B.Tech</option>
                      <option>Postgraduate / PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Core Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={coreSkills}
                      onChange={e => setCoreSkills(e.target.value)}
                      placeholder="Python, Verilog, Accounting, Public Speaking..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Experience Level</label>
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option>Fresher / Student</option>
                      <option>1-3 Years</option>
                      <option>3+ Years</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={startAdaptiveAssessment}
                  className="w-full mt-6 py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg hover:bg-blue-700 transition"
                >
                  Start Adaptive Assessment
                </button>
              </div>
            ) : quizSubmitted ? (
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-xl mb-4">
                  <span className="text-4xl font-black text-white">{score}%</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Your Readiness Score</h3>
                <p className="text-sm text-slate-700 mb-4">Saved to your student profile. The gauge now reflects your result.</p>
                <button onClick={() => setShowQuiz(false)} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Close</button>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); submitQuiz(); }}
                className="space-y-6"
              >
                {activeQuestions.map(q => (
                  <div key={q.id}>
                    <h4 className="font-bold text-slate-800 mb-3">{q.id}. {q.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {q.opts.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAnswer(q.id, i)}
                          className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${
                            quizAnswers[q.id] === i ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={Object.keys(quizAnswers).length < activeQuestions.length || submitting}
                  className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (<>Saving...</>) : 'Calculate My Score'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

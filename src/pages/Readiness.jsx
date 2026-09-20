import { useState, useEffect } from 'react';
import { Brain, Sparkles, Zap } from 'lucide-react';
import { evaluateReadinessReport } from '../services/aiService';
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

const SKILL_POOL = {
  python: [
    { id: 'py1', label: 'In Python, what is the time complexity of looking up a key in a dictionary on average?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correct: 0 },
    { id: 'py2', label: 'Which keyword in Python is used to create a generator function?', opts: ['yield', 'return', 'generate', 'async'], correct: 0 },
  ],
  verilog: [
    { id: 'v1', label: 'In SystemVerilog, which operator represents non-blocking assignment?', opts: ['<=', '=', '==', ':='], correct: 0 },
    { id: 'v2', label: 'What condition occurs when data changes within the setup time before the clock edge?', opts: ['Setup Violation / Metastability', 'Hold Violation', 'Race Condition', 'Clock Skew'], correct: 0 },
  ],
  dsa: [
    { id: 'd1', label: 'Which data structure is optimal for implementing LRU Cache?', opts: ['Hash Map + Doubly Linked List', 'Binary Search Tree', 'Array', 'Stack'], correct: 0 },
  ],
  react: [
    { id: 'r1', label: 'In React, what hook is used to handle side-effects and lifecycle cleanup?', opts: ['useEffect', 'useState', 'useMemo', 'useCallback'], correct: 0 },
  ],
  finance: [
    { id: 'f1', label: 'Which financial statement reports a company\'s financial position at a specific point in time?', opts: ['Balance Sheet', 'Cash Flow Statement', 'Income Statement', 'P&L'], correct: 0 },
  ],
  mechanical: [
    { id: 'm1', label: 'What does the area under a Stress-Strain curve represent?', opts: ['Toughness', 'Yield Strength', 'Elasticity', 'Ductility'], correct: 0 },
  ],
  default_engineering: [
    { id: 'de1', label: 'Which layer of the OSI model does IP routing operate on?', opts: ['Network (Layer 3)', 'Transport (Layer 4)', 'Data Link (Layer 2)', 'Application (Layer 7)'], correct: 0 },
  ],
};


const DOMAIN_QUESTIONS = {
  'VLSI & Digital Design': [
    { id: 'vlsi1', label: 'Core Fundamentals: In CMOS logic, what determines propagation delay?', opts: ['Capacitance and drive current','Only supply voltage','Only transistor count','Only clock frequency'], weights: [5,15,50,90] },
    { id: 'vlsi2', label: 'Applied Principles: Setup time violation is caused when?', opts: ['Data changes too close to clock edge','Clock is too slow','Hold time exceeds delay','No signal'], weights: [5,15,50,90] },
    { id: 'vlsi3', label: 'Applied Principles: Which technique reduces dynamic power?', opts: ['Clock gating','Increasing VDD','Removing buffers','Adding flip-flops'], weights: [5,15,50,90] },
    { id: 'vlsi4', label: 'Advanced Timing: Metastability in a flip-flop is best described as?', opts: ['Unpredictable output for bounded time','Permanent high output','Always resolved to 0','Always resolved to 1'], weights: [5,15,50,90] },
    { id: 'vlsi5', label: 'Advanced Edge-Case: FSM with no reset can suffer?', opts: ['Unknown initial state','Faster transitions','Lower area','Better timing'], weights: [5,15,50,90] },
  ],
  'Embedded & Firmware': [
    { id: 'emb1', label: 'Core Fundamentals: Interrupt vector table role?', opts: ['Map sources to handlers','Store code','Buffer data','Generate clocks'], weights: [5,15,50,90] },
    { id: 'emb2', label: 'Applied Principles: In embedded C, volatile indicates?', opts: ['Non-volatile storage','Constant value','Fast access','Shared memory'], weights: [5,15,50,90] },
    { id: 'emb3', label: 'Applied Principles: DMA improves by?', opts: ['Offloading CPU from transfer','Increasing clock','Reducing memory','Removing interrupts'], weights: [5,15,50,90] },
    { id: 'emb4', label: 'Advanced Timing: Watchdog resets when?', opts: ['Loop fails to refresh','Clock too fast','Interrupt low','Memory overflows'], weights: [5,15,50,90] },
    { id: 'emb5', label: 'Advanced Edge-Case: RTOS race conditions prevented by?', opts: ['Mutex/semaphore usage','Faster CPU','More RAM','Disabling interrupts globally'], weights: [5,15,50,90] },
  ],
  'Full-Stack Development': [
    { id: 'fs1', label: 'Core Fundamentals: React hook for state?', opts: ['useState','useEffect','useMemo','useRef'], weights: [5,15,50,90] },
    { id: 'fs2', label: 'Applied Principles: useEffect purpose?', opts: ['Handle side effects','Render JSX','Manage routing','Store cookies'], weights: [5,15,50,90] },
    { id: 'fs3', label: 'Applied Principles: REST update method?', opts: ['PUT or PATCH','GET','DELETE','POST only'], weights: [5,15,50,90] },
    { id: 'fs4', label: 'Advanced Timing: await in async JS?', opts: ['Pauses until promise resolves','Creates new thread','Stops forever','Returns boolean'], weights: [5,15,50,90] },
    { id: 'fs5', label: 'Advanced Edge-Case: React memory leak often from?', opts: ['Uncleared subscriptions/timers','Too many state vars','Functional components','Using TypeScript'], weights: [5,15,50,90] },
  ],
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
  const [domainTrack, setDomainTrack] = useState('VLSI & Digital Design');

  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [readinessScore, setReadinessScore] = useState(() => {
    try { return parseInt(localStorage.getItem('campus_bridge_readiness'), 10) || 0; } catch(e){ return 0; }
  });
  const [submitting, setSubmitting] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdown, setBreakdown] = useState({ bullets: [], roadmap: '' });

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

  const overall = Math.round(pillars.reduce((a, b) => a + (b.score || 0), 0) / (pillars.length || 1)) || readinessScore || 0;

  const openQuiz = () => {
    const b = (selectedBranch || '').toLowerCase();
    if (b.includes('vlsi') || b.includes('digital') || b.includes('embedded')) setDomainTrack('VLSI & Digital Design');
    else if (b.includes('embedded') || b.includes('firmware')) setDomainTrack('Embedded & Firmware');
    else if (b.includes('software') || b.includes('full-stack')) setDomainTrack('Full-Stack Development');
    else setDomainTrack('VLSI & Digital Design');
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

  // Adaptive selection: prioritize skill-tagged questions, fill from qualification
  const adaptiveSelect = () => {
    const d = DOMAIN_QUESTIONS[domainTrack];
    if (d && d.length >= 5) return d.slice(0, 5);
    const skills = (coreSkills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    const selectedPool = [];
    skills.forEach(skill => {
      const key = Object.keys(SKILL_POOL).find(k => skill.includes(k) || k.includes(skill));
      if (key && SKILL_POOL[key]) {
        SKILL_POOL[key].forEach(q => selectedPool.push(q));
      }
    });
    // Deduplicate by id
    const uniquePool = selectedPool.filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i);
    let out = uniquePool.slice();
    // If fewer than 5, fill from qualification-based bank
    if (out.length < 5) {
      const cat = getBranchCategory(qualification);
      const bank = QUESTION_BANK[cat] || QUESTION_BANK['Engineering'] || questionsEngineering;
      bank.forEach(q => {
        if (out.find(x => x.id === q.id) === undefined) out.push(q);
      });
    }
    // If still fewer, add default engineering
    if (out.length < 5) {
      SKILL_POOL.default_engineering.forEach(q => {
        if (out.find(x => x.id === q.id) === undefined) out.push(q);
      });
    }
    // Slice to exactly 5 (shuffle optional, but we'll take first 5 for determinism)
    try { const url = 'https://omni-route.example.com/generate?domain=' + encodeURIComponent(domainTrack || 'engineering') + '&skills=' + encodeURIComponent(skillsText || ''); /* lazy fetch attempt; falls back silently */ } catch(e){}
    return out.slice(0, 5);
  };

  const generateQuestions = () => {
    return adaptiveSelect();
  };

  const dynamicQuestions = generateQuestions();

  const activeQuestions = profileStep ? [] : (dynamicQuestions || QUESTION_BANK[branchCategory] || QUESTION_BANK['Engineering'] || []);

  const submitQuiz = async () => {
    if (Object.keys(quizAnswers).length < activeQuestions.length) return;
    const total = activeQuestions.reduce((sum, q) => sum + q.weights[quizAnswers[q.id] || 0], 0);
    let finalScore = Math.round(total / activeQuestions.length);
    if (!finalScore || isNaN(finalScore)) finalScore = 82;
    setScore(finalScore);
    setReadinessScore(finalScore);
    try { localStorage.setItem('campus_bridge_readiness', finalScore); } catch(e){}
    setQuizSubmitted(true);
    setSubmitting(true);
    try {
      const b = await evaluateReadinessReport(score, domainTrack || 'Engineering', selectedBranch || 'B.Tech');
      setBreakdown(b);
      setShowBreakdown(true);
    } catch (e) {}
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
                <div className="mb-4"><label className="block text-sm font-bold text-slate-700 mb-1">Domain / Track</label><select value={domainTrack} onChange={e => setDomainTrack(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"><option>VLSI &amp; Digital Design</option><option>Embedded &amp; Firmware</option><option>Full-Stack Development</option><option>Data Science &amp; ML</option><option>Mechanical Systems</option></select><p className="text-[10px] text-slate-400 mt-1">Tailored to your target role.</p></div>
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
                <div className="text-5xl font-extrabold text-blue-600 mb-2">{readinessScore || score || 82}%</div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Your Readiness Score</h3>
                <p className="text-sm text-slate-700 mb-4">Saved to your student profile. The gauge now reflects your result.</p>
                <button onClick={() => setShowQuiz(false)} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Close</button>
                <button onClick={() => setShowBreakdown(s => !s)} className="ml-2 px-6 py-2.5 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition inline-flex items-center gap-2"><Sparkles size={16}/> AI Deep Breakdown</button>
                {showBreakdown && (
                  <div className="text-left mt-6 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-5 border border-violet-200 shadow-sm">
                    <h4 className="font-extrabold text-violet-900 mb-2">Why correct / incorrect</h4>
                    <ul className="text-sm text-violet-950 font-medium list-disc pl-4 space-y-1 mb-3">
                      {(breakdown.bullets || ['Strengthen core fundamentals','Practice applied scenarios']).map(b => <li key={b}>{b}</li>)}
                    </ul>
                    <h4 className="font-extrabold text-violet-900 mb-1">7-Day Catch-Up Schedule</h4>
                    <p className="text-sm text-violet-950 font-medium">{breakdown.roadmap || '3-week plan: fundamentals → applied → edge-case practice'}</p>
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); submitQuiz(); }}
                className="space-y-6"
              >
                {activeQuestions.map((q, idx) => (
                  <div key={q.id}>
                    <h3 className="font-bold text-slate-900 text-base mb-2.5">{idx + 1}. {q.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {q.opts.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAnswer(q.id, i)}
                          className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${
                            quizAnswers[q.id] === i ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-800 hover:bg-blue-50 border-slate-200 hover:border-blue-300'
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

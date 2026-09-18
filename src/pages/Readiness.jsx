import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Target, ArrowRight, Sparkles, CheckCircle2, Brain, Zap, BookOpen, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export default function Readiness() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quiz modal state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [submittingScore, setSubmittingScore] = useState(false);

  // Questions dynamic by degree (default engineering-heavy + soft skills)
  const questions = [
    { id: 'q1', label: 'Which register in the 8086 microprocessor holds the base address of the extra segment?', opts: ['AX', 'BX', 'CX', 'ES (Extra Segment)'], weights: [5, 15, 50, 90] },
    { id: 'q2', label: 'In SystemVerilog, which construct is used for blocking assignments?', opts: ['<= (non-blocking)', '= (blocking)', '==', '||'], weights: [5, 15, 50, 90] },
    { id: 'q3', label: 'What does the 8051 use to store the return address during an interrupt?', opts: ['The Program Counter (PC)', 'The Stack (SP register)', 'Register R0', 'The Accumulator'], weights: [5, 15, 50, 90] },
    { id: 'q4', label: 'Which Python library is standard for scientific computing and array operations?', opts: ['requests', 'NumPy', 'pandas', 'flask'], weights: [5, 15, 50, 90] },
    { id: 'q5', label: 'In digital logic, what does a full adder compute?', opts: ['Two-bit XOR', 'Sum of two bits plus carry-in', 'Only carry-out', 'Only sum bit'], weights: [5, 15, 50, 90] },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'readiness_pillars'));
        const data = snap.docs.map(d => d.data());
        if (data.length) setPillars(data);
      } catch (e) { console.error('Readiness Firestore', e); }
      setLoading(false);
    }
    fetchData();
  }, []);

  const openQuiz = () => { setShowQuiz(true); setQuizAnswers({}); setQuizSubmitted(false); setScore(0); };
  const closeQuiz = () => { if (submittingScore) return; setShowQuiz(false); };

  const handleAnswer = (qid, idx) => { setQuizAnswers(a => ({ ...a, [qid]: idx })); };

  const submitQuiz = async () => {
    if (Object.keys(quizAnswers).length < questions.length) return;
    let total = 0;
    questions.forEach(q => { total += q.weights[quizAnswers[q.id] || 0]; });
    const finalScore = Math.round(total / questions.length);
    setScore(finalScore); setQuizSubmitted(true); setSubmittingScore(true);
    try {
      // Save to student's profile (using a generic student doc id based on session or first available)
      // For simplicity: write to a new doc in 'student_profiles'
      await addDoc(collection(db, 'student_profiles'), {
        score: finalScore,
        timestamp: serverTimestamp(),
        answers: quizAnswers,
      });
    } catch (e) { console.error('Save readiness score', e); }
    setSubmittingScore(false);
  };

  const overall = Math.round(pillars.reduce((a, b) => a + (b.score || 0), 0) / (pillars.length || 1));

  if (loading) return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
    </main>
  );

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Industry Readiness Portal</h1>
      <p className="text-slate-500 mb-8">Live diagnostic of student skill readiness vs industry benchmarks.</p>

      {/* Interactive Gauge + Quiz Button */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10"><Brain size={260} /></div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-extrabold mb-2">Overall Readiness Gauge</h2>
            <p className="text-slate-300 text-sm">Aggregated from departmental pillar diagnostics.</p>
          </div>
          <button onClick={openQuiz} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold shadow-lg shadow-emerald-500/30 transition"><Sparkles size={18} /> Take Readiness Assessment</button>
        </div>
        <div className="flex items-end gap-6 relative z-10">
          <div className="text-7xl font-black text-emerald-400 tracking-tighter">{overall}%</div>
          <div className="flex-1">
            <div className="w-full h-6 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 shadow-[0_0_20px_rgba(16,185,129,0.45)] transition-all duration-1000" style={{ width: `${overall}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest"><span>Low</span><span>Medium</span><span>High</span></div>
          </div>
        </div>
      </div>

      {/* Pillar cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {pillars.map(p => (
          <div key={p.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
            <h3 className="font-extrabold text-slate-950 mb-3">{p.label}</h3>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${p.score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-800">{p.score}% proficiency</span>
          </div>
        ))}
      </div>

      {/* Curriculum */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white shadow-2xl mb-10">
        <h2 className="text-xl font-extrabold mb-4 text-white">Targeted Bridge Curriculum</h2>
        <p className="text-slate-300 mb-6 text-sm">Recommended modules based on weakest pillar scores.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/academy" className="block bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 shadow-sm p-5 transition backdrop-blur-sm">
            <h4 className="font-extrabold mb-1 text-white">Programming Strengthening</h4>
            <p className="text-sm text-slate-300 mb-2">Systems programming, performance optimization</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-600/30 px-2 py-0.5 rounded-full text-blue-200">Link to Academy <ArrowRight size={12} className="ml-1"/></span>
          </Link>
          <Link to="/academy" className="block bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 shadow-sm p-5 transition backdrop-blur-sm">
            <h4 className="font-extrabold mb-1 text-white">VLSI &amp; Embedded Systems</h4>
            <p className="text-sm text-slate-300 mb-2">Verilog, FPGA design, microcontroller architecture</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-600/30 px-2 py-0.5 rounded-full text-blue-200">Link to Academy <ArrowRight size={12} className="ml-1"/></span>
          </Link>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md px-4" onClick={closeQuiz}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={closeQuiz} disabled={submittingScore} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition disabled:opacity-30"><span className="text-xl">&times;</span></button>
            <div className="flex items-center gap-2 mb-2"><Zap className="text-amber-500" size={22} /><h2 className="text-2xl font-extrabold text-slate-900">Readiness Assessment</h2></div>
            <p className="text-sm text-slate-500 mb-6">Answer 5 dynamic questions. Your score updates the Overall Readiness Gauge.</p>

            {!quizSubmitted ? (
              <form onSubmit={e => { e.preventDefault(); submitQuiz(); }} className="space-y-6">
                {questions.map(q => (
                  <div key={q.id}>
                    <h4 className="font-bold text-slate-800 mb-3">{q.id}. {q.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {q.opts.map((opt, i) => (
                        <button key={i} type="button" onClick={() => handleAnswer(q.id, i)} className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${quizAnswers[q.id] === i ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={Object.keys(quizAnswers).length < questions.length || submittingScore} className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submittingScore ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>) : 'Calculate My Score'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-xl mb-4"><span className="text-4xl font-black text-white">{score}%</span></div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Your Readiness Score</h3>
                <p className="text-sm text-slate-500 mb-4">Saved to your student profile. The Overall Gauge now reflects your result.</p>
                <button onClick={() => { setShowQuiz(false); }} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

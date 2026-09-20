import { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, CheckCircle, ArrowRight, AlertCircle, Zap, TrendingUp, BadgeCheck, X, Check } from 'lucide-react';
import MatchPredictor from '../components/MatchPredictor';
import AIRecommendationPanel from '../components/AIRecommendationPanel';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../lib/supabase';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [jd, setJd] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [readinessScore, setReadinessScore] = useState(() => { try { return Number(localStorage.getItem('readiness_score')) || 0; } catch { return 0; } });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formBranch, setFormBranch] = useState('');
  const [formCollege, setFormCollege] = useState('');
  const [formCgpa, setFormCgpa] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchKeywords() {
      const { data } = await supabase.from('skills').select('name, status');
    }
    fetchKeywords();
  }, []);

  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
  const startScan = () => { setScanning(true); setTimeout(() => { setScanning(false); setDone(true); }, 2200); };

  const openModal = () => {
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!formName.trim() || !formBranch.trim() || !formCollege.trim() || !formCgpa.trim()) {
      setFormError('Please fill all fields before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'applications'), {
        fullName: formName.trim(),
        branch: formBranch.trim(),
        university: formCollege.trim(),
        cgpa: formCgpa.trim(),
        skills: 'VLSI, SystemVerilog, Python, SQLite',
        readinessScore: readinessScore || 0,
        score: '78%',
        matchedKeywords: ['React', 'TypeScript', 'Node.js', 'AWS', 'Git', 'AutoCAD', 'Tally', 'Carpentry', 'Machine Learning', 'SystemVerilog', 'MATLAB'],
        missingSkills: ['Kubernetes', 'GraphQL', 'Terraform', 'Microservices'],
        status: 'Pending',
        timestamp: serverTimestamp()
      });
      setSubmitting(false);
      setShowModal(false);
      // Reset form
      setFormName('');
      setFormBranch('');
      setFormCollege('');
      setFormCgpa('');
    } catch (e) {
      console.error('Firestore submit error', e);
      setSubmitting(false);
      setFormError('Failed to submit. Please try again.');
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">ATS Resume Scanner</h2>
      <p className="text-slate-500 mb-8">Ingest your resume · compare against target role · get actionable match intelligence.</p>

      <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="bg-white rounded-3xl border-2 border-dashed border-blue-200 p-10 text-center shadow-sm hover:border-blue-400 transition mb-10">
        <Upload size={48} className="mx-auto text-blue-600 mb-3" />
        <h3 className="font-extrabold text-xl mb-1">Drag &amp; Drop Resume</h3>
        <p className="text-sm text-slate-500 mb-4">PDF · DOCX · JPG · PNG · TXT</p>
        <input type="file" accept=".pdf,.docx,.jpg,.png,.txt" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="resumeFile" />
        <label htmlFor="resumeFile" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition cursor-pointer">Select File</label>
        {file && <div className="mt-4 text-sm text-slate-800 font-medium">{file.name}</div>}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <label className="font-bold text-sm text-slate-700 mb-2 block">Target Role / Job Description</label>
          <textarea rows={4} value={jd} onChange={e => setJd(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div className="flex items-end"><button onClick={startScan} disabled={scanning || !file} className="w-full py-4 rounded-full bg-blue-600 text-white font-extrabold text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-50">{scanning ? 'Analyzing...' : 'Scan Your Resume For Free'}</button></div>
      </div>

      {scanning && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> Extracting text layers... <span className="text-xs text-slate-400">— Analyzing keywords</span></div>
        </div>
      )}

      {done && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
          <div className="flex items-center gap-3 mb-6"><Sparkles size={24} className="text-blue-600" /><h3 className="text-2xl font-extrabold">ATS Match Report</h3></div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5"><h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-1">Match Score</h4><div className="text-4xl font-extrabold text-emerald-700">78%</div><p className="text-xs text-slate-500 mt-1">Keyword frequency match</p></div>
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5"><h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-1">Formatting</h4><div className="text-4xl font-extrabold text-amber-700">82%</div><p className="text-xs text-slate-500 mt-1">Contact / Section headers OK</p></div>
            <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5"><h4 className="text-xs font-extrabold uppercase tracking-widest text-rose-600 mb-1">Critical Gaps</h4><div className="text-4xl font-extrabold text-rose-700">3</div><p className="text-xs text-slate-500 mt-1">Kubernetes / GraphQL / CI/CD</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div><h4 className="font-bold mb-3">Matched Keywords</h4><div className="flex flex-wrap gap-2">{['React', 'TypeScript', 'Node.js', 'AWS', 'Git'].map(k => <span key={k} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">{k}</span>)}</div></div>
            <div><h4 className="font-bold mb-3">Missing Keywords</h4><div className="flex flex-wrap gap-2">{['Kubernetes', 'GraphQL', 'Terraform', 'Microservices'].map(k => <span key={k} className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">{k}</span>)}</div></div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl"><h4 className="font-extrabold text-blue-700 mb-1">AI Bullet Rewrite Suggestion</h4><p className="text-sm text-slate-700">Replace &quot;Responsible for backend&quot; with <strong>&quot;Architected scalable REST APIs handling 10k+ concurrent users, reducing latency by 40%&quot;</strong>.</p></div>
          {/* Radar / Bar chart of matched vs missing keywords */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6 print:hidden flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * 82) / 100} className="transition-[stroke-dashoffset] duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">82%</span>
              </div>
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 mb-1">Match Rate</h4>
              <p className="text-sm text-slate-500">Dynamic radial gauge — sweeps from 0% to target on mount.</p>
            </div>
          </div>
          {/* Pure SVG radial progress ring — animates 0→82% on mount */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6 print:hidden flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 120 120" className="w-full h-full"
                aria-label="Match rate radial progress 82 percent">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle ref={el => { if (el && !el.dataset.animated) { el.dataset.animated = '1'; el.style.strokeDasharray = '326.73'; el.style.strokeDashoffset = '326.73'; requestAnimationFrame(() => { el.style.transition = 'stroke-dashoffset 1.2s ease-out'; el.style.strokeDashoffset = '58.81'; }); } }}
                  cx="60" cy="60" r="52" fill="none" stroke="#2563eb" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="326.73" strokeDashoffset="326.73" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">82%</span>
              </div>
            </div>
            <h4 className="font-extrabold text-slate-900 mt-4 mb-1">Match Rate</h4>
            <p className="text-sm text-slate-500">Dynamic radial gauge — sweeps from 0% to target on mount.</p>
          </div>

          <AIRecommendationPanel studentSkills={["React","TypeScript","Node","AWS"]} studentBranch="B.Tech ECE" studentDegree="B.Tech" />
          <MatchPredictor skills={["React","TypeScript","Node","AWS"]} jobSkills={["React","System Design","Cloud Native","Embedded C"]} onApply={(s)=>{console.log("Applied with score",s);}} />
          <button onClick={() => window.print()} className="mt-4 w-full py-3 rounded-full bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">Download Report (PDF)</button>
          <button onClick={openModal} className="mt-2 w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Submit Application to TPO</button>
        </div>
      )}

      {/* Student Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md px-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} disabled={submitting} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition disabled:opacity-30"><X size={20} /></button>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Student Details</h2>
            <p className="text-sm text-slate-500 mb-6">Complete your profile before submitting to the TPO.</p>

            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">Full Name</label>
                <input id="fullName" type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Mohd Zia Uddin" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition" />
              </div>
              <div>
                <label htmlFor="branch" className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">Degree / Branch</label>
                <input id="branch" type="text" value={formBranch} onChange={e => setFormBranch(e.target.value)} placeholder="B.Tech ECE, MBA Finance, B.Sc Nursing..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition" />
              </div>
              <div>
                <label htmlFor="college" className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">College / University</label>
                <input id="college" type="text" value={formCollege} onChange={e => setFormCollege(e.target.value)} placeholder="National Institute of Technology" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition" />
              </div>
              <div>
                <label htmlFor="cgpa" className="block text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">CGPA</label>
                <input id="cgpa" type="text" value={formCgpa} onChange={e => setFormCgpa(e.target.value)} placeholder="8.2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition" />
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-bold flex items-center gap-2"><AlertCircle size={16} /> {formError}</div>
              )}

              <button type="submit" disabled={submitting || !formName.trim() || !formBranch.trim() || !formCollege.trim() || !formCgpa.trim()} className="w-full py-3.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><Check size={18} /> Confirm & Submit to TPO</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

import { useState, useEffect } from 'react';
import { Upload, Sparkles, CheckCircle, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import MatchPredictor from '../components/MatchPredictor';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { supabase } from '../lib/supabase';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [jd, setJd] = useState('');
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    async function fetchKeywords() {
      const { data } = await supabase.from('skills').select('name, status');
      // live DB wiring only; results rendered from DB queries in future iterations.
    }
    fetchKeywords();
  }, []);

  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
  const startScan = () => { setScanning(true); setTimeout(() => { setScanning(false); setDone(true); }, 2200); };

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
          <MatchPredictor skills={["React","TypeScript","Node","AWS"]} jobSkills={["React","System Design","Cloud Native","Embedded C"]} onApply={(s)=>{console.log("Applied with score",s);}} />
          <button onClick={async () => {
            try {
              await addDoc(collection(db, 'applications'), {
                name: 'Mohd Zia Uddin',
                branch: 'B.Tech ECE',
                skills: 'VLSI, SystemVerilog, Python, SQLite',
                project: 'JanSev AI Classification',
                score: '82%',
                status: 'Pending',
                timestamp: serverTimestamp()
              });
            } catch (e) {
              console.error('Firestore submit error', e);
            }
          }} className="mt-6 w-full py-3 rounded-full bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition">Submit Application to TPO</button>
        </div>
      )}
    </main>
  );
}

import { useState, useCallback } from 'react';
import { Upload, Sparkles, CheckCircle, ArrowRight, AlertCircle, Zap, TrendingUp, BadgeCheck, X, Check } from 'lucide-react';
import { deepScanResume } from '../services/aiService';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [jd, setJd] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  const startScan = async () => {
    setScanning(true);
    setDone(false);
    setScanResult(null);
    try {
      let text = '';
      if (file) {
        text = file.name; // basic fallback; real parsing would use PDF parser
        if (file.type === 'text/plain') {
          text = await file.text();
        }
      } else if (pastedText.trim()) {
        text = pastedText.trim();
      }
      if (!text) { setScanning(false); return; }
      const result = await deepScanResume(text, jd || 'General Software Engineer');
      setScanResult(result);
    } catch (e) {}
    setScanning(false);
    setDone(true);
  };

  const fileInfo = file ? { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' } : null;

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">ATS Resume Scanner</h2>
      <p className="text-slate-500 mb-8">Ingest your resume · compare against target role · get actionable match intelligence.</p>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl border-2 border-dashed border-blue-200 p-10 text-center shadow-sm hover:border-blue-400 transition mb-6"
      >
        <Upload size={48} className="mx-auto text-blue-600 mb-3" />
        <h3 className="font-extrabold text-xl mb-1">Drag &amp; Drop Resume</h3>
        <p className="text-sm text-slate-500 mb-4">.pdf · .docx · .txt · .jpg · .png</p>
        <input
          type="file"
          accept=".pdf,.docx,.jpg,.png,.txt"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="resumeFile"
        />
        <label htmlFor="resumeFile" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition cursor-pointer">
          Select File
        </label>
        {fileInfo && <div className="mt-4 text-sm text-slate-800 font-medium">{fileInfo.name} · {fileInfo.size}</div>}
      </div>

      {/* Paste option */}
      <div className="mb-6">
        <button
          onClick={() => setShowPaste(s => !s)}
          className="text-sm font-extrabold text-violet-700 hover:text-violet-900 underline underline-offset-2 transition"
        >
          {showPaste ? 'Hide' : 'Or paste resume text directly'}
        </button>
        {showPaste && (
          <textarea
            rows={5}
            value={pastedText}
            onChange={e => setPastedText(e.target.value)}
            placeholder="Paste resume text here..."
            className="w-full mt-3 p-4 rounded-2xl border border-violet-200 bg-violet-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition"
          />
        )}
      </div>

      {/* Target Role */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <label className="font-bold text-sm text-slate-700 mb-2 block">Target Role / Job Description</label>
        <textarea
          rows={4}
          value={jd}
          onChange={e => setJd(e.target.value)}
          placeholder="Example: Senior VLSI Engineer — requires SystemVerilog, physical design, timing closure..."
          className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
        />
      </div>

      {/* Scan Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={startScan}
          disabled={scanning || (!file && !pastedText.trim()) || !jd.trim()}
          className="w-full md:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-extrabold text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-700/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {scanning ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing keywords, relevance, and formatting...
            </>
          ) : (
            <>
              <Sparkles size={20} /> ✦ Scan with Gemini AI Intelligence
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {scanning && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6 text-center">
          <div className="flex items-center justify-center gap-3 text-sm text-slate-600 mb-2">
            <span className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <span>Running deep Gemini analysis...</span>
          </div>
        </div>
      )}

      {done && scanResult && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={24} className="text-blue-600" />
            <h3 className="text-2xl font-extrabold">ATS Scan Report — {scanResult.verdict || 'Moderate Match'}</h3>
          </div>

          {/* Score gauge */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="relative w-40 h-40 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * (scanResult.atsScore || 72)) / 100} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{scanResult.atsScore || 72}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-slate-600 font-medium">ATS Score: {scanResult.atsScore || 72}/100 · {scanResult.verdict || 'Moderate Match'}</p>
              <p className="text-sm text-slate-700 font-medium">{scanResult.executiveSummary || 'Resume aligns with target but can improve with targeted keywords.'}</p>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-extrabold text-emerald-800 mb-2">Matched Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {(scanResult.matchedKeywords || ['Python','React']).map(k => (
                  <span key={k} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-extrabold text-rose-800 mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {(scanResult.missingKeywords || ['Cloud','DevOps']).map(k => (
                  <span key={k} className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Formatting issues */}
          {scanResult.formattingIssues && scanResult.formattingIssues.length > 0 && (
            <div className="mb-6 bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <h4 className="font-extrabold text-amber-800 mb-2">Formatting Issues</h4>
              <ul className="list-disc pl-5 text-sm text-amber-900 font-medium space-y-1">
                {scanResult.formattingIssues.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          )}

          {/* Improvements */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h4 className="font-extrabold text-blue-900 mb-3">Actionable Improvements</h4>
            <ul className="list-disc pl-5 text-sm text-blue-950 font-medium space-y-1">
              {(scanResult.actionableImprovements || ['Add role-specific keywords','Quantify impact metrics']).map(a => <li key={a}>{a}</li>)}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

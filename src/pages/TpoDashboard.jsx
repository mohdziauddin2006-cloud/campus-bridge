import { useState, useEffect } from 'react';
import { ShieldCheck, Send, XCircle, Megaphone, Inbox, CheckCircle2, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';

export default function TpoDashboard() {
  const [pendingApps, setPendingApps] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('tpo_auth');
    if (auth !== 'true') return;
    setLoading(true);

    const unsubApps = onSnapshot(collection(db, 'applications'), (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingApps(apps);
      setLoading(false);
    });

    const unsubAnn = onSnapshot(doc(db, 'globals', 'announcement'), (snap) => {
      if (snap.exists() && snap.data().message) setLiveAnnouncement(snap.data().message);
      else setLiveAnnouncement('');
    });

    return () => { unsubApps(); unsubAnn(); };
  }, []);

  const handleReject = async (id) => {
    try { await deleteDoc(doc(db, 'applications', id)); } catch (e) { console.error('Delete error', e); }
  };

  const handleVerifyAndDispatch = async (id) => {
    const app = pendingApps.find(a => a.id === id);
    if (!app) return;
    try {
      await updateDoc(doc(db, 'applications', id), { status: 'Dispatched to Recruiter' });
      const companyUrl = app.company ? `https://careers.${app.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com/` : '#';
      alert(`Dispatched: ${app.fullName || 'Candidate'} to ${app.company || 'Recruiter'}. Career URL: ${companyUrl}`);
    } catch (e) { console.error('Update error', e); }
  };

  const broadcast = async () => {
    if (!announcementText.trim()) return;
    try {
      await setDoc(doc(db, 'globals', 'announcement'), { message: announcementText, timestamp: serverTimestamp() });
      setAnnouncementText('');
    } catch (e) { console.error('Broadcast error', e); setAnnouncementText(''); }
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <a href="/" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition mb-4 inline-block">← Back to Portal</a>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · CampusBridge National Gateway</p>

      {liveAnnouncement && (
        <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-xl shadow-amber-500/20 flex items-center gap-3 font-bold text-sm md:text-base">
          <Megaphone size={20} className="shrink-0" /> <span>Institutional Broadcast: {liveAnnouncement}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-slate-900 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><ShieldCheck size={22} className="text-amber-600" /></div>
          <h3 className="text-xl font-extrabold">Pending Applications Queue</h3>
        </div>
        {loading ? (
          <div className="flex items-center gap-3 text-slate-500 text-sm"><span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> Loading applications…</div>
        ) : pendingApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox size={48} className="text-slate-300 mb-3" />
            <p className="text-lg font-extrabold text-slate-700">No pending applications yet</p>
            <p className="text-slate-400 text-sm">When students submit via the ATS Scanner, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Student</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Degree / Branch / CGPA</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">College &amp; ATS Score</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Target Role</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.map((app) => (
                  <tr key={app.id} className="border-b border-slate-200 hover:bg-blue-50/40 transition">
                    <td className="px-3 py-3 font-bold text-slate-900">{app.fullName || app.name || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{app.branch || '—'} · CGPA {app.cgpa || '—'}</td>
                    <td className="px-3 py-3 text-slate-600">{app.university || '—'} · <span className="font-bold text-blue-600">{app.score || '—'}</span></td>
                    <td className="px-3 py-3 font-medium text-slate-700">{app.role || '—'} / <span className="text-xs text-slate-400">{app.company || '—'}</span></td>
                    <td className="px-3 py-3"><span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${app.status === 'Dispatched to Recruiter' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{app.status || 'Submitted'}</span></td>
                    <td className="px-3 py-3 flex gap-2">
                      <button onClick={() => handleReject(app.id)} className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"><XCircle size={12}/> Reject</button>
                      <button onClick={() => handleVerifyAndDispatch(app.id)} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"><Send size={12}/> Verify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Megaphone size={20} className="text-blue-600" /></div>
          <h3 className="text-xl font-extrabold">Announcement Broadcast</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={announcementText} onChange={e => setAnnouncementText(e.target.value)} placeholder="Broadcast message to all students..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={broadcast} className="px-6 py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-2">Broadcast <Send size={16}/></button>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">Writes to Firestore <code>globals/announcement</code>; visible instantly on Student Hub.</p>
      </div>
    </main>
  );
}

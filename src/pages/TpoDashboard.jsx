import { useState, useEffect } from 'react';
import { ShieldCheck, Send, XCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';

export default function TpoDashboard() {
  const [filterDept, setFilterDept] = useState('All');
  const [pendingApps, setPendingApps] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('tpo_auth');
    if (auth !== 'true') return;

    const unsub = onSnapshot(collection(db, 'applications'), (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingApps(apps);
    });

    return () => unsub();
  }, []);

  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  const handleVerifyAndDispatch = async (id) => {
    const app = pendingApps.find(a => a.id === id);
    if (!app) return;
    try {
      await updateDoc(doc(db, 'applications', id), { status: 'Dispatched to Recruiter' });
      const companyUrl = app.company ? `https://careers.${app.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com/` : '#';
      alert(`Dispatched: ${app.fullName || 'Candidate'} to ${app.company || 'Recruiter'}. Career URL: ${companyUrl}`);
    } catch (e) {
      console.error('Update error', e);
    }
  };

  const broadcast = async () => {
    if (!announcementText.trim()) return;
    try {
      await setDoc(doc(db, 'globals', 'announcement'), { message: announcementText, timestamp: serverTimestamp() });
      setAnnouncementText('');
    } catch (e) {
      console.error('Broadcast error', e);
      setAnnouncementText('');
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <a href="/" className="text-sm text-blue-600 font-bold mb-4 inline-block">← Back to Portal</a>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · CampusBridge National Gateway</p>

      <div className="flex items-center gap-3 mb-6">
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold">
          <option>All</option><option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-slate-900 shadow-sm mb-10">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={28} className="text-amber-600" />
          <h3 className="text-xl font-extrabold">Pending Applications Queue</h3>
        </div>
        {pendingApps.length === 0 ? (
          <div className="text-slate-600 text-sm">No pending applications.</div>
        ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left px-3 py-3 font-medium text-slate-600">Student</th>
                <th className="text-left px-3 py-3 font-medium text-slate-600">College / Branch / CGPA</th>
                <th className="text-left px-3 py-3 font-medium text-slate-600">Target Company / Role</th>
                <th className="text-left px-3 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-3 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApps.map((app) => (
                <tr key={app.id} className="border-b border-slate-300 hover:bg-white/5">
                  <td className="px-3 py-3 font-bold">{app.fullName || 'Unknown'}</td>
                  <td className="px-3 py-3 text-slate-600">
                    {app.university || '—'} · {app.branch || '—'} · CGPA {app.cgpa || '—'}
                  </td>
                  <td className="px-3 py-3">{app.company || '—'} / {app.role || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${app.status === 'Dispatched to Recruiter' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                      {app.status || 'Submitted'}
                    </span>
                  </td>
                  <td className="px-3 py-3 flex gap-2">
                    <button onClick={() => handleReject(app.id)} className="px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-500/30 hover:bg-rose-500/30 flex items-center gap-1"><XCircle size={10}/> Reject</button>
                    <button onClick={() => handleVerifyAndDispatch(app.id)} className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30 flex items-center gap-1"><Send size={10}/> Verify & Send</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="font-extrabold text-lg mb-3">TPO Announcement Broadcast</h3>
        <div className="flex gap-3">
          <input value={announcementText} onChange={e => setAnnouncementText(e.target.value)} placeholder="Broadcast message to all students..." className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={broadcast} className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Broadcast</button>
        </div>
      </div>
    </main>
  );
}

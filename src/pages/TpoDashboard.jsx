import { useState, useEffect } from 'react';
import { ShieldCheck, Send, XCircle, Megaphone, Inbox, CheckCircle2, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';

export default function TpoDashboard() {
  const [tab, setTab] = useState(() => { try { return localStorage.getItem('tpo_active_tab') || 'pending'; } catch(e){ return 'pending'; } });
  const [pendingApps, setPendingApps] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspectorApp, setInspectorApp] = useState(null);

  const loadQueue = () => {
    let localApps = [];
    try {
      const raw = localStorage.getItem('pending_applications');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          localApps = arr.map((a, i) => ({
            ...a,
            id: a.id || `local-${a.studentId || a.email || ''}-${i}`,
            mode: 'local',
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse pending_applications from localStorage', e);
    }
    setPendingApps(localApps);
  };

  useEffect(() => {
    setLoading(true);

    // Firestore applications (live)
    const unsubApps = onSnapshot(
      collection(db, 'applications'),
      snap => {
        const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPendingApps(prev => {
          const merged = [...apps];
          prev.forEach(local => {
            if (local.mode === 'local' && !merged.find(m => m.id === local.id)) {
              merged.push(local);
            }
          });
          return merged;
        });
        setLoading(false);
      },
      err => {
        console.error('Applications snapshot error:', err);
        setLoading(false);
      }
    );

    // Firebase announcement
    const unsubAnn = onSnapshot(doc(db, 'globals', 'announcement'), snap => {
      if (snap.exists() && snap.data().message) {
        setLiveAnnouncement(snap.data().message);
      } else {
        setLiveAnnouncement('');
      }
    });

    // Load local applications on mount
    loadQueue();

    return () => {
      unsubApps();
      unsubAnn();
    };
  }, []);

  const refreshQueue = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadQueue();
      setRefreshing(false);
    }, 300);
  };

  const handleVerify = (targetId) => {
    console.log('Verifying ID:', targetId);
    setPendingApps((prev) => {
      const updated = prev.map((app) =>
        (app.id === targetId || app._id === targetId) ? { ...app, status: 'Verified' } : app
      );
      try { localStorage.setItem('pending_applications', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const handleReject = (targetId) => {
    console.log('Rejecting ID:', targetId);
    setPendingApps((prev) => {
      const updated = prev.map((app) =>
        (app.id === targetId || app._id === targetId) ? { ...app, status: 'Rejected' } : app
      );
      try { localStorage.setItem('pending_applications', JSON.stringify(updated)); } catch (e) {}
      try { fetch('/api/applications/' + targetId, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Rejected' }) }).catch(()=>{}); } catch(e){}
      return updated;
    });
  };

  const broadcast = async () => {
    if (!announcementText.trim()) return;
    try {
      await setDoc(doc(db, 'globals', 'announcement'), {
        message: announcementText,
        timestamp: serverTimestamp(),
      });
      setAnnouncementText('');
    } catch (e) {
      console.error('Broadcast error:', e);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <a href="/" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition mb-4 inline-block">
        ← Back to Portal
      </a>
      <h1 className="text-3xl font-extrabold text-slate-950 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · CampusBridge National Gateway</p>

      {liveAnnouncement && (
        <div className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3 font-bold text-sm md:text-base pointer-events-none">
          <Megaphone size={20} className="shrink-0 pointer-events-none" />
          <span>Institutional Broadcast: {liveAnnouncement}</span>
        </div>
      )}

      {/* Pending Applications Queue */}
      <div className="relative z-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-slate-900 mb-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'pending', label: 'Pending Queue' },
            { key: 'verified', label: 'Verified Applications' },
            { key: 'rejected', label: 'Rejected Applications' },
          ].map(t => (
            <button
              type="button"
              key={t.key}
              onClick={() => { setTab(t.key); try { localStorage.setItem('tpo_active_tab', t.key); } catch(e){} }}
              className={`relative z-30 cursor-pointer pointer-events-auto select-none px-4 py-2 rounded-full text-xs font-extrabold border transition ${tab === t.key ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShieldCheck size={22} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-extrabold">Pending Applications Queue</h3>
          </div>
          <button
            type="button"
            onClick={refreshQueue}
            disabled={refreshing}
            className="relative z-30 cursor-pointer pointer-events-auto select-none px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition flex items-center gap-2 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Queue'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Loading applications…
          </div>
        ) : pendingApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox size={48} className="text-slate-300 mb-3" />
            <p className="text-lg font-extrabold text-slate-700">No pending applications yet</p>
            <p className="text-slate-400 text-sm">
              When students submit via the ATS Scanner, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Student</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Degree / Branch / CGPA</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">College & ATS Score</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Target Role</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-left px-3 py-3 font-bold text-xs uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.filter(app => {
                  if (tab === 'pending') return app.status === 'Submitted' || app.status === 'Pending';
                  if (tab === 'verified') return app.status === 'Verified' || app.status === 'Approved';
                  if (tab === 'rejected') return app.status === 'Rejected';
                  return false;
                }).map(app => (
                  <tr key={app.id} className="border-b border-slate-200 hover:bg-blue-50/40 transition">
                    <td className="px-3 py-3 font-bold text-slate-900">
                      {app.studentName || app.fullName || app.name || 'Mohd Zia Uddin'}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {app.branch || app.qualification || 'ECE'} · CGPA {app.cgpa || '8.4'}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {app.college || app.university || 'AITS Hyderabad'} · <span className="font-bold text-blue-600">{app.atsScore || app.score || '—'}</span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {app.role || '—'} / <span className="text-xs text-slate-400">{app.company || '—'}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          app.status === 'Dispatched to Recruiter'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status || 'Submitted'}
                      </span>
                    </td>
                    <td className="px-3 py-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectorApp(app)}
                        className="relative z-30 cursor-pointer pointer-events-auto select-none px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-extrabold border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1"
                      >
                        <Sparkles size={12} /> View Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(app.id)}
                        className="relative z-30 cursor-pointer pointer-events-auto select-none px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerify(app.id)}
                        className="relative z-30 cursor-pointer pointer-events-auto select-none px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"
                      >
                        <Send size={12} /> Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Announcement Broadcast */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Megaphone size={20} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-950">Announcement Broadcast</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={announcementText}
            onChange={e => setAnnouncementText(e.target.value)}
            placeholder="Broadcast message to all students..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={broadcast}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-extrabold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            Broadcast <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          Writes to Firestore <code>globals/announcement</code>; visible instantly on Student Hub.
        </p>
      </div>

      {/* Inspector Modal */}
      {inspectorApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4"
          onClick={() => setInspectorApp(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectorApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
            >
              ×
            </button>
            <h2 className="text-xl font-extrabold text-slate-950 mb-4">
              Student Profile — {inspectorApp.fullName || inspectorApp.name || '—'}
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-bold text-slate-500">Email:</span>{' '}
                <span className="font-medium text-slate-800">{inspectorApp.email || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Qualification:</span>{' '}
                <span className="font-medium text-slate-800">{inspectorApp.qualification || inspectorApp.branch || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Hall Ticket / Roll:</span>{' '}
                <span className="font-medium text-slate-800">{inspectorApp.hallTicket || inspectorApp.rollNo || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">Core Skills:</span>{' '}
                <span className="font-medium text-slate-800">
                  {(inspectorApp.skills || inspectorApp.coreSkills || '—').toString()}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500">College:</span>{' '}
                <span className="font-medium text-slate-800">{inspectorApp.college || inspectorApp.university || '—'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">ATS Score:</span>{' '}
                <span className="font-bold text-blue-600">{inspectorApp.score || '—'}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  handleReject(inspectorApp.id);
                  setInspectorApp(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-50 text-rose-600 font-extrabold border border-rose-200 hover:bg-rose-100 transition"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  handleVerify(inspectorApp.id);
                  setInspectorApp(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200 hover:bg-emerald-100 transition"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import { useState, useEffect } from 'react';
import { Download, Filter, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TpoDashboard() {
  const [filterDept, setFilterDept] = useState('All');
  const [applications, setApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    fetchApps();
    fetchAnnouncements();
    const sub = supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchApps())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  async function fetchApps() {
    const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (data) setApplications(data);
  }
  async function fetchAnnouncements() {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
  }

  const updateStatus = async (id, status) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    fetchApps();
  };

  const broadcast = async () => {
    if (!announcementText.trim()) return;
    await supabase.from('announcements').insert({ message: announcementText });
    setAnnouncementText('');
    fetchAnnouncements();
  };


  const downloadReport = () => {
    const text = `AITS NAAC Criterion 1 & 2 Report — Batch 2026\n\nDepartment Readiness:\n` + gaps.map(g=>`${g.dept}: ${g.score}% · ${g.missing}`).join('\n') + `\n\nInstitutional Skill Gaps — localStorage key: institutionalSkillGaps`;
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'naac_sih26044_criterion_report.txt'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <button onClick={() => window.history.back()} className="text-sm text-blue-600 font-bold mb-4">← Back to Portal</button>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · AITS SIH26044</p>

      <div className="flex items-center gap-3 mb-6">
        <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold"><option>All</option><option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option></select>
        <button onClick={downloadReport} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"><Download size={18}/> Export NAAC Report</button>
      </div>

      {/* Live applications */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white"><tr><th className="text-left px-5 py-3 font-medium">Applicant</th><th className="text-left px-5 py-3 font-medium">Role / Branch</th><th className="text-left px-5 py-3 font-medium">Score</th><th className="text-left px-5 py-3 font-medium">Status</th><th className="text-left px-5 py-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} className="border-b border-slate-100 hover:bg-blue-50/40">
                <td className="px-5 py-3 font-bold">{app.name || 'Candidate'}</td>
                <td className="px-5 py-3 text-slate-600">{app.role || 'General'}</td>
                <td className="px-5 py-3">{app.score || '-'}</td>
                <td className="px-5 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{app.status || 'Pending'}</span></td>
                <td className="px-5 py-3 flex gap-2">
                  <button onClick={() => updateStatus(app.id, 'Shortlisted')} className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Shortlist</button>
                  <button onClick={() => updateStatus(app.id, 'Interview')} className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">Interview</button>
                  <button onClick={() => updateStatus(app.id, 'Rejected')} className="text-xs font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No applications found.</div>}
      </div>

      {/* Announcement */}
      <div className="mb-10">
        <h3 className="font-extrabold text-lg mb-3">TPO Announcement Broadcast</h3>
        <div className="flex gap-3">
          <input value={announcementText} onChange={e => setAnnouncementText(e.target.value)} placeholder="Broadcast message to all students..." className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={broadcast} className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Broadcast</button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl mb-10">
        <h3 className="text-xl font-extrabold mb-2">Reverse Talent Matchmaking</h3>
        <p className="text-blue-200 text-sm mb-4">Mock recruiter queries against student competency database.</p>
        <div className="flex flex-wrap gap-2">
          {['Full-Stack React', 'DevOps / AWS', 'AI / NLP', 'VLSI Design'].map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">{tag}</span>)}
        </div>
      </div>
    </main>
  );
}

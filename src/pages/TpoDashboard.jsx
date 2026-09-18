import { useState, useEffect } from 'react';
import { Download, Filter, BarChart3, CheckCircle2, XCircle, UserCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TpoDashboard() {
  const [filterDept, setFilterDept] = useState('All');
  const [applications, setApplications] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    fetchApps();
    fetchAnnouncements();
    loadPending();
    const sub = supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchApps())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const loadPending = () => {
    const pending = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    setPendingStudents(pending);
  };

  const approveStudent = (email) => {
    const approved = JSON.parse(localStorage.getItem('approvedStudents') || '[]');
    const pending = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    const student = pending.find(s => s.email === email);
    if (student && !approved.find(s => s.email === email)) {
      approved.push(student);
      localStorage.setItem('approvedStudents', JSON.stringify(approved));
      const remaining = pending.filter(s => s.email !== email);
      localStorage.setItem('pendingStudents', JSON.stringify(remaining));
      setPendingStudents(remaining);
    }
  };

  const rejectStudent = (email) => {
    const pending = JSON.parse(localStorage.getItem('pendingStudents') || '[]');
    const remaining = pending.filter(s => s.email !== email);
    localStorage.setItem('pendingStudents', JSON.stringify(remaining));
    setPendingStudents(remaining);
  };

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
    const text = `CampusBridge NAAC Criterion 1 & 2 Report — Batch 2026\n\nDepartment Readiness:\n` + gaps.map(g=>`${g.dept}: ${g.score}% · ${g.missing}`).join('\n') + `\n\nInstitutional Skill Gaps — localStorage key: institutionalSkillGaps`;
    const blob = new Blob([text], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'naac_sih26044_criterion_report.txt'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <button onClick={() => window.history.back()} className="text-sm text-blue-600 font-bold mb-4">← Back to Portal</button>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">TPO Admin Analytics</h1>
      <p className="text-slate-500 mb-6">Institutional Skill Gap Heatmap · Batch 2026 · CampusBridge National Gateway</p>

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

      {/* Pending Student Approvals */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck size={24} className="text-blue-600" />
          <h3 className="font-extrabold text-xl text-slate-900">Pending Student Approvals</h3>
        </div>
        {pendingStudents.length === 0 ? (
          <div className="text-slate-400 text-sm">No pending sign-up requests.</div>
        ) : (
          <div className="space-y-3">
            {pendingStudents.map(s => (
              <div key={s.email} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.email}</div>
                  <div className="text-xs text-slate-500">Hall Ticket: <span className="font-mono text-blue-600">{s.hallTicket}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveStudent(s.email)} className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1"><CheckCircle2 size={12}/> Approve</button>
                  <button onClick={() => rejectStudent(s.email)} className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold border border-rose-200 hover:bg-rose-100 transition flex items-center gap-1"><XCircle size={12}/> Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcement */}
      <div className="mb-10">
        <h3 className="font-extrabold text-lg mb-3">TPO Announcement Broadcast</h3>
        <div className="flex gap-3">
          <input value={announcementText} onChange={e => setAnnouncementText(e.target.value)} placeholder="Broadcast message to all students..." className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button onClick={broadcast} className="px-5 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition">Broadcast</button>
        </div>
      </div>

      
      {/* Skill Gap Heatmap */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-10">
        <div className="flex items-center gap-3 mb-4"><h3 className="font-extrabold text-xl text-slate-900">Institutional Skill Gap Heatmap — Batch 2026</h3></div>
        <table className="w-full text-sm border-collapse"><thead className="bg-slate-900 text-white"><tr><th className="px-3 py-2 text-left font-medium">Dept / Skill</th><th>Cloud Native</th><th>System Design</th><th>Embedded C</th><th>BIM</th></tr></thead>
        <tbody>
          <tr className="border-b border-slate-100"><td className="font-bold px-3 py-2 text-slate-800">CSE</td><td className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-2">82%</td><td className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-2">88%</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">45%</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">30%</td></tr>
          <tr className="border-b border-slate-100"><td className="font-bold px-3 py-2 text-slate-800">ECE</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">68%</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">72%</td><td className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-2">78%</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">42%</td></tr>
          <tr className="border-b border-slate-100"><td className="font-bold px-3 py-2 text-slate-800">MECH</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">55%</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">60%</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">35%</td><td className="bg-emerald-50 text-emerald-700 font-extrabold px-3 py-2">65%</td></tr>
          <tr><td className="font-bold px-3 py-2 text-slate-800">CIVIL</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">42%</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">50%</td><td className="bg-rose-50 text-rose-700 font-extrabold px-3 py-2">28%</td><td className="bg-amber-50 text-amber-700 font-extrabold px-3 py-2">72%</td></tr>
        </tbody></table>
        <button onClick={() => { const advisory = `NAAC Syllabus Advisory — ${new Date().toISOString()}: CSE (82%), ECE (68%), MECH (55%), CIVIL (42%). Recommend adding Cloud Native, System Design, Embedded C, BIM modules.`; const blob = new Blob([advisory], {type:'text/plain'}); const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=u; a.download='naac_syllabus_advisory.txt'; a.click(); URL.revokeObjectURL(u); }} className="mt-4 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-extrabold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Generate NAAC Syllabus Revision Advisory</button>
      </div>
<div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl mb-10">
        <h3 className="text-xl font-extrabold mb-2">Reverse Talent Matchmaking</h3>
        <p className="text-blue-200 text-sm mb-4">Mock recruiter queries against student competency database.</p>
        <div className="flex flex-wrap gap-2">
          {['Full-Stack React', 'DevOps / AWS', 'AI / NLP', 'VLSI Design'].map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-semibold">{tag}</span>)}
        </div>
      </div>
    
      {/* Two-Tier Pipeline */}
      <div className="bg-gradient-to-r from-blue-950 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl mb-10"><div className="flex items-center gap-3 mb-6"><ShieldCheck size={28} className="text-amber-300" /><h3 className="text-xl font-extrabold">Student Endorsement &amp; Dispatch Queue</h3></div><table className="w-full text-sm"><thead><tr><th className="text-left px-3 py-2 font-medium text-blue-200">Student</th><th className="text-left px-3 py-2 font-medium text-blue-200">College / Target</th><th className="text-left px-3 py-2 font-medium text-blue-200">Role / Company</th><th className="text-left px-3 py-2 font-medium text-blue-200">Status</th><th className="text-left px-3 py-2 font-medium text-blue-200">Actions</th></tr></thead><tbody><tr className="border-b border-blue-800"><td className="px-3 py-3 font-bold">Aarav Mehta</td><td className="px-3 py-3 text-blue-200">IIT Delhi / Bengaluru</td><td className="px-3 py-3">Frontend Engineer / CampusBridge Tech</td><td className="px-3 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">SUBMITTED_TO_TPO</span></td><td className="px-3 py-3 flex gap-2"><button className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">Reject / Revise</button><button className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">Endorse &amp; Transmit</button></td></tr><tr className="border-b border-blue-800"><td className="px-3 py-3 font-bold">Divya Krishnan</td><td className="px-3 py-3 text-blue-200">NIT Trichy / Hyderabad</td><td className="px-3 py-3">Full-Stack / Global Recruiters</td><td className="px-3 py-3"><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">TPO_ENDORSED</span></td><td className="px-3 py-3"><button className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">Transmit to Recruiter Portal</button></td></tr></tbody></table></div>
</main>
)
}

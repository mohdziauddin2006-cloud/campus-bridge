import { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Readiness() {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase.from('readiness_pillars').select('*').order('label');
      if (data) setPillars(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </main>
  );

  const overall = Math.round(pillars.reduce((a, b) => a + (b.score || 0), 0) / (pillars.length || 1));

  return (
    <main className="bg-slate-50 min-h-screen pb-20 pt-6 px-6 lg:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Industry Readiness Portal</h1>
      <p className="text-slate-500 mb-8">Live diagnostic of student skill readiness vs industry benchmarks.</p>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">Overall Readiness Gauge</h2>
          <span className="text-4xl font-extrabold text-blue-700">{overall}%</span>
        </div>
        <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {pillars.map(p => (
          <div key={p.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-extrabold text-slate-900 mb-3">{p.label}</h3>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${p.score}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-500">{p.score}% proficiency</span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-slate-900 shadow-2xl mb-10">
        <h2 className="text-xl font-extrabold mb-4 text-slate-900">Targeted Bridge Curriculum</h2>
        <p className="text-slate-600 mb-6 text-sm">Recommended modules based on weakest pillar scores.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/academy" className="block bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
            <h4 className="font-extrabold mb-1 text-slate-900">Programming Strengthening</h4>
            <p className="text-sm text-slate-600 mb-2">Systems programming, performance optimization</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-full text-blue-700">Link to Academy <ArrowRight size={12} className="ml-1"/></span>
          </Link>
          <Link to="/academy" className="block bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
            <h4 className="font-extrabold mb-1 text-slate-900">VLSI &amp; Embedded Systems</h4>
            <p className="text-sm text-slate-600 mb-2">Verilog, FPGA design, microcontroller architecture</p>
            <span className="inline-flex items-center text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-full text-blue-700">Link to Academy <ArrowRight size={12} className="ml-1"/></span>
          </Link>
        </div>
      </div>
    </main>
  );
}

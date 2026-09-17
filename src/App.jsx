import { useState, useEffect } from 'react';
import {
  CheckCircle, Clock, Award, Briefcase, ShieldCheck, BookOpen,
  Zap, ChevronRight, Lock, Eye, Users, TrendingUp, Sparkles, X,
  Menu, Upload, FileText, Github, Linkedin, ExternalLink,
  Plus, Play, Youtube
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const STORAGE_KEY = 'sih_data';
function getApps() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveApps(a) { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const JOBS = [
  { id: 1, title: 'VLSI Verification Engineer', company: 'SiliconCore', skills: ['Verilog','SystemVerilog','UVM'], tag: 'VLSI', desc: 'Pre-silicon verification, testbench architecture.' },
  { id: 2, title: 'Junior NLP Engineer', company: 'Meridian AI', skills: ['Python','PyTorch','NLP'], tag: 'AI/ML', desc: 'Transformer fine-tuning, sentiment pipelines.' },
  { id: 3, title: 'DevOps Automation Intern', company: 'ShieldNet', skills: ['AWS','Docker','CI/CD'], tag: 'DevOps', desc: 'Infrastructure-as-code, pipeline optimization.' },
  { id: 4, title: 'Full-Stack React Intern', company: 'Nebula UI', skills: ['React','Node.js','PostgreSQL'], tag: 'Full-Stack', desc: 'Component libraries, API integration.' },
];

const DEFAULT_JOB_LISTINGS = [
  { id: 101, title: 'Software Engineer Intern', company: 'Orbit Labs', skills: ['React','Node.js','PostgreSQL'], tag: 'Full-Stack', desc: 'Build production-grade web applications.', ctc: '₹ 12-16 LPA', dept: 'CSE', published: true },
  { id: 102, title: 'AI Research Intern', company: 'Meridian AI', skills: ['Python','PyTorch','NLP'], tag: 'AI/ML', desc: 'Research on large language models.', ctc: '₹ 14-18 LPA', dept: 'CSE', published: true },
  { id: 103, title: 'Cloud DevOps Intern', company: 'Vertex Systems', skills: ['AWS','Docker','CI/CD'], tag: 'DevOps', desc: 'Infrastructure automation and monitoring.', ctc: '₹ 10-14 LPA', dept: 'IT', published: true },
];

const INDUSTRIES = {
  'Full-Stack': { required: ['React','Node.js','PostgreSQL','JavaScript','CSS','API Design','Git'], label: 'Full-Stack Web' },
  'AI/ML': { required: ['Python','PyTorch','NLP','Pandas','NumPy','Scikit-learn','Data Visualization'], label: 'AI / Machine Learning' },
  'VLSI': { required: ['Verilog','SystemVerilog','UVM','Digital Design','Synthesis','STA'], label: 'VLSI / Semiconductor' },
  'DevOps': { required: ['AWS','Docker','CI/CD','Kubernetes','Terraform','Linux','Monitoring'], label: 'DevOps & Cloud' },
};

// Enhanced Learning Resources Component
const EnhancedLearningResources = ({ missingSkills, industry }) => {
  const [learningResources, setLearningResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningResources = async () => {
      setLoading(true);
      setError(null);

      try {
        // Mock data for demonstration (graceful fallback)
        const mockResources = generateMockResources(missingSkills);

        // Try to use Gemini API if key is available
        let geminiResources = null;
        if (import.meta.env.VITE_GEMINI_API_KEY) {
          try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
            const prompt = `For the following missing skills in the ${industry} industry, provide official documentation URLs and YouTube search URLs:

            Missing Skills: ${missingSkills.join(', ')}

            For each skill, provide:
            1. The exact official documentation URL
            2. A targeted YouTube search URL (format: https://www.youtube.com/results?search_query=learn+[skill]+crash+course)

            Return as JSON array with this structure:
            [{
              "skill": "Skill Name",
              "docsUrl": "https://official-docs-url.com",
              "youtubeUrl": "https://www.youtube.com/results?search_query=learn+skill+crash+course"
            }]

            Focus on practical, beginner-friendly resources. Include official government/academic resources when available.`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: prompt,
            });

            const textResponse = response.text;
            if (textResponse) {
              const jsonMatch = textResponse.match(/\[.*\]/s);
              if (jsonMatch) {
                geminiResources = JSON.parse(jsonMatch[0]);
              }
            }
          } catch (geminiError) {
            console.log('Gemini API failed, using mock data:', geminiError);
            geminiResources = null;
          }
        }

        setLearningResources(geminiResources || mockResources);
      } catch (err) {
        console.error('Failed to fetch learning resources:', err);
        setError('Failed to load resources');
        setLearningResources(generateMockResources(missingSkills));
      } finally {
        setLoading(false);
      }
    };

    fetchLearningResources();
  }, [missingSkills, industry]);

  const generateMockResources = (skills) => {
    return skills.map(skill => {
      const skillSlug = skill.toLowerCase().replace(/\s+/g, '+');
      const mockDocsUrls = {
        'Advanced System Design': 'https://assets.amazon.com/2f60e548-df70-4ce3-bcad-6c8972e313bc/documents/61bcfa8e-c506-4fe8-bc41-c9245332e233/Designing_Highly_Available_Applications_on_AWS.pdf',
        'Kubernetes': 'https://kubernetes.io/docs/home/',
        'Microservices Architecture': 'https://microservices.io/patterns/index.html',
        'React': 'https://react.dev/learn',
        'Node.js': 'https://nodejs.org/en/docs/',
        'Python': 'https://docs.python.org/3/',
        'AWS': 'https://docs.aws.amazon.com/',
        'Docker': 'https://docs.docker.com/get-started/',
        'Git': 'https://git-scm.com/doc',
        'TypeScript': 'https://www.typescriptlang.org/docs/',
        'GraphQL': 'https://graphql.org/learn/',
        'Digital Design': 'https://www.allaboutcircuits.com/tutorials/',
        'SystemVerilog': 'https://static.dev.snowblower.com/pdf/sv_getting_started_guide_2021_en.pdf',
        'UVM': 'https://dvresources.e-research.info/wiki/UVM',
        'Synthesis': 'https://www.synopsys.com/designware/synthesis.html',
        'STA': 'https://www.synopsys.com/glossary/sta.html',
        'CI/CD': 'https://docs.gitlab.com/ee/ci/cd_prerequisites/',
        'Terraform': 'https://developer.hashicorp.com/terraform/docs',
        'Linux': 'https://linux.die.net/man/',
        'Monitoring': 'https://prometheus.io/docs/introduction/overview/',
        'PyTorch': 'https://pytorch.org/tutorials/',
        'NLP': 'https://huggingface.co/docs/transformers/',
        'Pandas': 'https://pandas.pydata.org/docs/',
        'NumPy': 'https://numpy.org/doc/stable/',
        'Scikit-learn': 'https://scikit-learn.org/stable/documentation.html',
        'Data Visualization': 'https://matplotlib.org/stable/users/index.html',
      };

      const docsUrl = mockDocsUrls[skill] || `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`;

      return {
        skill,
        docsUrl,
        youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' crash course full tutorial')}`
      };
    });
  };

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#EAE6DC] shadow-[4px_4px_0_#d8d4c8,1px_1px_0_#d8d4c8]">
        <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
          <div className="w-4 h-4 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
          Loading learning resources...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-[#800020]/5 rounded-xl border border-[#800020]/20">
        <p className="text-sm text-[#800020]">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium text-[#10b981] mb-2">
        🎓 Recommended Learning Resources:
      </div>
      {learningResources.map((resource, idx) => (
        <div
          key={idx}
          className="card-editorial p-4 hover:-translate-y-1 transition-all duration-300 border-l-4 border-[#10b981] bg-gradient-to-r from-[#10b981]/5 to-transparent"
        >
          <div className="flex items-start justify-between mb-3">
            <h6 className="font-medium text-sm text-[#1A1A1A] flex items-center gap-2">
              <BookOpen size={14} className="text-[#10b981]" />
              {resource.skill}
            </h6>
            <span className="text-xs text-[#1A1A1A]/40">Industry: {industry}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <a
              href={resource.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 p-3 rounded-lg bg-[#FDFBF7] border border-[#EAE6DC] hover:border-[#10b981] hover:bg-[#10b981]/5 transition-all duration-300"
            >
              <BookOpen size={16} className="text-[#10b981]" />
              <span className="text-sm text-[#1A1A1A] group-hover:text-[#10b981] truncate">
                Official Docs
              </span>
              <ExternalLink size={12} className="text-[#1A1A1A]/40 group-hover:text-[#10b981]" />
            </a>
            <a
              href={resource.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden bg-[#12121a] border border-[#EAE6DC]/20 hover:border-[#800020] shadow-[8px_8px_0_#d8d4c8,2px_2px_0_#d8d4c8] hover:shadow-[10px_10px_0_#3a0010,3px_3px_0_#d8d4c8] transition-all duration-300"
            >
              <div className="relative h-28 w-full bg-gradient-to-br from-[#1b1e23] to-[#0a0a0f] flex items-center justify-center">
                <div className="absolute inset-0 bg-[#800020]/10" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#1A1A1A]/90 text-[10px] font-bold text-[#FDFBF7] border border-[#EAE6DC]/20 shadow-sm backdrop-blur-sm">
                  Tutorial • 25 min
                </div>
                <div className="relative z-10 w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.45),inset_0_2px_4px_rgba(255,255,255,0.15)] ring-2 ring-[#FF3333]/30">
                  <Play size={22} className="text-white fill-white ml-1" />
                </div>
              </div>
              <div className="p-4">
                <h6 className="font-display text-base font-bold text-[#FDFBF7] mb-1 leading-snug truncate">
                  {resource.skill} Comprehensive Masterclass / Crash Course
                </h6>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-[#e2e8f0]/40 uppercase tracking-wider">YouTube • Search Results</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#800020] hover:bg-[#600018] transition-colors shadow-[3px_3px_0_#3a0010,1px_1px_0_#3a0010]">
                    Watch ↗
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

const courseCatalog = {
  'Full-Stack': [
    { id: 'fs1', title: 'Modern React & TypeScript Patterns', embedUrl: 'https://www.youtube.com/embed/zjs13CRwIsk', tag: 'Frontend', domain: 'Full-Stack', skills: ['React','JavaScript','CSS'], fallbackUrl: 'https://react.dev/learn', fallbackText: 'Read Official React Docs' },
    { id: 'fs2', title: 'Node.js & API Design Masterclass', embedUrl: 'https://www.youtube.com/embed/Oe421EPjePz', tag: 'Backend', domain: 'Full-Stack', skills: ['Node.js','API Design'], fallbackUrl: 'https://nodejs.org/en/docs/', fallbackText: 'Read Official Node.js Docs' },
  ],
  'AI/ML': [
    { id: 'ai1', title: 'Deep Learning with PyTorch', embedUrl: 'https://www.youtube.com/embed/3t9lZh11ZfA', tag: 'ML Core', domain: 'AI/ML', skills: ['PyTorch','Python'], fallbackUrl: 'https://pytorch.org/tutorials/', fallbackText: 'Read PyTorch Tutorials' },
    { id: 'ai2', title: 'NLP & Transformer Architectures', embedUrl: 'https://www.youtube.com/embed/fqpta0OQjS0', tag: 'NLP', domain: 'AI/ML', skills: ['NLP','Python'], fallbackUrl: 'https://huggingface.co/docs', fallbackText: 'Read Hugging Face Docs' },
    { id: 'ai3', title: 'Neural Networks from Scratch', embedUrl: 'https://www.youtube.com/embed/w8yWXqWQYmU', tag: 'Deep Learning', domain: 'AI/ML', skills: ['PyTorch','NumPy'], fallbackUrl: 'https://www.w3schools.com/ai/', fallbackText: 'Read W3Schools AI Guide' },
  ],
  'VLSI': [
    { id: 'vl1', title: 'Verilog & SystemVerilog Fundamentals', embedUrl: 'https://www.youtube.com/embed/3zO1f3OqwRI', tag: 'Digital Design', domain: 'VLSI', skills: ['Verilog','SystemVerilog','Digital Design'], fallbackUrl: 'https://www.chipverify.com/verilog/', fallbackText: 'Read ChipVerify Verilog Guide' },
    { id: 'vl2', title: 'UVM Verification Methodology', embedUrl: 'https://www.youtube.com/embed/0Y7lP8D8LzU', tag: 'Verification', domain: 'VLSI', skills: ['UVM'], fallbackUrl: 'https://verificationacademy.com/', fallbackText: 'Read Verification Academy' },
    { id: 'vl3', title: 'Static Timing Analysis (STA)', embedUrl: 'https://www.youtube.com/embed/d5f8e6j3nRg', tag: 'Timing', domain: 'VLSI', skills: ['STA'], fallbackUrl: 'https://www.synopsys.com/glossary/sta.html', fallbackText: 'Read Synopsys STA Overview' },
  ],
  'DevOps': [
    { id: 'do1', title: 'Docker & Kubernetes for Engineers', embedUrl: 'https://www.youtube.com/embed/fqpta0OQjS0', tag: 'Containers', domain: 'DevOps', skills: ['Docker','Kubernetes'], fallbackUrl: 'https://docs.docker.com/get-started/', fallbackText: 'Read Official Docker Docs' },
    { id: 'do2', title: 'CI/CD Pipelines & Infra as Code', embedUrl: 'https://www.youtube.com/embed/-C5XfBjFc5g', tag: 'Automation', domain: 'DevOps', skills: ['CI/CD','Terraform'], fallbackUrl: 'https://learn.hashicorp.com/terraform', fallbackText: 'Read HashiCorp Learn' },
    { id: 'do3', title: 'AWS Cloud Architecture Essentials', embedUrl: 'https://www.youtube.com/embed/Ndrr9P6x5vU', tag: 'Cloud', domain: 'DevOps', skills: ['AWS','Linux'], fallbackUrl: 'https://aws.amazon.com/getting-started/', fallbackText: 'Read AWS Getting Started' },
  ],
};

export default function App() {
  const [page, setPage] = useState('portal');
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [jobListings, setJobListings] = useState(DEFAULT_JOB_LISTINGS);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [postForm, setPostForm] = useState({ company: '', role: '', skills: '', ctc: '', dept: 'CSE' });

  const openPostJob = () => { setPostForm({ company: '', role: '', skills: '', ctc: '', dept: 'CSE' }); setPostJobOpen(true); };
  const closePostJob = () => setPostJobOpen(false);

  const submitPostJob = () => {
    if (!postForm.company || !postForm.role) { showToast('Fill company and role'); return; }
    const skillsArr = postForm.skills.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
    const newJob = {
      id: Math.max(...jobListings.map(j => j.id), 0) + 1,
      title: postForm.role,
      company: postForm.company,
      skills: skillsArr,
      tag: skillsArr[0] || 'General',
      desc: `New opportunity at ${postForm.company}.`,
      ctc: postForm.ctc || '₹ 10-14 LPA',
      dept: postForm.dept,
      published: true,
    };
    setJobListings([...jobListings, newJob]);
    closePostJob();
    showToast('Job listing published to Recruiter Matching');
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  useEffect(() => { saveApps(getApps()); }, []);

  /* ---------- APPLY MODAL ---------- */
  const [applyJob, setApplyJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cgpa: '', backlogs: '' });

  const openApply = (j) => { setApplyJob(j); setFormData({ name: '', email: '', phone: '', cgpa: '', backlogs: '' }); };
  const closeModal = () => setApplyJob(null);

  const submitApp = () => {
    if (!formData.name || !formData.email || !formData.phone || formData.cgpa === '' || formData.backlogs === '') {
      showToast('Please fill all fields'); return;
    }
    const apps = getApps();
    apps.push({
      id: uid(), jobTitle: applyJob.title, studentName: formData.name,
      email: formData.email, contact: formData.phone,
      cgpa: parseFloat(formData.cgpa), backlogs: parseInt(formData.backlogs),
      skills: applyJob.skills, status: 'Applied', submittedAt: new Date().toISOString()
    });
    saveApps(apps); closeModal(); showToast('Application submitted successfully');
  };

  /* ---------- PAGES ---------- */
  function PortalPage({ onApply }) {
    return (
      <div>
        <header className="mb-14">
          <h1 className="hero-display text-[#1A1A1A] mb-4">Explore Internships.<br/><span className="italic font-medium text-[#800020]">Bridge talent to industry.</span></h1>
          <p className="text-[#1A1A1A]/70 text-lg max-w-2xl leading-relaxed">Browse verified roles across VLSI, AI/ML, DevOps and Full-Stack. Apply formally — no instant submissions.</p>
        </header>
        <section className="card-grid">
          {jobListings.map(j => (
            <article key={j.id} className="card-editorial flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{j.tag}</span>
                <Briefcase size={18} className="text-[#1A1A1A]/30" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-1 leading-snug">{j.title}</h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-3">{j.company}</p>
              <p className="text-[#1A1A1A]/80 text-sm leading-relaxed mb-4 flex-grow">{j.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {j.skills.map(s => <span key={s} className="text-xs border border-[#EAE6DC] px-2 py-0.5 rounded-md text-[#1A1A1A]/70">{s}</span>)}
              </div>
              <button onClick={() => onApply({ title: j.title, company: j.company, skills: j.skills })} className="btn-editorial w-full text-center">Apply Now</button>
            </article>
          ))}
        </section>
      </div>
    );
  }

  function MyApplicationsPage() {
    const apps = getApps();
    const timeline = ['Applied','Under Review','Interview','Decision'];

    return (
      <div>
        <header className="mb-10"><h1 className="font-display text-5xl font-bold text-[#1A1A1A] mb-3">My Applications</h1><p className="text-[#1A1A1A]/60">Read-only view of your submitted profiles.</p></header>
        {apps.length === 0 ? (
          <div className="card-editorial text-center py-16"><h3 className="font-display text-xl text-[#1A1A1A] mb-2">No applications yet</h3><p className="text-sm text-[#1A1A1A]/60">Return to the portal to apply.</p></div>
        ) : (
          <div className="flex flex-col gap-10">
            {apps.map(app => (
              <article key={app.id} className="card-editorial relative pl-16 md:pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#800020] text-white flex items-center justify-center shadow-lg font-display font-bold text-lg">{timeline.indexOf(app.status)+1}</div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-display text-xl font-bold text-[#1A1A1A]">{app.jobTitle}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-2.5 py-1 rounded-full">{app.status}</span>
                </div>
                <p className="text-sm text-[#1A1A1A]/70 mb-3">{app.studentName} — {app.email} — CGPA {app.cgpa}</p>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {timeline.map(t => (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-md border transition-colors ${t===app.status ? 'bg-[#800020] text-white border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A]/40 border-[#EAE6DC]'}`}>{t}</span>
                  ))}
                </div>
                <p className="text-xs text-[#1A1A1A]/40">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                <div className="absolute left-6 top-14 bottom-[-8px] w-[2px] bg-gradient-to-b from-[#800020] to-[#EAE6DC]" />
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ReadinessPage() {
    const [industry, setIndustry] = useState('Full-Stack');
    const [typedSkills, setTypedSkills] = useState('');
    const [result, setResult] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const currentActive = activeVideo;
    useEffect(() => {
      const missing = result ? result.missing : [];
      const lowerMissing = missing.map(s => s.toLowerCase());
      const allVideos = Object.values(courseCatalog).flat();
      const filtered = allVideos.filter(v => {
        if (v.domain !== industry) return false;
        if (!missing.length) return true;
        return v.skills.some(sk => lowerMissing.some(m => sk.toLowerCase().includes(m) || m.includes(sk.toLowerCase())));
      });
      const display = filtered.length ? filtered : (courseCatalog[industry] || []);
      setActiveVideo(display[0] || (courseCatalog[industry] ? courseCatalog[industry][0] : null));
    }, [industry, result]);

    const displayVideos = result ? (() => {
      const missing = result.missing || [];
      const lowerMissing = missing.map(s => s.toLowerCase());
      const allVideos = Object.values(courseCatalog).flat();
      const filtered = allVideos.filter(v => {
        if (v.domain !== industry) return false;
        if (!missing.length) return true;
        return v.skills.some(sk => lowerMissing.some(m => sk.toLowerCase().includes(m) || m.includes(sk.toLowerCase())));
      });
      return filtered.length ? filtered : (courseCatalog[industry] || []);
    })() : (courseCatalog[industry] || []);

    const calculate = () => {
      const target = INDUSTRIES[industry].required;
      const current = typedSkills.split(/[;,]+/).map(s => s.trim()).filter(Boolean);
      const found = target.filter(req => current.some(c => c.toLowerCase() === req.toLowerCase() || c.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(c.toLowerCase())));
      const missing = target.filter(req => !found.includes(req));
      const pct = Math.round((found.length / target.length) * 100);
      setResult({ pct, missing, found, target, industryLabel: INDUSTRIES[industry].label });
    };

    return (
      <div>
        <header className="mb-10"><h1 className="font-display text-5xl font-bold text-[#1A1A1A] mb-3">Industry Readiness</h1><p className="text-[#1A1A1A]/60">Compare your skills against a target industry's hard requirements.</p></header>
        <section className="grid lg:grid-cols-2 gap-8 mb-10">
          <div className="card-editorial">
            <h2 className="font-display text-xl font-bold mb-4">Target Industry</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(INDUSTRIES).map(([k,v]) => (
                <button key={k} onClick={() => { setIndustry(k); setResult(null); }} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${industry===k ? 'bg-[#800020] text-[#FDFBF7] border-[#800020]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020]'}`}>{v.label}</button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[#FDFBF7] border border-[#EAE6DC] rounded-lg text-sm text-[#1A1A1A]/80">Required: {INDUSTRIES[industry].required.join(', ')}</div>
          </div>
          <div className="card-editorial">
            <h2 className="font-display text-xl font-bold mb-4">Your Skills</h2>
            <textarea rows={3} placeholder="Type your skills (e.g., React, Python, Verilog, NLP)" value={typedSkills} onChange={e=>setTypedSkills(e.target.value)} className="input-editorial w-full resize-none mb-3" />
            <button onClick={calculate} className="btn-editorial">Calculate Readiness</button>
          </div>
        </section>

        {result && (
          <section className="card-editorial mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-display text-2xl font-bold">{result.industryLabel} Readiness</h2>
              <span className={`text-3xl font-display font-bold ${result.pct>=70?'text-[#10b981]':result.pct>=40?'text-[#B8860B]':'text-[#800020]'}`}>{result.pct}%</span>
            </div>
            <div className="w-full h-3 bg-[#EAE6DC] rounded-full overflow-hidden mb-6"><div className="h-full bg-gradient-to-r from-[#800020] to-[#10b981] rounded-full" style={{width:`${result.pct}%`}} /></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Matched Skills</h3>
                {result.found.length===0 ? <p className="text-sm text-[#1A1A1A]/40">None matched.</p> : <ul className="flex flex-wrap gap-2">{result.found.map(s=><li key={s} className="text-sm bg-[#10b981]/10 text-[#1A1A1A] px-2 py-1 rounded-md">{s}</li>)}</ul>}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#1A1A1A]/50 mb-2">Missing Skills</h3>
                {result.missing.length===0 ? <p className="text-sm text-[#10b981]">All requirements met.</p> : <ul className="flex flex-wrap gap-2">{result.missing.map(s=><li key={s} className="text-sm bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-md font-medium">{s}</li>)}</ul>}
              </div>
            </div>
          </section>
        )}

        {/* AI Profile & Resume Analyzer */}
        <section className="card-editorial mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#10b981] rounded-full" />
            <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">AI Profile & Resume Analyzer</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">AI-Powered</span>
          </div>

          {/* Resume Scanner Section */}
          <div className="mb-10">
            <h3 className="font-display text-2xl font-bold mb-4">Resume Scanner</h3>
            <div className="relative border-2 border-dashed border-[#800020]/30 rounded-xl p-8 bg-gradient-to-br from-[#FDFBF7] to-[#FDFBF7]/80 hover:from-[#FDFBF7]/90 hover:to-[#FDFBF7]/70 transition-all duration-300">
              <input type="file" id="resume-upload" className="hidden" accept=".pdf,.docx" onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  // Simulate file upload
                  showToast('Processing resume...');
                  setTimeout(() => {
                    setToast(null);
                    showToast('Resume scan complete!');
                  }, 2500);
                }
              }} />
              <label htmlFor="resume-upload" className="cursor-pointer block text-center">
                <div className="flex flex-col items-center gap-4">
                  <Upload size={48} className="text-[#800020]" />
                  <div>
                    <p className="font-medium text-[#1A1A1A] mb-1">Drop your resume here or click to browse</p>
                    <p className="text-sm text-[#1A1A1A]/60">Supports PDF and DOCX files</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* GitHub & LinkedIn Integration */}
          <div className="mb-6">
            <h3 className="font-display text-2xl font-bold mb-4">Professional Profiles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A]/80 mb-2">GitHub Profile</label>
                <div className="relative">
                  <Github size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A1A1A]/40" />
                  <input type="url" placeholder="https://github.com/yourusername" className="input-editorial pl-10 w-full" />
                  <button onClick={() => showToast('GitHub profile synced successfully!')} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#10b981] text-white text-xs rounded-full hover:bg-[#10b981]/90 transition-colors">Sync</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A]/80 mb-2">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1A1A1A]/40" />
                  <input type="url" placeholder="https://linkedin.com/in/yourusername" className="input-editorial pl-10 w-full" />
                  <button onClick={() => showToast('LinkedIn profile synced successfully!')} className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-[#10b981] text-white text-xs rounded-full hover:bg-[#10b981]/90 transition-colors">Sync</button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Scanning Results Demo */}
          <div className="mt-8 p-6 bg-[#10b981]/5 rounded-xl border border-[#10b981]/20">
            <h4 className="font-display text-xl font-bold mb-4 text-[#10b981]">AI Scanning Results</h4>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#1A1A1A]/70">Job Readiness Score</span>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#10b981]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#10b981] border-t-transparent transform rotate-[-90deg]" style={{background: 'conic-gradient(from 90deg, #10b981 var(--progress, 88%), transparent 0)'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#10b981]">88%</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-sm text-[#10b981] mb-2">Extracted Skills</h5>
                <ul className="space-y-1">
                  <li className="text-sm text-[#1A1A1A]/80 flex items-center gap-2"><CheckCircle size={14} className="text-[#10b981]" /> React, Node.js, Python, SQL</li>
                  <li className="text-sm text-[#1A1A1A]/80 flex items-center gap-2"><CheckCircle size={14} className="text-[#10b981]" /> Docker, AWS, Git</li>
                  <li className="text-sm text-[#1A1A1A]/80 flex items-center gap-2"><CheckCircle size={14} className="text-[#10b981]" /> TypeScript, GraphQL</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-sm text-[#800020] mb-2">Identified Gaps</h5>
                <ul className="space-y-1">
                  <li className="text-sm text-[#800020] flex items-center gap-2"><X size={14} className="text-[#800020]" /> Advanced System Design</li>
                  <li className="text-sm text-[#800020] flex items-center gap-2"><X size={14} className="text-[#800020]" /> Kubernetes</li>
                  <li className="text-sm text-[#800020] flex items-center gap-2"><X size={14} className="text-[#800020]" /> Microservices Architecture</li>
                </ul>
                {result?.missing?.length > 0 && (
                  <EnhancedLearningResources
                    missingSkills={result.missing}
                    industry={result.industryLabel}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Video Platform */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#800020] rounded-full" />
            <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Recommended Masterclasses</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-3 py-1 rounded-full">{industry}</span>
          </div>
          <div className="card-editorial mb-8" style={{ border: '2px solid #1A1A1A', boxShadow: '10px 10px 0 #d8d4c8, 4px 4px 0 #d8d4c8' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-[#1A1A1A]">{currentActive ? currentActive.title : 'Select a Masterclass'}</h3>
              <span className="text-xs font-bold uppercase text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-full">{currentActive ? currentActive.tag : 'Waiting'}</span>
            </div>
            <div className="video-wrap">
              <iframe src={currentActive && currentActive.embedUrl ? currentActive.embedUrl : 'https://www.youtube.com/embed/zjs13CRwIsk?rel=0'} title="Masterclass Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            {currentActive && currentActive.fallbackUrl && (
              <div className="mt-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#EAE6DC] shadow-[4px_4px_0_#d8d4c8,1px_1px_0_#d8d4c8]">
                <a href={currentActive.fallbackUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#800020] hover:bg-[#600018] transition-colors shadow-[3px_3px_0_#4a0010,1px_1px_0_#4a0010]" style={{fontFamily:"'Inter',sans-serif"}}>
                  Prefer reading? {currentActive.fallbackText}
                </a>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {displayVideos.map((vid, idx) => (
              <button key={vid.id} onClick={() => setActiveVideo(vid)} className={`card-editorial text-left transition-all duration-300 hover:-translate-y-1 ${(currentActive?.id === vid.id || activeVideo?.id === vid.id) ? 'ring-2 ring-[#800020] bg-[#FDFBF7]' : ''}`} style={{ borderColor: (currentActive?.id === vid.id || activeVideo?.id === vid.id) ? '#800020' : '#EAE6DC' }}>
                <div className="flex gap-5">
                  <div className="w-24 h-16 shrink-0 rounded-lg overflow-hidden shadow-md" style={{ background: '#800020' }}>
                    <div className="w-full h-full flex items-center justify-center text-white/90 font-display font-bold text-xs">▶</div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-bold text-[#1A1A1A] leading-snug mb-1 truncate">{vid.title}</h4>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#800020]">{vid.tag}</span>
                    <div className="text-[10px] text-[#1A1A1A]/40 mt-2">Free Embeddable Class · YouTube</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* ---------- TPO ADMIN ---------- */
  function TPOPage() {
    const [authed, setAuthed] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const handleLogin = () => { if (loginId === 'admin' && loginPass === 'sih2026') setAuthed(true); else { showToast('Invalid credentials'); setLoginPass(''); } };

    if (!authed) {
      return (
        <div className="max-w-md mx-auto mt-20">
          <div className="card-editorial text-center">
            <ShieldCheck size={48} className="mx-auto mb-4 text-[#800020]" />
            <h2 className="font-display text-3xl font-bold mb-2">TPO Administration</h2>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">Secure access required for placement records.</p>
            <input placeholder="Admin ID" value={loginId} onChange={e=>setLoginId(e.target.value)} className="input-editorial w-full mb-3 text-center" />
            <input type="password" placeholder="Password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} className="input-editorial w-full mb-4 text-center" />
            <button onClick={handleLogin} className="btn-editorial w-full">Sign In</button>
            <p className="text-[10px] text-[#1A1A1A]/30 mt-4">Hardcoded: admin / sih2026</p>
          </div>
        </div>
      );
    }

    const apps = getApps();
    const statusOptions = ['Applied','Under Review','Interview','Decision'];

    const changeStatus = (id, newStatus) => {
      const list = getApps();
      const idx = list.findIndex(a => a.id === id);
      if (idx !== -1) { list[idx].status = newStatus; saveApps(list); showToast('Status updated'); }
      // Sync student view via storage (no reload needed if they navigate)
    };

    return (
      <div>
        <header className="mb-10 border-b border-[#EAE6DC] pb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-[#1A1A1A] mb-1">Annamacharya Institute Of Technology And Sciences - TPO Placement Portal</h1>
            <p className="text-sm text-[#1A1A1A]/50">Authorized administrator view · localStorage sync active · Active Internships: {jobListings.filter(j => j.published).length}</p>
          </div>
          <button onClick={openPostJob} className="btn-editorial flex items-center gap-2 shrink-0"><Plus size={14} /> Post New Job / Internship</button>
        </header>

        <section className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{apps.length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Total Applications</p></div>
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{apps.filter(a=>a.status==='Applied').length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Awaiting Review</p></div>
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1">{new Set(apps.map(a=>a.jobTitle)).size}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Active Roles</p></div>
          <div className="card-editorial"><h3 className="font-display text-xl font-bold mb-1 text-[#10b981]">{jobListings.filter(j => j.published).length}</h3><p className="text-xs uppercase tracking-widest text-[#1A1A1A]/40">Active Internships</p></div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Application Registry</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#EAE6DC] bg-[#FDFBF7] shadow-[8px_8px_0_#d8d4c8,2px_2px_0_#d8d4c8]">
            <table className="w-full text-sm" style={{fontFamily:"'Inter',sans-serif"}}>
              <thead className="bg-[#1A1A1A] text-[#FDFBF7]">
                <tr><th className="text-left px-4 py-3 font-medium">Student</th><th className="text-left px-4 py-3 font-medium">Role</th><th className="text-left px-4 py-3 font-medium">Email</th><th className="text-left px-4 py-3 font-medium">CGPA</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-left px-4 py-3 font-medium">Action</th></tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} className="border-b border-[#EAE6DC] hover:bg-[#800020]/[0.03] transition">
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">{app.studentName}</td>
                    <td className="px-4 py-3">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-[#1A1A1A]/70">{app.email}</td>
                    <td className="px-4 py-3">{app.cgpa}</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#800020]/10 text-[#800020]">{app.status}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-2">{statusOptions.map(st => (<button key={st} onClick={() => changeStatus(app.id, st)} disabled={app.status===st} className={`text-xs px-2 py-1 rounded-md border transition ${app.status===st ? 'bg-[#1A1A1A] text-[#FDFBF7] border-[#1A1A1A]' : 'bg-[#FDFBF7] text-[#1A1A1A] border-[#EAE6DC] hover:border-[#800020] hover:text-[#800020]'}`}>{st}</button>))}</div></td>
                  </tr>
                ))}
                {apps.length===0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#1A1A1A]/40">No applications recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- RENDER ---------- */
  return (
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@300;400;500;600&display=swap'); .font-display { font-family: 'Playfair Display', Georgia, serif; } .nav-label { font-family: 'Inter', sans-serif; font-size: 0.85rem; letter-spacing: 0.02em; text-transform: uppercase; font-weight: 500; }`}</style>
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EAE6DC]" style={{fontFamily:"'Inter',sans-serif"}}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-auto nav-row flex items-center justify-between py-3">
          <button onClick={()=>setPage('portal')} className="font-display text-2xl font-bold text-[#1A1A1A] tracking-tight hover:text-[#800020] transition-colors">Campus Bridge</button>
          <button onClick={()=>setMobileOpen(!mobileOpen)} className="md:hidden text-[#1A1A1A]" aria-label="Menu"><Menu size={24} /></button>
          <div className={`md:flex gap-8 items-center ${mobileOpen ? 'flex flex-col gap-3 mt-3 md:mt-0 w-full md:w-auto' : 'hidden'}`}>
            <button onClick={()=>{setPage('portal'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Student Portal</button>
            <button onClick={()=>{setPage('applications'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">My Applications</button>
            <button onClick={()=>{setPage('readiness'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">Industry Readiness</button>
            <button onClick={()=>{setPage('tpo'); setMobileOpen(false);}} className="nav-label text-[#1A1A1A] hover:text-[#800020] transition-colors">TPO Admin</button>
          </div>
        </div>
      </nav>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] text-[#FDFBF7] px-6 py-3 rounded-full shadow-2xl font-[Inter] text-sm font-medium flex items-center gap-2 animate-toast-in"><CheckCircle size={18} className="text-[#10b981]" /> {toast}</div>}

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {page==='portal' && <PortalPage onApply={openApply} />}
        {page==='applications' && <MyApplicationsPage />}
        {page==='readiness' && <ReadinessPage />}
        {page==='tpo' && <TPOPage />}
      </main>

      {/* Post Job Modal */}
      <div className={`modal-back ${postJobOpen ? '' : 'hidden'}`} onClick={closePostJob}>
        <div className="modal-panel" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Post New Job / Internship</h2>
            <button onClick={closePostJob} className="text-[#1A1A1A]/40 hover:text-[#800020] transition"><X size={22} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); submitPostJob(); }} className="flex flex-col gap-4">
            <input required placeholder="Company Name" value={postForm.company} onChange={e=>setPostForm({...postForm,company:e.target.value})} className="input-editorial" />
            <input required placeholder="Role Title" value={postForm.role} onChange={e=>setPostForm({...postForm,role:e.target.value})} className="input-editorial" />
            <input placeholder="Required Skills (comma separated)" value={postForm.skills} onChange={e=>setPostForm({...postForm,skills:e.target.value})} className="input-editorial" />
            <input placeholder="Expected CTC / Stipend (e.g. ₹ 12-16 LPA)" value={postForm.ctc} onChange={e=>setPostForm({...postForm,ctc:e.target.value})} className="input-editorial" />
            <select value={postForm.dept} onChange={e=>setPostForm({...postForm,dept:e.target.value})} className="input-editorial bg-white">
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="Mech">Mech</option>
              <option value="Civil">Civil</option>
              <option value="IT">IT</option>
            </select>
            <button type="submit" className="btn-editorial w-full mt-2">Publish Listing</button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <div className={`modal-back ${applyJob ? '' : 'hidden'}`} onClick={closeModal}>
        <div className="modal-panel" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Apply to <span className="text-[#800020]">{applyJob?.title}</span></h2>
              <p className="text-sm text-[#1A1A1A]/60">{applyJob?.company}</p>
            </div>
            <button onClick={closeModal} className="text-[#1A1A1A]/40 hover:text-[#800020] transition"><X size={22} /></button>
          </div>
          <form onSubmit={e => { e.preventDefault(); submitApp(); }} className="flex flex-col gap-4">
            <input required placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="input-editorial" />
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="input-editorial" />
            <input required placeholder="Phone / Contact" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} className="input-editorial" />
            <div className="flex gap-4">
              <input required type="number" step="0.01" placeholder="CGPA (e.g. 8.5)" value={formData.cgpa} onChange={e=>setFormData({...formData,cgpa:e.target.value})} className="input-editorial flex-1" />
              <input required type="number" placeholder="Active Backlogs" value={formData.backlogs} onChange={e=>setFormData({...formData,backlogs:e.target.value})} className="input-editorial flex-1" />
            </div>
            <button type="submit" className="btn-editorial w-full mt-2">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}

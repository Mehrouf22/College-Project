import React, { useState, useEffect } from 'react';
import { Sparkles, Code2, BookOpen, FileText, ArrowRight, Loader2, Copy, CheckCircle2, Download, LogOut, User } from 'lucide-react';

// ═══════════════════════════════════════════
//        MATRINAX SPLASH SCREEN COMPONENT
// ═══════════════════════════════════════════
function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const letters = 'MATRINAX'.split('');

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${4 + Math.random() * 6}s`,
    size: `${1 + Math.random() * 2}px`,
  }));

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3800);
    const removeTimer = setTimeout(() => onFinish(), 4600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-glow" />
      <div className="splash-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="splash-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
      <h1 className="splash-title">
        {letters.map((char, i) => (
          <span key={i} className="letter" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
            {char}
          </span>
        ))}
      </h1>
      <div className="splash-line" />
      <div className="splash-progress-track">
        <div className="splash-progress-bar" />
      </div>
      <p className="splash-tagline">A Matrinax Product</p>
    </div>
  );
}

// ═══════════════════════════════════════════
//          AUTH SCREEN COMPONENT
// ═══════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authData, setAuthData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store user info locally
    const userData = {
      fullName: authData.fullName || 'User',
      companyName: authData.companyName || '',
      email: authData.email,
    };
    localStorage.setItem('syncspace_user', JSON.stringify(userData));
    onLogin(userData);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setAuthData({ fullName: '', companyName: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      {/* Floating ambient orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* Auth Card */}
      <div className="auth-card" key={isSignUp ? 'signup' : 'login'}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Sparkles className="text-white" style={{ width: 22, height: 22 }} />
          </div>
          <span className="auth-logo-text">SyncSpace</span>
        </div>
        <p className="auth-subtitle">
          {isSignUp ? 'Create your AI workspace account' : 'Welcome back to your workspace'}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-row">
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="John Doe"
                  required
                  value={authData.fullName}
                  onChange={(e) => setAuthData({ ...authData, fullName: e.target.value })}
                />
              </div>
              <div className="auth-input-group">
                <label className="auth-label">Company</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Matrinax Inc."
                  value={authData.companyName}
                  onChange={(e) => setAuthData({ ...authData, companyName: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@company.com"
              required
              value={authData.email}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              required
              minLength={6}
              value={authData.password}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-button">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button className="auth-switch-link" onClick={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>

      {/* Bottom branding */}
      <p className="auth-branding">A Matrinax Product</p>
    </div>
  );
}

// ═══════════════════════════════════════════
//              MAIN APP
// ═══════════════════════════════════════════
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('syncspace_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // States for features
  const [formData, setFormData] = useState({ websiteType: '', audience: '', tone: '' });
  const [compData, setCompData] = useState({ component: '', style: '', framework: 'React + Tailwind' });
  const [docsData, setDocsData] = useState({ topic: '', level: 'intermediate' });
  const [invoiceData, setInvoiceData] = useState({ clientName: '', projectName: '', amount: '' });
  
  // Shared UI States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setResult(null);
  };

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult(`Backend/AI Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setResult(`Connection Error: Make sure backend is running on port 5000!`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateComponent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult(`Backend/AI Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setResult(`Connection Error: Make sure backend is running on port 5000!`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocs = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docsData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult(`Backend/AI Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setResult(`Connection Error: Make sure backend is running on port 5000!`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        alert("Error generating invoice!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadPDF = () => {
    if (!result || !result.base64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${result.base64}`;
    link.download = `Invoice-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tools = [
    { id: 'content', title: 'Content AI', icon: <Sparkles className="w-6 h-6 text-purple-400" />, desc: 'AI content directly tuned for high-converting websites.' },
    { id: 'component', title: 'Component AI', icon: <Code2 className="w-6 h-6 text-blue-400" />, desc: 'Clean, production-ready React UI components in seconds.' },
    { id: 'docs', title: 'Docs AI', icon: <BookOpen className="w-6 h-6 text-emerald-400" />, desc: 'Convert complex technical topics into structured notes.' },
    { id: 'invoice', title: 'Invoice Generator', icon: <FileText className="w-6 h-6 text-amber-400" />, desc: 'Create beautiful PDF invoices instantly without AI.' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('syncspace_user');
    setUser(null);
    setActiveTab('dashboard');
    setResult(null);
  };

  return (
    <>
      {/* MATRINAX Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Auth Gate: Show login if not authenticated */}
      {!showSplash && !user && (
        <AuthScreen onLogin={(userData) => setUser(userData)} />
      )}

      {/* Main App: Only visible when logged in */}
      {!showSplash && user && (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center py-12 px-4 selection:bg-purple-500/30">
      
      {/* Header */}
      <div className="max-w-5xl w-full flex justify-between items-center mb-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">SyncSpace</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
            <User className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300 font-medium">{user.fullName}</span>
            {user.companyName && (
              <span className="text-xs text-slate-500">• {user.companyName}</span>
            )}
          </div>
          {/* Status Badge */}
          <div className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm font-medium text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Active
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-slate-900 border border-slate-800 rounded-full p-2.5 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full flex-1">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Welcome back, {user.fullName.split(' ')[0]} 👋
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl">
                Select a perfectly-tuned agent to supercharge your development workflow. Each tool is built with a separate underlying model for maximum performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => ['content', 'component', 'docs', 'invoice'].includes(tool.id) ? navigateTo(tool.id) : alert('Coming soon!')}
                  className="group bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className={`w-5 h-5 ${tool.id === 'component' ? 'text-blue-400' : tool.id === 'docs' ? 'text-emerald-400' : tool.id === 'invoice' ? 'text-amber-400' : 'text-purple-400'}`} />
                  </div>
                  <div className="bg-slate-950 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-slate-800 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Generator Tab */}
        {activeTab === 'content' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" /> Content Generator
                </h2>
              </div>

              <form onSubmit={handleGenerateContent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website Type</label>
                  <input type="text" placeholder="e.g. SaaS Startup, Gym Portfolio" required value={formData.websiteType} onChange={(e) => setFormData({...formData, websiteType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Target Audience</label>
                  <input type="text" placeholder="e.g. Enterprise Businesses" required value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tone</label>
                  <input type="text" placeholder="e.g. Professional, Energetic" required value={formData.tone} onChange={(e) => setFormData({...formData, tone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <button disabled={loading} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating...</> : <><Sparkles className="w-5 h-5"/> Generate Content</>}
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-full">
              {result ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-purple-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Gemini Response</span>
                    <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">{copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}</button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="text-slate-600"><Sparkles className="w-8 h-8 mb-4 mx-auto" /><h3 className="text-xl font-bold text-slate-500">Awaiting Instructions</h3></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Component Generator Tab */}
        {activeTab === 'component' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-blue-400" /> Component Generator
                </h2>
              </div>

              <form onSubmit={handleGenerateComponent} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Component Type</label>
                  <input type="text" placeholder="e.g. Hero Section, Pricing Card, Nav Bar" required value={compData.component} onChange={(e) => setCompData({...compData, component: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Detailed Style</label>
                  <input type="text" placeholder="e.g. Glassmorphism, Dark Mode, Minimalist" required value={compData.style} onChange={(e) => setCompData({...compData, style: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Framework</label>
                  <input type="text" required value={compData.framework} onChange={(e) => setCompData({...compData, framework: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <button disabled={loading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating...</> : <><Code2 className="w-5 h-5"/> Generate Component</>}
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-full">
              {result ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Mistral Response</span>
                    <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">{copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}</button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">{result}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="text-slate-600"><Code2 className="w-8 h-8 mb-4 mx-auto" /><h3 className="text-xl font-bold text-slate-500">Ready to Code</h3></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Docs Generator Tab */}
        {activeTab === 'docs' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-400" /> Docs AI
                </h2>
              </div>

              <form onSubmit={handleGenerateDocs} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Topic</label>
                  <input type="text" placeholder="e.g. React Server Components, LangGraph" required value={docsData.topic} onChange={(e) => setDocsData({...docsData, topic: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Technical Level</label>
                  <select required value={docsData.level} onChange={(e) => setDocsData({...docsData, level: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <button disabled={loading} className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Summarizing...</> : <><BookOpen className="w-5 h-5"/> Generate Docs</>}
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-full">
              {result ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-emerald-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cohere Response</span>
                    <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">{copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}</button>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                    <pre className="text-sm text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{result}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="text-slate-600"><BookOpen className="w-8 h-8 mb-4 mx-auto" /><h3 className="text-xl font-bold text-slate-500">Ready to Learn</h3></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoice Generator Tab */}
        {activeTab === 'invoice' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
                </button>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-500" /> Invoice Generator
                </h2>
              </div>

              <form onSubmit={handleGenerateInvoice} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Client Name</label>
                  <input type="text" placeholder="e.g. Acme Corp" required value={invoiceData.clientName} onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Project Name</label>
                  <input type="text" placeholder="e.g. Dashboard Redesign" required value={invoiceData.projectName} onChange={(e) => setInvoiceData({...invoiceData, projectName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Amount ($)</label>
                  <input type="number" placeholder="5000" required value={invoiceData.amount} onChange={(e) => setInvoiceData({...invoiceData, amount: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-slate-600" />
                </div>
                <button disabled={loading} className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating PDF...</> : <><FileText className="w-5 h-5"/> Generate Invoice PDF</>}
                </button>
              </form>
            </div>

            <div className="w-full md:w-1/2 flex flex-col h-full">
              {result && result.base64 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="bg-slate-950 border-b border-slate-800 p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-amber-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> System Generated PDF</span>
                    <button onClick={downloadPDF} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 text-sm font-medium flex items-center gap-2">
                      <Download className="w-5 h-5" /> Download
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    <iframe src={`data:application/pdf;base64,${result.base64}`} className="w-full h-full rounded-xl bg-white border-0 min-h-[500px]" title="Invoice Preview"></iframe>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center p-8 text-center min-h-[400px]">
                  <div className="text-slate-600"><FileText className="w-8 h-8 mb-4 mx-auto text-slate-700" /><h3 className="text-xl font-bold text-slate-500">Ready to Bill</h3></div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      
    </div>
    )}
    </>
  );
}

export default App;

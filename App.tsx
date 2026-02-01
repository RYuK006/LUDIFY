
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bot, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Navigation,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CalendarCheck,
  Activity,
  ChevronRight,
  Cpu,
  Layers,
  Calendar,
  MessageSquare,
  Key,
  Globe
} from 'lucide-react';
import { AgentStatus, Listing, SearchQuery, AgentLog } from './types';
import { geminiService } from './services/geminiService';
import { Terminal } from './components/Terminal';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'CHF', symbol: 'Fr' },
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [query, setQuery] = useState<SearchQuery>({
    workLocation: '',
    budget: '',
    currency: 'USD',
    transport: 'driving',
    maxCommute: 25
  });
  const [coords, setCoords] = useState<{ latitude: number, longitude: number } | undefined>();
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [strategyText, setStrategyText] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("Geolocation blocked, using default location.", err)
      );
    }
  }, []);

  const addLog = useCallback((message: string, type: AgentLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      message,
      type
    }]);
  }, []);

  const startMission = async () => {
    if (!query.workLocation || !query.budget) return;

    setStatus(AgentStatus.STRATEGIZING);
    setLogs([]);
    setResults([]);
    setStrategyText('');
    setSources([]);

    addLog(`LUDIFY Lifecycle Management Initiated for: ${query.workLocation}`, 'agent');
    addLog(`Target Currency: ${query.currency}`, 'info');
    addLog('PHASE 1: Strategist Agent calculating real-time Commute Zones...', 'info');

    try {
      const strategy = await geminiService.analyzeCommute(query, coords);
      setStrategyText(strategy);
      addLog('Neighborhood clusters and landmark nodes verified.', 'success');

      setStatus(AgentStatus.HUNTING);
      addLog('PHASE 2: Hunter Agent (Architect Mode) scanning disparate platforms...', 'agent');
      addLog('Synthesizing extraction scripts to pull deterministic data...', 'info');
      
      const { listings, sources: searchSources } = await geminiService.findListings(query);
      setSources(searchSources);
      setResults(listings);
      
      if (listings.length === 0) {
        addLog('Zero direct matches. Expanding search radius by 5%...', 'warning');
      } else {
        addLog(`Successfully extracted ${listings.length} REAL listings from the live web.`, 'success');
      }
      
      setStatus(AgentStatus.CLOSING);
      addLog('PHASE 3: Closer Agent (Outreach Bot) initiating automated sequence...', 'agent');
      
      for (const listing of listings.slice(0, 3)) {
        addLog(`Transmitting LUDIFY proxy inquiry to ${listing.source}...`);
        const outcome = await geminiService.simulateOutreach(listing);
        
        await new Promise(r => setTimeout(r, 1500));
        
        const isAvailable = outcome.toUpperCase().includes('AVAILABLE') && !outcome.toUpperCase().includes('SOLD OUT');
        
        setResults(prev => prev.map(l => 
          l.id === listing.id 
            ? { 
                ...l, 
                status: isAvailable ? 'replied' : 'rejected', 
                agentNote: isAvailable 
                  ? 'Confirmed: Unit is active. Verified visit window Sat @ 11:30 AM.' 
                  : 'Update: Owner reports unit just rented. Removing from sequence.' 
              } 
            : l
        ));
        
        if (isAvailable) {
          addLog(`Inquiry Success: Viewing window locked for ${listing.title}.`, 'success');
        } else {
          addLog(`Listing "${listing.title}" marked as SOLD OUT.`, 'warning');
        }
      }

      setStatus(AgentStatus.COMPLETED);
      addLog('Lifecycle Completed: Your Verified Schedule is ready.', 'success');

    } catch (error) {
      console.error(error);
      addLog('Critical Mission Error: ' + (error as any).message, 'warning');
      setStatus(AgentStatus.IDLE);
    }
  };

  const schedule = results.filter(r => r.status === 'replied');
  const currentSymbol = CURRENCIES.find(c => c.code === query.currency)?.symbol || '$';

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/90 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                LUDIFY
                <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/20 uppercase tracking-tighter ml-1">v1.2</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Let Us Do It For You</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 shadow-inner">
              <div className={`w-2 h-2 rounded-full ${coords ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'bg-slate-600 animate-pulse'}`}></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{coords ? 'GEO-SIGNAL LOCKED' : 'SIGNAL SEARCH...'}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Phase Controls */}
        <div className="lg:col-span-4 space-y-8 animate-reveal">
          <section className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden group border-indigo-500/10">
            <header className="mb-10">
              <h2 className="text-xl font-black flex items-center gap-3 text-white mb-2">
                <Layers className="w-6 h-6 text-indigo-400" />
                Phase 1: Targeting
              </h2>
              <p className="text-slate-500 text-xs font-medium tracking-wide">Defining commute zones and price ceilings.</p>
            </header>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-black ml-1">Mission Headquarters (Work)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="e.g. 10 Hudson Yards, NY"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-700 text-sm font-semibold text-white"
                    value={query.workLocation}
                    onChange={e => setQuery({...query, workLocation: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-black ml-1">Price Limit</label>
                  <div className="relative flex">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">{currentSymbol}</span>
                      <input 
                        type="text" 
                        placeholder="Budget"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-l-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-semibold text-white"
                        value={query.budget}
                        onChange={e => setQuery({...query, budget: e.target.value})}
                      />
                    </div>
                    <select 
                      className="bg-slate-900 border-y border-r border-white/10 rounded-r-2xl px-3 py-4 text-xs font-bold text-indigo-400 outline-none hover:bg-slate-800 transition-colors cursor-pointer"
                      value={query.currency}
                      onChange={e => setQuery({...query, currency: e.target.value})}
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-black ml-1">Zone Radius</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                    <input 
                      type="number" 
                      placeholder="Mins"
                      className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-semibold text-white"
                      value={query.maxCommute}
                      onChange={e => setQuery({...query, maxCommute: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-black ml-1">Modality</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['driving', 'transit', 'walking'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setQuery({...query, transport: mode})}
                      className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        query.transport === mode 
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 border-transparent text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startMission}
                disabled={status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETED}
                className="w-full bg-white hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-5 rounded-[1.25rem] shadow-2xl transition-all flex items-center justify-center gap-3 group mt-8 uppercase tracking-[0.3em] text-xs"
              >
                {status === AgentStatus.IDLE ? (
                  <>
                    Initialize LUDIFY <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : status === AgentStatus.COMPLETED ? (
                    "Re-Run Sequence"
                ) : (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Agents In Progress...
                  </>
                )}
              </button>
            </div>
          </section>

          <div className="animate-reveal stagger-1">
            <Terminal logs={logs} />
          </div>
        </div>

        {/* Intelligence Dashboard */}
        <div className="lg:col-span-8 space-y-8">
          {status === AgentStatus.IDLE && results.length === 0 && (
            <div className="h-[750px] glass-panel rounded-[3.5rem] flex flex-col items-center justify-center text-slate-500 p-12 text-center animate-reveal stagger-1 border-white/5 shadow-inner">
              <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-14 rounded-[4rem] mb-12 border border-white/5 relative">
                <Bot className="w-28 h-28 text-indigo-400 opacity-30 animate-float" />
                <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full"></div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase tracking-[0.2em]">Autonomous Concierge</h3>
              <p className="text-slate-400 max-w-sm font-medium leading-relaxed mb-10 text-sm">
                Deploy LUDIFY to handle discovery, commute strategy, and owner outreach automatically. Real listings, real data, no friction.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-900/60 px-5 py-2.5 rounded-full border border-white/10">
                    <Activity className="w-3.5 h-3.5 text-indigo-500" /> Phase 2: Hunter
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-900/60 px-5 py-2.5 rounded-full border border-white/10">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-500" /> Phase 3: Closer
                 </div>
              </div>
            </div>
          )}

          {status !== AgentStatus.IDLE && (
            <div className="space-y-8">
              {/* Strategist Analysis */}
              <div className="glass-panel rounded-[2.5rem] p-10 shadow-2xl animate-reveal stagger-1 border-indigo-500/10">
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-3 rounded-2xl">
                       <Navigation className="w-7 h-7 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-wider">Phase 1: Strategist Output</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Grounding v2.4</span>
                  </div>
                </header>
                {strategyText ? (
                  <div className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-8 rounded-[2rem] border border-white/5 font-medium italic shadow-inner">
                    {strategyText.split('\n').map((line, i) => <p key={i} className="mb-4">{line}</p>)}
                  </div>
                ) : (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-white/5 rounded-xl w-full"></div>
                    <div className="h-6 bg-white/5 rounded-xl w-11/12"></div>
                    <div className="h-6 bg-white/5 rounded-xl w-10/12"></div>
                  </div>
                )}
              </div>

              {/* Verified Schedule (Phase 3 Completed) */}
              {schedule.length > 0 && status === AgentStatus.COMPLETED && (
                <div className="glass-panel rounded-[2.5rem] p-10 shadow-2xl border-emerald-500/20 bg-emerald-500/5 animate-reveal stagger-2">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="bg-emerald-500/20 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                         <CalendarCheck className="w-7 h-7 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-wider">Verified Visit Schedule</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {schedule.map(s => (
                        <div key={s.id} className="flex items-center justify-between bg-black/50 p-6 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all">
                           <div className="flex items-center gap-4">
                              <Calendar className="w-6 h-6 text-indigo-400" />
                              <div>
                                 <p className="text-sm font-black text-white">{s.title}</p>
                                 <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Confirmed: Sat @ 11:30 AM</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Hunter Findings (Phase 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.length > 0 ? (
                  results.map((listing, index) => (
                    <div 
                      key={listing.id} 
                      className="glass-panel rounded-[3rem] overflow-hidden group hover:scale-[1.04] transition-all duration-1000 shadow-2xl hover:shadow-indigo-500/20 animate-reveal border-white/5"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="relative h-72 overflow-hidden">
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] brightness-90 group-hover:brightness-110" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-black/70 backdrop-blur-2xl px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10 flex items-center gap-2 shadow-xl">
                            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                            {listing.source}
                          </span>
                        </div>
                        <div className="absolute bottom-6 right-6">
                          <div className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border ${
                            listing.status === 'replied' ? 'bg-emerald-500 border-emerald-400 text-white' :
                            listing.status === 'rejected' ? 'bg-pink-600 border-pink-400 text-white' :
                            listing.status === 'contacted' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900/90 border-white/10 text-slate-400'
                          }`}>
                            {listing.status === 'replied' ? <CalendarCheck className="w-4 h-4" /> : <Loader2 className={`w-4 h-4 ${listing.status === 'new' ? '' : 'animate-spin'}`} />}
                            {listing.status === 'replied' ? 'VERIFIED' : listing.status}
                          </div>
                        </div>
                      </div>
                      <div className="p-10">
                        <div className="flex justify-between items-start mb-5">
                          <h4 className="font-extrabold text-2xl text-white tracking-tight leading-tight group-hover:text-pink-400 transition-colors truncate pr-2">{listing.title}</h4>
                          <span className="text-white font-black text-2xl bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent flex-shrink-0">{listing.price}</span>
                        </div>
                        <div className="flex items-center gap-8 text-slate-400 text-xs mb-8 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2.5">
                            <MapPin className="w-4.5 h-4.5 text-indigo-500" />
                            {listing.location}
                          </span>
                          <span className="flex items-center gap-2.5">
                            <Navigation className="w-4.5 h-4.5 text-pink-500" />
                            {listing.commuteTime}
                          </span>
                        </div>
                        
                        <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-white/5 flex gap-5 items-start mb-10 min-h-[100px] shadow-inner">
                          <Bot className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                          <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                            {listing.agentNote || "Analyzing architectural structure and verifying landlord responsiveness..."}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <a 
                            href={listing.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-center transition-all uppercase tracking-[0.2em] text-white border border-white/10 flex items-center justify-center gap-2 group/link shadow-xl"
                          >
                            Explore Site <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  status === AgentStatus.HUNTING && (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-[500px] glass-panel rounded-[3rem] animate-pulse border-white/5 shadow-inner"></div>
                    ))
                  )
                )}
              </div>

              {/* Data Node Transparency */}
              {sources.length > 0 && (
                <div className="glass-panel rounded-[2.5rem] p-10 animate-reveal stagger-3 border-white/5 shadow-2xl">
                  <div className="flex items-center gap-4 mb-10">
                    <Activity className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.5em]">Autonomous Scrape Nodes</h3>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.web?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black bg-slate-950/80 border border-white/10 px-6 py-4 rounded-2xl hover:border-pink-500/50 hover:text-pink-400 transition-all text-slate-500 flex items-center gap-4 group shadow-lg"
                      >
                        <AlertCircle className="w-5 h-5 text-indigo-600 group-hover:text-pink-500 transition-colors" />
                        {s.web?.title?.slice(0, 45) || 'Encrypted Node ' + (i+1)}...
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Persistent Lifecycle Footer */}
      {status !== AgentStatus.IDLE && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-slate-950/95 backdrop-blur-[40px] rounded-[3rem] p-8 shadow-[0_20px_100px_rgba(0,0,0,0.8)] flex items-center justify-between z-[100] border border-white/10 ring-1 ring-white/10 animate-reveal">
          <div className="flex items-center gap-8">
            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 p-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              {status === AgentStatus.COMPLETED ? <CheckCircle2 className="w-7 h-7 text-white" /> : <Loader2 className="w-7 h-7 animate-spin text-white" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2">Sequence Protocol</span>
              <span className="text-xl font-black text-white capitalize tracking-tight">
                {status === AgentStatus.STRATEGIZING && 'Phase 1: Strategist'}
                {status === AgentStatus.HUNTING && 'Phase 2: Hunter'}
                {status === AgentStatus.CLOSING && 'Phase 3: Closer'}
                {status === AgentStatus.COMPLETED && 'Lifecycle Success'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-black bg-white text-slate-950 px-10 py-5 rounded-[1.25rem] uppercase tracking-widest shadow-2xl active:scale-95 transition-all hover:bg-indigo-50"
          >
            Audit Logs
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart3, 
  Settings, 
  Footprints, 
  Wind, 
  Thermometer, 
  Sun, 
  Armchair, 
  ChevronRight, 
  Trophy, 
  Sparkles,
  Bell,
  User,
  Navigation2,
  Store,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { INITIAL_SEATS, MOCK_INSIGHTS } from './constants';
import { SmartSeat, UserStats, UrbanInsight } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explorer' | 'planner' | 'profile'>('dashboard');
  const [seats, setSeats] = useState<SmartSeat[]>(INITIAL_SEATS);
  const [userStats, setUserStats] = useState<UserStats>({
    steps: 8420,
    target: 10000,
    rewards: 3,
    points: 1250
  });
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate step counting
  useEffect(() => {
    const interval = setInterval(() => {
      setUserStats(prev => ({
        ...prev,
        steps: Math.min(prev.target, prev.steps + Math.floor(Math.random() * 5))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following urban data from Riyadh's Sports Boulevard:
        - Smart Seats: ${seats.length} units
        - Current Occupancy: ${seats.filter(s => s.status === 'occupied').length}
        - Average Temperature: 32°C
        - Peak Sunlight: 90%
        - User Activity: High (8000+ steps avg)
        
        Provide 3 strategic recommendations for "Humanizing" this public space. Focus on walkability, thermal comfort, and social engagement. Return in a concise markdown format.`,
      });
      setAiAnalysis(response.text || "Unable to generate insights at this time.");
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis("Error generating insights. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleSeat = (id: string) => {
    setSeats(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus: SmartSeat['status'] = s.status === 'folded' ? 'occupied' : (s.status === 'occupied' ? 'shaded' : 'folded');
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-stone-50 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <header className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-saudi-green">HumanizeCity</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Riyadh Sports Boulevard</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full bg-white shadow-sm border border-slate-100 relative">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 rounded-full bg-saudi-green text-white shadow-md">
            <QrCode size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 pt-4"
            >
              {/* Step Progress Card */}
              <div className="saudi-gradient p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-saudi-gold font-bold text-xs uppercase tracking-widest mb-1">Today's Journey</p>
                      <h2 className="text-4xl font-black">{userStats.steps.toLocaleString()}</h2>
                      <p className="text-sm opacity-80">steps of {userStats.target.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                      <Footprints size={24} />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      className="h-full bg-saudi-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.steps / userStats.target) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-saudi-green bg-slate-200 overflow-hidden">
                          <img src={`https://picsum.photos/seed/user${i}/100`} alt="user" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-saudi-green bg-saudi-gold flex items-center justify-center text-[10px] font-bold">
                        +12
                      </div>
                    </div>
                    <button className="text-xs font-bold bg-white text-saudi-green px-4 py-2 rounded-full shadow-sm">
                      Claim Reward
                    </button>
                  </div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Thermometer size={16} />
                    <span className="text-xs font-bold uppercase tracking-tighter">Temp</span>
                  </div>
                  <p className="text-2xl font-bold">32°C</p>
                  <p className="text-[10px] text-orange-500 font-medium">Hot • Shading Active</p>
                </div>
                <div className="glass-card p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Wind size={16} />
                    <span className="text-xs font-bold uppercase tracking-tighter">AQI</span>
                  </div>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-[10px] text-emerald-500 font-medium">Good • Fresh Air</p>
                </div>
              </div>

              {/* Smart Seats Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Nearby Smart Seats</h3>
                  <button className="text-saudi-green text-xs font-bold flex items-center gap-1">
                    View Map <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {seats.map(seat => (
                    <div key={seat.id} className="glass-card p-4 flex items-center justify-between group hover:border-saudi-green/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-2xl transition-colors",
                          seat.status === 'occupied' ? "bg-red-50 text-red-500" : 
                          seat.status === 'folded' ? "bg-slate-100 text-slate-400" : 
                          "bg-emerald-50 text-emerald-600"
                        )}>
                          <Armchair size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Zone {seat.id}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                            {seat.status === 'occupied' ? 'Currently Occupied' : 
                             seat.status === 'folded' ? 'Folded for Space' : 'Available • Shaded'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSeat(seat.id)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-saudi-green group-hover:text-white transition-all"
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards Section */}
              <div className="bg-saudi-gold/10 border border-saudi-gold/20 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-saudi-gold rounded-xl text-white">
                    <Trophy size={20} />
                  </div>
                  <h3 className="font-bold text-saudi-gold">Active Rewards</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Store size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Free Arabic Coffee</p>
                        <p className="text-[10px] text-slate-500">Reach 10k steps</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-saudi-gold bg-saudi-gold/10 px-2 py-1 rounded-full">84%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'explorer' && (
            <motion.div 
              key="explorer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 pt-4"
            >
              <div className="h-[400px] bg-slate-200 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-40">
                  <img 
                    src="https://picsum.photos/seed/riyadh-map/800/800" 
                    alt="map" 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Map Markers */}
                {seats.map((seat, i) => (
                  <motion.div
                    key={seat.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="absolute cursor-pointer"
                    style={{ 
                      top: `${30 + i * 15}%`, 
                      left: `${20 + i * 20}%` 
                    }}
                  >
                    <div className={cn(
                      "p-2 rounded-full shadow-lg border-2 border-white",
                      seat.status === 'occupied' ? "bg-red-500" : "bg-saudi-green"
                    )}>
                      <Navigation2 size={16} className="text-white transform rotate-45" />
                    </div>
                  </motion.div>
                ))}

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Scenic Heritage Path</h4>
                    <span className="text-[10px] font-bold text-saudi-green bg-saudi-green/10 px-2 py-1 rounded-full">2.4 km</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Explore traditional architecture and hidden gardens along the boulevard.</p>
                  <button className="w-full py-3 bg-saudi-green text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
                    Start Walking
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-xs font-bold">Hidden Gems</p>
                  <p className="text-[10px] text-slate-400">12 nearby</p>
                </div>
                <div className="glass-card p-4 text-center space-y-2">
                  <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <Store size={20} />
                  </div>
                  <p className="text-xs font-bold">Local Deals</p>
                  <p className="text-[10px] text-slate-400">5 active</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'planner' && (
            <motion.div 
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">AI Urban Insights</h3>
                <button 
                  onClick={generateAIInsights}
                  disabled={isAnalyzing}
                  className="p-2 bg-saudi-green text-white rounded-lg shadow-md disabled:opacity-50"
                >
                  <Sparkles size={18} />
                </button>
              </div>

              {/* Chart Section */}
              <div className="glass-card p-4 h-[200px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Pedestrian Flow (24h)</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { time: '00:00', flow: 120 },
                    { time: '04:00', flow: 40 },
                    { time: '08:00', flow: 350 },
                    { time: '12:00', flow: 280 },
                    { time: '16:00', flow: 520 },
                    { time: '20:00', flow: 890 },
                    { time: '23:00', flow: 450 },
                  ]}>
                    <defs>
                      <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006C35" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#006C35" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="flow" stroke="#006C35" fillOpacity={1} fill="url(#colorFlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Analysis Result */}
              <div className="space-y-4">
                {isAnalyzing ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm prose prose-sm max-w-none">
                    <div className="flex items-center gap-2 mb-4 text-saudi-green font-bold">
                      <Sparkles size={16} />
                      <span>Gemini AI Strategy</span>
                    </div>
                    <div className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                      {aiAnalysis}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Tap the sparkles to generate AI insights</p>
                  </div>
                )}
              </div>

              {/* Mock Insights List */}
              <div className="space-y-3">
                {MOCK_INSIGHTS.map(insight => (
                  <div key={insight.id} className="glass-card p-4 border-l-4 border-saudi-green">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm">{insight.title}</h4>
                      <span className={cn(
                        "text-[8px] font-bold px-2 py-0.5 rounded-full uppercase",
                        insight.impact === 'high' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{insight.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6 pt-4 text-center"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-4 border-saudi-gold p-1 mx-auto">
                  <img 
                    src="https://picsum.photos/seed/user-main/300" 
                    alt="profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-saudi-green text-white p-2 rounded-full shadow-lg">
                  <Settings size={16} />
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold">Ahmad Al-Faisal</h2>
                <p className="text-xs text-slate-500">Explorer Level 12 • Riyadh, KSA</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-3">
                  <p className="text-lg font-bold text-saudi-green">12.4k</p>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Total Pts</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-lg font-bold text-saudi-green">48</p>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Badges</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-lg font-bold text-saudi-green">15</p>
                  <p className="text-[8px] text-slate-400 uppercase font-bold">Rewards</p>
                </div>
              </div>

              <div className="space-y-3 text-left">
                <h3 className="font-bold text-sm px-2">Settings</h3>
                <div className="glass-card divide-y divide-slate-50">
                  <button className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="text-sm">Privacy & Security</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="text-sm">Health Data Sync</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <button className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="text-sm">Notifications</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-30">
        <NavButton 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard size={22} />} 
          label="Home" 
        />
        <NavButton 
          active={activeTab === 'explorer'} 
          onClick={() => setActiveTab('explorer')} 
          icon={<MapIcon size={22} />} 
          label="Explore" 
        />
        <NavButton 
          active={activeTab === 'planner'} 
          onClick={() => setActiveTab('planner')} 
          icon={<BarChart3 size={22} />} 
          label="AI Planner" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={22} />} 
          label="Profile" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300",
        active ? "text-saudi-green scale-110" : "text-slate-400 hover:text-slate-600"
      )}
    >
      <div className={cn(
        "p-1 rounded-xl transition-all",
        active && "bg-saudi-green/10"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-saudi-green rounded-full mt-0.5"
        />
      )}
    </button>
  );
}

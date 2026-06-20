'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  ArrowRight, 
  Cpu, 
  Play, 
  CheckCircle, 
  Sparkles, 
  ThumbsUp, 
  Activity,
  Flame
} from 'lucide-react';
import { useApp, ArenaBot } from '@/context/AppContext';

export default function Arena() {
  const { arenaBots, voteForBot } = useApp();
  
  const [botAId, setBotAId] = useState('bot-1');
  const [botBId, setBotBId] = useState('bot-2');
  
  const [showdownRunning, setShowdownRunning] = useState(false);
  const [showdownCompleted, setShowdownCompleted] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [showdownWinner, setShowdownWinner] = useState<ArenaBot | null>(null);

  const botA = arenaBots.find(b => b.id === botAId) || arenaBots[0];
  const botB = arenaBots.find(b => b.id === botBId) || arenaBots[1];

  const handleShowdown = async () => {
    if (botA.id === botB.id) return;
    
    setShowdownRunning(true);
    setShowdownCompleted(false);
    setShowdownWinner(null);
    setBattleLogs([]);

    const steps = [
      'Synchronizing node parameters on 0G DA...',
      'Deploying swarms to local 0G Compute environments...',
      'Injecting identical task payloads: "Evaluate gas hedge arbitrage on Uniswap vs Sushiswap"...',
      `Evaluating speeds: ${botA.name} latency at ${botA.speed}ms vs ${botB.name} latency at ${botB.speed}ms...`,
      `Evaluating execution precision: ${botA.name} accuracy ${botA.accuracy}% vs ${botB.name} accuracy ${botB.accuracy}%...`,
      `Validating data costs... ${botA.name} cost: ${botA.cost}cr vs ${botB.name} cost: ${botB.cost}cr...`,
      'Finalizing performance matrices...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setBattleLogs(prev => [...prev, steps[i]]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Determine winner based on custom formula: score = accuracy * 0.4 + (200 - speed) * 0.4 + (100 - cost * 2) * 0.2
    const scoreA = botA.accuracy * 0.4 + (200 - botA.speed) * 0.4 + (100 - botA.cost * 2) * 0.2;
    const scoreB = botB.accuracy * 0.4 + (200 - botB.speed) * 0.4 + (100 - botB.cost * 2) * 0.2;

    const winner = scoreA >= scoreB ? botA : botB;
    setShowdownWinner(winner);
    setShowdownCompleted(true);
    setShowdownRunning(false);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-neon-purple/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-neon-lime drop-shadow-[0_2px_6px_rgba(16,185,129,0.3)]" />
            0G ZERO CUP ARENA
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Compare and vote on the most gas-efficient and accurate AI agent workflows in the tournament arena.
          </p>
        </div>

        <div className="bg-neon-lime/10 border border-neon-lime/30 px-4 py-2 rounded-xl text-xs text-neon-lime font-black uppercase tracking-wider animate-pulse flex items-center gap-2">
          <Flame className="w-4 h-4" />
          Round of 32 Standings Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Leaderboard list (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Tournament Leaderboard
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neon-purple/10 text-foreground/40 font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Bot Name</th>
                    <th className="pb-3">Efficiency</th>
                    <th className="pb-3">Latency</th>
                    <th className="pb-3">Accuracy</th>
                    <th className="pb-3">Cost</th>
                    <th className="pb-3 pr-2 text-right">Votes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neon-purple/5">
                  {arenaBots.sort((a, b) => b.votes - a.votes).map((bot, index) => (
                    <tr key={bot.id} className="hover:bg-white/5 transition-all group">
                      <td className="py-4 pl-2 font-mono text-neon-lime font-bold">
                        #{index + 1}
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-white text-sm">{bot.name}</div>
                        <div className="text-[10px] text-foreground/40 font-mono">@{bot.creator}</div>
                      </td>
                      <td className="py-4 font-mono text-foreground/80">{bot.efficiency}%</td>
                      <td className="py-4 font-mono text-foreground/80">{bot.speed} ms</td>
                      <td className="py-4 font-mono text-foreground/80">{bot.accuracy}%</td>
                      <td className="py-4 font-mono">
                        <span className={bot.cost === 0 ? 'text-neon-lime font-bold' : 'text-neon-purple font-bold'}>
                          {bot.cost === 0 ? 'FREE' : `${bot.cost} cr`}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-bold font-mono text-white">{bot.votes}</span>
                          <button
                            onClick={() => voteForBot(bot.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neon-purple/20 bg-neon-purple/5 hover:bg-neon-purple/15 text-neon-purple hover:text-white cursor-pointer transition-all"
                            title="Vote for agent"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Head-to-Head Showdown simulator (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between min-h-[460px]">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <Flame className="w-4 h-4 text-neon-lime" />
                HEAD-TO-HEAD BATTLE
              </h2>

              <div className="space-y-4">
                {/* Bot Selectors */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-foreground/40">Contender A</label>
                    <select
                      value={botAId}
                      onChange={(e) => setBotAId(e.target.value)}
                      disabled={showdownRunning}
                      className="bg-obsidian border border-neon-purple/20 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-neon-lime transition-all w-full"
                    >
                      {arenaBots.map(b => (
                        <option key={b.id} value={b.id} disabled={b.id === botBId}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-center font-black text-neon-purple text-xs">VS</div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-foreground/40">Contender B</label>
                    <select
                      value={botBId}
                      onChange={(e) => setBotBId(e.target.value)}
                      disabled={showdownRunning}
                      className="bg-obsidian border border-neon-purple/20 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-neon-lime transition-all w-full"
                    >
                      {arenaBots.map(b => (
                        <option key={b.id} value={b.id} disabled={b.id === botAId}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Showdown logs terminal */}
                {(showdownRunning || showdownCompleted) && (
                  <div className="bg-black/50 border border-neon-purple/15 rounded-xl p-3.5 h-44 overflow-y-auto font-mono text-[10px] space-y-2 text-foreground/80 select-none scrollbar-none">
                    {battleLogs.map((log, index) => (
                      <div key={index} className="flex gap-1.5 items-start">
                        <span className="text-neon-lime font-bold">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Winner announcement */}
                <AnimatePresence>
                  {showdownCompleted && showdownWinner && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 bg-neon-lime/10 border border-neon-lime/30 rounded-xl text-center text-xs font-black text-neon-lime uppercase flex flex-col items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
                      <span>{showdownWinner.name} WINS!</span>
                      <span className="text-[10px] text-foreground/60 font-medium normal-case">
                        Highest cumulative efficiency and gas savings.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neon-purple/10">
              <button
                onClick={handleShowdown}
                disabled={showdownRunning || botAId === botBId}
                className="w-full py-3 bg-gradient-to-r from-neon-lime to-neon-purple text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)] disabled:opacity-50 disabled:shadow-none cursor-pointer transition-all uppercase"
              >
                <Play className="w-3.5 h-3.5" />
                Run Showdown Simulator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

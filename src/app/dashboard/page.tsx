'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Wallet, 
  Database, 
  Cpu, 
  ArrowUpRight, 
  Play, 
  Terminal, 
  Trash2, 
  Trophy, 
  Key, 
  ShoppingCart,
  Activity
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Dashboard() {
  const { 
    walletConnected, 
    walletAddress, 
    credits, 
    connectWallet, 
    disconnectWallet, 
    workflows, 
    logs, 
    clearLogs 
  } = useApp();

  const activeBots = workflows.filter(w => w.status === 'running').length;

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-neon-purple/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-neon-lime animate-pulse" />
            CONTROL DECK
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Real-time multi-agent swarm status and 0G Labs protocol analytics.
          </p>
        </div>

        {/* Wallet connection info */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-obsidian-light/50 border border-neon-purple/20 p-2 pr-4 rounded-2xl backdrop-blur-xl"
        >
          {walletConnected ? (
            <>
              <div className="flex flex-col items-end pl-2">
                <span className="text-xs text-foreground/50">0G EVM WALLET</span>
                <span className="text-sm font-mono text-neon-lime font-bold">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-neon-purple/20" />
              <div className="flex flex-col items-end">
                <span className="text-xs text-foreground/50">0G CREDITS</span>
                <span className="text-sm font-black text-neon-purple">{credits} cr</span>
              </div>
              <button 
                onClick={disconnectWallet}
                className="ml-2 px-3 py-1.5 rounded-xl text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer font-bold border border-red-500/20"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-lime to-neon-purple text-white font-black rounded-xl hover:shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              CONNECT WALLET
            </button>
          )}
        </motion.div>
      </div>

      {/* Grid: 4 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'ACTIVE SWARMS',
            value: `${activeBots} / ${workflows.length}`,
            detail: 'Agent loops running',
            icon: Bot,
            color: 'neon-lime',
            shadow: 'rgba(16,185,129,0.06)',
            barWidth: `${(workflows.length > 0 ? (activeBots / workflows.length) * 100 : 0)}%`
          },
          {
            title: 'DAILY COMPLETED TASKS',
            value: '1,248',
            detail: '+14% from yesterday',
            icon: Cpu,
            color: 'neon-purple',
            shadow: 'rgba(99,102,241,0.06)',
            barWidth: '78%'
          },
          {
            title: '0G STORAGE SYNC (PoRA)',
            value: '14.2 MB',
            detail: 'JSON flows state sync',
            icon: Database,
            color: 'neon-lime',
            shadow: 'rgba(16,185,129,0.06)',
            barWidth: '42%'
          },
          {
            title: '0G COMPUTE CLUSTER',
            value: '34 / 40',
            detail: 'GPU Workers available',
            icon: Activity,
            color: 'neon-purple',
            shadow: 'rgba(99,102,241,0.06)',
            barWidth: '85%'
          }
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, borderColor: 'rgba(16,185,129,0.3)' }}
              className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-40"
              style={{ boxShadow: `inset 0 0 12px ${item.shadow}` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{item.title}</span>
                  <h3 className="text-2xl font-black text-white mt-2 font-mono">{item.value}</h3>
                </div>
                <div className={`p-2 rounded-xl bg-black/40 border border-neon-purple/20`}>
                  <Icon className={`w-5 h-5 ${item.color === 'neon-lime' ? 'text-neon-lime' : 'text-neon-purple'}`} />
                </div>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-2">{item.detail}</p>
                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color === 'neon-lime' ? 'bg-neon-lime' : 'bg-neon-purple'} rounded-full`}
                    style={{ width: item.barWidth }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Grid: Main Panel & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shortcuts: 2/3 wide */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-wide">QUICK OPERATIONS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Workflow Studio',
                desc: 'Access node workspace canvas, edit loops & trigger actions.',
                link: '/studio',
                icon: Play,
                color: 'from-neon-lime/20 to-neon-lime/0',
                border: 'border-neon-lime/20',
                btnText: 'LAUNCH CANVAS',
                btnColor: 'bg-neon-lime text-obsidian font-bold'
              },
              {
                title: 'Lease Swarms',
                desc: 'Fork community workflows on the 0G Lease Marketplace.',
                link: '/marketplace',
                icon: ShoppingCart,
                color: 'from-neon-purple/20 to-neon-purple/0',
                border: 'border-neon-purple/20',
                btnText: 'BROWSE STORE',
                btnColor: 'bg-neon-purple text-white font-bold'
              },
              {
                title: 'API Key Vault',
                desc: 'Encrypt and store third-party keys securely on 0G Storage.',
                link: '/vault',
                icon: Key,
                color: 'from-neon-purple/20 to-neon-purple/0',
                border: 'border-neon-purple/20',
                btnText: 'LOCK CREDENTIALS',
                btnColor: 'bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple border border-neon-purple/40 font-bold'
              },
              {
                title: 'Tournament Arena',
                desc: 'Battle agent configurations in the 0G Zero Cup.',
                link: '/arena',
                icon: Trophy,
                color: 'from-neon-lime/20 to-neon-lime/0',
                border: 'border-neon-lime/20',
                btnText: 'ENTER ARENA',
                btnColor: 'bg-neon-lime/20 hover:bg-neon-lime/45 text-neon-lime border border-neon-lime/40 font-bold'
              }
            ].map((op, idx) => {
              const OpIcon = op.icon;
              return (
                <motion.div
                  key={op.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className={`p-5 rounded-2xl border ${op.border} bg-gradient-to-br ${op.color} flex flex-col justify-between h-52 backdrop-blur-md relative group overflow-hidden`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white text-lg">{op.title}</h3>
                      <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{op.desc}</p>
                  </div>
                  <Link href={op.link} className="w-full">
                    <button className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider text-center cursor-pointer transition-all ${op.btnColor}`}>
                      {op.btnText}
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal: 1/3 wide */}
        <div className="bg-black/40 border border-neon-purple/20 rounded-2xl p-5 flex flex-col h-[460px] relative overflow-hidden backdrop-blur-lg">
          <div className="flex justify-between items-center pb-3 border-b border-neon-purple/10 mb-4 z-10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neon-lime" />
              <span className="text-xs font-bold text-white tracking-widest uppercase">SWARM_LOG_STREAM</span>
            </div>
            <button 
              onClick={clearLogs}
              className="p-1 rounded text-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Clear terminal logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-3 pr-2 custom-scrollbar z-10 flex flex-col-reverse">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-foreground/30 italic">
                Terminal idle. Run simulations or trigger state updates.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="leading-5 border-l-2 pl-2 border-transparent transition-all hover:bg-white/5 py-0.5 rounded">
                  <span className="text-foreground/40">[{log.timestamp}]</span>{' '}
                  <span 
                    className={
                      log.type === 'success' ? 'text-neon-lime font-bold' :
                      log.type === 'error' ? 'text-red-400 font-bold' :
                      log.type === 'warn' ? 'text-yellow-400 font-bold' :
                      log.type === 'system' ? 'text-cyan-400 font-black' :
                      'text-foreground/90'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

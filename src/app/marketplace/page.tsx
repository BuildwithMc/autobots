'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Star, 
  ArrowDownToLine, 
  Layers, 
  Zap, 
  ShieldAlert, 
  Wallet,
  Activity
} from 'lucide-react';
import { useApp, Workflow } from '@/context/AppContext';

const MARKETPLACE_TEMPLATES: Workflow[] = [
  {
    id: 'wf-temp-1',
    name: 'Social Hype & Summary Swarm',
    description: 'Scrapes specified web content, summarizes key terms via 0G Compute, and pushes highlights to Discord/Twitter.',
    author: '0G_Innovator',
    rating: 4.8,
    cost: 0,
    isPremium: false,
    status: 'idle',
    nodes: [
      {
        id: 'n-1',
        type: 'trigger',
        label: 'HTTP Scraper Trigger',
        status: 'idle',
        config: { title: 'Target scraper URL', description: 'Checks URL periodically.', highFunctionMode: false, parameters: { url: 'https://blog.0g.ai' } }
      },
      {
        id: 'n-2',
        type: 'ai',
        label: 'Local Summarizer',
        status: 'idle',
        config: { title: '0G LLaMA model', description: 'Summarizes using local GPU network.', highFunctionMode: false, parameters: { model: 'llama-3-8b' } }
      },
      {
        id: 'n-3',
        type: 'integration',
        label: 'Discord Webhook',
        status: 'idle',
        config: { title: 'Discord Outbound', description: 'Pushes summaries to discord channels.', highFunctionMode: false, parameters: {} }
      }
    ],
    edges: [
      { id: 'et-1', source: 'n-1', target: 'n-2' },
      { id: 'et-2', source: 'n-2', target: 'n-3' }
    ]
  },
  {
    id: 'wf-temp-2',
    name: 'Dynamic Arbitrage Sniping',
    description: 'Monitors smart contracts on 0G Chain, runs high-tier inference to assess gas efficiency, and submits flash-loan actions.',
    author: 'FlashSniper',
    rating: 4.9,
    cost: 20,
    isPremium: true,
    status: 'idle',
    nodes: [
      {
        id: 'n-1',
        type: 'trigger',
        label: 'DEX Block Monitor',
        status: 'idle',
        config: { title: 'Block Monitor', description: 'Triggers on price differences.', highFunctionMode: false, parameters: { threshold: '0.5%' } }
      },
      {
        id: 'n-2',
        type: 'condition',
        label: 'Gas Cost Check',
        status: 'idle',
        config: { title: 'Gas Estimate Evaluator', description: 'Checks standard limits.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-3',
        type: 'ai',
        label: 'Decisions Agent',
        status: 'idle',
        config: { title: 'Premium Model Claude', description: 'Evaluates risk coefficient.', highFunctionMode: true, parameters: {} }
      },
      {
        id: 'n-4',
        type: 'integration',
        label: 'Ethers Contract Executor',
        status: 'idle',
        config: { title: '0G Contract swap', description: 'Executes flashLoan swap.', highFunctionMode: false, parameters: {} }
      }
    ],
    edges: [
      { id: 'et-1', source: 'n-1', target: 'n-2' },
      { id: 'et-2', source: 'n-2', target: 'n-3' },
      { id: 'et-3', source: 'n-3', target: 'n-4' }
    ]
  },
  {
    id: 'wf-temp-3',
    name: '0G DA Block Tracker & Watcher',
    description: 'Watches 0G Data Availability (DA) node attestations, validates metadata structure, and notifies admin panel on lag.',
    author: 'DAGuardian',
    rating: 4.7,
    cost: 0,
    isPremium: false,
    status: 'idle',
    nodes: [
      {
        id: 'n-1',
        type: 'trigger',
        label: 'DA Block Attestation',
        status: 'idle',
        config: { title: 'DA Listener', description: 'Triggers when a new block attestation is submitted.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-2',
        type: 'ai',
        label: 'Structure Verifier',
        status: 'idle',
        config: { title: 'Mistral Parser', description: 'Checks header hashes against consensus criteria.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-3',
        type: 'integration',
        label: 'Telegram Alert',
        status: 'idle',
        config: { title: 'Telegram Dispatcher', description: 'Pushes alert to channel.', highFunctionMode: false, parameters: {} }
      }
    ],
    edges: [
      { id: 'et-1', source: 'n-1', target: 'n-2' },
      { id: 'et-2', source: 'n-2', target: 'n-3' }
    ]
  },
  {
    id: 'wf-temp-4',
    name: 'Intelligent IPFS Sync & PoRA Locker',
    description: 'Watches designated local folders, uses external models to tags content, writes summaries to IPFS, and seals hash pointers in 0G Storage.',
    author: 'StorageKing',
    rating: 4.6,
    cost: 15,
    isPremium: true,
    status: 'idle',
    nodes: [
      {
        id: 'n-1',
        type: 'trigger',
        label: 'Directory File Watcher',
        status: 'idle',
        config: { title: 'Folder Watcher', description: 'Triggers on new files.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-2',
        type: 'ai',
        label: 'Context Tagger',
        status: 'idle',
        config: { title: 'OpenAI Classifier', description: 'Analyzes document and tags topics.', highFunctionMode: true, parameters: {} }
      },
      {
        id: 'n-3',
        type: 'integration',
        label: '0G Storage Writer',
        status: 'idle',
        config: { title: 'PoRA Submitter', description: 'Writes metadata hashes.', highFunctionMode: false, parameters: {} }
      }
    ],
    edges: [
      { id: 'et-1', source: 'n-1', target: 'n-2' },
      { id: 'et-2', source: 'n-2', target: 'n-3' }
    ]
  },
  {
    id: 'wf-temp-5',
    name: 'Dynamic Gas Price Balancer Swarm',
    description: 'Polls GAS metrics across multiple chains, computes price volatility coefficients, and triggers hedging swaps via multi-sig scripts.',
    author: 'GasWizard',
    rating: 4.9,
    cost: 30,
    isPremium: true,
    status: 'idle',
    nodes: [
      {
        id: 'n-1',
        type: 'trigger',
        label: 'Multi-chain Gas Monitor',
        status: 'idle',
        config: { title: 'Gas Price Tracker', description: 'Fires if prices drop > 15%.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-2',
        type: 'ai',
        label: 'Hedge Estimator',
        status: 'idle',
        config: { title: 'Llama Decision', description: 'Validates profit margins.', highFunctionMode: false, parameters: {} }
      },
      {
        id: 'n-3',
        type: 'integration',
        label: 'Gnosis Safe Multi-sig',
        status: 'idle',
        config: { title: 'Gasless Transaction Submitter', description: 'Dispenses assets.', highFunctionMode: false, parameters: {} }
      }
    ],
    edges: [
      { id: 'et-1', source: 'n-1', target: 'n-2' },
      { id: 'et-2', source: 'n-2', target: 'n-3' }
    ]
  }
];

export default function Marketplace() {
  const { walletConnected, credits, connectWallet, forkWorkflow, workflows } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');

  const handleLease = (template: Workflow) => {
    forkWorkflow(template);
  };

  const filteredTemplates = MARKETPLACE_TEMPLATES.filter((temp) => {
    const matchesSearch = temp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          temp.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'free') {
      return matchesSearch && temp.cost === 0;
    }
    if (filterType === 'premium') {
      return matchesSearch && temp.cost > 0;
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header and Wallet Balance */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-neon-purple/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-neon-purple drop-shadow-[0_2px_6px_rgba(99,102,241,0.3)]" />
            BOT MARKETPLACE
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            Fork, lease, and deploy verified multi-agent workflows built by the 0G developer community.
          </p>
        </div>

        {/* Credit balances / Connect */}
        <div className="flex items-center gap-4 bg-obsidian-light/50 border border-neon-purple/20 p-2 pr-4 rounded-2xl backdrop-blur-xl">
          {walletConnected ? (
            <>
              <div className="flex flex-col items-end pl-2">
                <span className="text-xs text-foreground/50">0G BALANCE</span>
                <span className="text-sm font-black text-neon-lime">{credits} CREDITS</span>
              </div>
            </>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-lime to-neon-purple text-white font-black rounded-xl hover:shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              CONNECT WALLET TO LEASE
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-obsidian-light/20 p-4 border border-neon-purple/10 rounded-2xl backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-light border border-neon-purple/20 text-white rounded-xl px-4 py-2 text-xs pl-10 focus:outline-none focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/30 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-3" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Swarms' },
            { id: 'free', label: '0G Compute (Free)' },
            { id: 'premium', label: 'Premium Key Needed' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterType(btn.id as any)}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                filterType === btn.id
                  ? 'bg-neon-purple border-neon-purple text-white shadow-[0_0_12px_rgba(188,19,254,0.3)]'
                  : 'bg-obsidian border-neon-purple/15 text-foreground/70 hover:text-white hover:border-neon-purple/35'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, idx) => {
          // Check if user already owns it
          const isOwned = workflows.some(w => w.name === template.name && w.author === 'Me (Leased)');
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, borderColor: 'rgba(99,102,241,0.3)' }}
              className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-5 flex flex-col justify-between h-[340px] relative overflow-hidden backdrop-blur-md"
              style={{ boxShadow: 'inset 0 0 15px rgba(99,102,241,0.03)' }}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base line-clamp-1">{template.name}</h3>
                    <span className="text-[10px] text-foreground/40 font-mono">By @{template.author}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-1 border border-neon-purple/20 rounded-lg text-xs font-bold text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                  {template.description}
                </p>

                {/* Nodes Preview representation */}
                <div className="flex items-center gap-2 pt-2">
                  {template.nodes.map((n, i) => (
                    <React.Fragment key={n.id}>
                      <span 
                        className={`text-[9px] uppercase px-2 py-1 rounded border font-bold ${
                          n.type === 'trigger' ? 'bg-neon-lime/5 border-neon-lime/20 text-neon-lime' :
                          n.type === 'ai' ? 'bg-neon-purple/5 border-neon-purple/20 text-neon-purple' :
                          n.type === 'condition' ? 'bg-yellow-400/5 border-yellow-400/20 text-yellow-400' :
                          'bg-cyan-400/5 border-cyan-400/20 text-cyan-400'
                        }`}
                        title={n.label}
                      >
                        {n.type}
                      </span>
                      {i < template.nodes.length - 1 && (
                        <span className="text-foreground/30 text-xs font-mono">&gt;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neon-purple/10 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-foreground/40 uppercase block tracking-wider font-bold">Lease Cost</span>
                  <span className={`text-lg font-black font-mono ${template.cost === 0 ? 'text-neon-lime' : 'text-neon-purple'}`}>
                    {template.cost === 0 ? 'FREE' : `${template.cost} credits`}
                  </span>
                </div>

                {isOwned ? (
                  <button
                    disabled
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs bg-neon-lime/15 border border-neon-lime/30 text-neon-lime font-black"
                  >
                    IN LIBRARY
                  </button>
                ) : (
                  <button
                    onClick={() => handleLease(template)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs bg-neon-purple hover:bg-neon-purple hover:shadow-[0_0_12px_rgba(188,19,254,0.4)] text-white font-black cursor-pointer transition-all uppercase"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    Fork & Lease
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Lock, 
  CheckCircle, 
  Info, 
  Eye, 
  EyeOff, 
  Cpu, 
  Radio, 
  Database,
  Link as LinkIcon,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Vault() {
  const { walletConnected, connectWallet, vaultKeys, saveKeysToVault } = useApp();
  
  const [keys, setKeys] = useState({
    openai: vaultKeys.openai || '',
    claude: vaultKeys.claude || '',
    kimi: vaultKeys.kimi || ''
  });

  const [showKey, setShowKey] = useState<Record<string, boolean>>({
    openai: false,
    claude: false,
    kimi: false
  });

  const [encryptClient, setEncryptClient] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    const success = await saveKeysToVault(keys, encryptClient);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header Panel */}
      <div className="pb-6 border-b border-neon-purple/10">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Lock className="w-8 h-8 text-neon-lime drop-shadow-[0_2px_6px_rgba(16,185,129,0.3)]" />
          CREDENTIAL VAULT
        </h1>
        <p className="text-foreground/60 text-sm mt-1">
          Secure, client-side encrypted storage for your external AI models and third-party API configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Key locker form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-neon-purple" />
              External AI API Credentials
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              {[
                { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-proj-...' },
                { id: 'claude', label: 'Anthropic Claude Key', placeholder: 'sk-ant-sid-...' },
                { id: 'kimi', label: 'Kimi (Moonshot AI) Key', placeholder: 'sk-kimi-...' }
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-bold text-foreground/60">{field.label}</label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field.id)}
                      className="text-[10px] text-neon-purple font-bold hover:text-white cursor-pointer"
                    >
                      {showKey[field.id] ? (
                        <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hide</span>
                      ) : (
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Show</span>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showKey[field.id] ? 'text' : 'password'}
                      placeholder={field.placeholder}
                      value={keys[field.id as keyof typeof keys]}
                      onChange={(e) => setKeys(prev => ({ ...prev, [field.id]: e.target.value }))}
                      disabled={isSaving}
                      className="w-full bg-obsidian-light border border-neon-purple/20 text-white rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-neon-lime transition-all"
                    />
                  </div>
                </div>
              ))}

              {/* Encryption toggle options */}
              <div className="p-4 rounded-xl border border-neon-purple/15 bg-black/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-neon-lime mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Encrypt Client-Side via Wallet Signature</span>
                      <span className="text-[10px] text-foreground/50">Generates AES-256 decryption parameters signed locally.</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={encryptClient}
                      onChange={(e) => setEncryptClient(e.target.checked)}
                      disabled={isSaving}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-black/60 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/60 peer-checked:after:bg-neon-lime after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-lime/30 border border-neon-purple/20"></div>
                  </label>
                </div>
              </div>

              {/* Action and feedback */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                <div className="text-[10px] text-foreground/40 leading-relaxed max-w-sm flex gap-2">
                  <Info className="w-4 h-4 text-neon-purple shrink-0" />
                  <span>
                    Your credentials are encrypted locally on this client, and pointers are written directly to your 0G Storage account. They are never sent to a centralized server.
                  </span>
                </div>

                {isSaving ? (
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 px-6 py-3 bg-neon-lime/40 text-obsidian font-black rounded-xl text-xs uppercase"
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-obsidian animate-spin" />
                    Encrypting & Syncing...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-lime to-neon-purple text-white font-black rounded-xl text-xs hover:shadow-[0_4px_15px_rgba(16,185,129,0.25)] cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase"
                  >
                    <Lock className="w-4 h-4" />
                    Save & Lock Credentials
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Alert of encryption status */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-xl bg-neon-lime/10 border border-neon-lime/30 flex items-center gap-3 text-neon-lime text-xs font-bold"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Keys encrypted client-side and saved to decentralized 0G Storage! Reference block verified.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Col: Connection statuses (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-obsidian-light/30 border border-neon-purple/10 rounded-2xl p-5 backdrop-blur-md">
            <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-neon-lime" />
              INTEGRATION SOCKETS
            </h2>

            <div className="space-y-4">
              {[
                { name: 'Discord Webhook Feed', type: 'Web2', state: 'Connected', badge: 'bg-neon-lime/10 border-neon-lime/30 text-neon-lime' },
                { name: 'Twitter API Hook', type: 'Web2', state: 'Disconnected', badge: 'bg-red-500/10 border-red-500/30 text-red-400' },
                { name: 'Zapier Webhook Hook', type: 'Web2', state: 'Connected', badge: 'bg-neon-lime/10 border-neon-lime/30 text-neon-lime' },
                { name: '0G Chain Transaction Signer', type: 'Web3', state: walletConnected ? 'Connected' : 'Disconnected', badge: walletConnected ? 'bg-neon-lime/10 border-neon-lime/30 text-neon-lime' : 'bg-red-500/10 border-red-500/30 text-red-400' },
                { name: 'IPFS Storage Node Gateway', type: 'Web3', state: 'Connected', badge: 'bg-neon-lime/10 border-neon-lime/30 text-neon-lime' }
              ].map((conn, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-neon-purple/5 bg-black/30">
                  <div>
                    <span className="text-xs font-bold text-white block">{conn.name}</span>
                    <span className="text-[9px] uppercase font-black text-foreground/40 tracking-wider font-mono">{conn.type}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded border font-bold ${conn.badge}`}>
                    {conn.state}
                  </span>
                </div>
              ))}
            </div>

            {!walletConnected && (
              <div className="mt-4 p-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 text-yellow-400 text-xs flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>EVM Wallet connection required for 0G Chain transactions.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

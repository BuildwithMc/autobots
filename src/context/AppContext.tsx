'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai' | 'integration' | 'condition';
  label: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  config: {
    title: string;
    description: string;
    highFunctionMode: boolean;
    parameters: Record<string, string>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isPremium: boolean;
  cost: number;
  author: string;
  rating: number;
  status: 'idle' | 'running' | 'success' | 'failed';
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
}

export interface VaultKeys {
  openai: string;
  claude: string;
  kimi: string;
  encrypted: boolean;
}

export interface ArenaBot {
  id: string;
  name: string;
  creator: string;
  efficiency: number; // 0-100
  accuracy: number; // 0-100
  speed: number; // ms
  cost: number; // credits
  votes: number;
}

interface AppContextType {
  walletAddress: string | null;
  walletConnected: boolean;
  credits: number;
  vaultKeys: VaultKeys;
  workflows: Workflow[];
  selectedWorkflow: Workflow | null;
  logs: LogEntry[];
  arenaBots: ArenaBot[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  saveKeysToVault: (keys: Partial<VaultKeys>, encrypt: boolean) => Promise<boolean>;
  runSimulation: (workflowId: string) => Promise<void>;
  stopSimulation: (workflowId: string) => void;
  forkWorkflow: (workflow: Workflow) => void;
  setSelectedWorkflow: (workflow: Workflow | null) => void;
  generateWorkflowFromPrompt: (prompt: string) => Promise<boolean>;
  updateWorkflowNodes: (nodes: WorkflowNode[]) => void;
  updateWorkflowEdges: (edges: WorkflowEdge[]) => void;
  voteForBot: (botId: string) => void;
  addCustomWorkflow: (workflow: Workflow) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Social Hype & Summary Swarm',
    description: 'Scrapes specified web content, summarizes key terms via 0G Compute, and pushes highlights to Discord/Twitter.',
    author: '0G_Innovator',
    rating: 4.8,
    cost: 0,
    isPremium: false,
    status: 'idle',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        label: 'Web Scraper Trigger',
        status: 'idle',
        config: {
          title: 'Scrape Target Url',
          description: 'Triggered when new text content is uploaded or scheduled.',
          highFunctionMode: false,
          parameters: { url: 'https://blog.0g.ai', interval: 'Hourly' }
        }
      },
      {
        id: 'node-2',
        type: 'ai',
        label: 'Local 0G Summarizer',
        status: 'idle',
        config: {
          title: '0G Compute Open-Source Model',
          description: 'Summarizes raw scraper payload using local LLaMA-3.',
          highFunctionMode: false,
          parameters: { model: 'llama-3-8b-instruct', prompt: 'Summarize text focusing on 0G developments.' }
        }
      },
      {
        id: 'node-3',
        type: 'integration',
        label: 'Discord Webhook Feed',
        status: 'idle',
        config: {
          title: 'Discord Notification',
          description: 'Dispatches summary markdown stream to discord developers room.',
          highFunctionMode: false,
          parameters: { channelId: '10928301823091', botName: '0G Bot' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: false },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: false }
    ]
  },
  {
    id: 'wf-2',
    name: 'Dynamic Arbitrage Sniping',
    description: 'Monitors smart contracts on 0G Chain, runs high-tier inference to assess gas efficiency, and submits flash-loan actions.',
    author: 'FlashSniper',
    rating: 4.9,
    cost: 20,
    isPremium: true,
    status: 'idle',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        label: 'DEX Block Monitor',
        status: 'idle',
        config: {
          title: '0G Chain Block Event',
          description: 'Triggers on price differences > 0.5% between liquidity pools.',
          highFunctionMode: false,
          parameters: { threshold: '0.5%', pools: 'UniswapV3 / Sushiswap' }
        }
      },
      {
        id: 'node-2',
        type: 'condition',
        label: 'Gas Cost Check',
        status: 'idle',
        config: {
          title: 'Gas Estimate Evaluator',
          description: 'Verifies if gas fits inside standard 0G Chain limit parameters.',
          highFunctionMode: false,
          parameters: { maxGasPrice: '5 Gwei' }
        }
      },
      {
        id: 'node-3',
        type: 'ai',
        label: 'Decisions Agent',
        status: 'idle',
        config: {
          title: 'External Model Overdrive',
          description: 'Evaluates dynamic risk coefficients using Claude-3.5-Sonnet.',
          highFunctionMode: true,
          parameters: { model: 'claude-3.5-sonnet', prompt: 'Compute profit matrix. Only approve if profit margin > 15%.' }
        }
      },
      {
        id: 'node-4',
        type: 'integration',
        label: 'Ethers Gasless Multi-sig',
        status: 'idle',
        config: {
          title: '0G Chain Executor',
          description: 'Executes swap contract transaction with signed credentials.',
          highFunctionMode: false,
          parameters: { contractAddress: '0x3c44...1f49', method: 'flashLoanSwap' }
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: false },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: false },
      { id: 'e3-4', source: 'node-3', target: 'node-4', animated: false }
    ]
  }
];

const INITIAL_ARENA_BOTS: ArenaBot[] = [
  { id: 'bot-1', name: '0G_GigaBot', creator: '0G_Master', efficiency: 98.4, accuracy: 99.1, speed: 45, cost: 0, votes: 2420 },
  { id: 'bot-2', name: 'AlphaArbitrage', creator: 'QuantLabs', efficiency: 92.1, accuracy: 97.5, speed: 18, cost: 5, votes: 1980 },
  { id: 'bot-3', name: 'HypeSwarmer', creator: 'CommunityMod', efficiency: 88.0, accuracy: 91.0, speed: 120, cost: 0, votes: 1450 },
  { id: 'bot-4', name: 'GasGuarder', creator: 'Ethersmith', efficiency: 95.6, accuracy: 98.9, speed: 30, cost: 2, votes: 1120 }
];

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [credits, setCredits] = useState<number>(100);
  const [vaultKeys, setVaultKeys] = useState<VaultKeys>({
    openai: '',
    claude: '',
    kimi: '',
    encrypted: false
  });
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(INITIAL_WORKFLOWS[0]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [arenaBots, setArenaBots] = useState<ArenaBot[]>(INITIAL_ARENA_BOTS);
  const [simulationIntervalId, setSimulationIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Initialize with some log entries representing booting up on 0G
  useEffect(() => {
    addLog('System Initializing: AutoBots Decentralized AI OS Workspace', 'system');
    addLog('0G Chain RPC Node: Connected to devnet (chainId: 16600)', 'info');
    addLog('0G Storage PoRA: Network verified, ready to commit flows', 'success');
    addLog('0G Compute Decentralized Cluster: 34 active worker nodes detected', 'info');
  }, []);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 50));
  };

  const clearLogs = () => setLogs([]);

  const connectWallet = async () => {
    addLog('Wallet connection requested...', 'info');
    // Simulate Metamask loading
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockAddr = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    setWalletAddress(mockAddr);
    setWalletConnected(true);
    addLog(`Wallet linked successfully: ${mockAddr.slice(0, 6)}...${mockAddr.slice(-4)}`, 'success');
    addLog(`0G Chain Credit Balance verified: ${credits} credits`, 'info');
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletConnected(false);
    addLog('Wallet disconnected', 'warn');
  };

  const saveKeysToVault = async (keys: Partial<VaultKeys>, encrypt: boolean) => {
    if (!walletConnected && encrypt) {
      addLog('Encryption error: Wallet must be connected to sign the encryption key.', 'error');
      return false;
    }

    addLog('API vault save requested.', 'info');
    if (encrypt) {
      addLog('Prompting user wallet for signature to generate AES key...', 'info');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addLog('Wallet signature detected. Generating key...', 'success');
      addLog('Encrypting credentials client-side...', 'info');
      await new Promise((resolve) => setTimeout(resolve, 800));
      addLog('Pushing encrypted payload to 0G Storage network (PoRA)...', 'info');
      await new Promise((resolve) => setTimeout(resolve, 1200));
      addLog('Storage write finalized! Reference ID: 0x9f28c2e...b3a', 'success');
    } else {
      addLog('Warning: Saving keys in plaintext (Centralized DB mock)', 'warn');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setVaultKeys((prev) => ({
      ...prev,
      ...keys,
      encrypted: encrypt
    }));
    addLog('Vault configuration updated successfully!', 'success');
    return true;
  };

  const runSimulation = async (workflowId: string) => {
    const wf = workflows.find((w) => w.id === workflowId);
    if (!wf) return;

    if (wf.status === 'running') {
      addLog('Simulation already running', 'warn');
      return;
    }

    // Reset workflow and node status
    const resetNodes = wf.nodes.map((n) => ({ ...n, status: 'idle' as const }));
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, status: 'running' as const, nodes: resetNodes } : w))
    );
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflow((prev) => prev ? { ...prev, status: 'running' as const, nodes: resetNodes } : null);
    }

    addLog(`Starting workflow simulation: "${wf.name}"`, 'system');
    addLog(`[Auto-Evaluator] Initiating layout verification...`, 'info');

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple auto-evaluator check for cycles or disconnected nodes
    const isDisconnected = wf.nodes.length > 0 && wf.edges.length < wf.nodes.length - 1;
    if (isDisconnected) {
      addLog(`[Auto-Evaluator Alert] Graph contains disconnected elements! Continuing anyway.`, 'warn');
    } else {
      addLog(`[Auto-Evaluator Check] Layout verified. No infinite loops detected.`, 'success');
    }

    // Sequential Node Execution Simulation
    let currentNodeIndex = 0;

    const executeNextNode = async () => {
      if (currentNodeIndex >= wf.nodes.length) {
        // Simulation finished
        setWorkflows((prev) =>
          prev.map((w) => (w.id === workflowId ? { ...w, status: 'success' as const } : w))
        );
        if (selectedWorkflow?.id === workflowId) {
          setSelectedWorkflow((prev) => prev ? { ...prev, status: 'success' as const } : null);
        }
        addLog(`Simulation completed: "${wf.name}" executed successfully.`, 'success');
        return;
      }

      const node = wf.nodes[currentNodeIndex];
      
      // Mark node as running
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? {
                ...w,
                nodes: w.nodes.map((n, i) => (i === currentNodeIndex ? { ...n, status: 'running' as const } : n))
              }
            : w
        )
      );
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow((prev) =>
          prev
            ? {
                ...prev,
                nodes: prev.nodes.map((n, i) => (i === currentNodeIndex ? { ...n, status: 'running' as const } : n))
              }
            : null
        );
      }

      addLog(`Executing: [${node.label}] - Type: ${node.type.toUpperCase()}`, 'info');

      // Model or routing logic depending on Tier
      if (node.type === 'ai') {
        if (node.config.highFunctionMode) {
          addLog(`[Node: ${node.label}] Premium Key Mode active. Routing to ${node.config.parameters.model || 'External LLM'}...`, 'info');
          if (!vaultKeys.claude && !vaultKeys.openai) {
            addLog(`[Node: ${node.label} Error] Key missing! Please set Claude/OpenAI key in Vault. Falling back to local 0G Compute...`, 'warn');
            addLog(`[Node: ${node.label}] Routing to 0G Compute Local GPU network (LLaMA-3)...`, 'info');
            await new Promise((resolve) => setTimeout(resolve, 1200));
            addLog(`[Node: ${node.label}] 0G Compute model completed in 89ms. Accuracy: 92%`, 'success');
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            addLog(`[Node: ${node.label}] Premium model completed in 340ms. (Bill: 0.12 credits)`, 'success');
            setCredits((prev) => Math.max(0, prev - 1));
          }
        } else {
          addLog(`[Node: ${node.label}] Local Mode active. Routing to 0G Compute Local GPU network...`, 'info');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          addLog(`[Node: ${node.label}] 0G Compute execution finished: 0 credits burned.`, 'success');
        }
      } else if (node.type === 'trigger') {
        await new Promise((resolve) => setTimeout(resolve, 600));
        addLog(`[Node: ${node.label}] Trigger condition evaluated to TRUE. Payload injected.`, 'success');
      } else if (node.type === 'condition') {
        await new Promise((resolve) => setTimeout(resolve, 600));
        addLog(`[Node: ${node.label}] Check passed: parameters conform to boundary criteria.`, 'success');
      } else if (node.type === 'integration') {
        await new Promise((resolve) => setTimeout(resolve, 800));
        addLog(`[Node: ${node.label}] Outbound dispatch completed to target integration.`, 'success');
      }

      // Mark node as success
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? {
                ...w,
                nodes: w.nodes.map((n, i) => (i === currentNodeIndex ? { ...n, status: 'success' as const } : n))
              }
            : w
        )
      );
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow((prev) =>
          prev
            ? {
                ...prev,
                nodes: prev.nodes.map((n, i) => (i === currentNodeIndex ? { ...n, status: 'success' as const } : n))
              }
            : null
        );
      }

      currentNodeIndex++;
      setTimeout(executeNextNode, 400);
    };

    setTimeout(executeNextNode, 500);
  };

  const stopSimulation = (workflowId: string) => {
    if (simulationIntervalId) {
      clearInterval(simulationIntervalId);
      setSimulationIntervalId(null);
    }
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              status: 'idle' as const,
              nodes: w.nodes.map((n) => ({ ...n, status: 'idle' as const }))
            }
          : w
      )
    );
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflow((prev) =>
        prev
          ? {
              ...prev,
              status: 'idle' as const,
              nodes: prev.nodes.map((n) => ({ ...n, status: 'idle' as const }))
            }
          : null
      );
    }
    addLog(`Simulation stopped for "${workflows.find((w) => w.id === workflowId)?.name}"`, 'warn');
  };

  const forkWorkflow = (workflow: Workflow) => {
    addLog(`Initiating on-chain template lease for "${workflow.name}"...`, 'info');
    if (credits < workflow.cost) {
      addLog(`Lease transaction failed: Insufficient 0G credit balance. Needs ${workflow.cost} credits.`, 'error');
      return;
    }

    setTimeout(() => {
      const newWf = {
        ...workflow,
        id: `wf-${Date.now()}`,
        author: 'Me (Leased)',
        cost: 0,
        isPremium: false,
        status: 'idle' as const,
        nodes: workflow.nodes.map((n) => ({ ...n, status: 'idle' as const }))
      };

      setWorkflows((prev) => [...prev, newWf]);
      setCredits((prev) => prev - workflow.cost);
      setSelectedWorkflow(newWf);
      addLog(`Workflow leased & forked! Saved JSON layout to 0G Storage PoRA.`, 'success');
      addLog(`Transaction fee paid: ${workflow.cost} credits.`, 'info');
    }, 1000);
  };

  const generateWorkflowFromPrompt = async (prompt: string): Promise<boolean> => {
    if (!prompt.trim()) return false;
    
    addLog(`Consulting AutoBots Director Agent with workspace request: "${prompt}"`, 'system');
    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog(`[Director Agent] Analyzing keywords and mapping system requirements...`, 'info');
    await new Promise((resolve) => setTimeout(resolve, 900));
    addLog(`[Director Agent] Generating node layout and dependency connections...`, 'info');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Custom layout generation depending on input prompt keywords
    const isCrypto = prompt.toLowerCase().includes('crypto') || prompt.toLowerCase().includes('token') || prompt.toLowerCase().includes('swap') || prompt.toLowerCase().includes('price') || prompt.toLowerCase().includes('ethereum') || prompt.toLowerCase().includes('eth');
    const isDiscord = prompt.toLowerCase().includes('discord') || prompt.toLowerCase().includes('alert') || prompt.toLowerCase().includes('notify');
    const isTwitter = prompt.toLowerCase().includes('twitter') || prompt.toLowerCase().includes('tweet');

    let newNodes: WorkflowNode[] = [];
    let newEdges: WorkflowEdge[] = [];
    let name = "Custom AutoBot Swarm";
    let desc = `Custom orchestrator built from prompt: "${prompt}"`;

    if (isCrypto) {
      name = "Crypto Arbitrage & Disptacher";
      desc = "Triggered by on-chain events, evaluates profit, and performs outbound reporting.";
      newNodes = [
        {
          id: 'n-1',
          type: 'trigger',
          label: 'On-chain Event Tracker',
          status: 'idle',
          config: {
            title: '0G Chain Event Monitor',
            description: 'Triggers when specified contract updates.',
            highFunctionMode: false,
            parameters: { event: 'Transfer', contract: '0xabc...ef12' }
          }
        },
        {
          id: 'n-2',
          type: 'ai',
          label: '0G Compute Analyst',
          status: 'idle',
          config: {
            title: 'Llama 3 Decision Node',
            description: 'Processes values and flags anomalous activities.',
            highFunctionMode: false,
            parameters: { model: 'llama-3-8b-instruct', prompt: 'Is this value an outlier?' }
          }
        },
        {
          id: 'n-3',
          type: 'integration',
          label: isDiscord ? 'Discord Webhook Output' : isTwitter ? 'Twitter Bot Poster' : 'Zapier Dispatcher',
          status: 'idle',
          config: {
            title: 'Outbound Connector',
            description: 'Dispatches analytics report.',
            highFunctionMode: false,
            parameters: { connectionType: isDiscord ? 'Discord' : isTwitter ? 'Twitter' : 'Webhook' }
          }
        }
      ];
      newEdges = [
        { id: 'en-12', source: 'n-1', target: 'n-2', animated: false },
        { id: 'en-23', source: 'n-2', target: 'n-3', animated: false }
      ];
    } else {
      // General web scraper workflow
      name = "Hype Scraper Swarm";
      desc = "Scrapes target web endpoints and filters headlines via local LLM.";
      newNodes = [
        {
          id: 'n-1',
          type: 'trigger',
          label: 'Web Scraper Schedule',
          status: 'idle',
          config: {
            title: 'HTTP Poller',
            description: 'Queries URLs at configured intervals.',
            highFunctionMode: false,
            parameters: { target: 'https://news.ycombinator.com', frequency: '30 mins' }
          }
        },
        {
          id: 'n-2',
          type: 'condition',
          label: 'Keyword Filter',
          status: 'idle',
          config: {
            title: 'Text Comparator',
            description: 'Checks if scraped content contains focus words.',
            highFunctionMode: false,
            parameters: { words: '0G Labs, blockchain, modular, DA' }
          }
        },
        {
          id: 'n-3',
          type: 'ai',
          label: 'Local Summarizer',
          status: 'idle',
          config: {
            title: '0G Compute Open-Source Model',
            description: 'Extracts bullet points from matched elements.',
            highFunctionMode: false,
            parameters: { model: 'llama-3-8b-instruct', prompt: 'Convert into bullet points.' }
          }
        },
        {
          id: 'n-4',
          type: 'integration',
          label: 'Webhook Dispatcher',
          status: 'idle',
          config: {
            title: 'API POST Endpoint',
            description: 'Pushes JSON payload to web endpoint.',
            highFunctionMode: false,
            parameters: { url: 'https://api.myendpoint.xyz/hooks' }
          }
        }
      ];
      newEdges = [
        { id: 'en-12', source: 'n-1', target: 'n-2', animated: false },
        { id: 'en-23', source: 'n-2', target: 'n-3', animated: false },
        { id: 'en-34', source: 'n-3', target: 'n-4', animated: false }
      ];
    }

    const createdWf: Workflow = {
      id: `wf-${Date.now()}`,
      name,
      description: desc,
      nodes: newNodes,
      edges: newEdges,
      isPremium: false,
      cost: 0,
      author: 'Local Creator',
      rating: 5.0,
      status: 'idle'
    };

    setWorkflows((prev) => [createdWf, ...prev]);
    setSelectedWorkflow(createdWf);
    addLog(`[Director Agent] Swarm layout constructed and instantiated.`, 'success');
    addLog(`Saving layout configuration to 0G Storage...`, 'info');
    await new Promise((resolve) => setTimeout(resolve, 800));
    addLog(`Swarm configuration stored successfully! Block offset: 48,291`, 'success');

    return true;
  };

  const updateWorkflowNodes = (nodes: WorkflowNode[]) => {
    if (!selectedWorkflow) return;
    const updated = { ...selectedWorkflow, nodes };
    setSelectedWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === selectedWorkflow.id ? updated : w)));
  };

  const updateWorkflowEdges = (edges: WorkflowEdge[]) => {
    if (!selectedWorkflow) return;
    const updated = { ...selectedWorkflow, edges };
    setSelectedWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === selectedWorkflow.id ? updated : w)));
  };

  const addCustomWorkflow = (workflow: Workflow) => {
    setWorkflows((prev) => [workflow, ...prev]);
    setSelectedWorkflow(workflow);
    addLog(`Custom Swarm workflow "${workflow.name}" registered.`, 'success');
  };

  const voteForBot = (botId: string) => {
    setArenaBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, votes: b.votes + 1 } : b))
    );
    const bot = arenaBots.find((b) => b.id === botId);
    if (bot) {
      addLog(`Submitting vote for "${bot.name}" on 0G Chain (gasless)...`, 'info');
      setTimeout(() => {
        addLog(`Vote registered for "${bot.name}". Current count: ${bot.votes + 1}`, 'success');
      }, 500);
    }
  };

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        walletConnected,
        credits,
        vaultKeys,
        workflows,
        selectedWorkflow,
        logs,
        arenaBots,
        connectWallet,
        disconnectWallet,
        addLog,
        clearLogs,
        saveKeysToVault,
        runSimulation,
        stopSimulation,
        forkWorkflow,
        setSelectedWorkflow,
        generateWorkflowFromPrompt,
        updateWorkflowNodes,
        updateWorkflowEdges,
        voteForBot,
        addCustomWorkflow
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Plus, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Zap, 
  Send,
  Sliders,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp, WorkflowNode, Workflow, WorkflowEdge } from '@/context/AppContext';

// Custom Node Components for ReactFlow
const CustomNode = ({ data }: NodeProps) => {
  const node = data.node as WorkflowNode;
  const index = data.index || 0;
  
  const borderColors = {
    trigger: 'border-neon-lime shadow-[0_0_10px_rgba(204,255,0,0.15)]',
    ai: 'border-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.15)]',
    integration: 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]',
    condition: 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.15)]'
  };

  const statusColors = {
    idle: 'bg-foreground/20',
    running: 'bg-neon-lime animate-ping',
    success: 'bg-neon-lime shadow-[0_0_8px_rgba(204,255,0,0.8)]',
    failed: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 130, 
        damping: 14,
        mass: 0.8,
        delay: index * 0.12 // Staggered snaps
      }}
      className={`px-4 py-3 rounded-2xl bg-obsidian-light/95 border-2 ${borderColors[node.type]} w-56 text-white text-xs relative group transition-all`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-neon-purple border border-obsidian" />
      
      <div className="flex items-center justify-between mb-2">
        <span className="uppercase text-[9px] font-mono font-bold text-foreground/40 tracking-wider">
          {node.type === 'integration' ? 'Action / Integration' : node.type}
        </span>
        <div className="flex items-center gap-1.5">
          {node.config.highFunctionMode && (
            <span title="High-Function premium node">
              <Zap className="w-3.5 h-3.5 text-neon-purple animate-pulse" />
            </span>
          )}
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[node.status]}`} />
        </div>
      </div>

      <div className="font-bold text-foreground/90 truncate mb-1">{node.label}</div>
      <div className="text-[10px] text-foreground/50 line-clamp-2 leading-relaxed">{node.config.description}</div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-neon-lime border border-obsidian" />
    </motion.div>
  );
};

// Dynamic helper to parse intent from text prompt
function parsePromptToWorkflow(prompt: string) {
  const cleanPrompt = prompt.trim();
  const isCrypto = /crypto|token|arbitrage|swap|price|uniswap|gas/i.test(prompt);
  const isSocial = /twitter|tweet|discord|social|alert|notify|telegram/i.test(prompt);
  
  let nodes: WorkflowNode[] = [];
  let edges: WorkflowEdge[] = [];
  let name = "Custom AutoBot Swarm";
  let desc = `Custom orchestrator built from prompt: "${prompt}"`;
  
  if (isCrypto) {
    name = "0G DeFi Arbitrage Monitor";
    desc = `Automated trading pipeline: ${prompt}`;
    nodes = [
      {
        id: 'node-trig',
        type: 'trigger',
        label: 'Block Arbitrage Trigger',
        status: 'idle',
        config: {
          title: '0G Pool Monitor',
          description: 'Triggers on price differences > 0.3% on 0G DEX.',
          highFunctionMode: false,
          parameters: { pool: 'USDC-WEth', threshold: '0.3%' }
        }
      },
      {
        id: 'node-ai',
        type: 'ai',
        label: 'LLaMA Risk Evaluator',
        status: 'idle',
        config: {
          title: '0G Compute LLaMA-3',
          description: 'Runs local inference on GPU cluster to verify trade profit safety.',
          highFunctionMode: false,
          parameters: { model: 'llama-3-8b-instruct', prompt: 'Compute gas margin & profit.' }
        }
      },
      {
        id: 'node-act',
        type: 'integration',
        label: 'Contract Swap Executor',
        status: 'idle',
        config: {
          title: '0G Chain Executor',
          description: 'Submits flash loan swap transaction.',
          highFunctionMode: false,
          parameters: { method: 'flashLoanSwap', gasLimit: '3,000,000' }
        }
      }
    ];
    edges = [
      { id: 'e-1-2', source: 'node-trig', target: 'node-ai' },
      { id: 'e-2-3', source: 'node-ai', target: 'node-act' }
    ];
  } else if (isSocial) {
    name = "Modular Hype Dispatcher";
    desc = `Social sentiment alerts: ${prompt}`;
    nodes = [
      {
        id: 'node-trig',
        type: 'trigger',
        label: 'Twitter Stream Monitor',
        status: 'idle',
        config: {
          title: 'Twitter Scraper Poller',
          description: 'Triggers on new tweets matching targeted keywords.',
          highFunctionMode: false,
          parameters: { keywords: '0G Labs, zero gravity', interval: 'Every 5m' }
        }
      },
      {
        id: 'node-ai',
        type: 'ai',
        label: 'Compute Sentiment Agent',
        status: 'idle',
        config: {
          title: '0G Compute Summarizer',
          description: 'Classifies tweet tone and aggregates community hype.',
          highFunctionMode: false,
          parameters: { model: 'llama-3-8b-instruct', prompt: 'Classify sentiment.' }
        }
      },
      {
        id: 'node-act',
        type: 'integration',
        label: 'Discord Alert Dispatcher',
        status: 'idle',
        config: {
          title: 'Discord Notification Channel',
          description: 'Posts summarized high-relevance alerts.',
          highFunctionMode: false,
          parameters: { webhookUrl: 'https://discord.com/api/webhooks/sent' }
        }
      }
    ];
    edges = [
      { id: 'e-1-2', source: 'node-trig', target: 'node-ai' },
      { id: 'e-2-3', source: 'node-ai', target: 'node-act' }
    ];
  } else {
    // Dynamic generator extracts intent
    let firstPart = "Start Event";
    let thirdPart = "Outbound Dispatcher";
    
    const matchAnd = prompt.match(/(?:build a workflow to|create a workflow to|workflow to|i want to)?\s*(.*?)\s+(?:and then|and|then)\s+(.*)/i);
    if (matchAnd) {
      firstPart = matchAnd[1].trim();
      thirdPart = matchAnd[2].trim();
    } else {
      firstPart = prompt;
    }
    
    name = "Custom Agent Flow";
    desc = `AI Custom Swarm: ${prompt}`;
    nodes = [
      {
        id: 'node-trig',
        type: 'trigger',
        label: `${firstPart.slice(0, 22)} Trigger`,
        status: 'idle',
        config: {
          title: 'Trigger Event Monitor',
          description: `Triggers when: ${firstPart}`,
          highFunctionMode: false,
          parameters: { triggerCondition: 'On Event' }
        }
      },
      {
        id: 'node-ai',
        type: 'ai',
        label: '0G LLaMA Processor',
        status: 'idle',
        config: {
          title: '0G Compute Cluster',
          description: `Decentralized AI inference analyzing payload from "${firstPart}".`,
          highFunctionMode: false,
          parameters: { model: 'llama-3-8b-instruct', task: 'Analyze input data' }
        }
      },
      {
        id: 'node-act',
        type: 'integration',
        label: `${thirdPart.slice(0, 22)} Action`,
        status: 'idle',
        config: {
          title: 'Target Integration Outbound',
          description: `Dispatches processed payload to: ${thirdPart}`,
          highFunctionMode: false,
          parameters: { target: thirdPart }
        }
      }
    ];
    edges = [
      { id: 'e-1-2', source: 'node-trig', target: 'node-ai' },
      { id: 'e-2-3', source: 'node-ai', target: 'node-act' }
    ];
  }
  
  return { name, desc, nodes, edges };
}

export default function Studio() {
  const {
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
    stopSimulation,
    updateWorkflowNodes,
    updateWorkflowEdges,
    addCustomWorkflow
  } = useApp();

  // Terminal Chat State
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
  }>>([
    {
      id: 'init-1',
      sender: 'system',
      text: 'SYSTEM BOOT: Director AI OS v1.0.4 initialized.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-2',
      sender: 'agent',
      text: 'DIRECTOR_AI > Ready to orchestrate. Describe the automation workflow you wish to compile or update. Try saying:\n- "Build an Uniswap block tracker that runs LLM analysis and alerts Discord"\n- "Create a Twitter sentiment scraper"\n- "Update workflow: Add a Gas cost condition"',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [computeActive, setComputeActive] = useState(false);
  const [storageActive, setStorageActive] = useState(false);
  
  // HUD Overlays State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [manualMenuOpen, setManualMenuOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // References
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Set the first node selected by default if selectedWorkflow changes
  useEffect(() => {
    if (selectedWorkflow && selectedWorkflow.nodes.length > 0) {
      setSelectedNodeId(selectedWorkflow.nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [selectedWorkflow]);

  const activeNode = useMemo(() => {
    return selectedWorkflow?.nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedWorkflow, selectedNodeId]);

  // Convert workflow nodes into ReactFlow nodes
  const flowNodes = useMemo(() => {
    if (!selectedWorkflow) return [];
    return selectedWorkflow.nodes.map((node, index) => ({
      id: node.id,
      type: 'customNode',
      // Center and spread nodes nicely on canvas
      position: { x: 80 + index * 280, y: 180 + (index % 2) * 20 },
      data: { node, index },
    }));
  }, [selectedWorkflow]);

  // Convert workflow edges into ReactFlow edges
  const flowEdges = useMemo(() => {
    if (!selectedWorkflow) return [];
    const active = selectedWorkflow.status === 'running' || isSimulating;
    return selectedWorkflow.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: active || edge.animated,
      style: { 
        stroke: active ? '#ccff00' : '#bc13fe',
        strokeWidth: 3
      }
    }));
  }, [selectedWorkflow, isSimulating]);

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Streaming response generator from Director AI
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping || isSimulating) return;

    const userPrompt = inputText;
    setInputText('');
    setIsTyping(true);

    // 1. Add User Message
    const userMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString()
    }]);

    // Glow Compute badge to show Director AI processing
    setComputeActive(true);

    // 2. Compute response schema
    const isUpdate = /add|update|insert|delete|remove|condition/i.test(userPrompt);
    let name = "Custom AutoBot Swarm";
    let desc = `Custom orchestrator built from prompt: "${userPrompt}"`;
    let newNodes: WorkflowNode[] = [];
    let newEdges: WorkflowEdge[] = [];

    if (isUpdate && selectedWorkflow) {
      name = selectedWorkflow.name;
      desc = selectedWorkflow.description;

      const isCondition = /condition|check|filter|if/i.test(userPrompt);
      const isAI = /ai|inference|llama|model|gpt|claude/i.test(userPrompt);
      const isIntegration = /discord|twitter|webhook|action|post|send/i.test(userPrompt);
      const isTrigger = /trigger|hook|poller|monitor/i.test(userPrompt);

      let type: 'trigger' | 'ai' | 'integration' | 'condition' = 'condition';
      let nodeLabel = "Conditional Check";
      let nodeTitle = "Dynamic Parameter Filter";
      let nodeDesc = "Checks node values against configurable bounds.";

      if (isAI) {
        type = 'ai';
        nodeLabel = "0G Compute LLM";
        nodeTitle = "0G Compute LLaMA-3";
        nodeDesc = "Runs decentralized LLaMA-3 inference.";
      } else if (isIntegration) {
        type = 'integration';
        nodeLabel = "Outbound Action Dispatch";
        nodeTitle = "API Action Node";
        nodeDesc = "Dispatches payload data to external integrations.";
      } else if (isTrigger) {
        type = 'trigger';
        nodeLabel = "Block Webhook Event";
        nodeTitle = "Custom API Trigger";
        nodeDesc = "Triggers workflow upon receiving Webhook JSON.";
      }

      const newNodeId = `node-${Date.now()}`;
      const newNode: WorkflowNode = {
        id: newNodeId,
        type,
        label: nodeLabel,
        status: 'idle',
        config: {
          title: nodeTitle,
          description: nodeDesc,
          highFunctionMode: false,
          parameters: type === 'ai' ? { model: 'llama-3-8b-instruct', prompt: 'Summarize payload details.' } : { target: 'https://api.autobots.dev/push' }
        }
      };

      newNodes = [...selectedWorkflow.nodes, newNode];
      newEdges = [...selectedWorkflow.edges];
      if (selectedWorkflow.nodes.length > 0) {
        const lastNode = selectedWorkflow.nodes[selectedWorkflow.nodes.length - 1];
        newEdges.push({
          id: `e-${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id
        });
      }
    } else {
      const result = parsePromptToWorkflow(userPrompt);
      name = result.name;
      desc = result.desc;
      newNodes = result.nodes;
      newEdges = result.edges;
    }

    const compiledWf: Workflow = {
      id: isUpdate && selectedWorkflow ? selectedWorkflow.id : `wf-${Date.now()}`,
      name,
      description: desc,
      nodes: newNodes,
      edges: newEdges,
      isPremium: false,
      cost: 0,
      author: 'Director AI',
      rating: 5.0,
      status: 'idle'
    };

    const steps = [
      { text: `\n[DIRECTOR_AI] > Analyzing prompt request...`, delay: 500 },
      { text: isUpdate 
        ? `\n[DIRECTOR_AI] > Querying active schema parameters for Swarm: "${name}"...`
        : `\n[DIRECTOR_AI] > Synthesizing node configurations and graph edges...`, delay: 700 },
      { text: `\n[DIRECTOR_AI] > Emitting JSON Graph Schema:\n\`\`\`json\n`, delay: 600 },
      { 
        text: JSON.stringify({
          workflowName: name,
          nodes: newNodes.map(n => ({ id: n.id, type: n.type, label: n.label, description: n.config.description })),
          edges: newEdges.map(e => ({ source: e.source, target: e.target }))
        }, null, 2), 
        isJson: true, 
        delay: 10 
      },
      { text: `\n\`\`\`\n`, delay: 400 },
      { text: `\n[DIRECTOR_AI] > Resolving node snapped coordinates...`, delay: 500 },
      { text: `\n[DIRECTOR_AI] > Synchronizing state with 0G Storage PoRA network...`, delay: 800 },
      { text: `\n[DIRECTOR_AI] > Graph State Saved! Synced block offset: ${Math.floor(Math.random() * 50000) + 12000}.`, isSaveComplete: true, delay: 600 }
    ];

    const agentMsgId = `agent-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: agentMsgId,
      sender: 'agent',
      text: '',
      timestamp: new Date().toLocaleTimeString()
    }]);

    let accumulatedText = "";

    const streamChars = async (str: string, delayMs: number) => {
      for (let i = 0; i < str.length; i++) {
        accumulatedText += str[i];
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, text: accumulatedText } : m));
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    };

    for (const step of steps) {
      if (step.isJson) {
        await streamChars(step.text, step.delay);
      } else {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        accumulatedText += step.text;
        setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, text: accumulatedText } : m));
      }

      if (step.isSaveComplete) {
        // Trigger neon Storage badge!
        setStorageActive(true);
        
        // Register workflow changes
        if (isUpdate && selectedWorkflow) {
          updateWorkflowNodes(newNodes);
          updateWorkflowEdges(newEdges);
        } else {
          addCustomWorkflow(compiledWf);
        }
      }
    }

    setIsTyping(false);
    setComputeActive(false);

    // Dim storage badge after 2.5s
    setTimeout(() => {
      setStorageActive(false);
    }, 2500);
  };

  // Simulated Simulation in Terminal + Canvas
  const handleRunSimulation = async () => {
    if (!selectedWorkflow || isSimulating || isTyping) return;

    setIsSimulating(true);
    setComputeActive(true);

    // 1. Add User message request
    setMessages(prev => [...prev, {
      id: `sim-req-${Date.now()}`,
      sender: 'user',
      text: 'run simulation',
      timestamp: new Date().toLocaleTimeString()
    }]);

    // 2. Add System log message
    const simMsgId = `sim-run-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: simMsgId,
      sender: 'system',
      text: `[SYSTEM] > Initializing simulation of: "${selectedWorkflow.name}"...\n`,
      timestamp: new Date().toLocaleTimeString()
    }]);

    let accumulatedLogs = `[SYSTEM] > Initializing simulation of: "${selectedWorkflow.name}"...\n`;
    const appendLog = (log: string) => {
      accumulatedLogs += log;
      setMessages(prev => prev.map(m => m.id === simMsgId ? { ...m, text: accumulatedLogs } : m));
    };

    const nodes = selectedWorkflow.nodes;

    // Reset all nodes
    const idleNodes = nodes.map(n => ({ ...n, status: 'idle' as const }));
    updateWorkflowNodes(idleNodes);

    await new Promise(resolve => setTimeout(resolve, 800));
    appendLog(`[Auto-Evaluator] Verification complete. DAG is valid.\n`);
    await new Promise(resolve => setTimeout(resolve, 600));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Node Running
      const runningNodes = selectedWorkflow.nodes.map((n, idx) => idx === i ? { ...n, status: 'running' as const } : n);
      updateWorkflowNodes(runningNodes);
      appendLog(`[SIMULATOR] > Executing [${node.label}] (${node.type.toUpperCase()})...\n`);

      await new Promise(resolve => setTimeout(resolve, 1200));

      // Node Success
      const successNodes = selectedWorkflow.nodes.map((n, idx) => idx === i ? { ...n, status: 'success' as const } : n);
      updateWorkflowNodes(successNodes);

      if (node.type === 'ai') {
        const costStr = node.config.highFunctionMode ? '0.12 cr (Premium Key)' : '0.00 cr (Local Free Tier)';
        appendLog(`[SIMULATOR] > Node [${node.label}] executed successfully on 0G Compute. (Burn: ${costStr})\n`);
      } else {
        appendLog(`[SIMULATOR] > Node [${node.label}] executed successfully. (Burn: 0.00 cr)\n`);
      }

      await new Promise(resolve => setTimeout(resolve, 400));
    }

    appendLog(`\n[SYSTEM] > Simulation finished. All workflows validated on-chain.`);
    
    setStorageActive(true);
    setIsSimulating(false);
    setComputeActive(false);

    setTimeout(() => {
      setStorageActive(false);
    }, 2000);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    setComputeActive(false);
    setStorageActive(false);
    if (selectedWorkflow) {
      stopSimulation(selectedWorkflow.id);
      const idleNodes = selectedWorkflow.nodes.map(n => ({ ...n, status: 'idle' as const }));
      updateWorkflowNodes(idleNodes);
    }
    setMessages(prev => [...prev, {
      id: `sim-stop-${Date.now()}`,
      sender: 'system',
      text: `[SYSTEM] > Simulation aborted by user.`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleAddNode = (type: WorkflowNode['type']) => {
    if (!selectedWorkflow) return;
    
    const nodeLabels = {
      trigger: 'Manual API Webhook',
      ai: 'Local LLaMA Instance',
      integration: 'Outbound Action Dispatcher',
      condition: 'Value Boundary Filter'
    };

    const nodeTitles = {
      trigger: 'Incoming API Webhook',
      ai: '0G Compute GPU Inference',
      integration: 'Webhook Channel Dispatcher',
      condition: 'Value threshold parser'
    };

    const nodeDescriptions = {
      trigger: 'Triggered when custom webhooks are received.',
      ai: 'Fast, cost-efficient 0G local model pipeline.',
      integration: 'Publishes payload details to target URLs.',
      condition: 'Validates variables against configured constraints.'
    };

    const newNodeId = `node-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newNodeId,
      type,
      label: nodeLabels[type],
      status: 'idle',
      config: {
        title: nodeTitles[type],
        description: nodeDescriptions[type],
        highFunctionMode: false,
        parameters: {}
      }
    };

    const updatedNodes = [...selectedWorkflow.nodes, newNode];
    const updatedEdges = [...selectedWorkflow.edges];
    if (selectedWorkflow.nodes.length > 0) {
      const lastNode = selectedWorkflow.nodes[selectedWorkflow.nodes.length - 1];
      updatedEdges.push({
        id: `e-${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id
      });
    }

    updateWorkflowNodes(updatedNodes);
    updateWorkflowEdges(updatedEdges);
    setSelectedNodeId(newNodeId);

    setMessages(prev => [...prev, {
      id: `manual-add-${Date.now()}`,
      sender: 'system',
      text: `[SYSTEM] > Injected node [${nodeLabels[type]}] (${type.toUpperCase()}) manually onto canvas.`,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setStorageActive(true);
    setTimeout(() => setStorageActive(false), 1500);
  };

  // Update details of selected node
  const handleUpdateNodeConfig = (updates: Partial<WorkflowNode['config']>) => {
    if (!selectedWorkflow || !selectedNodeId) return;

    const updatedNodes = selectedWorkflow.nodes.map(node => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          config: {
            ...node.config,
            ...updates
          }
        };
      }
      return node;
    });

    updateWorkflowNodes(updatedNodes);
  };

  const handleUpdateNodeLabel = (newLabel: string) => {
    if (!selectedWorkflow || !selectedNodeId) return;

    const updatedNodes = selectedWorkflow.nodes.map(node => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          label: newLabel
        };
      }
      return node;
    });

    updateWorkflowNodes(updatedNodes);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <div className="flex-1 flex h-screen overflow-hidden relative bg-black text-white font-sans">
      {/* CSS overrides inject for CRT scanline lines & terminal blink cursors */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scanline-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
          background-size: 100% 4px;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        .glowing-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .glowing-scroll::-webkit-scrollbar-track {
          background: rgba(188, 19, 254, 0.02);
        }
        .glowing-scroll::-webkit-scrollbar-thumb {
          background: rgba(188, 19, 254, 0.25);
          border-radius: 2px;
        }
        .glowing-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(204, 255, 0, 0.4);
        }
      `}} />

      {/* Left Panel: Clean Agent Terminal */}
      <div className="w-[42%] border-r border-neon-purple/20 bg-black/95 flex flex-col relative h-full font-mono overflow-hidden">
        {/* Terminal Header */}
        <div className="h-14 border-b border-neon-purple/20 bg-obsidian flex items-center justify-between px-5 z-20">
          <div className="flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-neon-lime drop-shadow-[0_1px_4px_rgba(16,185,129,0.2)]" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">DIRECTOR_AI@WORKSPACE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
            <span className="text-[10px] text-neon-lime font-bold">DA_SYNC: OK</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 glowing-scroll z-0 pb-16">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3.5 rounded-xl border leading-relaxed text-xs transition-all relative ${
                msg.sender === 'user' 
                  ? 'bg-neon-lime/5 border-neon-lime/20 text-white' 
                  : msg.sender === 'system'
                    ? 'bg-obsidian-light/40 border-white/5 text-neon-purple/80 font-mono text-[11px]'
                    : 'bg-obsidian/40 border-neon-purple/15 text-white/95'
              }`}
            >
              {/* Header Label */}
              <div className="flex justify-between items-center mb-1.5 opacity-40 text-[9px] font-mono tracking-wider">
                <span>
                  {msg.sender === 'user' ? 'USER@AUTOBOTS:~#' : msg.sender === 'system' ? 'SYSTEM_LOG >' : 'DIRECTOR_AI >'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message text */}
              <div className="whitespace-pre-wrap leading-relaxed font-mono">
                {msg.text}
                {isTyping && msg.id === messages[messages.length - 1].id && (
                  <span className="inline-block w-1.5 h-3.5 bg-neon-lime ml-0.5 cursor-blink" />
                )}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        {/* Suggestion Chips and Input Container */}
        <div className="border-t border-neon-purple/20 bg-obsidian/95 p-4 z-20 flex flex-col gap-3 relative">
          
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "Build Crypto Arbitrage Swarm",
              "Create Hype Sentiment Monitor",
              "Update: Add a condition check node"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip)}
                disabled={isTyping || isSimulating}
                className="px-2.5 py-1 rounded-lg border border-neon-purple/10 bg-obsidian-light/30 hover:border-neon-lime/30 text-[10px] text-foreground/60 hover:text-neon-lime cursor-pointer transition-all uppercase"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-black/60 border border-neon-purple/25 rounded-xl px-3.5 py-2.5 focus-within:border-neon-lime focus-within:ring-1 focus-within:ring-neon-lime/30 transition-all">
              <span className="text-[10px] text-neon-lime font-bold">user@autobots:~$</span>
              <input
                type="text"
                placeholder="Describe workflow parameters..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping || isSimulating}
                className="flex-1 bg-transparent text-xs text-white outline-none border-none caret-neon-lime font-mono placeholder-white/20"
              />
            </div>
            <button
              type="submit"
              disabled={isTyping || isSimulating || !inputText.trim()}
              className="px-4 rounded-xl bg-neon-lime text-obsidian hover:shadow-[0_0_12px_rgba(204,255,0,0.5)] transition-all flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:shadow-none shrink-0"
              title="Send to Director AI"
            >
              <Send className="w-4 h-4 font-black" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel: React Flow canvas viewport */}
      <div className="w-[58%] h-full bg-background relative flex flex-col overflow-hidden">
        
        {/* Floating Neon 0G UI Indicator Badges */}
        <div className="absolute top-6 right-6 z-20 flex flex-col sm:flex-row gap-3 pointer-events-none">
          {/* 0G Compute Badge */}
          <motion.div
            animate={computeActive ? {
              boxShadow: ["0 0 10px rgba(16,185,129,0.1)", "0 0 25px rgba(16,185,129,0.4)", "0 0 10px rgba(16,185,129,0.1)"],
              borderColor: ["rgba(16,185,129,0.3)", "rgba(16,185,129,1)", "rgba(16,185,129,0.3)"],
              scale: [1, 1.03, 1],
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`px-3.5 py-2 rounded-xl border text-[10px] font-mono font-black tracking-wider uppercase transition-all duration-500 backdrop-blur-md ${
              computeActive 
                ? 'border-neon-lime bg-neon-lime/10 text-neon-lime shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'border-white/10 bg-obsidian-light/35 text-foreground/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${computeActive ? 'bg-neon-lime animate-pulse' : 'bg-foreground/20'}`} />
              0G Compute: Free Tier Enabled
            </div>
          </motion.div>

          {/* 0G Storage Badge */}
          <motion.div
            animate={storageActive ? {
              boxShadow: ["0 0 10px rgba(99,102,241,0.1)", "0 0 25px rgba(99,102,241,0.4)", "0 0 10px rgba(99,102,241,0.1)"],
              borderColor: ["rgba(99,102,241,0.3)", "rgba(99,102,241,1)", "rgba(99,102,241,0.3)"],
              scale: [1, 1.03, 1],
            } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`px-3.5 py-2 rounded-xl border text-[10px] font-mono font-black tracking-wider uppercase transition-all duration-500 backdrop-blur-md ${
              storageActive
                ? 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'border-white/10 bg-obsidian-light/35 text-foreground/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${storageActive ? 'bg-neon-purple animate-pulse' : 'bg-foreground/20'}`} />
              0G Storage: Graph State Saved
            </div>
          </motion.div>
        </div>

        {/* Floating Active Template Selector Selector */}
        <div className="absolute top-6 left-6 z-20 bg-obsidian/90 border border-neon-purple/20 px-3.5 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <span className="text-[9px] text-foreground/40 uppercase font-mono font-black">Active Swarm:</span>
          <select 
            value={selectedWorkflow?.id || ''}
            onChange={(e) => setSelectedWorkflow(workflows.find(w => w.id === e.target.value) || null)}
            className="bg-transparent text-xs text-white font-bold outline-none border-none cursor-pointer pr-4 focus:ring-0"
          >
            {workflows.map((wf) => (
              <option key={wf.id} value={wf.id} className="bg-obsidian text-white">{wf.name}</option>
            ))}
          </select>
        </div>

        {/* Floating Manual Component Deck */}
        <div className="absolute left-6 top-20 z-20">
          <button
            onClick={() => setManualMenuOpen(!manualMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neon-purple/20 bg-obsidian-light/80 hover:bg-obsidian-light text-[10px] font-bold text-white tracking-wider uppercase transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          >
            <Plus className="w-3.5 h-3.5 text-neon-lime" />
            Manual Override
          </button>
          
          <AnimatePresence>
            {manualMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="w-48 p-3 rounded-xl border border-neon-purple/20 bg-obsidian/95 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] space-y-1.5"
              >
                <span className="block text-[9px] uppercase font-mono font-bold text-foreground/40 mb-1 tracking-wider">Inject Component</span>
                {[
                  { type: 'trigger', label: 'Trigger Node', color: 'hover:bg-neon-lime/10 hover:text-neon-lime' },
                  { type: 'ai', label: 'AI Inference Node', color: 'hover:bg-neon-purple/10 hover:text-neon-purple' },
                  { type: 'integration', label: 'Action Node', color: 'hover:bg-cyan-400/10 hover:text-cyan-400' },
                  { type: 'condition', label: 'Condition Node', color: 'hover:bg-yellow-400/10 hover:text-yellow-400' }
                ].map((comp) => (
                  <button
                    key={comp.type}
                    onClick={() => {
                      handleAddNode(comp.type as any);
                      setManualMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/80 transition-all cursor-pointer ${comp.color}`}
                  >
                    + {comp.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Canvas Viewport (React Flow) */}
        <div className="flex-1 w-full h-full relative">
          {selectedWorkflow ? (
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-grid-white/[0.015]"
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            >
              <Background color="rgba(99, 102, 241, 0.06)" gap={16} size={1} />
              <Controls className="!bg-obsidian-light/90 !border-neon-purple/20 !text-white" />
              <MiniMap 
                nodeColor={(node) => {
                  if (node.type === 'customNode') {
                    const type = (node.data.node as WorkflowNode).type;
                    if (type === 'trigger') return '#ccff00';
                    if (type === 'ai') return '#bc13fe';
                    if (type === 'integration') return '#22d3ee';
                    return '#facc15';
                  }
                  return '#1f2025';
                }}
                className="!bg-obsidian-light/90 !border-neon-purple/20"
                maskColor="rgba(0, 0, 0, 0.7)"
              />
            </ReactFlow>
          ) : (
            <div className="h-full flex items-center justify-center text-foreground/30 text-xs italic font-mono">
              [SYSTEM] &gt; Select or prompt a new swarm to initialize canvas viewport...
            </div>
          )}

          {/* Floating Slides-in Inspector Card */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="absolute right-6 top-6 bottom-24 w-80 bg-obsidian/95 border border-neon-purple/25 rounded-2xl p-5 z-20 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
              >
                <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4 shrink-0">
                  <div>
                    <h3 className="text-xs uppercase font-black tracking-widest text-white">
                      Node Inspector
                    </h3>
                    <span className="text-[9px] font-mono text-foreground/40">{activeNode.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="text-foreground/40 hover:text-white text-xs cursor-pointer px-1.5 py-0.5 rounded border border-white/10 hover:border-white/20 font-mono"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-1 glowing-scroll">
                  <div>
                    <label className="block text-[9px] uppercase font-mono font-bold text-foreground/50 mb-1.5">
                      Node Label
                    </label>
                    <input
                      type="text"
                      value={activeNode.label}
                      onChange={(e) => handleUpdateNodeLabel(e.target.value)}
                      className="w-full bg-black/40 border border-neon-purple/20 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-neon-lime transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-mono font-bold text-foreground/50 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={activeNode.config.description}
                      onChange={(e) => handleUpdateNodeConfig({ description: e.target.value })}
                      className="w-full h-16 bg-black/40 border border-neon-purple/20 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-neon-lime transition-all resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-mono font-bold text-foreground/50 mb-1.5">
                      Parameters
                    </label>
                    <div className="space-y-2">
                      {Object.entries(activeNode.config.parameters).map(([key, val]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-[9px] text-foreground/45 font-mono">{key}</span>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const newParams = { ...activeNode.config.parameters, [key]: e.target.value };
                              handleUpdateNodeConfig({ parameters: newParams });
                            }}
                            className="w-full bg-black/40 border border-neon-purple/15 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-neon-lime transition-all font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeNode.type === 'ai' && (
                    <div className="space-y-4 pt-3 border-t border-white/5 shrink-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">High-Function Mode</span>
                          <span className="text-[10px] text-foreground/50">Toggles premium LLM keys</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={activeNode.config.highFunctionMode}
                            onChange={(e) => handleUpdateNodeConfig({ highFunctionMode: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-black/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/60 peer-checked:after:bg-neon-purple after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-purple/35 border border-neon-purple/20"></div>
                        </label>
                      </div>

                      <div className="p-3 rounded-xl border border-neon-purple/25 bg-neon-purple/5 space-y-1.5">
                        <span className="text-[9px] font-mono uppercase font-black tracking-widest text-neon-purple block">Cost analysis</span>
                        <div className="flex justify-between text-xs text-foreground/70">
                          <span>Compute Type:</span>
                          <span className="font-bold text-white">
                            {activeNode.config.highFunctionMode ? 'Premium Keys' : '0G Compute Local'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-foreground/70">
                          <span>Credit Burn:</span>
                          <span className={`font-black ${activeNode.config.highFunctionMode ? 'text-neon-purple' : 'text-neon-lime'}`}>
                            {activeNode.config.highFunctionMode ? '0.12 cr / run' : '0.00 cr (Free)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Simulation Execution Deck */}
        {selectedWorkflow && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[90%] max-w-md h-14 bg-obsidian/90 border border-neon-purple/25 rounded-2xl p-2 flex items-center justify-between z-10 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2.5 pl-2 font-mono">
              <div className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-neon-lime animate-pulse' : 'bg-foreground/20'}`} />
              <span className="text-[10px] font-bold text-white uppercase">
                {isSimulating ? 'SIMULATING' : 'STATUS: READY'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating || isTyping}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-lime text-obsidian font-black text-xs hover:shadow-[0_0_12px_rgba(204,255,0,0.5)] disabled:opacity-40 disabled:shadow-none cursor-pointer transition-all font-mono uppercase"
              >
                <Play className="w-3.5 h-3.5 fill-obsidian" />
                Run
              </button>
              <button
                onClick={handleStopSimulation}
                disabled={!isSimulating}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:bg-transparent border border-red-500/35 text-xs font-bold cursor-pointer transition-all font-mono uppercase"
              >
                <Square className="w-3.5 h-3.5 fill-red-400" />
                Stop
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

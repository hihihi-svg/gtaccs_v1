import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
<<<<<<< HEAD
import TopologyBuilder from './components/TopologyBuilder';
=======
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
import Dashboard from './components/Dashboard';
import FlowsTab from './components/FlowsTab';
import PayoffTab from './components/PayoffTab';
import ComparisonTab from './components/ComparisonTab';
<<<<<<< HEAD
import AnalyticsTab from './components/AnalyticsTab';
import { simulationStep, initSimulation, DEFAULT_FLOWS } from './simulation/engine';

const SPEED_MAP = { '0.5x': 2000, '1x': 1000, '2x': 500, '5x': 200, '10x': 100 };

const TABS = [
  { id: 'topology', label: '🗺 Topology' },
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'analytics', label: '🧮 Analytics' },
  { id: 'flows', label: '🔀 Flows' },
  { id: 'payoff', label: '💰 Payoff' },
  { id: 'comparison', label: '⚔️ Compare' },
];

// Default topology mirrors the builder's defaults
const DEFAULT_TOPOLOGY = {
  nodes: [
    { id: 'A', x: 80, y: 190 },
    { id: 'B', x: 220, y: 100 },
    { id: 'C', x: 220, y: 290 },
    { id: 'D', x: 380, y: 190 },
    { id: 'E', x: 500, y: 190 },
    { id: 'F', x: 620, y: 190 },
    { id: 'G', x: 750, y: 100 },
    { id: 'H', x: 750, y: 290 },
  ],
  links: [
    { from: 'A', to: 'B', capacity: 100 },
    { from: 'A', to: 'C', capacity: 80 },
    { from: 'B', to: 'D', capacity: 60 },
    { from: 'C', to: 'D', capacity: 70 },
    { from: 'D', to: 'E', capacity: 50 },
    { from: 'E', to: 'F', capacity: 100 },
    { from: 'F', to: 'G', capacity: 90 },
    { from: 'F', to: 'H', capacity: 80 },
  ],
  flows: [
    { id: 'F1', path: ['A', 'B', 'D', 'E', 'F', 'G'], strategy: 'aggressive', rate: 40, color: '#ef4444' },
    { id: 'F2', path: ['A', 'C', 'D', 'E', 'F', 'H'], strategy: 'adaptive', rate: 40, color: '#3b82f6' },
    { id: 'F3', path: ['B', 'D', 'E', 'F'], strategy: 'conservative', rate: 40, color: '#22c55e' },
  ],
};

export default function App() {
  const [tab, setTab] = useState('topology');

  // ── Topology state (source of truth from TopologyBuilder) ──
  const [topology, setTopology] = useState(DEFAULT_TOPOLOGY);

  // ── Simulation state ──────────────────────────────────────
=======
import TheoryTab from './components/TheoryTab';
import AnalyticsTab from './components/AnalyticsTab';
import Sidebar from './components/Sidebar';
import { simulationStep, initSimulation, DEFAULT_FLOWS, SCENARIOS } from './simulation/engine';

const SPEED_MAP = { '0.5x': 2000, '1x': 1000, '2x': 500, '5x': 200, '10x': 100 };
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '🧮' },
  { id: 'flows',     label: 'Flows',     icon: '🔀' },
  { id: 'payoff',    label: 'Payoff',    icon: '💰' },
  { id: 'comparison',label: 'Compare',   icon: '⚔️' },
  // { id: 'theory',    label: 'Theory',    icon: '📚' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
  const [round, setRound] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const [alpha, setAlpha] = useState(0.3);
  const [beta, setBeta] = useState(2.0);
  const [equilibrium, setEquilibrium] = useState(false);
  const [equilibriumRound, setEquilibriumRound] = useState(null);
<<<<<<< HEAD

  const [flows, setFlows] = useState(() => {
    const init = initSimulation(DEFAULT_TOPOLOGY.flows);
    return init.flows;
  });
  const [payoffHistories, setPayoffHistories] = useState(() => {
    const init = initSimulation(DEFAULT_TOPOLOGY.flows);
    return init.payoffHistories;
  });
=======
  const [activeScenario, setActiveScenario] = useState('mixed');
  const [insight, setInsight] = useState(null);
  const [mode, setMode] = useState('arena'); // 'playground' | 'arena'

  const [flows, setFlows] = useState(DEFAULT_FLOWS.map(f => ({ ...f, throughput: 0, delay: 0, lossRate: 0, payoff: 0 })));
  const [payoffHistories, setPayoffHistories] = useState(DEFAULT_FLOWS.map(() => []));
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
  const [linkUtil, setLinkUtil] = useState({});
  const [linkLoss, setLinkLoss] = useState({});
  const [linkDemand, setLinkDemand] = useState({});
  const [fairness, setFairness] = useState(0);
  const [totalThroughput, setTotalThroughput] = useState(0);
  const [congestedNodes, setCongestedNodes] = useState(new Set());
  const [flowsWithPayoff, setFlowsWithPayoff] = useState([]);
  const [historyChart, setHistoryChart] = useState([]);
<<<<<<< HEAD

  const timerRef = useRef(null);
  const stateRef = useRef({ flows, payoffHistories, alpha, beta, topology });
  const equilibriumRef = useRef(false);

  useEffect(() => {
    stateRef.current = { flows, payoffHistories, alpha, beta, topology };
  }, [flows, payoffHistories, alpha, beta, topology]);

  // When topology flows change (from builder), reinit simulation
  const prevFlowIdsRef = useRef(topology.flows.map(f => f.id).join(','));
  useEffect(() => {
    const newIds = topology.flows.map(f => f.id).join(',');
    // Only reinit if something meaningful changed (avoids reinit on every canvas drag)
    const flowsChanged = newIds !== prevFlowIdsRef.current ||
      topology.flows.some((f, i) => {
        const old = flows[i];
        return !old || old.id !== f.id || old.strategy !== f.strategy ||
          JSON.stringify(old.path) !== JSON.stringify(f.path);
      });

    if (flowsChanged) {
      prevFlowIdsRef.current = newIds;
      doReset(topology.flows);
    }
  }, [topology.flows]);

  const doStep = useCallback(() => {
    const { flows: curFlows, payoffHistories: curHistories, alpha: a, beta: b, topology: topo } = stateRef.current;
    const result = simulationStep(curFlows, curHistories, a, b, topo.links);

=======
  const [bottleneckUtil, setBottleneckUtil] = useState(0);

  const timerRef = useRef(null);
  const stateRef = useRef({ flows, payoffHistories, alpha, beta });
  const equilibriumRef = useRef(false);

  useEffect(() => { stateRef.current = { flows, payoffHistories, alpha, beta }; }, [flows, payoffHistories, alpha, beta]);

  const doStep = useCallback(() => {
    const { flows: cur, payoffHistories: hist, alpha: a, beta: b } = stateRef.current;
    const result = simulationStep(cur, hist, a, b);
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
    setFlows(result.flows);
    setPayoffHistories(result.newHistories);
    setLinkUtil(result.linkUtil);
    setLinkLoss(result.linkLoss);
    setLinkDemand(result.linkDemand);
    setFairness(result.fairness);
    setTotalThroughput(result.totalThroughput);
    setEquilibrium(result.equilibrium);
    setCongestedNodes(result.congestedNodes);
    setFlowsWithPayoff(result.flowsWithPayoff);
<<<<<<< HEAD

    setRound(r => {
      const newRound = r + 1;
      if (result.equilibrium && !equilibriumRef.current) {
        equilibriumRef.current = true;
        setEquilibriumRound(newRound);
      }
      const point = {
        round: newRound,
        throughput: parseFloat(result.totalThroughput.toFixed(1)),
        fairness: parseFloat(result.fairness.toFixed(3)),
      };
      result.flowsWithPayoff.forEach(f => {
        point[`rate_${f.id}`] = parseFloat((f.rate || 0).toFixed(2));
        point[`payoff_${f.id}`] = parseFloat((f.payoff || 0).toFixed(2));
        point[`delay_${f.id}`] = parseFloat((f.delay || 0).toFixed(2));
        point[`loss_${f.id}`] = parseFloat(((f.lossRate || 0) * 100).toFixed(2));
        point[`throughput_${f.id}`] = parseFloat((f.throughput || 0).toFixed(2));
      });
      setHistoryChart(prev => [...prev, point]);
      return newRound;
=======
    setBottleneckUtil(result.bottleneckUtil);
    setInsight(result.insight);
    setRound(r => {
      const nr = r + 1;
      if (result.equilibrium && !equilibriumRef.current) { equilibriumRef.current = true; setEquilibriumRound(nr); }
      const pt = { round: nr, throughput: +result.totalThroughput.toFixed(1), fairness: +result.fairness.toFixed(3) };
      result.flowsWithPayoff.forEach(f => {
        pt['rate_'+f.id]       = +(f.rate||0).toFixed(2);
        pt['payoff_'+f.id]     = +(f.payoff||0).toFixed(2);
        pt['delay_'+f.id]      = +(f.delay||0).toFixed(2);
        pt['loss_'+f.id]       = +((f.lossRate||0)*100).toFixed(2);
        pt['throughput_'+f.id] = +(f.throughput||0).toFixed(2);
      });
      setHistoryChart(prev => [...prev, pt]);
      return nr;
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
    });
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (running) {
      const interval = SPEED_MAP[speed] || 1000;
      timerRef.current = setInterval(doStep, interval);
    }
    return () => clearInterval(timerRef.current);
  }, [running, speed, doStep]);

  function doReset(flowDefs) {
    setRunning(false);
    clearInterval(timerRef.current);
    equilibriumRef.current = false;
    setRound(0);
    setEquilibrium(false);
    setEquilibriumRound(null);
    setFairness(0);
    setTotalThroughput(0);
    setLinkUtil({});
    setLinkLoss({});
    setLinkDemand({});
    setCongestedNodes(new Set());
    setFlowsWithPayoff([]);
    setHistoryChart([]);
    const init = initSimulation(flowDefs || topology.flows);
    setFlows(init.flows);
    setPayoffHistories(init.payoffHistories);
  }

  function handlePlayPause() { setRunning(r => !r); }
  function handleStep() { if (!running) doStep(); }
  function handleReset() { doReset(); }
=======
    if (running) timerRef.current = setInterval(doStep, SPEED_MAP[speed] || 1000);
    return () => clearInterval(timerRef.current);
  }, [running, speed, doStep]);

  function handleScenario(key) {
    setActiveScenario(key);
    handleReset(SCENARIOS[key].flows);
  }

  function handleReset(customFlows) {
    setRunning(false); clearInterval(timerRef.current);
    equilibriumRef.current = false;
    setRound(0); setEquilibrium(false); setEquilibriumRound(null);
    setFairness(0); setTotalThroughput(0);
    setLinkUtil({}); setLinkLoss({}); setLinkDemand({});
    setCongestedNodes(new Set()); setFlowsWithPayoff([]);
    setHistoryChart([]); setInsight(null); setBottleneckUtil(0);
    const src = customFlows || flows.map(f => ({ id: f.id, path: f.path, strategy: f.strategy, rate: 40, color: f.color }));
    const init = initSimulation(src);
    setFlows(init.flows); setPayoffHistories(init.payoffHistories);
  }
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598

  function handleUpdateFlows(newFlows) {
    equilibriumRef.current = false;
    const init = initSimulation(newFlows);
<<<<<<< HEAD
    setFlows(init.flows);
    setPayoffHistories(init.payoffHistories);
    setRound(0);
    setEquilibrium(false);
    setEquilibriumRound(null);
    setFairness(0);
    setTotalThroughput(0);
    setLinkUtil({});
    setLinkLoss({});
    setCongestedNodes(new Set());
    setFlowsWithPayoff([]);
    setHistoryChart([]);
    // Also sync back to topology
    setTopology(prev => ({ ...prev, flows: newFlows }));
  }

  function handleTopologyChange(newTopology) {
    setTopology(newTopology);
  }

  function handleGoToDashboard() {
    // Reinit with current topology flows and switch to dashboard
    doReset(topology.flows);
    setTab('dashboard');
  }

  const sharedState = {
    flows,
    linkUtil,
    linkLoss,
    linkDemand,
    fairness,
    totalThroughput,
    equilibrium,
    congestedNodes,
    flowsWithPayoff,
    historyChart: historyChart.slice(-40),
  };

  const isSimTab = tab !== 'topology';
=======
    setFlows(init.flows); setPayoffHistories(init.payoffHistories);
    setRound(0); setEquilibrium(false); setEquilibriumRound(null);
    setFairness(0); setTotalThroughput(0);
    setLinkUtil({}); setLinkLoss({});
    setCongestedNodes(new Set()); setFlowsWithPayoff([]); setHistoryChart([]);
  }

  const sharedState = {
    flows, linkUtil, linkLoss, linkDemand, fairness, totalThroughput,
    equilibrium, congestedNodes, flowsWithPayoff,
    historyChart: historyChart.slice(-40), bottleneckUtil, insight,
  };

  const scenarioInfo = SCENARIOS[activeScenario];
  const isBottleneckCongested = bottleneckUtil > 0.8;
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">GT<span>ACCS</span></div>
<<<<<<< HEAD
        <div className="header-pill">Game-Theoretic Adaptive Congestion Control</div>
        {tab !== 'topology' && (
          <div className="header-pill" style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {flows.map(f => (
              <span key={f.id} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: f.color, display: 'inline-block'
              }} />
            ))}
            {flows.length} Flows · {topology.nodes.length} Nodes · {topology.links.length} Links
          </div>
        )}
        <div className="header-spacer" />
        <nav className="nav-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              {t.label}
=======

        <div className="header-spacer" />

        <nav className="nav-tabs">
          {TABS.map(t => (
            <button key={t.id} className={'nav-tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
            </button>
          ))}
        </nav>
      </header>

<<<<<<< HEAD
      <main className="main-content">

        {/* Sim controls — only on non-topology tabs */}
        {isSimTab && (
          <div className="sim-controls">
            <div className="sim-round">Round <span>{round}</span></div>

            <button className="ctrl-btn primary" onClick={handlePlayPause}>
              {running ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="ctrl-btn ghost" onClick={handleStep} disabled={running}>
              ⏭ Step
            </button>
            <button className="ctrl-btn danger" onClick={handleReset}>
              ↺ Reset
            </button>

            <select className="speed-select" value={speed} onChange={e => setSpeed(e.target.value)}>
              {Object.keys(SPEED_MAP).map(s => (
                <option key={s} value={s}>{s} Speed</option>
              ))}
=======
      <div className="app-container">
        <Sidebar 
          mode={mode} setMode={setMode} 
          activeScenario={activeScenario} onSelectScenario={handleScenario} 
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="sim-controls">
            <div className="sim-round">Round <span>{round}</span></div>

            <button className="ctrl-btn primary" onClick={() => setRunning(r => !r)}>
              {running ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="ctrl-btn ghost" onClick={doStep} disabled={running}>⏭ Step</button>
            <button className="ctrl-btn danger" onClick={() => handleReset()}>↺ Reset</button>

            <select className="speed-select" value={speed} onChange={e => setSpeed(e.target.value)}>
              {Object.keys(SPEED_MAP).map(s => <option key={s} value={s}>{s} Speed</option>)}
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
            </select>

            <div className="ctrl-spacer" />

<<<<<<< HEAD
            {/* Edit topology shortcut */}
            <button onClick={() => { setRunning(false); setTab('topology'); }} style={{
              fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600,
              padding: '4px 12px', borderRadius: 100, cursor: 'pointer',
              border: '1.5px solid var(--border)', background: '#fff', color: 'var(--text2)',
            }}>
              🗺 Edit Topology
            </button>

            <div className={`eq-badge ${equilibrium ? 'reached' : 'searching'}`}>
              {equilibrium
                ? `⚡ NASH EQ — Round ${equilibriumRound}`
                : '🔍 Searching...'}
            </div>

            {congestedNodes.size > 0 && (
              <div style={{
                background: '#dc2626', color: '#fff', borderRadius: 100,
                fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
                padding: '5px 12px', letterSpacing: 0.5, animation: 'pulse 1s infinite',
              }}>
                🔴 [{Array.from(congestedNodes).join(', ')}]
              </div>
            )}
          </div>
        )}

        {tab === 'topology' && (
          <TopologyBuilder
            topology={topology}
            onTopologyChange={handleTopologyChange}
            onGoToDashboard={handleGoToDashboard}
          />
        )}

        {tab === 'dashboard' && (
          <Dashboard state={sharedState} topology={topology} />
        )}

        {tab === 'analytics' && (
          <AnalyticsTab
            state={{ ...sharedState, historyChart }}
            alpha={alpha}
            beta={beta}
            equilibriumRound={equilibriumRound}
            round={round}
            flows={flows}
          />
        )}

        {tab === 'flows' && (
          <FlowsTab flows={flows} onUpdateFlows={handleUpdateFlows} running={running} />
        )}

        {tab === 'payoff' && (
          <PayoffTab state={sharedState} alpha={alpha} beta={beta}
            onAlpha={setAlpha} onBeta={setBeta} />
        )}

        {tab === 'comparison' && <ComparisonTab />}
      </main>
=======
            <div className="bottleneck-meter">
              <span className="bm-label">D→E</span>
              <div className="bm-bar">
                <div className="bm-fill" style={{ width: (bottleneckUtil * 100) + '%', background: isBottleneckCongested ? '#ef4444' : '#22c55e' }} />
              </div>
              <span className="bm-pct" style={{ color: isBottleneckCongested ? '#ef4444' : '#22c55e' }}>
                {Math.round(bottleneckUtil * 100)}%
              </span>
            </div>

            <div className={'eq-badge' + (equilibrium ? ' reached' : ' searching')}>
              {equilibrium ? ('⚡ NASH EQ — R' + equilibriumRound) : '🔍 Searching...'}
            </div>

            {congestedNodes.size > 0 && (
              <div className="congestion-pill">
                🔴 {Array.from(congestedNodes).slice(0,4).join(', ')}
              </div>
            )}
          </div>

          {insight && (
            <div className={'insight-bar insight-' + insight.type}>
              <span className="insight-icon">
                {insight.type === 'danger' ? '🚨' : insight.type === 'success' ? '✅' : insight.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              {insight.msg}
            </div>
          )}

          <main className="main-content">
            {tab === 'dashboard'  && <Dashboard state={sharedState} mode={mode} />}
            {tab === 'analytics'  && <AnalyticsTab state={{ ...sharedState, historyChart }} alpha={alpha} beta={beta} equilibriumRound={equilibriumRound} round={round} flows={flows} />}
            {tab === 'flows'      && <FlowsTab flows={flows} onUpdateFlows={handleUpdateFlows} running={running} />}
            {tab === 'payoff'     && <PayoffTab state={sharedState} alpha={alpha} beta={beta} onAlpha={setAlpha} onBeta={setBeta} />}
            {tab === 'comparison' && <ComparisonTab />}
            {/* {tab === 'theory'     && <TheoryTab />} */}
          </main>
        </div>
      </div>
>>>>>>> e0674159cb6301a6ada997f7388c5431dc22f598
    </div>
  );
}

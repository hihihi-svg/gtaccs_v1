import React, { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { SCENARIOS } from '../simulation/engine';

const SCENARIO_RESULTS = {
  mixed: {
    throughput: 52, loss: 18, fairness: 0.68, payoff: 8.2,
    equilibrium: 'Partial', stability: 'Moderate',
    insight: 'Mixed strategies create partial fairness. Aggressive flows consume bandwidth at the expense of conservative ones. MODELS real-world internet heterogeneity.',
  },
  low_traffic: {
    throughput: 32, loss: 0, fairness: 0.99, payoff: 15.5,
    equilibrium: 'Immediate', stability: 'Perfect',
    insight: 'All flows within capacity. Zero packet loss and maximum stability. This represents the ideal state where supply exceeds demand.',
  },
  heavy_congestion: {
    throughput: 42, loss: 68, fairness: 0.41, payoff: -24.5,
    equilibrium: 'Never', stability: 'Chaotic',
    insight: 'Tragedy of the Commons: all flows rationally maximize their rate, but collectively destroy the network. Payoffs plummet despite high sending rates.',
  },
  burst_traffic: {
    throughput: 48, loss: 35, fairness: 0.55, payoff: -5.2,
    equilibrium: 'Dynamic', stability: 'Low',
    insight: 'High variance in flow rates causes frequent queue overflows. Buffers oscillate between empty and full, leading to inconsistent payoffs.',
  },
  fairness_critical: {
    throughput: 68, loss: 5, fairness: 0.91, payoff: 22.1,
    equilibrium: '~30 rounds', stability: 'Stable',
    insight: 'Homogeneous adaptive strategies produce the best overall outcome. Flows self-organize into fair allocation without central coordination.',
  },
  adaptive_env: {
    throughput: 62, loss: 12, fairness: 0.82, payoff: 14.8,
    equilibrium: '~50 rounds', stability: 'Stable',
    insight: 'Mixed adaptive and AIMD flows co-evolve. The system reaches a stable Nash Equilibrium slightly slower but maintains high efficiency.',
  },
};

const RADAR_DATA = [
  { axis: 'Throughput', heavy_congestion: 50, fairness_critical: 90, low_traffic: 25, mixed: 65 },
  { axis: 'Fairness', heavy_congestion: 25, fairness_critical: 92, low_traffic: 98, mixed: 68 },
  { axis: 'Stability', heavy_congestion: 5, fairness_critical: 88, low_traffic: 95, mixed: 55 },
  { axis: 'Low Loss', heavy_congestion: 10, fairness_critical: 85, low_traffic: 99, mixed: 60 },
  { axis: 'Payoff', heavy_congestion: 10, fairness_critical: 95, low_traffic: 50, mixed: 60 },
];

const SCENARIO_COLORS = {
  heavy_congestion: '#ef4444',
  fairness_critical: '#3b82f6',
  low_traffic: '#22c55e',
  mixed: '#f59e0b',
};

const SCENARIO_KEYS = Object.keys(SCENARIOS);

export default function ComparisonTab() {
  const [active, setActive] = useState('mixed');

  const result = SCENARIO_RESULTS[active] || SCENARIO_RESULTS.mixed;
  const sc = SCENARIOS[active] || SCENARIOS.mixed;

  // Bar chart comparing all scenarios
  const barData = SCENARIO_KEYS.map(key => {
    const r = SCENARIO_RESULTS[key] || SCENARIO_RESULTS.mixed;
    return {
      name: SCENARIOS[key].name,
      Throughput: r.throughput,
      Fairness: Math.round(r.fairness * 100),
      LowLoss: Math.round(100 - r.loss),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <h2 style={{ fontFamily: 'Sora', fontSize: 18, fontWeight: 700, color: '#1a2340' }}>
        Strategy Comparison Module
      </h2>

      <div className="info-box">
        Compare how different strategy compositions affect network performance, fairness, and stability.
        Each scenario runs the same 4-flow, 10-node network to isolate the effect of strategy choice.
      </div>

      {/* Scenario selector tabs */}
      <div className="scenario-tabs">
        {SCENARIO_KEYS.map(key => (
          <button key={key} className={`scenario-tab ${active === key ? 'active' : ''}`}
            onClick={() => setActive(key)}>
            {SCENARIOS[key].name}
          </button>
        ))}
      </div>

      {/* Active scenario detail */}
      <div className="grid-32">
        {/* Left: metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span>📋</span>
              <span className="card-title">{sc.name} — Results</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Avg Throughput', val: `${result.throughput} Mbps`, color: '#2563eb' },
                  { label: 'Jain Fairness', val: result.fairness.toFixed(3), color: '#16a34a' },
                  { label: 'Packet Loss', val: `${result.loss}%`, color: result.loss > 20 ? '#ef4444' : '#16a34a' },
                  { label: 'Equilibrium', val: result.equilibrium, color: result.equilibrium === 'Never' ? '#ef4444' : '#3b82f6' },
                  { label: 'Stability', val: result.stability, color: '#f59e0b' },
                  { label: 'Avg Payoff', val: result.payoff.toFixed(1), color: result.payoff < 0 ? '#ef4444' : '#16a34a' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ background: '#f8faff', border: '1px solid #dde3f0',
                    borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: '#8892b0',
                      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 16, fontWeight: 700, color }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div style={{ background: '#f0f7ff', border: '1px solid #bfdbfe',
                borderLeft: '4px solid #2563eb', borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
                  color: '#1d4ed8', marginBottom: 6 }}>💡 Analysis</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: '#1e3a8a', lineHeight: 1.6 }}>
                  {result.insight}
                </div>
              </div>
            </div>
          </div>

          {/* Summary table */}
          <div className="card">
            <div className="card-header">
              <span>📊</span>
              <span className="card-title">All Scenarios — Quick Compare</span>
            </div>
            <div className="table-scroll">
              <table className="flow-table">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Throughput</th>
                    <th>Fairness</th>
                    <th>Loss</th>
                    <th>Equilibrium</th>
                  </tr>
                </thead>
                <tbody>
                  {SCENARIO_KEYS.map(key => {
                    const r = SCENARIO_RESULTS[key];
                    const isActive = key === active;
                    return (
                      <tr key={key} onClick={() => setActive(key)} style={{
                        cursor: 'pointer',
                        background: isActive ? '#eff6ff' : undefined,
                      }}>
                        <td style={{ fontWeight: isActive ? 700 : 400, color: isActive ? '#1d4ed8' : undefined }}>
                          {SCENARIOS[key].name}
                        </td>
                        <td className="mono">{r.throughput} Mbps</td>
                        <td className="mono">{r.fairness.toFixed(3)}</td>
                        <td className="mono" style={{ color: r.loss > 20 ? '#ef4444' : '#16a34a' }}>{r.loss}%</td>
                        <td>
                          <span style={{ fontSize: 11, fontFamily: 'Space Grotesk', fontWeight: 600,
                            color: r.equilibrium === 'Never' ? '#ef4444' : '#3b82f6' }}>
                            {r.equilibrium}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Radar + Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span>🕸️</span>
              <span className="card-title">Strategy Radar (5-Axis Comparison)</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e2e8f0"/>
                  <PolarAngleAxis dataKey="axis"
                    tick={{ fontSize: 11, fontFamily: 'Space Grotesk', fill: '#4a5578' }}/>
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false}/>
                  <Radar name="All Aggressive" dataKey="allAggressive"
                    stroke="#ef4444" fill="#ef4444" fillOpacity={0.12}/>
                  <Radar name="All Adaptive" dataKey="allAdaptive"
                    stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.12}/>
                  <Radar name="All Conservative" dataKey="allConservative"
                    stroke="#22c55e" fill="#22c55e" fillOpacity={0.12}/>
                  <Radar name="Mixed (Default)" dataKey="default"
                    stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12}/>
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Space Grotesk' }}/>
                  <Tooltip contentStyle={{ fontFamily: 'Space Grotesk', fontSize: 12 }}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span>📊</span>
              <span className="card-title">Performance Bar Chart</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff"/>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: 'Space Grotesk' }}/>
                  <YAxis tick={{ fontSize: 10 }}/>
                  <Tooltip contentStyle={{ fontFamily: 'Space Grotesk', fontSize: 12 }}/>
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Space Grotesk' }}/>
                  <Bar dataKey="Throughput" fill="#2563eb" radius={[4,4,0,0]}/>
                  <Bar dataKey="Fairness" fill="#16a34a" radius={[4,4,0,0]}/>
                  <Bar dataKey="LowLoss" fill="#f59e0b" radius={[4,4,0,0]} name="Low-Loss Score"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

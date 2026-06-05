import React from 'react';
import { useGame } from '../context/GameContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

export const MetricsPanel = ({ onOpenCFDGuide }) => {
  const { cards, history, columns, turn } = useGame();
  
  // Calculate Lead Time for completed cards
  const completedCards = cards.filter(c => c.completedAt !== null && c.startedAt !== null);
  const leadTimeData = completedCards.map(c => {
    const totalLeadTime = c.completedAt - c.startedAt + 1;
    const totalTime = c.activeTime + c.waitTime;
    const efficiency = totalTime > 0 ? ((c.activeTime / totalTime) * 100).toFixed(0) : 0;

    return {
      name: c.id.substring(0, 4),
      leadTime: totalLeadTime,
      type: c.type,
      efficiency: efficiency
    };
  });
  
  const avgLeadTime = completedCards.length > 0 
    ? (leadTimeData.reduce((acc, curr) => acc + curr.leadTime, 0) / completedCards.length).toFixed(1)
    : 0;

  const avgFlowEfficiency = completedCards.length > 0
    ? (leadTimeData.reduce((acc, curr) => acc + parseFloat(curr.efficiency), 0) / completedCards.length).toFixed(0)
    : 0;

  const throughput = turn > 1 ? (completedCards.length / (turn - 1)).toFixed(2) : 0;

  // CFD Colors
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#64748b', '#0ea5e9'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
      
      {/* Top Metrics Summary */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tempo Médio de Entrega</span>
          <span style={{ fontSize: '1.8rem', color: 'var(--accent-blue)', fontWeight: 600 }}>{avgLeadTime} <span style={{ fontSize: '1rem' }}>dias</span></span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Eficiência de Fluxo</span>
          <span style={{ fontSize: '1.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{avgFlowEfficiency}%</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Vazão (Throughput)</span>
          <span style={{ fontSize: '1.8rem', color: 'var(--accent-purple)', fontWeight: 600 }}>{throughput} <span style={{ fontSize: '1rem' }}>cartões/dia</span></span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        
        {/* Lead Time Chart */}
        <div className="glass-panel" style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent-blue)" />
              Tempo de Entrega (Lead Time)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Média: {avgLeadTime} dias</span>
          </div>
        
        {completedCards.length > 0 ? (
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value, name, props) => {
                    return [value, name === 'leadTime' ? 'Lead Time (Dias)' : name];
                  }}
                />
                <Bar dataKey="leadTime" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Nenhum cartão concluído ainda
          </div>
        )}
      </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useGame } from '../context/GameContext';
import { X, BarChart3, TrendingUp, Clock, AlertTriangle, Lightbulb, MessageCircleQuestion } from 'lucide-react';

export const RetrospectiveDashboard = ({ isOpen, onClose }) => {
  const { cards, turn, history, columns } = useGame();

  if (!isOpen) return null;

  // 1. Calculate Delivered Cards
  const deliveredCards = cards.filter(c => c.completedAt !== null);
  const totalDelivered = deliveredCards.length;

  // 2. Calculate Average Lead Time
  const totalLeadTime = deliveredCards.reduce((sum, c) => {
    return sum + (c.completedAt - c.startedAt);
  }, 0);
  const avgLeadTime = totalDelivered > 0 ? (totalLeadTime / totalDelivered).toFixed(1) : 0;

  // 3. Calculate Flow Efficiency
  const startedCards = cards.filter(c => c.startedAt !== null);
  const totalActiveTime = startedCards.reduce((sum, c) => sum + (c.activeTime || 0), 0);
  const totalWaitTime = startedCards.reduce((sum, c) => sum + (c.waitTime || 0), 0);
  const totalTime = totalActiveTime + totalWaitTime;
  const flowEfficiency = totalTime > 0 ? ((totalActiveTime / totalTime) * 100).toFixed(0) : 0;

  // 4. Calculate Throughput
  const throughput = turn > 1 ? (totalDelivered / (turn - 1)).toFixed(2) : 0;

  // 5. Find Bottleneck (Queue with highest historical presence)
  let bottleneck = { title: "Nenhum", count: 0 };
  if (history.length > 0) {
    const queueColumns = columns.filter(c => c.role === 'queue' || c.role === 'done');
    const queueCounts = {};
    queueColumns.forEach(c => queueCounts[c.id] = 0);
    
    history.forEach(snapshot => {
      queueColumns.forEach(c => {
        if (snapshot[c.id]) queueCounts[c.id] += snapshot[c.id];
      });
    });

    let maxCount = -1;
    let maxColId = null;
    Object.keys(queueCounts).forEach(id => {
      if (queueCounts[id] > maxCount && id !== 'col-deploy' && id !== 'col-backlog') {
        maxCount = queueCounts[id];
        maxColId = id;
      }
    });

    if (maxColId && maxCount > 0) {
      bottleneck = { 
        title: columns.find(c => c.id === maxColId).title, 
        count: maxCount 
      };
    }
  }

  // Generate Pedagogical Questions and Hints
  const getFlowEfficiencyAdvice = () => {
    if (flowEfficiency >= 50) return {
      q: "Nossa Eficiência de Fluxo está ótima! Por que o tempo ocioso é baixo?",
      a: "Vocês estão aplicando 'Swarming' perfeitamente. Quando alguém fica livre, ajuda o colega em vez de puxar novos itens."
    };
    return {
      q: "Por que nossa Eficiência de Fluxo está abaixo de 50%?",
      a: "Nossos cartões passam a maior parte da vida parados em filas! Tente reduzir os Limites de WIP para forçar a equipe a terminar tarefas em vez de começar novas."
    };
  };

  const getBottleneckAdvice = () => {
    if (bottleneck.count === 0) return {
      q: "Como manter o fluxo sem gargalos visíveis?",
      a: "Continue focando em concluir os itens à direita do quadro e mantendo os Limites de WIP."
    };
    return {
      q: `Por que o maior gargalo se formou em "${bottleneck.title}"?`,
      a: `A etapa seguinte provavelmente tem menos capacidade que a anterior. Se DEV entrega mais rápido que QA pode testar, os cartões acumulam em "Dev Feito". Solução: Ajustar o WIP de DEV para baixo, ou mover DEVs para testar junto com QA.`
    };
  };

  const feAdvice = getFlowEfficiencyAdvice();
  const bnAdvice = getBottleneckAdvice();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '50%' }}>
            <BarChart3 size={32} color="var(--accent-blue)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-primary)' }}>Service Delivery Review (Retrospectiva)</h1>
            <span style={{ color: 'var(--text-muted)' }}>Análise de Fluxo do Dia {turn}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-secondary">
          <X size={20} /> Fechar
        </button>
      </header>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* KPI Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-emerald)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
              <TrendingUp size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Throughput</h3>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {throughput} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>cartões/dia</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Entregue: {totalDelivered}</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-blue)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}>
              <Clock size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Lead Time Médio</h3>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {avgLeadTime} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>dias</span>
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tempo do compromisso à entrega</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-purple)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)' }}>
              <BarChart3 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Eficiência de Fluxo</h3>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {flowEfficiency}%
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Trabalho Ativo vs Tempo em Fila</span>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-rose)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Maior Gargalo</h3>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', wordBreak: 'break-word', marginTop: 'auto', marginBottom: 'auto' }}>
              {bottleneck.title}
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fila com maior acúmulo histórico</span>
          </div>

        </div>

        {/* Reflexões Section */}
        <div>
          <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
            <MessageCircleQuestion size={28} color="var(--accent-amber)" />
            Tópicos para a Retrospectiva
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '0 0 16px 0', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--accent-blue)' }}>Q:</span> {feAdvice.q}
              </h3>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  <Lightbulb size={18} /> Resposta Simulada (Guia):
                </strong>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {feAdvice.a}
                </span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '0 0 16px 0', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--accent-blue)' }}>Q:</span> {bnAdvice.q}
              </h3>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  <Lightbulb size={18} /> Resposta Simulada (Guia):
                </strong>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {bnAdvice.a}
                </span>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { X, TrendingUp, AlertTriangle, ArrowDown, Activity, Lightbulb } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Custom Tooltip para evitar quebras por NaN/null do Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface)', padding: '12px', border: '1px solid var(--border-glass)', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.3)' }}>
        <p style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontWeight: 'bold' }}>Turno {label}</p>
        {[...payload].reverse().map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
            <div style={{ width: '12px', height: '12px', background: entry.color, borderRadius: '2px' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{entry.value || 0}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CFDDashboard = ({ isOpen, onClose }) => {
  const { history, columns } = useGame();

  // Cores do Kanban
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#64748b', '#0ea5e9'];
  // Conceito Kanban University: O CFD oficial de Delivery começa no Ponto de Comprometimento (Commitment Point).
  // Upstream (opções e ideias) não entra no CFD principal, pois a variação distorce a escala de fluxo.
  const downstreamColumns = useMemo(() => columns.filter(col => col.id.startsWith('col-down-')), [columns]);
  const reversedColumns = useMemo(() => [...downstreamColumns].reverse(), [downstreamColumns]);

  // Motor de Diagnóstico Dinâmico
  const diagnosis = useMemo(() => {
    if (history.length < 2) return [{ type: 'info', title: 'Aguardando Dados', text: 'Avance alguns turnos na simulação para o Mestre Kanban diagnosticar o seu fluxo.' }];
    
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const warnings = [];

    // 1. Verificar Degrau Liso (Flatline) do DONE
    const currentDone = last['col-down-done'] || 0;
    const prevDone = prev['col-down-done'] || 0;
    
    if (history.length >= 3) {
      const prevPrev = history[history.length - 3];
      const prevPrevDone = prevPrev['col-down-done'] || 0;
      if (currentDone === prevDone && prevDone === prevPrevDone && currentDone > 0) {
        warnings.push({
          type: 'danger',
          title: 'Degrau Liso na Entrega (Flatline)',
          text: 'O gráfico inferior (DONE) está plano há mais de 2 turnos. A equipe parou de entregar valor. Analise se há um gargalo grave ou se todo mundo parou para refinar o Backlog.'
        });
      }
    }

    // 2. Analisar Alargamento (Gargalo) e Starvation em colunas ativas
    downstreamColumns.forEach(col => {
      if (col.id === 'col-down-done') return;
      
      const currVal = last[col.id] || 0;
      const prevVal = prev[col.id] || 0;

      // Alargamento (Aumentou muito de repente)
      if (currVal > prevVal && currVal >= col.limit) {
        warnings.push({
          type: 'warning',
          title: `Gargalo Formando em "${col.title}"`,
          text: `A banda desta etapa engrossou rapidamente e atingiu/superou o limite de WIP. O trabalho está entrando, mas não está saindo. Sugestão: Faça "Swarming" (ajuda mútua) para desovar essa fila!`
        });
      }

      // Starvation (Banda sumiu)
      if (currVal === 0 && prevVal > 0) {
        warnings.push({
          type: 'info',
          title: `Starvation (Fome) em "${col.title}"`,
          text: `A banda dessa etapa desapareceu (chegou a zero). A equipe responsável pode estar ociosa porque a etapa anterior não está fornecendo trabalho rápido o suficiente.`
        });
      }
    });

    if (warnings.length === 0) {
      warnings.push({
        type: 'success',
        title: 'Fluxo Saudável',
        text: 'No último turno, as bandas do CFD se mantiveram proporcionais. Continue respeitando os limites de WIP para manter o Lead Time previsível.'
      });
    }

    return warnings;
  }, [history, columns]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '50%' }}>
            <TrendingUp size={32} color="var(--accent-emerald)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-primary)' }}>Análise CFD (Cumulative Flow Diagram)</h1>
            <span style={{ color: 'var(--text-muted)' }}>Diagnóstico avançado do fluxo de trabalho</span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-secondary">
          <X size={20} /> Fechar Análise
        </button>
      </header>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Gráfico Real Expansionado */}
        <section className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Gráfico de Fluxo Real</h2>
          
          <div style={{ height: '500px', width: '100%', marginTop: '16px' }}>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                  <XAxis dataKey="turn" stroke="var(--text-muted)" fontSize={12} tickMargin={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickMargin={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {reversedColumns.map((col, index) => (
                    <Area 
                      key={col.id} 
                      type="monotone" 
                      dataKey={col.id}
                      name={col.title}
                      stackId="1" 
                      stroke={colors[index % colors.length]} 
                      fill={colors[index % colors.length]} 
                      animationDuration={500}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                O gráfico aparecerá quando a simulação avançar os primeiros turnos.
              </div>
            )}
          </div>
        </section>

        {/* Diagnóstico Dinâmico */}
        <section>
          <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '24px' }}>
            <Activity size={28} color="var(--accent-purple)" />
            Diagnóstico do Turno Atual
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {diagnosis.map((diag, index) => {
              const getBg = () => {
                if (diag.type === 'danger') return 'rgba(239, 68, 68, 0.1)';
                if (diag.type === 'warning') return 'rgba(245, 158, 11, 0.1)';
                if (diag.type === 'success') return 'rgba(16, 185, 129, 0.1)';
                return 'rgba(59, 130, 246, 0.1)';
              };
              const getIconColor = () => {
                if (diag.type === 'danger') return 'var(--accent-rose)';
                if (diag.type === 'warning') return 'var(--accent-amber)';
                if (diag.type === 'success') return 'var(--accent-emerald)';
                return 'var(--accent-blue)';
              };

              return (
                <div key={index} className="glass-panel" style={{ padding: '24px', background: getBg(), borderLeft: `4px solid ${getIconColor()}` }}>
                  <h3 style={{ color: 'var(--text-primary)', display: 'flex', gap: '8px', alignItems: 'center', margin: '0 0 12px 0', fontSize: '1.1rem' }}>
                    <Lightbulb size={20} color={getIconColor()} /> {diag.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>{diag.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Guia Como Ler (Estático) */}
        <section style={{ marginTop: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '24px' }}>
            <AlertTriangle size={28} color="var(--accent-amber)" />
            Cartilha de Padrões de CFD
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-rose)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>1. Boca de Jacaré</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Aumento de WIP e troca de contexto.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Aplicar limite de WIP na coluna.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Motivos:</strong> Bloqueios, ansiedade de começar, pressão por paralelismo.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-amber)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>2. Escadas</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Lotes grandes, timeboxes rígidos ou janelas de GMUD.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Fazer mais releases e buscar fluxo contínuo.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Motivos:</strong> Itens de trabalho muito grandes ou acúmulo artificial.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--text-muted)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>3. Platô (Linhas Retas)</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Nada se moveu no período.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Investigar bloqueios, quebrar itens, verificar feriados.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Motivos:</strong> Férias coletivas, ambiente indisponível, itens gigantes.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-blue)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>4. Uma etapa em linha reta</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Starvation (fome/nenhum card) em uma etapa.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Força-tarefa para entregar itens que estão bloqueando antes.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Motivos:</strong> Bloqueios nas etapas iniciais ou itens pesados travando fluxo.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-purple)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>5. Linhas descendo</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Itens voltando para trás no fluxo ou projetos cancelados.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Avaliar se o cancelamento foi correto, entender o retorno.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Motivos:</strong> Falha nas políticas de entrada, trabalho re-alocado.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--accent-emerald)' }}>
              <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>6. Baleia Penteada (Perfeito)</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Indica:</strong> Time com fluxo maduro no uso de Kanban.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Ações:</strong> Manter a consistência e celebrar previsibilidade.</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}><strong>Consequências:</strong> As fases têm a mesma velocidade. Cabelos colados ao corpo = menor WIP e Lead Time.</p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

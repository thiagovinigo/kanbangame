import React from 'react';
import { X, TrendingUp, AlertTriangle, ArrowDown, Activity } from 'lucide-react';

export const CFDGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--surface)',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'var(--surface)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px', borderRadius: '10px' }}>
              <TrendingUp size={24} color="var(--accent-emerald)" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Guia de Leitura do CFD</h2>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Padrões e Anti-Padrões do Cumulative Flow Diagram</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section>
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '12px' }}>Como ler o Gráfico?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              O <strong>Cumulative Flow Diagram (CFD)</strong> mostra a quantidade cumulativa de itens em cada etapa do fluxo ao longo do tempo.
              <ul>
                <li><strong>Eixo Horizontal (X):</strong> Tempo (Dias, Semanas ou Turnos).</li>
                <li><strong>Eixo Vertical (Y):</strong> Número cumulativo de Cartões.</li>
                <li><strong>Espessura da Banda (Cor):</strong> É o Work in Progress (WIP) daquela etapa em um dado momento.</li>
                <li><strong>Distância Horizontal:</strong> Representa o Lead Time aproximado (tempo que leva da entrada até a saída).</li>
              </ul>
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--accent-rose)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} />
              Anti-Padrões Comuns (Problemas)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              
              {/* Pattern 1 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>1. Alargamento ("Boca de Jacaré")</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong>Sintoma:</strong> Uma das faixas coloridas começa a engrossar cada vez mais, ficando mais alta que as outras, enquanto as faixas de baixo permanecem finas.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Problema:</strong> O Limite de WIP está sendo ignorado ou existe um grande <strong>Gargalo</strong> logo à frente dessa etapa. O trabalho entra e não sai. O Lead Time vai explodir.<br/><br/>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Solução:</strong> Parar de puxar trabalho (parar de começar) e fazer "Swarming" (ajuda mútua) para desovar os itens acumulados.
                </div>
              </div>

              {/* Pattern 2 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>2. Degrau Liso (Flatlines)</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong>Sintoma:</strong> A linha superior e a inferior de todas as etapas ficam perfeitamente horizontais por dias. Nenhuma faixa cresce.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Problema:</strong> Nenhuma entrega está sendo feita. Pode indicar que todo o time está preso em um bloqueio crítico ou impedimento externo sistêmico.<br/><br/>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Solução:</strong> Focar a Daily Kanban inteiramente nos bloqueios e escalar a resolução dos impedimentos rapidamente.
                </div>
              </div>

              {/* Pattern 3 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowDown size={18} color="var(--accent-rose)" /> 3. Quedas no Gráfico
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong>Sintoma:</strong> Uma ou mais faixas de repente sofrem uma queda em direção a zero (vão para baixo).
                </p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Problema:</strong> O CFD <strong>nunca pode cair</strong>, ele é cumulativo! Se caiu, significa que os cartões foram devolvidos para etapas anteriores (o que quebra o fluxo) ou foram apagados do quadro (trabalho oculto/abandonado).<br/><br/>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Solução:</strong> Se um cartão falhou em Testes, não o mova de volta para DEV. Mantenha-o em testes com um impedimento (Blocker) e traga o DEV para ajudar na coluna atual.
                </div>
              </div>

              {/* Pattern 4 */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--accent-blue)" /> 4. Faixas Esmagadas (Desaparecendo)
                </h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong>Sintoma:</strong> Uma faixa colorida específica some (espessura vira zero), enquanto a camada inferior continua horizontal.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Problema:</strong> <strong>Starvation</strong> (Inanição). Significa que aquela etapa esgotou todo o trabalho e os profissionais estão ociosos, pois não recebem nada da etapa anterior.<br/><br/>
                  <strong style={{ color: 'var(--accent-emerald)' }}>Solução:</strong> Fazer Replenishment ou analisar por que a etapa anterior não está fornecendo vazão suficiente para alimentar o sistema.
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

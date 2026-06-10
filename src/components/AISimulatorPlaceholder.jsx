import React from 'react';
import { ArrowLeft, Sparkles, Cpu, Bot, Zap } from 'lucide-react';

export const AISimulatorPlaceholder = ({ onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '20%', right: '10%', width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)', zIndex: 0
      }}></div>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', zIndex: 10, marginBottom: '60px' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Voltar ao Portal
        </button>
      </header>

      {/* Main Content */}
      <main style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <div className="glass-panel" style={{ maxWidth: '700px', width: '100%', padding: '60px 40px', textAlign: 'center', borderTop: '4px solid #a855f7' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(168, 85, 247, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '32px' }}>
            <Cpu size={64} color="#c084fc" />
          </div>
          
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Simulador Kanban com IA</h1>
          <h2 style={{ fontSize: '1.2rem', color: '#c084fc', margin: '0 0 32px 0', fontWeight: 'normal', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Em Fase de Construção
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '48px' }}>
            Estamos preparando uma experiência revolucionária. O Kanban com Inteligência Artificial irá introduzir:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'left', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Bot size={24} color="#a855f7" />
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Cenários Dinâmicos</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Incidentes e demandas gerados de forma imprevisível.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Zap size={24} color="#a855f7" />
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Feedback em Tempo Real</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A IA analisará suas métricas e decisões instantaneamente.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Sparkles size={24} color="#a855f7" />
              <div>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>Aconselhamento Preditivo</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Antecipe gargalos antes mesmo deles acontecerem.</span>
              </div>
            </div>
          </div>

          <button onClick={onBack} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: '#a855f7', borderColor: '#a855f7' }}>
            Retornar ao Modo Clássico
          </button>
        </div>
      </main>

    </div>
  );
};

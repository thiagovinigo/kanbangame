import React from 'react';
import { LayoutDashboard, Sparkles, ChevronRight } from 'lucide-react';

export const HomePage = ({ onSelectMode }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(60px)', zIndex: 0
      }}></div>

      <div style={{ zIndex: 10, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 16px 0', background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portal Kanban
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: '1.6' }}>
          Escolha a sua experiência. Aprenda os fundamentos do fluxo no simulador clássico ou explore o futuro da gestão com Inteligência Artificial.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* Classic Card */}
          <div 
            onClick={() => onSelectMode('classic')}
            className="glass-panel hover-scale"
            style={{ 
              padding: '40px', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '24px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.05)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', padding: '20px', borderRadius: '50%', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}>
              <LayoutDashboard size={48} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Modo Clássico</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                O simulador tradicional. Aprenda sobre Limites de WIP, Daily, Replenishment, CFD e experimente os impactos das métricas em um ambiente controlado.
              </p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '16px', fontSize: '1.1rem', background: '#3b82f6', borderColor: '#3b82f6' }}>
              Acessar Simulador Clássico <ChevronRight size={20} />
            </button>
          </div>

          {/* AI Card */}
          <div 
            onClick={() => onSelectMode('ai')}
            className="glass-panel hover-scale"
            style={{ 
              padding: '40px', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '24px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              background: 'rgba(168, 85, 247, 0.05)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.8)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              NOVO
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #a855f7, #6b21a8)', padding: '20px', borderRadius: '50%', boxShadow: '0 10px 20px rgba(168,85,247,0.3)' }}>
              <Sparkles size={48} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0 0 12px 0' }}>Simulador com IA</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                A próxima evolução. Enfrente cenários gerados dinamicamente por Inteligência Artificial, incidentes complexos e feedback preditivo em tempo real.
              </p>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', padding: '16px', fontSize: '1.1rem', background: '#a855f7', borderColor: '#a855f7' }}>
              Experimentar IA <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Bot, ChevronRight, X } from 'lucide-react';

export const NarratorOverlay = ({ message, stepIndex, totalSteps, onNext, onSkip }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '400px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '2px solid var(--accent-purple)',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 0 4px rgba(139, 92, 246, 0.2)',
      zIndex: 9999999, // Super high to stay above modals
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out'
    }}>
      
      {/* Header */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.2)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={20} color="var(--accent-purple)" />
          <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem', letterSpacing: '1px' }}>
            GUIA DE SIMULAÇÃO ({stepIndex}/{totalSteps})
          </h4>
        </div>
        <button onClick={onSkip} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Encerrar Simulação">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.5' }}>
        {message}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)' }}>
        <button 
          onClick={onNext}
          className="btn btn-primary"
          style={{ background: 'var(--accent-purple)', border: 'none', borderRadius: '20px', padding: '8px 24px' }}
        >
          {stepIndex === totalSteps ? 'Finalizar' : 'Continuar'} <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

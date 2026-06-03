import React, { useState } from 'react';
import { Bot, ChevronRight, X, Activity, UserPlus, Presentation, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

export const NarratorOverlay = ({ 
  message, 
  onNext, 
  onSkip, 
  isEndOfDay, 
  onStartQuiz, 
  currentQuiz, 
  onAnswerQuiz 
}) => {
  if (!message && !currentQuiz && !isEndOfDay) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '450px',
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
            {currentQuiz ? 'QUIZ: CERIMÔNIA KANBAN' : 'MESTRE KANBAN'}
          </h4>
        </div>
        <button onClick={onSkip} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Encerrar Simulação">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.5' }}>
        {currentQuiz ? (
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '16px' }}>{currentQuiz.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQuiz.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onAnswerQuiz(opt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {currentQuiz.showFeedback && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                borderRadius: '8px', 
                background: currentQuiz.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${currentQuiz.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start'
              }}>
                {currentQuiz.isCorrect ? <CheckCircle color="var(--accent-emerald)" size={20} /> : <AlertCircle color="var(--accent-rose)" size={20} />}
                <span style={{ fontSize: '0.9rem' }}>{currentQuiz.feedbackMsg}</span>
              </div>
            )}
          </div>
        ) : (
          <p style={{ margin: 0 }}>{message}</p>
        )}

        {!currentQuiz && isEndOfDay && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Testar Conhecimento:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={() => onStartQuiz('daily')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                <Activity size={16} /> Daily
              </button>
              <button onClick={() => onStartQuiz('replenishment')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                <UserPlus size={16} /> Replenishment
              </button>
              <button onClick={() => onStartQuiz('demo')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                <Presentation size={16} /> Demo
              </button>
              <button onClick={() => onStartQuiz('retro')} className="btn btn-secondary" style={{ padding: '8px', fontSize: '0.85rem' }}>
                <BarChart3 size={16} /> Retro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)' }}>
        {(!currentQuiz || currentQuiz.isCorrect) && (
          <button 
            onClick={currentQuiz ? () => onNext(true) : onNext}
            className="btn btn-primary"
            style={{ background: 'var(--accent-purple)', border: 'none', borderRadius: '20px', padding: '8px 24px' }}
          >
            {currentQuiz ? 'Continuar' : 'Avançar Simulação'} <ChevronRight size={18} />
          </button>
        )}
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

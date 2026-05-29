import React from 'react';
import { X, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const FeedbackModal = () => {
  const { feedback, closeFeedback } = useGame();

  if (!feedback) return null;

  const getStyle = () => {
    switch(feedback.type) {
      case 'error': return { color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.1)', border: 'var(--accent-rose)' };
      case 'warning': return { color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.1)', border: 'var(--accent-amber)' };
      case 'info': return { color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.1)', border: 'var(--accent-blue)' };
      default: return { color: 'var(--text-primary)', bg: 'var(--bg-secondary)', border: 'var(--border-glass)' };
    }
  };

  const getIcon = () => {
    switch(feedback.type) {
      case 'error': return <AlertOctagon size={32} color={getStyle().color} />;
      case 'warning': return <AlertTriangle size={32} color={getStyle().color} />;
      case 'info': return <Info size={32} color={getStyle().color} />;
      default: return <Info size={32} />;
    }
  };

  const style = getStyle();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', borderTop: `4px solid ${style.border}`, position: 'relative' }}>
        <button className="modal-close" onClick={closeFeedback}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: style.bg, padding: '12px', borderRadius: '50%' }}>
            {getIcon()}
          </div>
          <h2 style={{ margin: 0, color: style.color, fontSize: '1.4rem' }}>{feedback.title}</h2>
        </div>

        <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px', whiteSpace: 'pre-line' }}>
          {feedback.message}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', background: style.color }}
          onClick={closeFeedback}
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

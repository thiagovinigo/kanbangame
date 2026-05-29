import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useGame } from '../context/GameContext';
import { cardTypeColors } from '../utils/initialState';
import { Settings, AlertTriangle, Calendar, Star } from 'lucide-react';

export const Card = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { ...card },
  });
  
  const { applyEffort, diceRoll } = useGame();

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  
  const color = cardTypeColors[card.type] || 'var(--text-primary)';
  
  const getIcon = () => {
    switch(card.type) {
      case 'urgente': return <AlertTriangle size={14} />;
      case 'data-fixa': return <Calendar size={14} />;
      case 'intangivel': return <Star size={14} />;
      default: return <Settings size={14} />;
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={{
        ...style,
        borderTop: `3px solid ${color}`,
        padding: '12px',
        marginBottom: '12px',
        background: 'var(--bg-secondary)',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative'
      }}
      {...attributes} 
      {...listeners}
      className="glass-panel"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
          {getIcon()}
          {card.type}
          {card.type === 'data-fixa' && card.dueDate && (
            <span style={{ marginLeft: '4px', background: 'var(--bg-glass-hover)', padding: '2px 6px', borderRadius: '4px' }}>
              Prazo: Dia {card.dueDate}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {card.id.substring(0,4)}</span>
      </div>
      
      <h4 style={{ fontSize: '0.9rem', margin: '4px 0' }}>{card.title}</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {card.effortTotal.dev > 0 && (
          <div style={{ 
            background: card.effortLeft.dev === 0 ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.15)', 
            padding: '6px 8px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            opacity: card.effortLeft.dev === 0 ? 0.6 : 1
          }}>
            <span style={{ color: 'var(--accent-blue)', fontWeight: 600, width: '40px' }}>DEV</span>
            <span style={{ fontWeight: 500, flex: 1, textAlign: 'center' }}>
              {card.effortLeft.dev === 0 ? '✓' : `${card.effortLeft.dev}/${card.effortTotal.dev}`}
            </span>
            <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              {card.effortLeft.dev > 0 && diceRoll.dev > 0 && card.columnId === 'col-dev-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'dev'); }}
                  style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '4px', width: '32px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}
                >
                  +1
                </button>
              )}
            </div>
          </div>
        )}
        
        {card.effortTotal.test > 0 && (
          <div style={{ 
            background: card.effortLeft.test === 0 ? 'rgba(139, 92, 246, 0.05)' : 'rgba(139, 92, 246, 0.15)', 
            padding: '6px 8px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            opacity: card.effortLeft.test === 0 ? 0.6 : 1
          }}>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 600, width: '40px' }}>QA</span>
            <span style={{ fontWeight: 500, flex: 1, textAlign: 'center' }}>
              {card.effortLeft.test === 0 ? '✓' : `${card.effortLeft.test}/${card.effortTotal.test}`}
            </span>
            <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              {card.effortLeft.test > 0 && diceRoll.test > 0 && card.columnId === 'col-qa-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'test'); }}
                  style={{ background: 'var(--accent-purple)', color: '#fff', border: 'none', borderRadius: '4px', width: '32px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(139,92,246,0.3)' }}
                >
                  +1
                </button>
              )}
            </div>
          </div>
        )}

        {card.effortTotal.uat > 0 && (
          <div style={{ 
            background: card.effortLeft.uat === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.15)', 
            padding: '6px 8px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            opacity: card.effortLeft.uat === 0 ? 0.6 : 1
          }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, width: '40px' }}>UAT</span>
            <span style={{ fontWeight: 500, flex: 1, textAlign: 'center' }}>
              {card.effortLeft.uat === 0 ? '✓' : `${card.effortLeft.uat}/${card.effortTotal.uat}`}
            </span>
            <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              {card.effortLeft.uat > 0 && diceRoll.uat > 0 && card.columnId === 'col-uat-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'uat'); }}
                  style={{ background: 'var(--accent-emerald)', color: '#fff', border: 'none', borderRadius: '4px', width: '32px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(16,185,129,0.3)' }}
                >
                  +1
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

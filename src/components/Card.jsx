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
  
  const { applyEffort, capacity, unblockCard } = useGame();

  const handleUnblock = (e) => {
    e.stopPropagation();
    alert(`💡 O Kanban diz:\n\n1. Bloqueios NÃO saem da coluna.\n2. Consomem limite de WIP (gerando dor no time).\n3. Requerem Sinalização Visual forte.\n4. O time deve fazer Swarming para resolver o mais rápido possível.\n5. O relógio do Lead Time não para, prejudicando a Eficiência do Fluxo!`);
    unblockCard(card.id);
  };

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
        position: 'relative',
        border: card.isBlocked ? '2px solid var(--accent-rose)' : '1px solid var(--border-glass)',
        backgroundColor: card.isBlocked ? 'rgba(244, 63, 94, 0.05)' : 'var(--bg-secondary)'
      }}
      {...attributes} 
      {...listeners}
      className="glass-panel"
    >
      {card.isBlocked && (
        <div style={{ position: 'absolute', top: '-12px', right: '-12px', background: 'var(--accent-rose)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)', zIndex: 10 }}>
          <span style={{ fontSize: '18px' }}>🛑</span>
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
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
      
      {card.isBlocked ? (
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
          <span style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 'bold' }}>IMPEDIMENTO!</span>
          <button 
            onPointerDown={handleUnblock}
            style={{ width: '100%', background: 'var(--accent-rose)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✅ Resolver
          </button>
        </div>
      ) : (
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
              {card.effortLeft.dev === 0 ? '✓' : `${card.effortLeft.dev}h / ${card.effortTotal.dev}h`}
            </span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
              {card.effortLeft.dev > 0 && capacity.dev >= 8 && card.columnId === 'col-dev-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'dev', 8); }}
                  style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  +8h
                </button>
              )}
              {card.effortLeft.dev > 0 && capacity.dev >= 1 && card.columnId === 'col-dev-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'dev', 1); }}
                  style={{ background: 'transparent', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', fontSize: '10px' }}
                >
                  +1h
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
              {card.effortLeft.test === 0 ? '✓' : `${card.effortLeft.test}h / ${card.effortTotal.test}h`}
            </span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
              {card.effortLeft.test > 0 && capacity.test >= 8 && card.columnId === 'col-qa-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'test', 8); }}
                  style={{ background: 'var(--accent-purple)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  +8h
                </button>
              )}
              {card.effortLeft.test > 0 && capacity.test >= 1 && card.columnId === 'col-qa-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'test', 1); }}
                  style={{ background: 'transparent', color: 'var(--accent-purple)', border: '1px solid var(--accent-purple)', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', fontSize: '10px' }}
                >
                  +1h
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
              {card.effortLeft.uat === 0 ? '✓' : `${card.effortLeft.uat}h / ${card.effortTotal.uat}h`}
            </span>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
              {card.effortLeft.uat > 0 && capacity.uat >= 8 && card.columnId === 'col-uat-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'uat', 8); }}
                  style={{ background: 'var(--accent-emerald)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  +8h
                </button>
              )}
              {card.effortLeft.uat > 0 && capacity.uat >= 1 && card.columnId === 'col-uat-doing' && (
                <button 
                  onPointerDown={(e) => { e.stopPropagation(); applyEffort(card.id, 'uat', 1); }}
                  style={{ background: 'transparent', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)', borderRadius: '4px', padding: '2px 4px', cursor: 'pointer', fontSize: '10px' }}
                >
                  +1h
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { Card } from './Card';

export const Column = ({ column }) => {
  const { cards } = useGame();
  const columnCards = cards.filter(c => c.columnId === column.id);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });
  
  const isOverLimit = column.limit > 0 && columnCards.length > column.limit;

  return (
    <div 
      className="glass-panel"
      style={{
        minWidth: '280px',
        maxWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        background: isOver ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
        border: isOverLimit ? '1px solid var(--accent-rose)' : '1px solid var(--border-glass)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', color: isOverLimit ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
          {column.title}
        </h3>
        {column.limit > 0 && (
          <span style={{ 
            fontSize: '0.8rem', 
            padding: '2px 8px', 
            borderRadius: '12px',
            background: isOverLimit ? 'var(--accent-rose)' : 'var(--bg-secondary)',
            color: isOverLimit ? '#fff' : 'var(--text-secondary)'
          }}>
            {columnCards.length} / {column.limit}
          </span>
        )}
      </div>
      
      <div 
        ref={setNodeRef}
        style={{
          padding: '12px',
          flex: 1,
          overflowY: 'auto',
          minHeight: '150px'
        }}
      >
        {columnCards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

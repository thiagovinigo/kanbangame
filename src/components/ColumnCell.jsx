import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { useGame } from '../context/GameContext';

export const ColumnCell = ({ column, swimlane }) => {
  const { cards, dailyStep, columns } = useGame();
  
  // Calculate if we are in Daily Walk the Board mode and if this column is out of focus
  const isDailyMode = dailyStep !== null;
  const currentDailyColId = isDailyMode ? columns[dailyStep].id : null;
  const isDimmed = isDailyMode && column.id !== currentDailyColId;
  
  // Filter cards for this specific column and swimlane
  const cellCards = cards.filter(c => {
    if (c.columnId !== column.id) return false;
    if (swimlane === 'expedite') return c.type === 'urgente';
    return c.type !== 'urgente';
  });
  
  const cellId = `${column.id}-${swimlane}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: cellId,
    data: {
      type: 'ColumnCell',
      column,
      swimlane
    },
  });
  
  // Total cards in column (for WIP limit check)
  const totalCardsInColumn = cards.filter(c => c.columnId === column.id).length;
  const isOverLimit = column.limit > 0 && totalCardsInColumn > column.limit;

  return (
    <div 
      ref={setNodeRef}
      className="glass-panel"
      style={{
        padding: '12px',
        minHeight: swimlane === 'expedite' ? '200px' : '400px',
        background: isOver ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
        border: isOverLimit ? '1px solid var(--accent-rose)' : '1px solid var(--border-glass)',
        transition: 'opacity 0.3s ease, all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        opacity: isDimmed ? 0.3 : 1,
        pointerEvents: isDimmed ? 'none' : 'auto',
        position: 'relative'
      }}
    >
      {cellCards.map(card => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
};

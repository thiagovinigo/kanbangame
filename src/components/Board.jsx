import React from 'react';
import { DndContext, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { ColumnCell } from './ColumnCell';
import { Info } from 'lucide-react';

export const Board = ({ onOpenPolicy }) => {
  const { columns, moveCard } = useGame();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.data.current?.type === 'ColumnCell') {
      const cardId = active.id;
      // Strip the swimlane suffix to get the actual column id
      const toColumnId = over.id.replace('-expedite', '').replace('-standard', '');
      
      const card = active.data.current;
      // Force expedite cards to stay in expedite lane visually, though logically they just move column
      if (card.type === 'urgente' && !over.id.includes('-expedite')) {
        alert("Cartões Urgentes devem ficar na raia de URGENTE!");
        return;
      }
      if (card.type !== 'urgente' && over.id.includes('-expedite')) {
        alert("Apenas cartões Urgentes podem entrar nesta raia!");
        return;
      }

      moveCard(cardId, toColumnId);
    }
  };

  return (
    <div className="board-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '20px' }}>
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        
        {/* CSS Grid for the Board */}
        <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(${columns.length}, 250px)`, gap: '12px', minWidth: 'max-content' }}>
          
          {/* Row 1: Headers & Policies */}
          <div style={{ padding: '12px' }}></div> {/* Empty top-left cell */}
          {columns.map(col => (
            <div key={`header-${col.id}`} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{col.title}</h3>
                <button 
                  onClick={() => onOpenPolicy(col)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  title="Ver política explícita da coluna"
                >
                  <Info size={16} />
                </button>
              </div>
              {col.limit > 0 && <span style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '12px', marginBottom: '8px' }}>WIP: {col.limit}</span>}
            </div>
          ))}

          {/* Row 2: Expedite Swimlane */}
          <div className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '4px solid var(--accent-rose)', background: 'rgba(244, 63, 94, 0.05)' }}>
            <h3 style={{ color: 'var(--accent-rose)', transform: 'rotate(-90deg)', whiteSpace: 'nowrap', margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>URGENTE</h3>
          </div>
          {columns.map(col => (
            <ColumnCell key={`exp-${col.id}`} column={col} swimlane="expedite" />
          ))}

          {/* Row 3: Standard Swimlane */}
          <div className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '4px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ color: 'var(--accent-blue)', transform: 'rotate(-90deg)', whiteSpace: 'nowrap', margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>PADRÃO</h3>
          </div>
          {columns.map(col => (
            <ColumnCell key={`std-${col.id}`} column={col} swimlane="standard" />
          ))}

        </div>

      </DndContext>
    </div>
  );
};

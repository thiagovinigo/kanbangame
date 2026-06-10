import React, { useState } from 'react';
import { DndContext, pointerWithin, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { ColumnCell } from './ColumnCell';
import { Info } from 'lucide-react';

export const Board = ({ onOpenPolicy }) => {
  const { columns, moveCard, showFeedback, dailyStep } = useGame();
  const [showCommitmentTooltip, setShowCommitmentTooltip] = useState(false);
  const boardRef = React.useRef(null);
  
  const isDailyMode = dailyStep !== null;
  const currentDailyColId = isDailyMode ? columns[dailyStep].id : null;

  React.useEffect(() => {
    if (isDailyMode && boardRef.current) {
      // Pequeno delay para garantir que a renderização aconteceu
      setTimeout(() => {
        if (boardRef.current) {
          boardRef.current.scrollTo({
            left: boardRef.current.scrollWidth,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [isDailyMode]);
  
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
        showFeedback('⚡ Classes de Serviço', 'Cartões "Urgente" devem tramitar exclusivamente na raia de URGENTE para furar fila com segurança!', 'warning');
        return;
      }
      if (card.type !== 'urgente' && over.id.includes('-expedite')) {
        showFeedback('⚡ Classes de Serviço', 'Apenas cartões da classe de serviço "Urgente" podem entrar nesta raia expressa!', 'warning');
        return;
      }

      moveCard(cardId, toColumnId);
    }
  };

  const upstreamCols = columns.filter(c => c.id.startsWith('col-up-') || ['col-ai-backlog', 'col-ai-pm', 'col-ai-arch', 'col-ai-replenishment'].includes(c.id));
  const downstreamCols = columns.filter(c => c.id.startsWith('col-down-') || ['col-ai-dev', 'col-ai-qa', 'col-ai-done'].includes(c.id));

  return (
    <div className="board-container animate-fade-in" ref={boardRef} style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '20px' }}>
      
      {/* Zone Headers */}
      <div style={{ display: 'flex', minWidth: 'max-content', paddingLeft: '162px', gap: '40px', marginBottom: '8px' }}>
        <div style={{ width: `${upstreamCols.length * 262}px`, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'var(--accent-purple)', fontWeight: 'bold', letterSpacing: '1px' }}>
          UPSTREAM (Descoberta & Opções)
        </div>
        <div style={{ width: `${downstreamCols.length * 262}px`, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 'bold', letterSpacing: '1px' }}>
          DOWNSTREAM (Entrega Contínua)
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
        
        {/* CSS Grid for the Board */}
        <div style={{ display: 'grid', gridTemplateColumns: `150px repeat(${upstreamCols.length}, 250px) 40px repeat(${downstreamCols.length}, 250px)`, gap: '12px', minWidth: 'max-content' }}>
          
          {/* Row 1: Headers & Policies */}
          <div style={{ padding: '12px' }}></div> {/* Empty top-left cell */}
          
          {upstreamCols.map(col => (
            <div key={`header-${col.id}`} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', opacity: (isDailyMode && col.id !== currentDailyColId) ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
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

          {/* Commitment Point Header Divider */}
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'help' }}
            onMouseEnter={() => setShowCommitmentTooltip(true)}
            onMouseLeave={() => setShowCommitmentTooltip(false)}
          >
            <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--accent-rose)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', textAlign: 'center', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Info size={16} style={{ transform: 'rotate(90deg)' }} /> COMPROMETIMENTO
            </div>
            
            {showCommitmentTooltip && (
              <div className="glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: '250px', padding: '12px', zIndex: 100, borderTop: '3px solid var(--accent-rose)', background: 'var(--bg-secondary)', marginTop: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--accent-rose)', fontSize: '0.9rem' }}>Ponto de Comprometimento</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  A partir desta linha, o time assume o compromisso de entregar o cartão ao cliente. O foco muda de "selecionar" para "terminar".
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(244, 63, 94, 0.05)', padding: '8px', borderRadius: '4px' }}>
                  <strong>Métricas acionadas a partir daqui:</strong><br/>
                  ⏳ Lead Time (Tempo de Entrega)<br/>
                  📈 Eficiência de Fluxo
                </div>
              </div>
            )}
          </div>

          {downstreamCols.map(col => (
            <div key={`header-${col.id}`} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', opacity: (isDailyMode && col.id !== currentDailyColId) ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
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
          
          {upstreamCols.map(col => (
            <ColumnCell key={`exp-${col.id}`} column={col} swimlane="expedite" />
          ))}

          <div style={{ borderLeft: '3px dashed var(--accent-rose)', height: '100%', margin: '0 auto', opacity: 0.5 }}></div>

          {downstreamCols.map(col => (
            <ColumnCell key={`exp-${col.id}`} column={col} swimlane="expedite" />
          ))}

          {/* Row 3: Standard Swimlane */}
          <div className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '4px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.05)' }}>
            <h3 style={{ color: 'var(--accent-blue)', transform: 'rotate(-90deg)', whiteSpace: 'nowrap', margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>PADRÃO</h3>
          </div>
          
          {upstreamCols.map(col => (
            <ColumnCell key={`std-${col.id}`} column={col} swimlane="standard" />
          ))}

          <div style={{ borderLeft: '3px dashed var(--accent-rose)', height: '100%', margin: '0 auto', opacity: 0.5 }}></div>

          {downstreamCols.map(col => (
            <ColumnCell key={`std-${col.id}`} column={col} swimlane="standard" />
          ))}

        </div>

      </DndContext>
    </div>
  );
};

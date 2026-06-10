import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cardTypeColors } from '../utils/initialState';
import { Settings, AlertTriangle, Calendar, Star, FileText, Bot, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DocumentModal } from './DocumentModal';

export const AICard = ({ card }) => {
  const [activeDoc, setActiveDoc] = useState(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: { ...card },
  });
  
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

  const hasArtifacts = Object.values(card.artifacts).some(val => val !== null);

  return (
    <>
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
          border: card.risks.length > 0 ? '2px solid var(--accent-amber)' : '1px solid var(--border-glass)',
          backgroundColor: card.risks.length > 0 ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-secondary)'
        }}
        {...attributes} 
        {...listeners}
        className="glass-panel hover-scale"
      >
        {card.updaterRun && (
          <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: 'var(--accent-emerald)', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)', zIndex: 10, fontWeight: 'bold' }}>
            <CheckCircle2 size={12} /> UPDATER OK
          </div>
        )}
        
        {card.risks.length > 0 && (
          <div style={{ position: 'absolute', top: '-12px', right: '-12px', background: 'var(--accent-amber)', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)', zIndex: 10 }} title="Risco Identificado!">
            <ShieldAlert size={16} color="white" />
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
            {getIcon()}
            {card.type}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {card.id.substring(0,4)}</span>
        </div>
        
        <h4 style={{ fontSize: '0.9rem', margin: '0 0 8px 0' }}>{card.title}</h4>

        {/* AI Status / Agent Message */}
        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '8px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <Bot size={14} color="#c084fc" style={{ marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {card.aiStatus}
          </span>
        </div>

        {/* Artifacts Badges */}
        {hasArtifacts && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            {card.artifacts.prd && (
              <button onPointerDown={(e) => { e.stopPropagation(); setActiveDoc('prd'); }} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={10} /> PRD
              </button>
            )}
            {card.artifacts.stories && (
              <button onPointerDown={(e) => { e.stopPropagation(); setActiveDoc('stories'); }} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={10} /> Storys
              </button>
            )}
            {card.artifacts.spec && (
              <button onPointerDown={(e) => { e.stopPropagation(); setActiveDoc('spec'); }} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={10} /> Spec
              </button>
            )}
            {card.artifacts.qa && (
              <button onPointerDown={(e) => { e.stopPropagation(); setActiveDoc('qa'); }} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={10} /> QA
              </button>
            )}
            {card.artifacts.releaseNotes && (
              <button onPointerDown={(e) => { e.stopPropagation(); setActiveDoc('releaseNotes'); }} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={10} /> Release Notes
              </button>
            )}
          </div>
        )}

        {/* Risks */}
        {card.risks.length > 0 && (
          <div style={{ marginTop: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px dashed var(--accent-amber)', padding: '8px', borderRadius: '6px' }}>
            {card.risks.map((risk, idx) => (
              <p key={idx} style={{ margin: 0, fontSize: '0.75rem', color: '#b45309', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <AlertTriangle size={12} style={{ marginTop: '2px', flexShrink: 0 }} /> {risk}
              </p>
            ))}
          </div>
        )}

      </div>

      <DocumentModal 
        isOpen={!!activeDoc} 
        onClose={() => setActiveDoc(null)} 
        title={`${activeDoc ? activeDoc.toUpperCase() : ''}: ${card.title}`}
        content={activeDoc ? card.artifacts[activeDoc] : ''}
        type={activeDoc}
      />
    </>
  );
};

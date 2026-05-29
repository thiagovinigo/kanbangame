import React from 'react';
import { X, Info } from 'lucide-react';

export const PolicyModal = ({ isOpen, onClose, column }) => {
  if (!isOpen || !column) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '400px',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent-blue)' }}>
          <Info size={24} />
          Política da Coluna
        </h2>

        <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{column.title}</h3>
        
        {/* Status Badge */}
        <div style={{ marginBottom: '20px' }}>
          {(column.role === 'queue' || column.role === 'done') && (
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px dashed rgba(245, 158, 11, 0.5)' }}>
              ⏳ Fila de Espera (Wait State)
            </span>
          )}
          {column.role === 'active' && (
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
              🔥 Fase Ativa (Doing)
            </span>
          )}
          {column.role === 'completed' && (
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
              ✅ Finalizado
            </span>
          )}
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {column.policy.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        
        {column.limit > 0 ? (
          <div style={{ marginTop: '16px', padding: '8px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', color: 'var(--accent-rose)' }}>
            <strong>Limite WIP:</strong> Máximo de {column.limit} cartões.
          </div>
        ) : (
          <div style={{ marginTop: '16px', padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-blue)' }}>
            <strong>Limite WIP:</strong> Ilimitado (Fila de Espera/Buffer).
          </div>
        )}
      </div>
    </div>
  );
};

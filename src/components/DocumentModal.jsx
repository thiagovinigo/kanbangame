import React from 'react';
import { X, FileText, Download } from 'lucide-react';

export const DocumentModal = ({ isOpen, onClose, title, content, type }) => {
  if (!isOpen) return null;

  // Simple Markdown parser to React elements for basic styling
  const renderMarkdown = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) return <h1 key={index} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={index} style={{ fontSize: '1.4rem', color: 'var(--accent-purple)', marginTop: '20px' }}>{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={index} style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginTop: '16px' }}>{line.replace('### ', '')}</h3>;
      
      // Checkboxes
      if (line.includes('- [ ]')) return <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}><input type="checkbox" readOnly /> {line.replace('- [ ]', '')}</div>;
      if (line.includes('- [x]')) return <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}><input type="checkbox" readOnly checked /> {line.replace('- [x]', '')}</div>;
      
      // Lists
      if (line.startsWith('- ')) return <li key={index} style={{ marginLeft: '20px', margin: '4px 0' }}>{line.replace('- ', '')}</li>;
      
      // Code blocks (simple representation)
      if (line.startsWith('\`\`\`')) return null; // Ignore backticks
      
      // Bold text handling
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={index} style={{ lineHeight: '1.6', margin: '8px 0', color: 'var(--text-secondary)' }}>{renderedParts}</p>;
    });
  };

  const getTypeColor = () => {
    switch(type) {
      case 'prd': return '#3b82f6';
      case 'spec': return '#a855f7';
      case 'qa': return '#10b981';
      case 'stories': return '#f59e0b';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
      <div 
        className="modal-content glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: '800px', 
          width: '90%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderTop: `4px solid ${getTypeColor()}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', background: 'var(--bg-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: `${getTypeColor()}20`, padding: '8px', borderRadius: '8px' }}>
              <FileText size={24} color={getTypeColor()} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{title}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documento gerado por IA Autônoma</span>
            </div>
          </div>
          <button onClick={onClose} className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '32px 40px', flex: 1 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-glass)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}>
            {renderMarkdown(content)}
          </div>
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-glass)' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onClose}>
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

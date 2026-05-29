import React, { useState } from 'react';
import { X, Users, UserCheck, UserCog, Settings } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const TeamConfigModal = ({ isOpen, onClose }) => {
  const { teamConfig, updateTeamConfig } = useGame();
  const [config, setConfig] = useState(teamConfig);

  if (!isOpen) return null;

  const handleSave = () => {
    updateTeamConfig(config);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '8px' }}>
            <Settings size={24} color="var(--accent-blue)" />
          </div>
          <h2 style={{ margin: 0 }}>Configurar Equipe</h2>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Defina quantas pessoas existem na sua equipe. Cada pessoa adiciona <strong>8 horas diárias</strong> à capacidade total daquela especialidade.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={20} color="var(--accent-blue)" />
              <span style={{ fontWeight: 600 }}>Desenvolvedores</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, dev: Math.max(1, p.dev - 1) }))}>-</button>
              <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{config.dev}</span>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, dev: p.dev + 1 }))}>+</button>
            </div>
          </div>

          <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-purple)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserCheck size={20} color="var(--accent-purple)" />
              <span style={{ fontWeight: 600 }}>Analistas de QA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, test: Math.max(1, p.test - 1) }))}>-</button>
              <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{config.test}</span>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, test: p.test + 1 }))}>+</button>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-emerald)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserCog size={20} color="var(--accent-emerald)" />
              <span style={{ fontWeight: 600 }}>PO / Cliente (UAT)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, uat: Math.max(1, p.uat - 1) }))}>-</button>
              <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{config.uat}</span>
              <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => setConfig(p => ({ ...p, uat: p.uat + 1 }))}>+</button>
            </div>
          </div>

        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleSave}
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { FastForward, RotateCcw, Users, UserCheck, UserCog, AlertOctagon, Settings } from 'lucide-react';
import { TeamConfigModal } from './TeamConfigModal';

export const ControlPanel = () => {
  const { turn, capacity, teamConfig, nextTurn, resetGame, blockRandomCard } = useGame();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Dia</span>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', margin: 0 }}>{turn}</h2>
        </div>
        
        <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <Users size={24} color="var(--accent-blue)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>DEV ({teamConfig.dev} {teamConfig.dev === 1 ? 'PESSOA' : 'PESSOAS'})</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{capacity.dev}h disp.</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(139, 92, 246, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <UserCheck size={24} color="var(--accent-purple)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>QA ({teamConfig.test} {teamConfig.test === 1 ? 'PESSOA' : 'PESSOAS'})</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{capacity.test}h disp.</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <UserCog size={24} color="var(--accent-emerald)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>UAT ({teamConfig.uat} {teamConfig.uat === 1 ? 'PESSOA' : 'PESSOAS'})</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{capacity.uat}h disp.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="btn btn-secondary"
          onClick={() => setIsConfigOpen(true)}
          title="Configurar Equipe"
        >
          <Settings size={18} />
          Configurar
        </button>

        <button 
          className="btn btn-secondary"
          onClick={resetGame}
          style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
        >
          <RotateCcw size={18} />
          Reiniciar
        </button>

        <button className="btn btn-secondary" onClick={blockRandomCard}>
          <AlertOctagon size={18} color="var(--accent-rose)" />
          Simular Bloqueio
        </button>

        <button className="btn btn-primary" onClick={nextTurn}>
          <FastForward size={18} />
          Próximo Dia
        </button>
      </div>

      <TeamConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
    </div>
  );
};

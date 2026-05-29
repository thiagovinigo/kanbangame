import React from 'react';
import { useGame } from '../context/GameContext';
import { Dices, FastForward, RotateCcw } from 'lucide-react';

export const ControlPanel = () => {
  const { turn, diceRoll, rollDice, nextTurn, resetGame } = useGame();

  const hasRolled = diceRoll.dev > 0 || diceRoll.test > 0 || diceRoll.uat > 0;

  return (
    <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Dia</span>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', margin: 0 }}>{turn}</h2>
        </div>
        
        <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)' }}></div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)' }}>DEV CAPACITY</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{diceRoll.dev}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(139, 92, 246, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>QA CAP</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{diceRoll.test}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 16px', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>UAT CAP</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{diceRoll.uat}</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          className="btn btn-secondary"
          onClick={resetGame}
          style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }}
        >
          <RotateCcw size={18} />
          Reiniciar
        </button>

        <button 
          className="btn btn-secondary"
          onClick={rollDice}
          disabled={hasRolled}
          style={{ opacity: hasRolled ? 0.5 : 1, cursor: hasRolled ? 'not-allowed' : 'pointer' }}
        >
          <Dices size={18} />
          Rolar Dados
        </button>
        
        <button className="btn btn-primary" onClick={nextTurn}>
          <FastForward size={18} />
          Próximo Dia
        </button>
      </div>
    </div>
  );
};

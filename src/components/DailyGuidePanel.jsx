import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowRight, ArrowLeft, XCircle, Users, AlertTriangle } from 'lucide-react';

export const DailyGuidePanel = () => {
  const { dailyStep, nextDailyStep, prevDailyStep, stopDaily, columns } = useGame();

  if (dailyStep === null) return null;

  const currentColumn = columns[dailyStep];
  const isDoneColumn = currentColumn.role === 'done' || currentColumn.role === 'queue';
  const isActiveColumn = currentColumn.role === 'active';

  let questionText = "";
  let hintText = "";
  let icon = <Users size={20} color="var(--accent-blue)" />;

  if (currentColumn.id === 'col-down-ready-dev') {
    questionText = "Temos vagas de WIP no fluxo? Os devs estão ociosos?";
    hintText = "Olhe para a próxima etapa (DEV). Se houver espaço e ociosidade, o próximo cartão do topo deve ser puxado hoje. Alguém tem dúvida sobre o requisito?";
    icon = <ArrowRight size={20} color="var(--accent-emerald)" />;
  } else if (isDoneColumn) {
    questionText = "A próxima etapa tem capacidade para puxar estes cartões?";
    hintText = "Cartões aqui estão parados (envelhecendo) apenas esperando capacidade da etapa seguinte. Há gargalo se formando?";
    icon = <AlertTriangle size={20} color="var(--accent-amber)" />;
  } else if (isActiveColumn) {
    questionText = "O que falta para terminarmos os cartões desta coluna HOJE?";
    hintText = "Foque nos impedimentos (vermelhos) e cartões envelhecidos. Alguém precisa de ajuda (Swarming) para remover bloqueios?";
    icon = <Users size={20} color="var(--accent-blue)" />;
  }

  return (
    <div className="animate-slide-up" style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--accent-blue)',
      borderRadius: '12px',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '90%',
      maxWidth: '800px',
      zIndex: 1000000,
      boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 0 2px rgba(59, 130, 246, 0.3)'
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '50%' }}>
            {icon}
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Foco: {currentColumn.title}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>Walk the Board (Passo {13 - dailyStep + 1} de 9)</span>
          </div>
        </div>
        
        <button onClick={stopDaily} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '4px' }}>
          <XCircle size={24} />
        </button>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)' }}>
        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{questionText}</strong>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{hintText}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={prevDailyStep}
          disabled={dailyStep >= 13}
          style={{ opacity: dailyStep >= 13 ? 0.5 : 1 }}
        >
          <ArrowRight size={16} /> Ir para a Direita
        </button>

        <button 
          className="btn btn-primary" 
          onClick={nextDailyStep}
          disabled={dailyStep <= 5}
          style={{ background: 'var(--accent-blue)', opacity: dailyStep <= 5 ? 0.5 : 1 }}
        >
          Próxima Coluna à Esquerda <ArrowLeft size={16} />
        </button>
      </div>

    </div>
  );
};

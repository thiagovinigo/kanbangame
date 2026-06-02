import React from 'react';
import { X, Activity, ArrowLeftRight, AlertOctagon, Clock, Users } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const DailyModal = ({ isOpen, onClose }) => {
  const { startDaily } = useGame();

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px', borderTop: '4px solid var(--accent-blue)', position: 'relative' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <Activity size={32} color="var(--accent-blue)" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Kanban Meeting (Daily)</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Papel sugerido: Service Delivery Manager (SDM) / Flow Master</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
          <p>
            No Kanban, a Reunião Diária foca no <strong>fluxo de trabalho</strong> (nos cartões) e não nas pessoas. A regra de ouro é sempre ler o quadro da <strong>Direita para a Esquerda</strong> ("Stop starting, start finishing").
          </p>
          
          <h3 style={{ color: 'var(--accent-blue)', marginTop: '20px', marginBottom: '12px', fontSize: '1.1rem' }}>Como "Caminhar pelo Quadro" (Walk the Board):</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ArrowLeftRight size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>1. Da Direita para a Esquerda</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Comece pelos cartões mais próximos da conclusão (ex: Homologação ou Teste). A pergunta é: <em>"O que precisamos fazer HOJE para que este item seja entregue?"</em></span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-rose)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertOctagon size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>2. Foco nos Impedimentos (Bloqueios)</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Existem cartões com a tag de BLOQUEADO? Quem pode ajudar a remover esse impedimento imediatamente para o fluxo voltar a andar?</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Clock size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>3. Envelhecimento (Aging) e Gargalos</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Algum cartão está há muitos "dias" parado na mesma coluna? Estamos batendo no limite de WIP em alguma etapa? Precisamos focar esforço ali.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Users size={20} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>4. Colaboração (Swarming)</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Alguém no time está ocioso porque sua coluna não pode receber mais cartões? Essa pessoa deve ajudar as etapas mais à direita (fazer Swarming).</span>
              </div>
            </li>
          </ul>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-blue)' }}
          onClick={() => {
            startDaily();
            onClose();
          }}
        >
          Iniciar Daily (Walk the Board)
        </button>
      </div>
    </div>
  );
};

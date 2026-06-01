import React from 'react';
import { X, UserPlus, AlertTriangle, CheckCircle, Target, ListOrdered } from 'lucide-react';

export const ReplenishmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px', borderTop: '4px solid var(--accent-emerald)' }}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <UserPlus size={32} color="var(--accent-emerald)" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Reunião de Replenishment</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Papel sugerido: Service Request Manager (SRM) / Product Owner</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
          <p>
            A Reunião de Replenishment (Reabastecimento) é o momento onde a equipe decide <strong>quais cartões devem ser puxados do Backlog para o sistema</strong> (ponto de comprometimento).
          </p>
          
          <h3 style={{ color: 'var(--accent-emerald)', marginTop: '20px', marginBottom: '12px', fontSize: '1.1rem' }}>Perguntas Guias para o Time:</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-rose)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>1. Temos capacidade disponível?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verifique os limites de WIP da coluna "Selecionado (Ready)". Se a coluna estiver cheia, não devemos puxar mais nada! O foco deve ser em terminar o que já começou.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Target size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>2. Existem urgências ou datas fixas?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Analise as Classes de Serviço. Cartões com "Data Fixa" próximos do vencimento ou itens "Urgentes" devem ter prioridade na seleção.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ListOrdered size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>3. Qual é a prioridade do negócio?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entre os itens Padrão, quais trarão mais valor ou reduzirão mais risco neste momento? Alinhe as expectativas com o negócio.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>4. Os itens estão preparados (Ready)?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>O time entende o que precisa ser feito nestes cartões? Não puxe itens mal especificados que vão gerar bloqueios logo à frente.</span>
              </div>
            </li>
          </ul>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-emerald)' }}
          onClick={onClose}
        >
          Iniciar Replenishment
        </button>
      </div>
    </div>
  );
};

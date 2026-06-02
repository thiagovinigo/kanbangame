import React from 'react';
import { X, UserPlus, AlertTriangle, CheckCircle, Target, ListOrdered } from 'lucide-react';

export const ReplenishmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px', borderTop: '4px solid var(--accent-emerald)', position: 'relative' }}>
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
            A Reunião de Replenishment foca nos <strong>itens que estão na fila "[UP] Pronto para Replenishment"</strong>. O objetivo é decidir quais cruzarão a linha de Comprometimento para o Downstream.
          </p>
          
          <h3 style={{ color: 'var(--accent-emerald)', marginTop: '20px', marginBottom: '12px', fontSize: '1.1rem' }}>Perguntas Guias para o Time:</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ListOrdered size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>1. Quais os itens mais importantes prontos no Upstream?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Olhando para o pool de opções refinadas, quais cartões trarão mais valor de negócio ou reduzirão mais risco se iniciados agora?</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Target size={20} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>2. Há Urgências ou Datas Fixas na fila?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verifique a fila em busca de itens da Classe de Serviço "Urgente" ou "Data Fixa" próxima. Eles devem ter prioridade na seleção.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-purple)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={20} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>3. Os itens estão 100% maduros (DoR)?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Temos as informações necessárias (arquitetura, regras de negócio) para começar a desenvolver sem surpresas?</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertTriangle size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>4. Temos capacidade (WIP) disponível no Downstream?</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>A coluna "[DOWN] Pronto para Desenvolvimento" tem espaço livre? O Kanban é um sistema puxado: só iniciamos itens se houver vagas.</span>
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

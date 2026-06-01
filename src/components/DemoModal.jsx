import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Star, Presentation, Lightbulb, ThumbsUp, AlertCircle } from 'lucide-react';

export const DemoModal = ({ isOpen, onClose }) => {
  const { cards, simulateCustomerFeedback } = useGame();
  const [feedbackResult, setFeedbackResult] = useState(null);

  if (!isOpen) return null;

  // Find cards in deploy column that haven't been validated yet
  const deployedCards = cards.filter(c => c.columnId === 'col-deploy' && !c.customerValidated);
  const validatedCards = cards.filter(c => c.columnId === 'col-deploy' && c.customerValidated);

  const handleSimulate = () => {
    const result = simulateCustomerFeedback();
    setFeedbackResult(result);
  };

  const handleClose = () => {
    setFeedbackResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 999999 }}>
      <div className="modal-content animate-slide-up" style={{ maxWidth: '800px', width: '90%' }}>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '8px', borderRadius: '50%' }}>
              <Presentation size={24} color="var(--accent-amber)" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Reunião de Demonstração (Showcase)</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Validando o Valor de Negócio Entregue</span>
            </div>
          </div>
          <button onClick={handleClose} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>
              <Star size={18} color="var(--accent-amber)" /> 
              Foco da Demo
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              A cerimônia de Demonstração serve para validar se o que a equipe construiu atende à expectativa de negócio. No simulador, o cliente avaliará as entregas. Cuidado: <strong>há chance de rejeição</strong> se o requisito não tiver gerado o valor correto!
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '16px' }}>
              Pacote de Entrega Atual ({deployedCards.length} itens)
            </h3>
            
            {deployedCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Nenhuma entrega pendente de validação</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Não há cartões não-validados na coluna de Implantado (Deploy).
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {deployedCards.map(card => (
                  <div key={card.id} style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent-blue)', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ minWidth: '12px', minHeight: '12px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{card.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {feedbackResult && (
            <div className="animate-slide-up" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid var(--accent-emerald)' }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThumbsUp size={20} /> Resultado da Avaliação do Cliente
              </h3>
              <ul style={{ margin: 0, color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6 }}>
                <li><strong>{feedbackResult.approvedCount}</strong> itens foram <strong style={{ color: 'var(--accent-emerald)' }}>aprovados</strong> e geraram valor real!</li>
                <li><strong>{feedbackResult.rejectedCount}</strong> itens foram <strong style={{ color: 'var(--accent-rose)' }}>rejeitados</strong> (Voltaram pro Backlog para retrabalho).</li>
              </ul>
            </div>
          )}

          {validatedCards.length > 0 && !feedbackResult && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                * Existem {validatedCards.length} item(ns) na coluna Deploy que já foram validados anteriormente.
              </span>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            Fechar
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleSimulate}
            disabled={deployedCards.length === 0 || feedbackResult !== null}
            style={{ background: 'var(--accent-amber)', borderColor: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Presentation size={18} />
            Validar Entregas com Cliente
          </button>
        </div>

      </div>
    </div>
  );
};

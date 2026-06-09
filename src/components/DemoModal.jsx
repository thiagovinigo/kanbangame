import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Star, Presentation, Lightbulb, ThumbsUp, AlertCircle } from 'lucide-react';

export const DemoModal = ({ isOpen, onClose }) => {
  const { cards, simulateCustomerFeedback } = useGame();
  const [feedbackResult, setFeedbackResult] = useState(null);

  if (!isOpen) return null;

  // Find cards in deploy column that haven't been validated yet
  const deployedCards = cards.filter(c => c.columnId === 'col-down-done' && !c.customerValidated);
  const validatedCards = cards.filter(c => c.columnId === 'col-down-done' && c.customerValidated);

  const handleSimulate = () => {
    const result = simulateCustomerFeedback();
    setFeedbackResult(result);
  };

  const handleClose = () => {
    setFeedbackResult(null);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '700px', borderTop: '4px solid var(--accent-amber)', position: 'relative' }}>
        <button className="modal-close" onClick={handleClose}><X size={20} /></button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <Presentation size={32} color="var(--accent-amber)" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Service Delivery Review (Demo)</h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Papel sugerido: Service Delivery Manager (SDM)</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
          <p>
            No Kanban, a "Demo" faz parte da <strong>Service Delivery Review</strong>. Mais do que apenas mostrar o software funcionando, o objetivo é avaliar se o sistema está atendendo às expectativas dos clientes (Fitness for Purpose).
          </p>
          
          <h3 style={{ color: 'var(--accent-amber)', marginTop: '20px', marginBottom: '12px', fontSize: '1.1rem' }}>Focos de Validação da SDR:</h3>
          
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ThumbsUp size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>1. Aptidão para o Uso (Fitness for Purpose)</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>O que foi entregue resolve a dor do cliente? Funcionalidade construída mas rejeitada não é entrega, é desperdício de fluxo.</span>
              </div>
            </li>

            <li style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-blue)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Lightbulb size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>2. Lead Time e Expectativas (SLA)</strong><br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Entregamos rápido o suficiente? O tempo que os cartões levaram desde o Comprometimento (Commitment Point) até a Entrega foi adequado?</span>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '16px', fontSize: '1.1rem' }}>
            Pacote de Entrega Atual ({deployedCards.length} itens aguardando validação)
          </h3>
          
          {deployedCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-glass)', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
              <AlertCircle size={28} color="var(--text-muted)" style={{ marginBottom: '8px', margin: '0 auto' }} />
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Nenhuma entrega pendente</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Não há cartões não-validados na coluna "[DOWN] Em Produção".
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {deployedCards.map(card => (
                <div key={card.id} style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ minWidth: '8px', minHeight: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>{card.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {feedbackResult && (
          <div className="animate-fade-in" style={{ marginTop: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid var(--accent-emerald)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Star size={20} /> Resultado da Validação do Cliente
            </h3>
            <ul style={{ margin: 0, color: 'var(--text-primary)', paddingLeft: '20px', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <li><strong>{feedbackResult.approvedCount}</strong> itens foram <strong style={{ color: 'var(--accent-emerald)' }}>aprovados</strong> e geraram valor real! ✅</li>
              <li><strong>{feedbackResult.rejectedCount}</strong> itens foram <strong style={{ color: 'var(--accent-rose)' }}>rejeitados</strong> pelo cliente e voltaram pro Backlog. ❌</li>
            </ul>
          </div>
        )}

        {validatedCards.length > 0 && !feedbackResult && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Historicamente, existem {validatedCards.length} item(ns) validados nesta simulação.
            </span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginTop: '24px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSimulate}
            disabled={deployedCards.length === 0 || feedbackResult !== null}
            style={{ width: '100%', background: 'var(--accent-amber)', borderColor: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Presentation size={18} />
            Coletar Feedback do Cliente
          </button>
        </div>

      </div>
    </div>
  );
};

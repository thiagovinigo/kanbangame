import React from 'react';
import { X, BookOpen, AlertTriangle } from 'lucide-react';

export const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--accent-blue)' }}>
          <BookOpen size={24} />
          Regras do Jogo
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
          <p>
            <strong>Objetivo:</strong> O objetivo deste jogo é aprender como o fluxo de trabalho funciona em um sistema Kanban, gerenciando gargalos, limites de trabalho em progresso (WIP) e colaborando para entregar valor de forma contínua.
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--accent-rose)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', margin: '0 0 8px 0' }}>
              <AlertTriangle size={18} />
              Restrições Importantes
            </h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong>Limites WIP (Work in Progress):</strong> Você NÃO pode mover um cartão para uma coluna que já tenha atingido o limite indicado (ex: 3/3), exceto se for da classe <em>Urgente</em>.</li>
              <li><strong>Esforço Necessário:</strong> Um cartão NÃO pode avançar para a próxima fase do fluxo (ex: de Dev para QA) enquanto ainda tiver pontos de esforço pendentes naquela fase.</li>
            </ul>
          </div>

          <h3 style={{ marginTop: '12px', marginBottom: '8px', color: 'var(--accent-blue)' }}>Classes de Serviço</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <strong style={{ color: 'var(--accent-blue)' }}>Padrão (Standard):</strong> Fluxo normal de trabalho. Segue as regras e os limites WIP (First In, First Out).
            </li>
            <li>
              <strong style={{ color: 'var(--accent-rose)' }}>Urgente (Expedite):</strong> Problemas críticos. Podem <strong>ignorar e furar os limites de WIP</strong>. Devem ter prioridade máxima pela equipe (Swarming).
            </li>
            <li>
              <strong style={{ color: 'var(--accent-amber)' }}>Data Fixa (Fixed Date):</strong> Precisam ser entregues até um turno (dia) específico, senão perdem valor ou geram multas.
            </li>
            <li>
              <strong style={{ color: 'var(--accent-purple)' }}>Intangível (Intangible):</strong> Tarefas técnicas importantes, mas sem urgência imediata (ex: refatoração, documentação). Costumam ter baixa prioridade no momento, mas podem virar urgência no futuro se ignoradas.
            </li>
          </ul>

          <h3 style={{ marginTop: '12px', marginBottom: '8px', color: 'var(--accent-purple)' }}>Como Jogar</h3>
          <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Puxe o Trabalho:</strong> Mova os cartões do <em>Backlog</em> para as colunas de execução conforme houver espaço.</li>
            <li><strong>Role os Dados:</strong> A cada dia (turno), clique em "Rolar Dados" para simular a capacidade da equipe. Os pontos azuis são <strong>Dev</strong>, roxos são <strong>QA</strong> e verdes são <strong>UAT</strong>.</li>
            <li><strong>Aplique o Esforço:</strong> Nos cartões que estão nas colunas de <em>Fazendo</em>, clique no botão <strong>"+"</strong> para consumir os pontos rolados e reduzir o esforço necessário do cartão.</li>
            <li><strong>Avance o Dia:</strong> Quando não tiver mais capacidade disponível ou pontos para gastar, clique em "Próximo Dia" para prosseguir para o próximo turno.</li>
            <li><strong>Métricas:</strong> Observe o gráfico de "Lead Time" para ver quanto tempo os cartões levam para ser entregues, e o "Cumulative Flow" para observar os gargalos ao longo dos dias.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

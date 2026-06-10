import React, { createContext, useContext, useState } from 'react';
import { initialColumns, initialCards } from '../utils/initialState';
import { generateMockMarkdown } from '../utils/mockAiResponses';

const AIGameContext = createContext();

export const useAIGame = () => useContext(AIGameContext);

export const AIGameProvider = ({ children }) => {
  const [columns, setColumns] = useState(initialColumns);
  
  // Initialize cards with AI properties
  const aiInitialCards = initialCards.map(c => ({
    ...c,
    artifacts: { prd: null, spec: null, qa: null, stories: null },
    risks: [],
    aiStatus: '' // Status message from the agent currently working on it
  }));
  
  const [cards, setCards] = useState(aiInitialCards);
  const [turn, setTurn] = useState(1);
  const [teamConfig, setTeamConfig] = useState({ dev: 2, test: 1, uat: 1 });
  const [capacity, setCapacity] = useState({ dev: 16, test: 8, uat: 8 });
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (title, message, type = 'error') => {
    setTimeout(() => setFeedback({ title, message, type }), 150);
  };
  const closeFeedback = () => setFeedback(null);

  const moveCard = (cardId, toColumnId) => {
    const col = columns.find(c => c.id === toColumnId);
    
    setCards(prev => {
      const currentCardsInCol = prev.filter(c => c.columnId === toColumnId).length;
      if (col && col.limit > 0 && currentCardsInCol >= col.limit) {
        showFeedback('Limites de WIP Excedidos!', \`A coluna "\${col.title}" tem um limite máximo de \${col.limit} cartões. Quebrar essa regra causa sobrecarga e atrasos na entrega.\`, 'error');
        return prev;
      }
      return prev.map(c => {
        if (c.id === cardId) {
          const startedAt = (toColumnId.startsWith('col-down-') && !c.startedAt) ? turn : c.startedAt;
          const completedAt = (toColumnId === 'col-down-done') ? turn : c.completedAt;
          return { ...c, columnId: toColumnId, startedAt, completedAt, isBlocked: false };
        }
        return c;
      });
    });
  };

  const applyEffort = (cardId, type, amount) => {
    if (capacity[type] < amount) {
      showFeedback('Sem Capacidade!', \`Não há horas suficientes de \${type.toUpperCase()} disponíveis hoje. Avance o dia ou altere a configuração do time.\`);
      return;
    }
    
    setCards(prev => prev.map(c => {
      if (c.id === cardId && c.effortLeft[type] > 0) {
        const newEffort = Math.max(0, c.effortLeft[type] - amount);
        setCapacity(cap => ({ ...cap, [type]: cap[type] - (c.effortLeft[type] - newEffort) }));
        return { ...c, effortLeft: { ...c.effortLeft, [type]: newEffort } };
      }
      return c;
    }));
  };

  const unblockCard = (cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isBlocked: false } : c));
  };

  const processAITurn = (currentCards) => {
    // Simulando o trabalho dos Agentes de IA baseado na coluna
    let updatedCards = [...currentCards];
    
    updatedCards = updatedCards.map(c => {
      const updatedCard = { ...c };
      
      // Agente de Produto atua no Refinamento Funcional
      if (c.columnId === 'col-up-ref-funcional' && !c.artifacts.prd) {
        updatedCard.artifacts.prd = generateMockMarkdown('prd', c.title);
        updatedCard.artifacts.stories = generateMockMarkdown('stories', c.title);
        updatedCard.aiStatus = '✅ PRD e User Stories gerados pelo Agente PM.';
        showFeedback('✨ Agente de Produto Finalizou', \`O Agente PM criou o PRD para a demanda "\${c.title}".\`, 'info');
      }
      
      // Agente Arquiteto atua no Refinamento Técnico
      if (c.columnId === 'col-up-ref-tecnico' && !c.artifacts.spec) {
        updatedCard.artifacts.spec = generateMockMarkdown('spec', c.title);
        updatedCard.aiStatus = '✅ Spec Técnica gerada pelo Agente Arquiteto.';
      }
      
      // Analisador de Risco atua antes do Replenishment
      if (c.columnId === 'col-up-ready' && c.risks.length === 0) {
        // Mock de checagem contra cards em Done
        const doneCards = currentCards.filter(card => card.columnId === 'col-down-done');
        if (doneCards.length > 0 && Math.random() > 0.5) {
          updatedCard.risks.push(\`Alerta de Dependência: Esta demanda compartilha código com "\${doneCards[0].title}" (lançada recentemente). Necessário teste de regressão.\`);
          updatedCard.aiStatus = '⚠️ Riscos identificados na análise arquitetural.';
        } else {
          updatedCard.risks.push('Análise concluída: Baixo Risco de impacto.');
          updatedCard.aiStatus = '✅ Análise de risco concluída sem impedimentos críticos.';
        }
      }
      
      // Agente QA atua na fase de Ready to Teste ou Testando
      if ((c.columnId === 'col-down-ready-test' || c.columnId === 'col-down-testing') && !c.artifacts.qa) {
        updatedCard.artifacts.qa = generateMockMarkdown('qa', c.title);
        updatedCard.aiStatus = '✅ Plano de Testes (BDD) gerado pelo Agente QA.';
      }

      return updatedCard;
    });

    return updatedCards;
  };

  const nextTurn = () => {
    // Gera demanda continua
    const newItemsCount = Math.floor(Math.random() * 2) + 1;
    const newItems = Array.from({ length: newItemsCount }).map((_, i) => {
      const devEffort = Math.floor(Math.random() * 16) + 8;
      const testEffort = Math.floor(Math.random() * 8) + 4;
      const uatEffort = Math.floor(Math.random() * 8) + 4;
      return {
        id: \`card-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
        title: \`Demanda \${turn}-\${i + 1}\`,
        type: Math.random() > 0.85 ? 'urgente' : 'padrao',
        columnId: 'col-up-new',
        effortTotal: { dev: devEffort, test: testEffort, uat: uatEffort },
        effortLeft: { dev: devEffort, test: testEffort, uat: uatEffort },
        isBlocked: false,
        activeTime: 0,
        waitTime: 0,
        createdAt: turn,
        startedAt: null,
        completedAt: null,
        customerValidated: false,
        artifacts: { prd: null, spec: null, qa: null, stories: null },
        risks: [],
        aiStatus: 'Recém-chegado no backlog.'
      };
    });

    const snapshot = { turn };
    columns.forEach(col => {
      let count = cards.filter(c => c.columnId === col.id).length;
      if (col.id === 'col-up-new') count += newItems.length;
      snapshot[col.id] = count;
    });
    setHistory(prev => [...prev, snapshot]);
    
    setCards(prevCards => {
      let updatedCards = prevCards.map(c => {
        if (c.startedAt && !c.completedAt) {
          const col = columns.find(col => col.id === c.columnId);
          if (col && col.role === 'active') return { ...c, activeTime: c.activeTime + 1 };
          else if (col && (col.role === 'queue' || col.role === 'done')) return { ...c, waitTime: c.waitTime + 1 };
        }
        return c;
      });
      
      updatedCards = [...updatedCards, ...newItems];
      
      // Processa a geração de AI após adicionar novos itens
      return processAITurn(updatedCards);
    });

    setTurn(prev => prev + 1);
    setCapacity({ dev: teamConfig.dev * 8, test: teamConfig.test * 8, uat: teamConfig.uat * 8 });
  };

  return (
    <AIGameContext.Provider value={{
      columns, cards, turn, capacity, teamConfig,
      feedback, history, showFeedback, closeFeedback,
      moveCard, applyEffort, nextTurn, unblockCard, updateTeamConfig: setTeamConfig
    }}>
      {children}
    </AIGameContext.Provider>
  );
};

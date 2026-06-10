import { createContext, useContext, useState, useEffect } from 'react';
import { initialColumns, initialCards, aiColumns } from '../utils/initialState';
import { generateMockMarkdown, updateStoriesMarkdown, updatePrdMarkdown } from '../utils/mockAiResponses';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children, isAIMode = false }) => {
  const [columns, setColumns] = useState(isAIMode ? aiColumns : initialColumns);
  
  // Inject AI properties if missing
  const initCards = initialCards.map(c => ({
    ...c,
    columnId: isAIMode ? 'col-ai-backlog' : c.columnId,
    artifacts: c.artifacts || { prd: null, spec: null, qa: null, stories: null, releaseNotes: null },
    risks: c.risks || [],
    aiStatus: c.aiStatus || '',
    updaterRun: c.updaterRun || false
  }));
  
  const [cards, setCards] = useState(initCards);
  const [turn, setTurn] = useState(1);
  const [teamConfig, setTeamConfig] = useState({ dev: 2, test: 1, uat: 1 });
  const [capacity, setCapacity] = useState({ dev: 16, test: 8, uat: 8 });
  const [history, setHistory] = useState([]); // For CFD metrics
  const [feedback, setFeedback] = useState(null);
  const [dailyStep, setDailyStep] = useState(null);

  const startDaily = () => setDailyStep(13); // Start at Liberado para Instalar (index 13)
  const nextDailyStep = () => setDailyStep(prev => (prev !== null && prev > 5) ? prev - 1 : null);
  const prevDailyStep = () => setDailyStep(prev => (prev !== null && prev < 13) ? prev + 1 : prev);
  const stopDaily = () => setDailyStep(null);

  const showFeedback = (title, message, type = 'error') => {
    setTimeout(() => {
      setFeedback({ title, message, type });
    }, 150);
  };
  const closeFeedback = () => setFeedback(null);

  const updateTeamConfig = (newConfig) => {
    setTeamConfig(newConfig);
    setCapacity({
      dev: newConfig.dev * 8,
      test: newConfig.test * 8,
      uat: newConfig.uat * 8
    });
  };
  
  // Track metrics each turn
  const nextTurn = () => {
    // Gerar 1 ou 2 novos cartões no Backlog para simular demanda contínua
    const newItemsCount = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const newItems = Array.from({ length: newItemsCount }).map((_, i) => {
      const devEffort = Math.floor(Math.random() * 16) + 8;
      const testEffort = Math.floor(Math.random() * 8) + 4;
      const uatEffort = Math.floor(Math.random() * 8) + 4;
      
      return {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `Demanda ${turn}-${i + 1}`,
        type: Math.random() > 0.85 ? 'urgente' : 'padrao', // 15% chance de urgente
        columnId: isAIMode ? 'col-ai-backlog' : 'col-up-new',
        effortTotal: { dev: devEffort, test: testEffort, uat: uatEffort },
        effortLeft: { dev: devEffort, test: testEffort, uat: uatEffort },
        isBlocked: false,
        activeTime: 0,
        waitTime: 0,
        createdAt: turn,
        startedAt: null,
        completedAt: null,
        customerValidated: false,
        artifacts: { prd: null, spec: null, qa: null, stories: null, releaseNotes: null },
        risks: [],
        aiStatus: 'Recém-chegado no backlog.',
        updaterRun: false
      };
    });

    // Record CFD snapshot before moving to next day
    const snapshot = { turn };
    columns.forEach(col => {
      let count = cards.filter(c => c.columnId === col.id).length;
      if (col.id === 'col-up-new' || col.id === 'col-ai-backlog') {
        count += newItems.length; // Conta os itens que acabaram de chegar
      }
      snapshot[col.id] = count;
    });
    setHistory(prev => [...prev, snapshot]);
    
    // Update active vs wait times for flow efficiency
    setCards(prevCards => {
      const updatedCards = prevCards.map(c => {
        if (c.startedAt && !c.completedAt) {
          const col = columns.find(col => col.id === c.columnId);
          if (col && col.role === 'active') {
            return { ...c, activeTime: c.activeTime + 1 };
          } else if (col && (col.role === 'queue' || col.role === 'done')) {
            return { ...c, waitTime: c.waitTime + 1 };
          }
        }
        return c;
      });
      let finalCards = [...updatedCards, ...newItems]; // Adiciona as novas demandas ao pool
      
      if (isAIMode) {
        finalCards = finalCards.map(c => {
          const updatedCard = { ...c };
          
          if (c.columnId === 'col-ai-pm' && !c.artifacts.prd) {
            updatedCard.artifacts.prd = generateMockMarkdown('prd', c.title);
            updatedCard.artifacts.stories = generateMockMarkdown('stories', c.title);
            updatedCard.aiStatus = '✅ PRD e User Stories gerados pelo Agente PM.';
            showFeedback('✨ Agente de Produto Finalizou', `O Agente PM criou o PRD para a demanda "${c.title}".`, 'info');
          }
          
          if (c.columnId === 'col-ai-arch' && !c.artifacts.spec) {
            updatedCard.artifacts.spec = generateMockMarkdown('spec', c.title);
            updatedCard.aiStatus = '✅ Spec Técnica gerada pelo Agente Arquiteto.';
            showFeedback('✨ Agente Arquiteto Finalizou', `O Agente Arquiteto criou a Spec Técnica para a demanda "${c.title}".`, 'info');
          }
          
          if (c.columnId === 'col-ai-replenishment' && c.risks.length === 0) {
            const doneCards = finalCards.filter(card => card.columnId === 'col-ai-done');
            if (doneCards.length > 0 && Math.random() > 0.5) {
              updatedCard.risks.push(`Alerta de Dependência: Compartilha código com "${doneCards[0].title}". Teste de regressão necessário.`);
              updatedCard.aiStatus = '⚠️ Riscos identificados na análise arquitetural.';
            } else {
              updatedCard.risks.push('Análise concluída: Baixo Risco de impacto.');
              updatedCard.aiStatus = '✅ Análise de risco concluída sem impedimentos críticos.';
            }
          }
          
          if (c.columnId === 'col-ai-qa' && !c.artifacts.qa) {
            updatedCard.artifacts.qa = generateMockMarkdown('qa', c.title);
            updatedCard.aiStatus = '✅ Plano de Testes (BDD) gerado pelo Agente QA.';
            showFeedback('✨ Agente QA Finalizou', `O Agente QA criou o Plano de Testes para a demanda "${c.title}".`, 'info');
          }

          // In AI Mode, effort automatically reduces (simulating agents working in downstream)
          if (c.columnId === 'col-ai-dev' && c.effortLeft.dev > 0) {
             updatedCard.effortLeft.dev = Math.max(0, c.effortLeft.dev - 8);
             updatedCard.aiStatus = '🤖 Agente DEV programando...';
          }
          if (c.columnId === 'col-ai-qa' && (c.effortLeft.test > 0 || c.effortLeft.uat > 0)) {
             updatedCard.effortLeft.test = Math.max(0, c.effortLeft.test - 8);
             updatedCard.effortLeft.uat = Math.max(0, c.effortLeft.uat - 8);
             updatedCard.aiStatus = '🤖 Agente QA automatizando testes e homologando...';
          }

          if (c.columnId === 'col-ai-done' && !c.updaterRun) {
             updatedCard.artifacts.releaseNotes = generateMockMarkdown('release_notes', c.title);
             updatedCard.artifacts.stories = updateStoriesMarkdown(c.artifacts.stories);
             updatedCard.artifacts.prd = updatePrdMarkdown(c.artifacts.prd);
             updatedCard.updaterRun = true;
             updatedCard.aiStatus = '🔄 Agentes SRE e Updater concluíram o deploy e sincronizaram a documentação!';
             showFeedback('🚀 Deploy & Sync Concluídos', `SRE subiu a demanda "${c.title}" e a documentação foi atualizada com sucesso.`, 'info');
          }

          return updatedCard;
        });
      }

      return finalCards;
    });

    setTurn(prev => prev + 1);
    setCapacity({
      dev: teamConfig.dev * 8,
      test: teamConfig.test * 8,
      uat: teamConfig.uat * 8
    }); // Recharge capacity for the new day
  };

  const resetGame = () => {
    setColumns(isAIMode ? aiColumns : initialColumns);
    setCards(initCards);
    setTurn(1);
    setCapacity({
      dev: teamConfig.dev * 8,
      test: teamConfig.test * 8,
      uat: teamConfig.uat * 8
    });
    setHistory([]);
  };

  // Removed rollDice function

  const moveCard = (cardId, toColumnId) => {
    setCards(prevCards => {
      const card = prevCards.find(c => c.id === cardId);
      if (!card || card.columnId === toColumnId) return prevCards;

      if (card.isBlocked) {
        showFeedback(
          '🛑 Cartão Impedido!', 
          'Você não pode mover um cartão bloqueado. Pela regra do Kanban, ele deve continuar onde está e consumir o Limite de WIP para gerar "dor" no time. Façam um Swarming para resolver o impedimento antes de continuar!', 
          'error'
        );
        return prevCards;
      }

      const targetColumn = columns.find(c => c.id === toColumnId);
      if (!targetColumn) return prevCards;

      // Rule 1: WIP Limit (Expedite ignores this)
      if (targetColumn.limit > 0 && card.type !== 'urgente') {
        const cardsInTarget = prevCards.filter(c => c.columnId === toColumnId).length;
        if (cardsInTarget >= targetColumn.limit) {
          showFeedback(
            '⚠️ Pare de começar e comece a terminar!',
            `Puxar este cartão violaria a capacidade máxima da coluna "${targetColumn.title}" (WIP Limit: ${targetColumn.limit}).\n\nNo Kanban, limitamos o Trabalho em Progresso para criar um Sistema Puxado. Ajude seus colegas a terminar o que já está na coluna em vez de puxar coisas novas!`,
            'warning'
          );
          return prevCards;
        }
      }

      // Rule 2: Effort completion (Definition of Done)
      const colIndex = columns.findIndex(c => c.id === toColumnId);
      // Rule 3: Sequential movement (Do not skip columns)
      const currentIndex = columns.findIndex(c => c.id === card.columnId);
      if (colIndex > currentIndex + 1) {
        showFeedback(
          '❌ Movimento Inválido', 
          `Você não pode pular colunas no fluxo Kanban! Mova o cartão sequencialmente para a próxima etapa.`, 
          'warning'
        );
        return prevCards;
      }
      
      // Validation thresholds based on current mode
      const devDoneIndex = isAIMode ? 5 : 7; // QA or Dev-Done
      const testDoneIndex = isAIMode ? 6 : 10; // Done or Ready-Homologacao
      const uatDoneIndex = isAIMode ? 6 : 12; // Done or Homologado

      // DEV effort required
      if (colIndex >= devDoneIndex && card.effortLeft.dev > 0) {
        showFeedback('❌ Definition of Done (DoD)', 'Termine o esforço de Desenvolvimento (DEV) antes de avançar o cartão!', 'error');
        return prevCards;
      }

      // TEST effort required
      if (colIndex >= testDoneIndex && card.effortLeft.test > 0) {
        showFeedback('❌ Definition of Done (DoD)', 'Termine o esforço de Qualidade (QA/TEST) antes de avançar o cartão!', 'error');
        return prevCards;
      }

      // UAT effort required
      if (colIndex >= uatDoneIndex && card.effortLeft.uat > 0) {
        showFeedback('❌ Definition of Done (DoD)', 'Termine a validação com o Cliente (UAT) antes de avançar o cartão!', 'error');
        return prevCards;
      }

      return prevCards.map(c => {
        if (c.id === cardId) {
          let updates = { columnId: toColumnId };
          
          // Track Start and Complete time for Lead Time metrics
          const startTrackingIndex = isAIMode ? 4 : 5; // Dev vs Ready-Dev
          const doneColId = isAIMode ? 'col-ai-done' : 'col-down-done';
          
          if (!c.startedAt && colIndex >= startTrackingIndex) {
            updates.startedAt = turn;
          }
          if (toColumnId === doneColId && !c.completedAt) {
            updates.completedAt = turn;
          }
          
          return { ...c, ...updates };
        }
        return c;
      });
    });
  };

  const applyEffort = (cardId, effortType, amount = 1) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    if (card.isBlocked) {
      showFeedback('🛑 Impedimento!', 'Você não pode trabalhar em um cartão bloqueado! Desbloqueie-o primeiro (Swarming).', 'error');
      return;
    }

    // Consume from capacity
    if (capacity[effortType] < amount) {
      showFeedback('🔋 Capacidade Esgotada', `A equipe de ${effortType.toUpperCase()} não possui mais horas disponíveis neste dia.\n\nAvance para o Próximo Dia para continuar fluindo!`, 'warning');
      return;
    }
    setCapacity(prev => ({ ...prev, [effortType]: prev[effortType] - amount }));

    // Apply to card
    setCards(prevCards => {
      return prevCards.map(c => {
        if (c.id === cardId) {
          const newEffortLeft = { ...c.effortLeft };
          newEffortLeft[effortType] = Math.max(0, newEffortLeft[effortType] - amount);
          return { ...c, effortLeft: newEffortLeft };
        }
        return c;
      });
    });
  };

  const cheatAdvanceCardsToDone = () => {
    setCards(prevCards => {
      let updatedCards = [...prevCards];
      const testCards = updatedCards.filter(c => c.columnId === 'col-down-ready-test');
      testCards.forEach(tc => {
        const index = updatedCards.findIndex(c => c.id === tc.id);
        updatedCards[index] = {
          ...updatedCards[index],
          columnId: 'col-down-done',
          effortLeft: { dev: 0, test: 0, uat: 0 },
          completedAt: turn
        };
      });
      return updatedCards;
    });
  };

  const autoPlayTurn = () => {
    setCards(prevCards => {
      let newCards = [...prevCards];
      
      const tryAdvance = (cardIndex, targetColumnId) => {
        const targetColumn = columns.find(c => c.id === targetColumnId);
        if (targetColumn && targetColumn.limit > 0) {
          const cardsInTarget = newCards.filter(c => c.columnId === targetColumnId).length;
          if (cardsInTarget >= targetColumn.limit) return; // Blocked by WIP limit
        }
        newCards[cardIndex] = { ...newCards[cardIndex], columnId: targetColumnId };
      };

      const tryPull = (sourceColumnId, targetColumnId) => {
        const targetColumn = columns.find(c => c.id === targetColumnId);
        if (!targetColumn) return;
        let cardsInTarget = newCards.filter(c => c.columnId === targetColumnId).length;
        const limit = targetColumn.limit > 0 ? targetColumn.limit : Infinity;
        
        if (cardsInTarget < limit) {
          const candidates = newCards.filter(c => c.columnId === sourceColumnId && !c.isBlocked);
          for (let c of candidates) {
            if (cardsInTarget >= limit) break;
            const index = newCards.findIndex(x => x.id === c.id);
            newCards[index] = { ...newCards[index], columnId: targetColumnId };
            cardsInTarget++;
          }
        }
      };

      // Pull phase
      tryPull('col-down-ready-dev', 'col-down-dev');
      tryPull('col-down-dev-done', 'col-down-ready-test');
      tryPull('col-down-ready-test', 'col-down-testing');
      tryPull('col-down-ready-homolog', 'col-down-val-po');
      tryPull('col-down-homologado', 'col-down-ready-install');

      // Effort phase
      let devCap = teamConfig.dev * 8;
      const devCards = newCards.filter(c => c.columnId === 'col-down-dev' && !c.isBlocked);
      devCards.forEach(c => {
        const index = newCards.findIndex(x => x.id === c.id);
        const needed = newCards[index].effortLeft.dev;
        const applied = Math.min(devCap, needed);
        if (applied > 0) {
          newCards[index] = { ...newCards[index], effortLeft: { ...newCards[index].effortLeft, dev: needed - applied } };
          devCap -= applied;
        }
        if (newCards[index].effortLeft.dev === 0) {
          tryAdvance(index, 'col-down-dev-done');
        }
      });

      let testCap = teamConfig.test * 8;
      const testCards = newCards.filter(c => c.columnId === 'col-down-testing' && !c.isBlocked);
      testCards.forEach(c => {
        const index = newCards.findIndex(x => x.id === c.id);
        const needed = newCards[index].effortLeft.test;
        const applied = Math.min(testCap, needed);
        if (applied > 0) {
          newCards[index] = { ...newCards[index], effortLeft: { ...newCards[index].effortLeft, test: needed - applied } };
          testCap -= applied;
        }
        if (newCards[index].effortLeft.test === 0) {
          tryAdvance(index, 'col-down-ready-homolog');
        }
      });

      let uatCap = teamConfig.uat * 8;
      const uatCards = newCards.filter(c => c.columnId === 'col-down-val-po' && !c.isBlocked);
      uatCards.forEach(c => {
        const index = newCards.findIndex(x => x.id === c.id);
        const needed = newCards[index].effortLeft.uat;
        const applied = Math.min(uatCap, needed);
        if (applied > 0) {
          newCards[index] = { ...newCards[index], effortLeft: { ...newCards[index].effortLeft, uat: needed - applied } };
          uatCap -= applied;
        }
        if (newCards[index].effortLeft.uat === 0) {
          tryAdvance(index, 'col-down-homologado');
        }
      });

      return newCards;
    });

    nextTurn();
  };

  const forceCompleteEffort = (cardId) => {
    setCards(prevCards => prevCards.map(c => 
      c.id === cardId ? { ...c, effortLeft: { dev: 0, test: 0, uat: 0 } } : c
    ));
  };

  const blockRandomCard = () => {
    const activeCards = cards.filter(c => 
      c.columnId.startsWith('col-down-') && 
      c.columnId !== 'col-down-done' && 
      !c.isBlocked
    );

    if (activeCards.length === 0) {
      showFeedback('ℹ️ Sem cartas', 'Não há nenhum cartão ativo no fluxo para bloquear no momento.', 'info');
      return;
    }

    const randomCard = activeCards[Math.floor(Math.random() * activeCards.length)];
    
    setCards(prev => prev.map(c => 
      c.id === randomCard.id ? { ...c, isBlocked: true } : c
    ));
    
    showFeedback('🛑 Impedimento Gerado!', `O cartão "${randomCard.title}" sofreu um impedimento crítico e foi bloqueado.\n\nA equipe deve fazer um Swarming (Enxame) para remover o impedimento o mais rápido possível!`, 'error');
  };

  const unblockCard = (cardId) => {
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isBlocked: false } : c
    ));
  };

  const simulateCustomerFeedback = () => {
    let approvedCount = 0;
    let rejectedCount = 0;
    const rejectedTitles = [];

    setCards(prevCards => {
      return prevCards.map(c => {
        const doneColId = isAIMode ? 'col-ai-done' : 'col-down-done';
        if (c.columnId === doneColId && !c.customerValidated) {
          // 20% chance of rejection
          const isRejected = Math.random() < 0.2;
          
          if (isRejected) {
            rejectedCount++;
            rejectedTitles.push(c.title);
            // Send back to backlog and mark as a bug/rework
            return { 
              ...c, 
              columnId: 'col-up-new', 
              startedAt: null,
              completedAt: null,
              title: `[RETRABALHO] ${c.title}`,
              effortLeft: { dev: c.effortTotal.dev || 1, test: c.effortTotal.test || 1, uat: c.effortTotal.uat || 1 }
            };
          } else {
            approvedCount++;
            return { ...c, customerValidated: true };
          }
        }
        return c;
      });
    });

    if (rejectedCount > 0) {
      showFeedback('😱 Cliente Rejeitou Entregas!', `O cliente não validou ${rejectedCount} cartão(ões) (${rejectedTitles.join(', ')}). O escopo estava incorreto e eles voltaram para o Backlog como retrabalho!`, 'error');
    } else if (approvedCount > 0) {
      showFeedback('🎉 Sucesso na Demo!', `O cliente adorou as ${approvedCount} entregas! Valor gerado com sucesso.`, 'info');
    } else {
      showFeedback('ℹ️ Sem Entregas Novas', 'Não há cartões não-validados na coluna de Deploy para apresentar.', 'info');
    }

    return { approvedCount, rejectedCount };
  };

  return (
    <GameContext.Provider value={{
      columns,
      cards: cards.map(c => ({ ...c, aiSuggestion: null })),
      turn,
      capacity,
      teamConfig,
      feedback,
      history,
      dailyStep,
      isAIMode,
      startDaily,
      nextDailyStep,
      prevDailyStep,
      stopDaily,
      showFeedback,
      closeFeedback,
      moveCard,
      applyEffort,
      nextTurn,
      unblockCard,
      updateTeamConfig,
      resetGame,
      autoPlayTurn,
      cheatAdvanceCardsToDone
    }}>
      {children}
    </GameContext.Provider>
  );
};

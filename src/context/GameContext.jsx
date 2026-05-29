import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialColumns, initialCards } from '../utils/initialState';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const [turn, setTurn] = useState(1);
  const [teamConfig, setTeamConfig] = useState({ dev: 2, test: 1, uat: 1 });
  const [capacity, setCapacity] = useState({ dev: 16, test: 8, uat: 8 });
  const [history, setHistory] = useState([]); // For CFD metrics
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (title, message, type = 'error') => {
    setFeedback({ title, message, type });
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
    // Record CFD snapshot before moving to next day
    const snapshot = { turn };
    columns.forEach(col => {
      snapshot[col.id] = cards.filter(c => c.columnId === col.id).length;
    });
    setHistory(prev => [...prev, snapshot]);
    
    // Update active vs wait times for flow efficiency
    setCards(prevCards => prevCards.map(c => {
      if (c.startedAt && !c.completedAt) {
        const col = columns.find(col => col.id === c.columnId);
        if (col && col.role === 'active') {
          return { ...c, activeTime: c.activeTime + 1 };
        } else if (col && (col.role === 'queue' || col.role === 'done')) {
          return { ...c, waitTime: c.waitTime + 1 };
        }
      }
      return c;
    }));

    setTurn(prev => prev + 1);
    setCapacity({
      dev: teamConfig.dev * 8,
      test: teamConfig.test * 8,
      uat: teamConfig.uat * 8
    }); // Recharge capacity for the new day
  };

  const resetGame = () => {
    setColumns(initialColumns);
    setCards(initialCards);
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
    const card = cards.find(c => c.id === cardId);
    if (!card || card.columnId === toColumnId) return;

    if (card.isBlocked) {
      showFeedback(
        '🛑 Cartão Impedido!', 
        'Você não pode mover um cartão bloqueado. Pela regra do Kanban, ele deve continuar onde está e consumir o Limite de WIP para gerar "dor" no time. Façam um Swarming para resolver o impedimento antes de continuar!', 
        'error'
      );
      return;
    }

    const targetColumn = columns.find(c => c.id === toColumnId);
    if (!targetColumn) return;

    // Rule 1: WIP Limit (Expedite ignores this)
    if (targetColumn.limit > 0 && card.type !== 'urgente') {
      const cardsInTarget = cards.filter(c => c.columnId === toColumnId).length;
      if (cardsInTarget >= targetColumn.limit) {
        showFeedback(
          '⚠️ Pare de começar e comece a terminar!',
          `Puxar este cartão violaria a capacidade máxima da coluna "${targetColumn.title}" (WIP Limit: ${targetColumn.limit}).\n\nNo Kanban, limitamos o Trabalho em Progresso para criar um Sistema Puxado. Ajude seus colegas a terminar o que já está na coluna em vez de puxar coisas novas!`,
          'warning'
        );
        return;
      }
    }

    // Rule 2: Effort completion
    const colIndex = columns.findIndex(c => c.id === toColumnId);
    const devDoneIndex = columns.findIndex(c => c.id === 'col-dev-done');
    const qaDoneIndex = columns.findIndex(c => c.id === 'col-qa-done');
    const uatDoneIndex = columns.findIndex(c => c.id === 'col-uat-done');
    
    if (colIndex >= devDoneIndex && card.effortLeft.dev > 0) {
      showFeedback('❌ Definition of Done (DoD)', 'Termine o esforço de Desenvolvimento (DEV) antes de avançar o cartão para a próxima etapa!', 'error');
      return;
    }

    if (colIndex >= qaDoneIndex && card.effortLeft.test > 0) {
      showFeedback('❌ Definition of Done (DoD)', 'Termine o esforço de Qualidade (QA/TEST) antes de avançar o cartão para a próxima etapa!', 'error');
      return;
    }

    if (colIndex >= uatDoneIndex && card.effortLeft.uat > 0) {
      showFeedback('❌ Definition of Done (DoD)', 'Termine a validação com o Cliente (UAT) antes de avançar o cartão para a próxima etapa!', 'error');
      return;
    }

    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        let updates = { columnId: toColumnId };
        
        // Track Start and Complete time for Lead Time metrics
        if (!c.startedAt && toColumnId !== 'col-backlog' && toColumnId !== 'col-selected') {
          updates.startedAt = turn;
        }
        if (toColumnId === 'col-deploy' && !c.completedAt) {
          updates.completedAt = turn;
        }
        
        return { ...c, ...updates };
      }
      return c;
    }));
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
      showFeedback('🔋 Capacidade Esgotada', `A equipe de ${effortType.toUpperCase()} não possui mais horas disponíveis neste dia.\n\nLembre-se: horas importam menos que eficiência. Avance para o Próximo Dia para continuar fluindo!`, 'warning');
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

  const blockRandomCard = () => {
    const activeCards = cards.filter(c => 
      c.columnId !== 'col-backlog' && 
      c.columnId !== 'col-deploy' && 
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

  const value = {
    columns,
    cards,
    turn,
    capacity,
    teamConfig,
    history,
    feedback,
    showFeedback,
    closeFeedback,
    nextTurn,
    moveCard,
    applyEffort,
    resetGame,
    blockRandomCard,
    unblockCard,
    updateTeamConfig
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

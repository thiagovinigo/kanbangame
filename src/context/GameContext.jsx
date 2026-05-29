import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialColumns, initialCards } from '../utils/initialState';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const [turn, setTurn] = useState(1);
  const [diceRoll, setDiceRoll] = useState({ dev: 0, test: 0, uat: 0 });
  const [history, setHistory] = useState([]); // For CFD metrics

  // Auto-roll dice on first render if turn === 1 and all dice are 0
  useEffect(() => {
    if (turn === 1 && diceRoll.dev === 0 && diceRoll.test === 0 && diceRoll.uat === 0) {
      rollDice();
    }
  }, []);
  
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
    setDiceRoll({ dev: 0, test: 0, uat: 0 }); // Reset dice for the new day
  };

  const resetGame = () => {
    setColumns(initialColumns);
    setCards(initialCards);
    setTurn(1);
    setDiceRoll({ dev: 0, test: 0, uat: 0 });
    setHistory([]);
  };

  const rollDice = () => {
    // Simulate team capacity for the day
    const devCapacity = Math.floor(Math.random() * 6) + 1; // 1-6
    const testCapacity = Math.floor(Math.random() * 4) + 1; // 1-4
    const uatCapacity = Math.floor(Math.random() * 3) + 1; // 1-3
    setDiceRoll({ dev: devCapacity, test: testCapacity, uat: uatCapacity });
  };

  const moveCard = (cardId, toColumnId) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.columnId === toColumnId) return;

    const targetColumn = columns.find(c => c.id === toColumnId);
    if (!targetColumn) return;

    // Rule 1: WIP Limit (Expedite ignores this)
    if (targetColumn.limit > 0 && card.type !== 'urgente') {
      const cardsInTarget = cards.filter(c => c.columnId === toColumnId).length;
      if (cardsInTarget >= targetColumn.limit) {
        alert(`Não é possível mover. A coluna "${targetColumn.title}" atingiu seu limite (WIP Limit). Apenas cartões "Urgente" podem ignorar este limite.`);
        return;
      }
    }

    // Rule 2: Effort completion
    const colIndex = columns.findIndex(c => c.id === toColumnId);
    const devDoneIndex = columns.findIndex(c => c.id === 'col-dev-done');
    const qaDoneIndex = columns.findIndex(c => c.id === 'col-qa-done');
    const uatDoneIndex = columns.findIndex(c => c.id === 'col-uat-done');
    
    if (colIndex >= devDoneIndex && card.effortLeft.dev > 0) {
      alert("Termine o esforço de Desenvolvimento (DEV) antes de avançar o cartão!");
      return;
    }

    if (colIndex >= qaDoneIndex && card.effortLeft.test > 0) {
      alert("Termine o esforço de Qualidade (QA/TEST) antes de avançar o cartão!");
      return;
    }

    if (colIndex >= uatDoneIndex && card.effortLeft.uat > 0) {
      alert("Termine a validação com o Cliente (UAT) antes de avançar o cartão!");
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

  const applyEffort = (cardId, type) => {
    // type is 'dev' or 'test'
    if (diceRoll[type] <= 0) return; // No capacity left
    
    setCards(prev => prev.map(card => {
      if (card.id === cardId && card.effortLeft[type] > 0) {
        return {
          ...card,
          effortLeft: {
            ...card.effortLeft,
            [type]: card.effortLeft[type] - 1
          }
        };
      }
      return card;
    }));
    
    setDiceRoll(prev => ({
      ...prev,
      [type]: prev[type] - 1
    }));
  };

  const value = {
    columns,
    cards,
    turn,
    diceRoll,
    history,
    nextTurn,
    rollDice,
    moveCard,
    applyEffort,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

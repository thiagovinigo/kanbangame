import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';

export const useAutoSimulation = ({
  setIsReplenishmentOpen,
  setIsDailyOpen,
  setIsDemoOpen,
  setIsRetroOpen
}) => {
  const { cards, moveCard, applyEffort, forceCompleteEffort, cheatAdvanceCardsToDone, nextTurn, blockRandomCard, unblockCard, startDaily, stopDaily } = useGame();
  
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState('');
  
  // Script sequence
  const script = [
    {
      msg: "Bem-vindo à simulação guiada! O objetivo do Kanban é fazer o trabalho fluir da esquerda para a direita. Vamos começar fazendo um Replenishment (Reabastecimento) para puxar opções do Upstream para o time de entrega.",
      action: () => {
        setIsReplenishmentOpen(true);
      }
    },
    {
      msg: "O PO selecionou as opções mais prioritárias e as moveu para o Ponto de Comprometimento (Pronto para Desenvolvimento).",
      action: () => {
        setIsReplenishmentOpen(false);
        // Move cards from col-up-ready to col-down-ready-dev
        const readyCards = cards.filter(c => c.columnId === 'col-up-ready');
        readyCards.slice(0, 3).forEach(c => moveCard(c.id, 'col-down-ready-dev'));
      }
    },
    {
      msg: "Agora os Desenvolvedores vão puxar essas tarefas para a coluna 'Em Desenvolvimento' (respeitando o limite de WIP de 2) e começar a trabalhar nelas. O relógio do Lead Time começou a contar!",
      action: () => {
        const devCards = cards.filter(c => c.columnId === 'col-down-ready-dev');
        devCards.slice(0, 2).forEach(c => moveCard(c.id, 'col-down-dev'));
      }
    },
    {
      msg: "Trabalhando... (O tempo passa, os Devs reduzem o esforço necessário nos cartões para zero).",
      action: () => {
        const activeDev = cards.filter(c => c.columnId === 'col-down-dev');
        activeDev.forEach(c => forceCompleteEffort(c.id));
        nextTurn();
      }
    },
    {
      msg: "Fim do primeiro dia! As tarefas avançaram, mas ops... um servidor caiu e gerou um impedimento crítico em um dos cartões!",
      action: () => {
        blockRandomCard();
      }
    },
    {
      msg: "É hora da Reunião Diária (Kanban Meeting). O foco do time não é no que cada um fez, mas sim nos cartões bloqueados. Da direita para a esquerda!",
      action: () => {
        setIsDailyOpen(true);
      }
    },
    {
      msg: "Na Daily, o time decide fazer um 'Swarming' (Enxame). Todos param de puxar coisas novas e ajudam a remover o bloqueio juntos. Cartão desbloqueado e movido para testes!",
      action: () => {
        setIsDailyOpen(false);
        stopDaily();
        const blockedCard = cards.find(c => c.isBlocked);
        if (blockedCard) unblockCard(blockedCard.id);
        
        const doneDev = cards.filter(c => c.columnId === 'col-down-dev');
        doneDev.forEach(c => {
          moveCard(c.id, 'col-down-dev-done');
          moveCard(c.id, 'col-down-ready-test');
        });
      }
    },
    {
      msg: "O trabalho fluiu rápido! O QA testou, o PO homologou, e as tarefas chegaram em Produção (Deploy). Vamos fazer a Reunião de Demonstração (Review) com os clientes.",
      action: () => {
        cheatAdvanceCardsToDone();
        nextTurn();
        setIsDemoOpen(true);
      }
    },
    {
      msg: "Os clientes adoraram! Para fechar o ciclo de feedback, vamos olhar para as nossas métricas de Fluxo na Retrospectiva (Service Delivery Review) para descobrir nosso gargalo e melhorar para a próxima semana.",
      action: () => {
        setIsDemoOpen(false);
        setIsRetroOpen(true);
      }
    },
    {
      msg: "Fim da simulação! Você viu na prática como os cartões entram pelo Replenishment, são destravados na Daily e validados na Demo. Jogue manualmente agora para sentir os Limites de WIP na pele!",
      action: () => {
        setIsRetroOpen(false);
      }
    }
  ];

  const totalSteps = script.length;

  const startSimulation = () => {
    setIsActive(true);
    setStepIndex(1);
    setMessage(script[0].msg);
    script[0].action();
  };

  const nextStep = () => {
    if (stepIndex >= totalSteps) {
      stopSimulation();
      return;
    }
    
    // Using a setTimeout hack to ensure GameContext updates are fresh before the next action reads them
    // but React batches. Ideally, the script actions that read 'cards' will read stale state if we aren't careful.
    // We will execute the action, which sets states.
    script[stepIndex].action();
    setMessage(script[stepIndex].msg);
    setStepIndex(stepIndex + 1);
  };

  const stopSimulation = () => {
    setIsActive(false);
    setStepIndex(0);
    setMessage('');
    setIsReplenishmentOpen(false);
    setIsDailyOpen(false);
    setIsDemoOpen(false);
    setIsRetroOpen(false);
  };

  return {
    isActive,
    stepIndex,
    totalSteps,
    message,
    startSimulation,
    nextStep,
    stopSimulation
  };
};

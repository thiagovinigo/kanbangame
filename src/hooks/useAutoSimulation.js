import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useKanbanQuiz } from './useKanbanQuiz';

export const useAutoSimulation = ({
  setIsReplenishmentOpen,
  setIsDailyOpen,
  setIsDemoOpen,
  setIsRetroOpen
}) => {
  const { cards, columns, capacity, moveCard, applyEffort, nextTurn, blockRandomCard, unblockCard } = useGame();
  const { generateQuiz } = useKanbanQuiz();
  
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [isEndOfDay, setIsEndOfDay] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const startSimulation = () => {
    setIsActive(true);
    setIsEndOfDay(false);
    setCurrentQuiz(null);
    setMessage("Bem-vindo à simulação dinâmica! O motor Kanban analisará o quadro e tomará a próxima decisão lógica (Puxar, Trabalhar, ou Avançar Fila). Clique em 'Avançar Simulação' para observar o time trabalhando.");
  };

  const handleStartQuiz = (type) => {
    const quiz = generateQuiz(type, cards, columns);
    setCurrentQuiz({ ...quiz, showFeedback: false });
  };

  const handleAnswerQuiz = (option) => {
    if (!currentQuiz) return;
    setCurrentQuiz({
      ...currentQuiz,
      showFeedback: true,
      isCorrect: option.isCorrect,
      feedbackMsg: option.feedback
    });
  };

  const handleNext = (clearQuiz = false) => {
    if (clearQuiz === true && currentQuiz && currentQuiz.isCorrect) {
      setCurrentQuiz(null);
      setIsEndOfDay(false);
      return;
    }
    nextStep();
  };

  const nextStep = () => {
    if (!isActive) return;
    setIsEndOfDay(false);

    // 1. Tentar desbloquear impedimentos
    const blockedCard = cards.find(c => c.isBlocked);
    if (blockedCard) {
      unblockCard(blockedCard.id);
      setMessage(`🔥 SWARMING: A equipe parou de puxar tarefas novas e fez um enxame para resolver o impedimento crítico do cartão '${blockedCard.title}'!`);
      return;
    }

    // 2. Tentar EMPURRAR
    const doneUat = cards.find(c => c.columnId === 'col-down-val-po' && c.effortLeft.uat === 0);
    if (doneUat) {
      moveCard(doneUat.id, 'col-down-homologado');
      setMessage(`✅ ENTREGA: O PO validou '${doneUat.title}'. O cartão foi movido para a fila de 'Homologado' e está pronto para Produção!`);
      return;
    }

    const doneTest = cards.find(c => c.columnId === 'col-down-testing' && c.effortLeft.test === 0);
    if (doneTest) {
      moveCard(doneTest.id, 'col-down-ready-homolog');
      setMessage(`🧪 QA: A equipe de Qualidade finalizou os testes do cartão '${doneTest.title}' e o empurrou para a fila 'Ready to Homologação'.`);
      return;
    }

    const doneDev = cards.find(c => c.columnId === 'col-down-dev' && c.effortLeft.dev === 0);
    if (doneDev) {
      moveCard(doneDev.id, 'col-down-dev-done');
      setMessage(`💻 DEV FINALIZADO: Os Desenvolvedores concluíram a codificação de '${doneDev.title}' e o empurraram para a fila de espera do QA.`);
      return;
    }

    const inDevDone = cards.find(c => c.columnId === 'col-down-dev-done');
    if (inDevDone) {
      const targetCol = columns.find(c => c.id === 'col-down-ready-test');
      const count = cards.filter(c => c.columnId === 'col-down-ready-test').length;
      if (count < targetCol.limit) {
        moveCard(inDevDone.id, 'col-down-ready-test');
        setMessage(`📦 FLUXO: O cartão '${inDevDone.title}' foi repassado da fila de dependência para a fila oficial de Testes.`);
        return;
      }
    }

    // 3. Tentar PUXAR
    const valPoCount = cards.filter(c => c.columnId === 'col-down-val-po').length;
    if (valPoCount < 1) {
      const readyHomolog = cards.find(c => c.columnId === 'col-down-ready-homolog');
      if (readyHomolog) {
        moveCard(readyHomolog.id, 'col-down-val-po');
        setMessage(`📥 SISTEMA PUXADO (PULL): O PO estava ocioso e PUXOU o cartão '${readyHomolog.title}' da fila para iniciar a Homologação.`);
        return;
      }
    }

    const qaCount = cards.filter(c => c.columnId === 'col-down-testing').length;
    if (qaCount < 1) {
      const readyTest = cards.find(c => c.columnId === 'col-down-ready-test');
      if (readyTest) {
        moveCard(readyTest.id, 'col-down-testing');
        setMessage(`📥 SISTEMA PUXADO (PULL): A equipe de QA viu que havia vagas no seu WIP limit e PUXOU '${readyTest.title}' para Testar.`);
        return;
      }
    }

    const devCount = cards.filter(c => c.columnId === 'col-down-dev').length;
    if (devCount < 2) {
      const readyDev = cards.find(c => c.columnId === 'col-down-ready-dev');
      if (readyDev) {
        moveCard(readyDev.id, 'col-down-dev');
        setMessage(`📥 SISTEMA PUXADO (PULL): Um Desenvolvedor ficou livre e PUXOU '${readyDev.title}' do Ponto de Comprometimento para começar a codificar.`);
        return;
      }
    }

    // 4. Tentar PUXAR do UPSTREAM
    const commitCount = cards.filter(c => c.columnId === 'col-down-ready-dev').length;
    if (commitCount < 3) {
      const readyUpstream = cards.find(c => c.columnId === 'col-up-ready');
      if (readyUpstream) {
        moveCard(readyUpstream.id, 'col-down-ready-dev');
        setMessage(`🔄 REPLENISHMENT: A fila de Dev esvaziou! O PO abasteceu o Ponto de Comprometimento puxando '${readyUpstream.title}' do Upstream.`);
        return;
      } else {
        const upNew = cards.find(c => c.columnId === 'col-up-new');
        if (upNew) {
          moveCard(upNew.id, 'col-up-ref-funcional');
          moveCard(upNew.id, 'col-up-ref-tecnico');
          moveCard(upNew.id, 'col-up-aprovacao-po');
          moveCard(upNew.id, 'col-up-ready');
          setMessage(`🧠 UPSTREAM: Uma nova ideia ('${upNew.title}') foi refinada pelo time de Negócios e está pronta para entrar no fluxo de Delivery!`);
          return;
        }
      }
    }

    // 5. Aplicar Esforço
    let effortApplied = false;
    let msgs = [];
    
    const uatActive = cards.filter(c => c.columnId === 'col-down-val-po');
    if (uatActive.length > 0 && capacity.uat > 0) {
      const amount = Math.min(capacity.uat, uatActive[0].effortLeft.uat, 8);
      if (amount > 0) {
        applyEffort(uatActive[0].id, 'uat', amount);
        msgs.push(`PO (${amount}h em '${uatActive[0].title.substring(0,10)}...')`);
        effortApplied = true;
      }
    }

    const qaActive = cards.filter(c => c.columnId === 'col-down-testing');
    if (qaActive.length > 0 && capacity.test > 0) {
      const amount = Math.min(capacity.test, qaActive[0].effortLeft.test, 8);
      if (amount > 0) {
        applyEffort(qaActive[0].id, 'test', amount);
        msgs.push(`QA (${amount}h em '${qaActive[0].title.substring(0,10)}...')`);
        effortApplied = true;
      }
    }

    const devActive = cards.filter(c => c.columnId === 'col-down-dev');
    if (devActive.length > 0 && capacity.dev > 0) {
      for (let c of devActive) {
         if (capacity.dev <= 0) break;
         const amount = Math.min(capacity.dev, c.effortLeft.dev, 8);
         if (amount > 0) {
           applyEffort(c.id, 'dev', amount);
           msgs.push(`DEV (${amount}h em '${c.title.substring(0,10)}...')`);
           effortApplied = true;
         }
      }
    }

    if (effortApplied) {
      setMessage(`⏳ TRABALHANDO: O tempo está passando e a equipe está alocando esforço nas tarefas...\n👉 ${msgs.join(' | ')}`);
      if (Math.random() > 0.85) {
        blockRandomCard();
        setMessage(`⚠️ TRABALHO E IMPEDIMENTO! A equipe aplicou esforço, MAS um servidor caiu e bloqueou um cartão ativo! A próxima ação deve ser um Swarming.`);
      }
      return;
    }

    // 6. Fim do dia
    const totalDone = cards.filter(c => c.columnId === 'col-down-done').length;
    if (totalDone === cards.length) {
      setMessage(`🎉 SIMULAÇÃO CONCLUÍDA! Todos os cartões chegaram em Produção.`);
      setIsEndOfDay(true);
      return;
    }

    nextTurn();
    setMessage(`🌙 FIM DO DIA! A capacidade diária esgotou ou todos ficaram ociosos. Aproveite o fim do dia para rodar as Cerimônias e testar seu conhecimento!`);
    setIsEndOfDay(true);
  };

  const stopSimulation = () => {
    setIsActive(false);
    setMessage('');
    setIsEndOfDay(false);
    setCurrentQuiz(null);
  };

  return {
    isActive,
    message,
    isEndOfDay,
    currentQuiz,
    startSimulation,
    nextStep: handleNext,
    stopSimulation,
    handleStartQuiz,
    handleAnswerQuiz
  };
};

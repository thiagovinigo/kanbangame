import { useCallback } from 'react';

export const useKanbanQuiz = () => {
  const generateQuiz = useCallback((type, cards, columns) => {
    switch (type) {
      case 'daily':
        return generateDailyQuiz(cards);
      case 'replenishment':
        return generateReplenishmentQuiz(cards, columns);
      case 'demo':
        return generateDemoQuiz(cards);
      case 'retro':
        return generateRetroQuiz(cards);
      default:
        return null;
    }
  }, []);

  const generateDailyQuiz = (cards) => {
    // 1. Prioritize Blocked cards
    const blockedCard = cards.find(c => c.isBlocked);
    if (blockedCard) {
      return {
        question: `Na Daily, andando o quadro da Direita para a Esquerda, notamos que o cartão '${blockedCard.title}' está BLOQUEADO. Qual deve ser o foco da discussão sobre ele?`,
        options: [
          { id: 'a', text: 'Perguntar quem foi o culpado pelo bloqueio para responsabilizá-lo.', isCorrect: false, feedback: 'O Kanban foca no processo, não em culpar pessoas.' },
          { id: 'b', text: 'Entender o motivo do impedimento e combinar quem vai fazer o Swarming para desbloquear o quanto antes.', isCorrect: true, feedback: 'Perfeito! O foco da Daily no Kanban é remover impedimentos para fazer o trabalho voltar a fluir.' },
          { id: 'c', text: 'Ignorar o cartão bloqueado e pedir para a equipe puxar novas tarefas do Backlog para não ficarem parados.', isCorrect: false, feedback: 'Isso violaria o limite de WIP e geraria mais gargalo! Pare de começar e comece a terminar.' }
        ]
      };
    }

    // 2. Find the right-most active card
    const activeCols = ['col-down-val-po', 'col-down-testing', 'col-down-dev'];
    for (let col of activeCols) {
      const activeCard = cards.find(c => c.columnId === col);
      if (activeCard) {
        return {
          question: `Andando o quadro da Direita para a Esquerda, paramos no cartão '${activeCard.title}'. Como a equipe deve relatar o status na Daily?`,
          options: [
            { id: 'a', text: 'Dizer: "Ontem eu trabalhei nisso e hoje vou continuar trabalhando nisso".', isCorrect: false, feedback: 'Isso é foco na pessoa. A Daily do Kanban é focada no fluxo do cartão!' },
            { id: 'b', text: `Dizer: "Para que o cartão '${activeCard.title}' avance para a próxima etapa amanhã, precisamos fazer X e Y."`, isCorrect: true, feedback: 'Exato! O foco é o cartão e o que falta para ele fluir para a direita.' },
            { id: 'c', text: 'O líder do time deve dizer o que cada um vai fazer naquele cartão hoje.', isCorrect: false, feedback: 'Kanban é um sistema puxado e auto-gerenciado, o líder não dita tarefas (Push).' }
          ]
        };
      }
    }

    return {
      question: `Não há cartões ativos no quadro! Qual a pauta da Daily de hoje?`,
      options: [
        { id: 'a', text: 'Cancelar a Daily, não tem o que falar.', isCorrect: false, feedback: 'A Daily também serve para discutir gargalos (falta de trabalho no sistema).' },
        { id: 'b', text: 'Discutir por que o sistema está vazio (Starvation) e puxar novos itens no Replenishment.', isCorrect: true, feedback: 'Correto! Ficar sem trabalho (Starvation) é um problema grave de fluxo que deve ser discutido.' }
      ]
    };
  };

  const generateReplenishmentQuiz = (cards, columns) => {
    const readyDevCol = columns.find(c => c.id === 'col-down-ready-dev');
    const currentCount = cards.filter(c => c.columnId === 'col-down-ready-dev').length;
    const availableSlots = readyDevCol.limit - currentCount;

    if (availableSlots > 0) {
      return {
        question: `Temos ${availableSlots} vaga(s) no Ponto de Comprometimento (Ready for Dev). O que devemos considerar ao puxar os próximos cartões do Upstream?`,
        options: [
          { id: 'a', text: 'Puxar os cartões mais fáceis e rápidos primeiro para entregar quantidade.', isCorrect: false, feedback: 'Quantidade não significa valor. Cuidado para não gerar falsas métricas de throughput.' },
          { id: 'b', text: 'Priorizar com base nas Classes de Serviço (ex: Urgentes primeiro, Data Fixa, e equilibrar o resto) mitigando riscos.', isCorrect: true, feedback: 'Isso mesmo! O Replenishment usa políticas explícitas e classes de serviço para decidir o que puxar.' },
          { id: 'c', text: 'Puxar tudo que o cliente pediu, ignorando o limite de WIP para mostrar serviço.', isCorrect: false, feedback: 'Empurrar trabalho ignora a capacidade do time e gera sobrecarga. É um Sistema Puxado!' }
        ]
      };
    }

    return {
      question: `O Ponto de Comprometimento já atingiu seu Limite de WIP (${readyDevCol.limit}). O que o PO deve fazer?`,
      options: [
        { id: 'a', text: 'Desrespeitar o limite de WIP e colocar mais cartões porque o cliente está com pressa.', isCorrect: false, feedback: 'Isso causaria sobrecarga e violaria a Lei de Little (Lead Time vai explodir).' },
        { id: 'b', text: 'Aguardar a equipe de Delivery puxar os cartões atuais e liberar vagas no limite de WIP.', isCorrect: true, feedback: 'Exato! O limite de WIP protege o sistema contra a sobrecarga.' }
      ]
    };
  };

  const generateDemoQuiz = (cards) => {
    const doneCards = cards.filter(c => c.columnId === 'col-down-done');
    if (doneCards.length > 0) {
      return {
        question: `Temos ${doneCards.length} cartão(ões) em DONE! Durante a Reunião de Review (Demonstração), qual é o objetivo principal?`,
        options: [
          { id: 'a', text: 'Apenas apresentar os cartões concluídos e colher feedback do cliente sobre o valor gerado.', isCorrect: true, feedback: 'Correto! É o momento de alinhar expectativas e confirmar se entregamos valor ao negócio.' },
          { id: 'b', text: 'Apresentar a velocidade do time e prometer o dobro de entregas para a próxima semana.', isCorrect: false, feedback: 'Promessas baseadas em velocidade não são o objetivo do fluxo Kanban.' },
          { id: 'c', text: 'Apontar dedos para quem demorou demais para entregar as funcionalidades.', isCorrect: false, feedback: 'Comportamento anti-ágil. A culpa é do processo e do fluxo, não das pessoas.' }
        ]
      };
    }
    return {
      question: `Chegou a hora da Review, mas não temos cartões em DONE. O que fazer?`,
      options: [
        { id: 'a', text: 'Cancelar a reunião e esconder o problema do cliente.', isCorrect: false, feedback: 'Transparência é fundamental.' },
        { id: 'b', text: 'Mostrar as métricas de fluxo, explicar onde estão os gargalos e alinhar novas previsões (Forecast) baseadas no Lead Time.', isCorrect: true, feedback: 'Perfeito! Mesmo sem entregas, gerenciamos expectativas através de previsões estatísticas (Lead Time).' }
      ]
    };
  };

  const generateRetroQuiz = (cards) => {
    return {
      question: `Na Retrospectiva (Service Delivery Review - SDR), qual a principal ferramenta que o time Kanban utiliza para melhorar o processo?`,
      options: [
        { id: 'a', text: 'Sentimentos individuais e votação de quem trabalhou mais no time.', isCorrect: false, feedback: 'O Kanban foca em fatos, métricas e melhoria evolutiva, não apenas sentimentos.' },
        { id: 'b', text: 'Analisar o CFD, Lead Time, Cycle Time e Throughput para identificar gargalos e ajustar limites de WIP.', isCorrect: true, feedback: 'Exatamente! O Kanban é gerenciamento quantitativo.' },
        { id: 'c', text: 'Cobrar que todos trabalhem mais horas na próxima semana para aumentar a velocidade (Velocity).', isCorrect: false, feedback: 'Horas extras mascaram os problemas reais do sistema.' }
      ]
    };
  };

  return { generateQuiz };
};

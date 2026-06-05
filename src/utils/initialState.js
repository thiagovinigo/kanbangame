import { v4 as uuidv4 } from 'uuid';

export const initialColumns = [
  // --- UPSTREAM ---
  { 
    id: 'col-up-new', 
    title: '[UP] New', 
    limit: 0, 
    role: 'queue', 
    policy: `📥 BACKLOG — Política de Entrada e Gestão
Qualquer pessoa pode sugerir. PO decide se entra via canal definido (formulário, Slack #ideias, sessão de discovery).
Itens no backlog NÃO têm compromisso de entrega — são opções, não promessas.
PO revisa e reprioriza a cada replenishment. Itens sem priorização por 60 dias são arquivados.
Tamanho não é obrigatório no backlog — só no refinamento.
Classe de Serviço deve ser definida pelo PO ao adicionar o item.` 
  },
  { 
    id: 'col-up-ref-funcional', 
    title: '[UP] Refinamento de Negócio', 
    limit: 4, 
    role: 'queue', 
    policy: `🔍 REFINAMENTO DE NEGÓCIO — Entrada e Saída
ENTRADA: Item selecionado pelo PO. WIP máximo: 4 itens.
SAÍDA (DoR): Problema descrito do ponto de vista do usuário.
SAÍDA: Critérios de aceite claros, objetivos e testáveis.
SAÍDA: Tamanho definido (P/M/G). Se G, o item DEVE ser quebrado antes de sair.
SAÍDA: Dependências mapeadas e acordadas com times envolvidos.
SAÍDA: Mockup ou protótipo disponível (para features com UX).
SAÍDA: Acesso a dados necessários confirmado.
SAÍDA: Classe de Serviço definida pelo PO.
Itens que não cumprem DoR após 2 ciclos voltam ao backlog com nota explicando o bloqueio.
Refinamento é feito pelo time + PO no replenishment — nunca por uma pessoa sozinha.` 
  },
  { 
    id: 'col-up-ref-tecnico', 
    title: '[UP] Refinamento Técnico', 
    limit: 0, 
    role: 'queue', 
    policy: `🔧 REFINAMENTO TÉCNICO — Política específica de Engenharia
QUANDO: Após o refinamento de negócio e antes do item entrar em "Pronto para Puxar". Pode ser em sessão dedicada ou durante o replenishment, dependendo da complexidade.
QUEM: Engenheiros (obrigatório) + Tech Lead + PO (para esclarecimento de contexto — não para decisões técnicas).
OBJETIVO: Alinhar a abordagem técnica, identificar riscos de implementação e garantir que o time sabe COMO construir — não só O QUÊ.
ENTRADA: Item aprovado no refinamento de negócio (DoR de negócio cumprido).
SAÍDA (DoR Técnico): Abordagem técnica acordada pelo time.
SAÍDA: Riscos técnicos identificados e mitigação definida.
SAÍDA: Dependências técnicas mapeadas (APIs, banco de dados, serviços externos).
SAÍDA: Decisão de arquitetura documentada (se relevante — não para itens P simples).
SAÍDA: Critérios técnicos de aceite adicionados ao item (ex: cobertura de testes mínima, SLA de performance, requisito de segurança).
SAÍDA: Tamanho técnico confirmado — se após análise o item é maior que o esperado, volta para quebrar.
SPIKES: Se a abordagem não está clara, cria-se um spike com time box máximo definido (ex: 1 dia). O spike precede o item no board.
DURAÇÃO: Máximo 30 min para itens P/M. Itens G que precisam de mais de 30 min devem ser quebrados primeiro.
NÃO é o momento de escrever código ou resolver o problema — é o momento de alinhar a estratégia de solução.
DOCUMENTAÇÃO MÍNIMA: Uma frase descrevendo a abordagem técnica escolhida + principais riscos. Não precisa ser extensa.` 
  },
  { 
    id: 'col-up-aprovacao-po', 
    title: '[UP] Aprovação PO', 
    limit: 0, 
    role: 'queue', 
    policy: `Etapa de validação final antes de ir para a fila de Replenishment.\nPO confirma se o item cumpre todos os DoRs de negócio e técnico.` 
  },
  { 
    id: 'col-up-ready', 
    title: '[UP] Pronto para Replenishment', 
    limit: 4, 
    role: 'queue', 
    policy: `Ponto final do Upstream. Aguardando a Reunião de Replenishment.\nOs itens aqui estão totalmente refinados e apenas aguardam capacidade no Downstream.` 
  },

  // --- DOWNSTREAM ---
  { 
    id: 'col-down-ready-dev', 
    title: '[DOWN] Pronto para Desenvolvimento', 
    limit: 5, 
    role: 'queue', 
    policy: `✅ PRONTO PARA PUXAR — 🎯 Commitment Point
⚠️ COMMITMENT POINT: Quando um item entra aqui, o time se compromete a entregá-lo.
WIP máximo: 5 itens. Limiar de reposição: quando cai para 2 → acionar replenishment.
Ordem FIFO dentro de cada Classe de Serviço. Expedite sempre na frente.
Nenhum item entra aqui sem cumprir o DoR de negócio E o DoR técnico. Sem exceção.
A data de entrada é registrada — inicia a contagem do lead time comprometido.` 
  },
  { 
    id: 'col-down-dev', 
    title: '[DOWN] Em Desenvolvimento', 
    limit: 3, 
    role: 'active', 
    policy: `🔨 EM PROGRESSO — Política de Execução
WIP máximo: 3 itens. Nenhum novo item começa se WIP está no limite.
PULL: Qualquer pessoa puxa o item de maior prioridade disponível — não é atribuição.
Se uma pessoa está sem item: deve ajudar a desbloquear antes de puxar novo.
EXPEDITE LANE: máximo 1 item. Prioridade absoluta. Todos param para resolver.
Item bloqueado: movido para "Bloqueado" em até 2h de identificação. Nunca fica aqui com flag escondido.
Pair programming é encorajado — conta como 1 WIP, não 2.

🚧 BLOQUEADO — Política de Impedimento
Meta de WIP: 0. Qualquer item bloqueado é uma emergência sistêmica — não um estado normal.
AO BLOQUEAR: registrar data, causa específica, dono do desbloqueio, próxima ação com prazo.
SLA Nível 1 (1 dia): owner tenta sozinho. SM informado.
SLA Nível 2 (2–3 dias): SM escala para o gestor do time bloqueante. Coach envolvido.
SLA Nível 3 (4+ dias): Coach escala para diretor/C-level com custo de atraso calculado.
Na daily: bloqueados são o PRIMEIRO ponto discutido.
Item bloqueado libera uma vaga no WIP de Em Progresso.` 
  },
  { 
    id: 'col-down-dev-done', 
    title: '[DOWN] Desenvolvimento Finalizado - Dependência', 
    limit: 2, 
    role: 'queue', 
    policy: `👁️ CODE REVIEW — Política de Revisão
WIP máximo: 2 itens simultâneos.
Mínimo 1 revisor diferente do autor. Para itens críticos: 2 revisores.
Prazo máximo: 4h para itens P, 8h para itens M.
Revisão inclui: funcionalidade, testes, segurança, padrões e documentação.
Comentários: 🔴 Bloqueante (deve corrigir) · 🟡 Sugestão (deve discutir) · 🟢 Nitpick (opcional).` 
  },
  { 
    id: 'col-down-ready-test', 
    title: '[DOWN] Ready to Teste', 
    limit: 2, 
    role: 'queue', 
    policy: `Aguardando a equipe de QA puxar o card.` 
  },
  { 
    id: 'col-down-testing', 
    title: '[DOWN] Testando', 
    limit: 2, 
    role: 'active', 
    policy: `🧪 QA / TESTE — Política de Validação
WIP máximo: 2 itens. QA é responsabilidade de todo o time.
ENTRADA: Code review aprovado + testes unitários passando + deploy em staging.
SAÍDA: Todos os critérios de aceite validados · Testes de regressão passando · PO validou · Sem bugs críticos.
Bug em QA: volta para "Em Progresso" com prioridade alta. Não cria novo ticket.` 
  },
  { id: 'col-down-ready-homolog', title: '[DOWN] Ready to Homologação', limit: 2, role: 'queue', policy: 'Testes de QA finalizados. Aguardando validação do negócio.' },
  { id: 'col-down-val-po', title: '[DOWN] Em validação PO', limit: 1, role: 'active', policy: 'Homologação pelo Cliente/PO (User Acceptance Testing).' },
  { id: 'col-down-homologado', title: '[DOWN] Homologado', limit: 0, role: 'queue', policy: 'Homologação concluída com sucesso.' },
  { id: 'col-down-ready-install', title: '[DOWN] Liberado para Instalar', limit: 0, role: 'queue', policy: 'Pronto para entrar na próxima janela de Release.' },
  { 
    id: 'col-down-done', 
    title: '[DOWN] Done', 
    limit: 0, 
    role: 'completed', 
    policy: `🚀 EM PRODUÇÃO — 🚀 Delivery Point
DELIVERY POINT: A partir daqui, o lead time foi cumprido e o cliente recebeu valor.
Deploy com feature flag — liberação gradual: 1% → 10% → 50% → 100% em 24–48h.
Monitoramento ativo por 24h após deploy.
Item vai para a demo do mês com dados de impacto coletados após 7–14 dias.
PO comunica stakeholders via canal definido em até 2h após deploy.` 
  }
];

export const initialCards = [
  {
    id: uuidv4(),
    title: 'Configurar Banco de Dados',
    type: 'padrao', // padrao, urgente, data-fixa, intangivel
    effortTotal: { dev: 32, test: 16, uat: 8 },
    effortLeft: { dev: 32, test: 16, uat: 8 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Interface de Login',
    type: 'padrao',
    effortTotal: { dev: 24, test: 8, uat: 16 },
    effortLeft: { dev: 24, test: 8, uat: 16 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Corrigir Bug Crítico de Segurança',
    type: 'urgente',
    effortTotal: { dev: 16, test: 8, uat: 8 },
    effortLeft: { dev: 16, test: 8, uat: 8 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Atualizar Termos de Uso',
    type: 'data-fixa',
    effortTotal: { dev: 8, test: 8, uat: 16 },
    effortLeft: { dev: 8, test: 8, uat: 16 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    dueDate: 5,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Refatorar Módulo de Auth',
    type: 'intangivel',
    effortTotal: { dev: 40, test: 16, uat: 8 },
    effortLeft: { dev: 40, test: 16, uat: 8 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Exportação de Relatórios',
    type: 'padrao',
    effortTotal: { dev: 24, test: 16, uat: 8 },
    effortLeft: { dev: 24, test: 16, uat: 8 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Integração com API de Pagamento',
    type: 'padrao',
    effortTotal: { dev: 48, test: 24, uat: 16 },
    effortLeft: { dev: 48, test: 24, uat: 16 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Filtro de Pesquisa Avançado',
    type: 'padrao',
    effortTotal: { dev: 16, test: 8, uat: 8 },
    effortLeft: { dev: 16, test: 8, uat: 8 },
    columnId: 'col-up-new',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    isBlocked: false,
  }
];

export const cardTypeColors = {
  padrao: 'var(--accent-blue)',
  urgente: 'var(--accent-rose)',
  'data-fixa': 'var(--accent-amber)',
  intangivel: 'var(--accent-purple)',
};

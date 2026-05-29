import { v4 as uuidv4 } from 'uuid';

export const initialColumns = [
  { id: 'col-backlog', title: 'Backlog', limit: 0, role: 'queue', policy: 'Priorizado pelo PO. Sem compromisso ainda.' },
  { id: 'col-selected', title: 'Selecionado (Ready)', limit: 4, role: 'queue', policy: 'Ponto de compromisso. Devs puxam daqui.' },
  { id: 'col-dev-doing', title: 'Dev (Fazendo)', limit: 3, role: 'active', policy: 'Código em andamento. Máximo 3.' },
  { id: 'col-dev-done', title: 'Dev (Feito)', limit: 0, role: 'done', policy: 'Fila de espera para QA. Nenhum esforço de Dev.' },
  { id: 'col-qa-doing', title: 'QA (Fazendo)', limit: 2, role: 'active', policy: 'Testes em andamento. Máximo 2.' },
  { id: 'col-qa-done', title: 'QA (Feito)', limit: 0, role: 'done', policy: 'Fila de espera para UAT. Nenhum esforço de QA.' },
  { id: 'col-uat-doing', title: 'UAT (Fazendo)', limit: 2, role: 'active', policy: 'Validação pelo Cliente. Máximo 2.' },
  { id: 'col-uat-done', title: 'UAT (Feito)', limit: 0, role: 'done', policy: 'Aprovado. Pronto para produção.' },
  { id: 'col-deploy', title: 'Implantado (Deploy)', limit: 0, role: 'completed', policy: 'Em produção para os usuários.' },
];

export const initialCards = [
  {
    id: uuidv4(),
    title: 'Configurar Banco de Dados',
    type: 'padrao', // padrao, urgente, data-fixa, intangivel
    effortTotal: { dev: 32, test: 16, uat: 8 },
    effortLeft: { dev: 32, test: 16, uat: 8 },
    columnId: 'col-backlog',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
  },
  {
    id: uuidv4(),
    title: 'Interface de Login',
    type: 'padrao',
    effortTotal: { dev: 24, test: 8, uat: 16 },
    effortLeft: { dev: 24, test: 8, uat: 16 },
    columnId: 'col-backlog',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
  },
  {
    id: uuidv4(),
    title: 'Corrigir Bug Crítico de Segurança',
    type: 'urgente',
    effortTotal: { dev: 16, test: 8, uat: 8 },
    effortLeft: { dev: 16, test: 8, uat: 8 },
    columnId: 'col-selected',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
  },
  {
    id: uuidv4(),
    title: 'Atualizar Termos de Uso',
    type: 'data-fixa',
    effortTotal: { dev: 8, test: 8, uat: 16 },
    effortLeft: { dev: 8, test: 8, uat: 16 },
    columnId: 'col-backlog',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
    dueDate: 5,
  },
  {
    id: uuidv4(),
    title: 'Refatorar Módulo de Auth',
    type: 'intangivel',
    effortTotal: { dev: 40, test: 16, uat: 8 },
    effortLeft: { dev: 40, test: 16, uat: 8 },
    columnId: 'col-backlog',
    createdAt: 1,
    startedAt: null,
    completedAt: null,
    activeTime: 0,
    waitTime: 0,
  }
];

export const cardTypeColors = {
  padrao: 'var(--accent-blue)',
  urgente: 'var(--accent-rose)',
  'data-fixa': 'var(--accent-amber)',
  intangivel: 'var(--accent-purple)',
};

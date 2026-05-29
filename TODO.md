# Roadmap do Simulador Kanban/Scrumban (Ideias Futuras)

## 1. Variabilidade e Eventos Aleatórios (Caos do Mundo Real)
- [ ] **Sistema de Eventos de Início de Dia:** Ao avançar o turno, o jogo pode sortear um evento aleatório.
- [ ] **Exemplos de Eventos:** 
  - *Ausência:* "Um DEV ficou doente (-8h de capacidade)".
  - *Incidente em Produção:* "Surge um novo cartão Urgente (Expedite) no topo do Backlog."
  - *Mudança de Escopo:* "O cliente adicionou +4h de esforço em um cartão que estava em QA."
  - *Sorte:* "O time estava muito focado! +2h extras para todos."
- [ ] **Objetivo Pedagógico:** Ensinar na prática como o Kanban lida com a imprevisibilidade usando folgas, limitação de WIP (trabalho em progresso) e técnicas como o Swarming (enxame).

## 2. Refinamento de Métricas (CFD e Lead Time)
- [ ] **Melhorar o Gráfico CFD:** Adicionar interatividade melhorada no Cumulative Flow Diagram.
- [ ] **Histograma de Lead Time:** Em vez de apenas a média, mostrar a dispersão de tempo de entrega (percentis 85%, 95%).
- [ ] **Monte Carlo Simples:** Fazer previsões baseadas no histórico do jogador ("Probabilidade de entregar os cartões restantes em X dias").

## 3. Dinâmica de Equipe Avançada
- [ ] **Especialistas vs Generalistas:** Permitir que horas de QA sejam usadas em DEV (simulando um time Cross-funcional).
- [ ] **Custo Financeiro:** Mostrar o "Custo de Atraso" (Cost of Delay) para cartões de Data Fixa que não são entregues no prazo.

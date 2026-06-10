export const generateMockMarkdown = (type, title) => {
  switch (type) {
    case 'prd':
      return `
# PRD: ${title}

## 🎯 Objetivo
Resolver a necessidade do usuário de realizar a ação com mais agilidade e segurança, diminuindo a fricção atual no processo em 40%.

## 👤 Persona
- Usuário final que utiliza o sistema diariamente.
- Perfil: Baixo conhecimento técnico, requer interface intuitiva.

## 📝 User Stories Iniciais
1. Como usuário, eu quero acessar a funcionalidade com apenas um clique na dashboard.
2. Como usuário, eu quero receber um alerta claro caso ocorra um erro durante a operação.

## ⚠️ Critérios de Aceite (DoR)
- [ ] A interface deve seguir o Design System atual.
- [ ] Tempo de resposta não deve ultrapassar 2 segundos.
- [ ] Deve funcionar no aplicativo mobile (iOS e Android).

## 📊 Métricas de Sucesso
- Aumento de 15% na taxa de conversão da funcionalidade.
- Redução de tickets no suporte relacionados a este fluxo.
      `.trim();

    case 'spec':
      return `
# Spec Técnica: ${title}

## 🏗️ Arquitetura Proposta
A funcionalidade será implementada utilizando o padrão de microsserviços atual. 
- **Frontend:** Componente React conectado via Apollo GraphQL.
- **Backend:** Novo endpoint no Node.js Gateway, roteando para o microserviço \`core-engine\`.

## 🔄 Diagrama de Fluxo
1. \`Client\` envia payload POST para \`/api/v2/feature\`
2. \`API Gateway\` valida o JWT.
3. Requisição encaminhada via gRPC para \`core-engine\`.
4. Evento assíncrono publicado no Kafka (tópico: \`feature-events\`).

## ⚠️ Riscos Técnicos e Mitigação
- **Risco:** Gargalo no banco de dados se houver pico de uso.
- **Mitigação:** Implementar cache agressivo usando Redis com TTL de 5 minutos.
- **Dependência:** Requer a versão mais recente do schema GraphQL da equipe de Core.

## 🔐 Segurança
- Sanitização rigorosa de inputs.
- Validar roles do usuário (apenas \`admin\` ou \`premium\`).
      `.trim();

    case 'qa':
      return `
# Plano de Testes (QA): ${title}

## 🧪 Cenários BDD (Behavior Driven Development)

**Cenário 1: Caminho Feliz**
\`\`\`gherkin
Dado que o usuário está autenticado
E possui perfil 'premium'
Quando ele preenche os dados corretamente e envia
Então o sistema deve processar a requisição com sucesso
E uma mensagem de confirmação verde deve aparecer
\`\`\`

**Cenário 2: Falha de Rede (Resiliência)**
\`\`\`gherkin
Dado que o usuário inicia a operação
Quando ocorre uma falha de conexão durante o envio
Então o sistema deve tentar novamente 3 vezes silenciosamente
E caso falhe definitivamente, mostrar modal de "Tente Novamente mais tarde" sem perder os dados preenchidos
\`\`\`

## ⚙️ Testes Automatizados Requeridos
- [ ] Teste unitário do helper de validação (Jest).
- [ ] Teste de integração do endpoint POST (Supertest).
- [ ] Teste E2E do fluxo completo no frontend (Cypress).
      `.trim();

    case 'stories':
      return `
# User Stories Quebradas: ${title}

Esta demanda principal era muito grande e foi quebrada em entregas menores pelo Agente de Produto:

1. **[Backend]** Criar o schema de banco e os endpoints base. (Tamanho: P)
2. **[Frontend]** Desenvolver o formulário inicial na interface. (Tamanho: M)
3. **[Frontend]** Implementar validações complexas e tratamento de erro. (Tamanho: P)
4. **[Integração]** Publicar os eventos no Kafka e criar consumidores básicos. (Tamanho: M)

*Nota do Agente:* Todas essas stories podem ser desenvolvidas em paralelo assim que a API Contract (Swagger) for aprovada.
      `.trim();

    default:
      return '# Documento não encontrado';
  }
};

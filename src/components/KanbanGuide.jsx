import React, { useState } from 'react';
import { X, BookOpen, Layout, Settings, Columns, Scale, AlertOctagon, Tags, BarChart2, Gamepad2, Info, ArrowRight } from 'lucide-react';

export const KanbanGuide = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const tabs = [
    { id: 0, title: 'Fundamentos', icon: BookOpen },
    { id: 1, title: 'Design de Fluxo & Políticas', icon: Layout },
    { id: 2, title: 'Buffers e Filas', icon: Columns },
    { id: 3, title: 'WIP Limit e Lei de Little', icon: Scale },
    { id: 4, title: 'Impedimentos (Blockers)', icon: AlertOctagon },
    { id: 5, title: 'Classes de Serviço', icon: Tags },
    { id: 6, title: 'Métricas Kanban', icon: BarChart2 },
    { id: 7, title: 'Como Jogar o Simulador', icon: Gamepad2 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0: return <Fundamentos />;
      case 1: return <DesignFluxo />;
      case 2: return <Buffers />;
      case 3: return <WipLittle />;
      case 4: return <Impedimentos />;
      case 5: return <ClassesServico />;
      case 6: return <Metricas />;
      case 7: return <Simulador />;
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-primary)',
      zIndex: 9999,
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '320px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', padding: '8px', borderRadius: '8px' }}>
            <BookOpen size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>Guia Kanban</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Centro de Aprendizado</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                <Icon size={18} />
                {tab.id + 1}. {tab.title}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px 80px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '40px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ maxWidth: '800px', margin: '0 auto', color: 'var(--text-primary)', lineHeight: '1.6' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const ContentBox = ({ children, color = 'var(--accent-blue)', bg = 'rgba(59, 130, 246, 0.05)' }) => (
  <div style={{ background: bg, padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${color}`, marginBottom: '24px' }}>
    {children}
  </div>
);

const Fundamentos = () => (
  <div>
    <h1 style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>1. Fundamentos do Kanban</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>O Kanban não é uma metodologia de desenvolvimento, é um método de <strong>gestão de fluxo</strong>. Ele assume que você já tem um processo e ajuda a otimizá-lo iterativamente.</p>
    
    <h3>Sistema Puxado vs Sistema Empurrado</h3>
    <ContentBox color="var(--accent-emerald)" bg="rgba(16, 185, 129, 0.05)">
      <strong>Sistema Empurrado (Push):</strong> O gerente joga tarefas para a equipe independentemente da capacidade deles. Resultado: Sobrecarga, burnout e muito trabalho em andamento que nunca termina.<br/><br/>
      <strong>Sistema Puxado (Pull):</strong> A equipe só "puxa" um novo trabalho quando tem capacidade livre (sinalizada pelo WIP Limit). Resultado: O trabalho flui de forma suave, previsível e sem estresse.
    </ContentBox>

    <h3>Os Princípios Fundamentais</h3>
    <ul>
      <li><strong>Gestão Visual:</strong> Tornar o trabalho invisível em visível. Se você não vê a fila, você não consegue gerenciá-la.</li>
      <li><strong>Limitar o Trabalho em Progresso (WIP):</strong> A restrição que cria o sistema puxado.</li>
      <li><strong>Gerenciar o Fluxo:</strong> Focar no trabalho movendo-se pelo sistema, não nas pessoas trabalhando (eficiência de fluxo vs eficiência de recursos).</li>
      <li><strong>Tornar as Políticas Explícitas:</strong> As regras do jogo devem estar claras para todos (ex: Definition of Done).</li>
    </ul>
  </div>
);

const DesignFluxo = () => (
  <div>
    <h1 style={{ color: 'var(--accent-purple)', marginBottom: '16px' }}>2. Design de Fluxo & Políticas</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Um quadro Kanban deve refletir a realidade da sua <strong>Cadeia de Valor (Value Stream)</strong>. Não se limite a "To Do, Doing, Done".</p>
    
    <h3>O Fluxo Ideal (Buffers vs Filas de Espera)</h3>
    <p>O fluxo deve mostrar as etapas onde o trabalho sofre transformação, e também onde o trabalho <strong>fica parado</strong>. Veja o exemplo de um fluxo maduro:</p>
    
    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginBottom: '24px', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.85rem' }}>
        <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid var(--border-glass)' }}>Backlog</span> <ArrowRight size={14} color="var(--text-muted)"/>
        
        <span style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', gap: '4px' }}>
          <strong>Análise</strong> [Doing | Done]
        </span> <ArrowRight size={14} color="var(--text-muted)"/>
        
        <span style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', gap: '4px' }}>
          <strong>Dev</strong> [Doing]
        </span> <ArrowRight size={14} color="var(--text-muted)"/>
        
        <span style={{ padding: '6px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '4px', border: '1px dashed rgba(245, 158, 11, 0.5)', color: 'var(--accent-amber)' }}>
          Aguardando QA (Wait)
        </span> <ArrowRight size={14} color="var(--text-muted)"/>
        
        <span style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>Deploy</span>
      </div>
    </div>

    <ContentBox color="var(--accent-purple)">
      <h4 style={{ marginTop: 0, color: 'var(--accent-purple)' }}>O Anti-Padrão da Fila Dupla (Redundant Queues)</h4>
      <p>Você <strong>NUNCA</strong> deve ter uma sub-coluna "Done" seguida imediatamente por uma coluna de "Wait". Isso cria duas filas seguidas com o mesmo propósito! Você deve escolher uma das duas abordagens abaixo:</p>
      
      <h4 style={{ marginTop: '16px', color: 'var(--accent-blue)' }}>Abordagem 1: Doing / Done (Sistema 100% Puxado)</h4>
      <p>Usamos colunas subdivididas (Doing/Done) quando o trabalho <strong>ainda está sob domínio da mesma equipe</strong>. Quando o Dev termina, ele move para o <em>Dev [Done]</em> e o cartão fica lá aguardando. O QA, quando tiver tempo, <strong>PUXA</strong> o cartão do Dev [Done] direto para o <em>QA [Doing]</em>. O Dev não joga o cartão no QA.</p>
      
      <h4 style={{ marginTop: '16px', color: 'var(--accent-amber)' }}>Abordagem 2: Coluna de "Wait" (Handoff e Empurrar)</h4>
      <p style={{ margin: 0 }}>Usamos a coluna inteira de Fila (Wait) quando perdemos o controle do item (ex: vai para o Cliente ou Terceiros), ou quando queremos evidenciar muito uma fila de gargalo. Nesse caso, a coluna de Dev <strong>não tem sub-coluna Done</strong>. Quando o Dev termina, ele <strong>EMPURRA</strong> o cartão para a fila "Aguardando QA".</p>
    </ContentBox>

    <h3>Políticas Explícitas</h3>
    <p>As políticas são acordos da equipe sobre como o sistema funciona. Elas evitam achismos e melhoram a qualidade. Cada coluna deve ter sua política clara.</p>
    
    <ContentBox bg="rgba(16, 185, 129, 0.05)" color="var(--accent-emerald)">
      <h4 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Exemplo: Política da Coluna de Dev</h4>
      <ul style={{ margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <li><strong>Critério de Entrada (Pull):</strong> Só pode puxar se a Análise estiver no estado <em>Done</em> e houver vaga no WIP de Dev.</li>
        <li><strong>Limite WIP:</strong> Máximo de 4 itens na coluna inteira (Doing + Done).</li>
        <li><strong>Critério de Saída (Para o Done):</strong> Código passou nos testes unitários localmente e o Pull Request foi aprovado por pelo menos 1 colega. Mover para a subcoluna <em>Done</em>.</li>
      </ul>
    </ContentBox>
  </div>
);

const Buffers = () => (
  <div>
    <h1 style={{ color: 'var(--accent-emerald)', marginBottom: '16px' }}>3. Buffers e Filas</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Para medir corretamente quanto tempo o seu time passa trabalhando e quanto tempo o item fica parado esperando, usamos subcolunas de Buffer ou Colunas de Wait.</p>
    
    <h3>Subcoluna: Doing vs Done</h3>
    <p>Em fases onde a sua própria equipe atua, é comum dividir a coluna em duas partes (ex: Dev [Doing | Done]).</p>
    <ul>
      <li><strong>Doing (Ativo):</strong> O desenvolvedor está escrevendo código. O tempo aqui conta como <em>Active Time</em>.</li>
      <li><strong>Done (Buffer):</strong> O código está pronto, mas o analista de QA ainda não puxou. O item está <strong>parado em uma fila</strong>. O tempo aqui conta como <em>Wait Time</em>.</li>
    </ul>
    <p><em>Regra de Ouro do WIP:</em> O limite de WIP se aplica à coluna inteira (Doing + Done). Se o Dev termina a tarefa e move para o "Done", o limite continua consumido até o QA puxar!</p>

    <h3>Coluna Dedicada (Wait/Fila)</h3>
    <p>Quando a dependência é <strong>externa</strong> (ex: o cliente precisa homologar, ou precisamos esperar a Apple aprovar na App Store), criamos uma coluna dedicada de espera (ex: <em>Aguardando UAT</em>).</p>
    <ContentBox color="var(--accent-amber)" bg="rgba(245, 158, 11, 0.05)">
      <h4 style={{ marginTop: 0, color: 'var(--accent-amber)' }}>O Impacto das Filas na Eficiência</h4>
      <p style={{ margin: 0 }}>Em ambientes corporativos tradicionais, um item pode levar 30 dias para ficar pronto (Lead Time), mas a equipe só trabalhou nele por 3 dias (Active Time). Os outros 27 dias o item ficou <strong>preso em Buffers e Filas</strong>. O Kanban expõe essas filas para você otimizá-las.</p>
    </ContentBox>
  </div>
);

const WipLittle = () => (
  <div>
    <h1 style={{ color: 'var(--accent-rose)', marginBottom: '16px' }}>4. Limites de WIP e Lei de Little</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>O WIP (Work In Progress) é o oxigênio do sistema Kanban. Controlá-lo é a única forma matemática de garantir velocidade.</p>
    
    <h3>A Matemática do Fluxo: Lei de Little</h3>
    <p>A Lei de Little prova matematicamente que o Tempo de Entrega (Lead Time) é diretamente proporcional à quantidade de trabalho em progresso (WIP).</p>
    
    <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', textAlign: 'center', fontSize: '1.2rem', marginBottom: '24px' }}>
      <strong>Lead Time</strong> = <strong>WIP</strong> / <strong>Throughput</strong>
    </div>

    <ContentBox color="var(--accent-rose)" bg="rgba(244, 63, 94, 0.05)">
      <h4 style={{ marginTop: 0 }}>Como usar a fórmula na vida real?</h4>
      <p>Se o seu time entrega 2 cartões por dia (Throughput = 2) e o seu chefe quer que uma funcionalidade leve no máximo 4 dias para ficar pronta (Lead Time ideal = 4).</p>
      <p>Qual deve ser o limite de WIP do quadro inteiro?</p>
      <p><em>WIP = 4 dias * 2 cartões/dia = <strong>8 cartões</strong>.</em></p>
      <p style={{ margin: 0 }}><strong>Conclusão:</strong> Se o seu quadro tiver mais de 8 cartões em andamento, é matematicamente impossível a sua equipe entregar as coisas em 4 dias de média. Você estará criando atrasos e ansiedade.</p>
    </ContentBox>
  </div>
);

const Impedimentos = () => (
  <div>
    <h1 style={{ color: 'var(--accent-rose)', marginBottom: '16px' }}>5. Impedimentos (Blockers)</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Na teoria do método Kanban, o tratamento de itens bloqueados tem regras rigorosas para forçar a melhoria contínua.</p>

    <ContentBox color="var(--accent-rose)" bg="rgba(244, 63, 94, 0.05)">
      <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <li><strong>1. Eles não saem da coluna:</strong> Não existe coluna "Blocked". O item bloqueado deve permanecer exatamente onde está, pois o trabalho continua em progresso. Esconder numa coluna genérica faz perder o contexto de onde ocorreu o gargalo.</li>
        <li><strong>2. Consomem o limite de WIP:</strong> Um item bloqueado continua ocupando espaço no limite de WIP da coluna. Isso causa "dor" no time, forçando-o a parar de começar coisas novas e focar em desbloquear o que já começou ("Pare de começar, comece a terminar").</li>
        <li><strong>3. Sinalização Visual (Gestão Visual):</strong> A recomendação é colocar uma sinalização forte e gritante (ex: botão vermelho, adesivo neon). Qualquer um que bater o olho no quadro precisa saber instantaneamente: "Temos um problema ali!".</li>
        <li><strong>4. Swarming (Enxame):</strong> Quando um item bloqueia, a política ideal é que o time faça "Swarming". Os membros devem parar o que estão fazendo e se reunir para ajudar a remover o bloqueio o mais rápido possível. Não crie um "novo ticket" só para resolver o bloqueio.</li>
        <li><strong>5. Prejudicam as Métricas:</strong> O tempo que o cartão passa bloqueado não pausa o relógio do Lead Time. Esse tempo de espera prejudica a Eficiência de Fluxo, forçando a empresa a olhar para as causas raízes dos bloqueios nas retrospectivas.</li>
      </ul>
    </ContentBox>
  </div>
);

const ClassesServico = () => (
  <div>
    <h1 style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>6. Classes de Serviço</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Diferentes tipos de trabalho têm diferentes custos de atraso (Cost of Delay). As Classes de Serviço ditam como o time deve priorizar e tratar os cartões que entram no fluxo.</p>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <ContentBox color="var(--accent-blue)">
        <h3 style={{ marginTop: 0, color: 'var(--accent-blue)' }}>Padrão (Standard)</h3>
        <p><strong>Exemplo:</strong> Uma nova funcionalidade ou melhoria de UI.</p>
        <p><strong>Regra:</strong> Segue o fluxo normal e respeita religiosamente os limites de WIP (First In, First Out). O custo de atraso cresce de forma linear.</p>
      </ContentBox>

      <ContentBox color="var(--accent-rose)" bg="rgba(244, 63, 94, 0.05)">
        <h3 style={{ marginTop: 0, color: 'var(--accent-rose)' }}>Urgente (Expedite)</h3>
        <p><strong>Exemplo:</strong> O servidor de produção caiu ou há um bug crítico vazando dados.</p>
        <p><strong>Regra:</strong> Tem prioridade máxima (Swarming). Pode <strong>ignorar e furar os limites de WIP</strong>. Normalmente os quadros limitam a existência de no máximo 1 item Expedite por vez.</p>
      </ContentBox>

      <ContentBox color="var(--accent-amber)" bg="rgba(245, 158, 11, 0.05)">
        <h3 style={{ marginTop: 0, color: 'var(--accent-amber)' }}>Data Fixa (Fixed Date)</h3>
        <p><strong>Exemplo:</strong> Preparar o sistema para a Black Friday ou atender uma nova regulação governamental (LGPD).</p>
        <p><strong>Regra:</strong> O custo de atraso é baixo até a data limite, mas se não for entregue na data exata, a empresa perde muito dinheiro ou leva multas.</p>
      </ContentBox>

      <ContentBox color="var(--accent-purple)" bg="rgba(139, 92, 246, 0.05)">
        <h3 style={{ marginTop: 0, color: 'var(--accent-purple)' }}>Intangível (Intangible)</h3>
        <p><strong>Exemplo:</strong> Refatorar um código legado, atualizar a versão do framework, documentação.</p>
        <p><strong>Regra:</strong> Não há urgência imediata (não dói adiar), mas se for ignorado por muito tempo, a dívida técnica se tornará um evento <em>Expedite</em> e travará a empresa.</p>
      </ContentBox>
    </div>
  </div>
);

const Metricas = () => (
  <div>
    <h1 style={{ color: 'var(--accent-emerald)', marginBottom: '16px' }}>7. Métricas Kanban</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>O Kanban utiliza métricas objetivas focadas em previsibilidade de entrega, e não em "pontos de esforço" ou velocidade individual.</p>

    <h3>1. Lead Time (Tempo de Entrega)</h3>
    <p>O tempo total que um item leva desde o momento que a equipe <strong>se compromete</strong> a fazê-lo (Commitment Point) até ele ser entregue ao cliente (Delivery Point).</p>
    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', borderLeft: '4px solid var(--accent-blue)' }}>
      <code style={{ fontSize: '1.1rem', color: 'var(--accent-blue)' }}>Lead Time = Data de Entrega - Data de Comprometimento</code>
    </div>
    <p><em>Dica:</em> Os clientes não se importam com estimativas, eles se importam com o Lead Time ("quando vai estar pronto?").</p>

    <h3>2. Eficiência de Fluxo (Flow Efficiency)</h3>
    <p>A proporção de tempo que o item passou ativamente sendo trabalhado versus o tempo que passou parado em filas (Buffers).</p>
    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', borderLeft: '4px solid var(--accent-emerald)' }}>
      <code style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>Eficiência = (Tempo Ativo / Lead Time Total) × 100</code>
    </div>
    <p>Equipes tradicionais costumam ter eficiências entre 5% e 15%. Equipes Kanban maduras chegam a 40% reduzindo o WIP!</p>

    <h3>3. Vazão (Throughput)</h3>
    <p>A taxa de entrega do sistema. Quantos cartões foram finalizados por unidade de tempo (dia, semana ou mês). Substitui a necessidade de calcular "Story Points".</p>
    <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px', borderLeft: '4px solid var(--accent-purple)' }}>
      <code style={{ fontSize: '1.1rem', color: 'var(--accent-purple)' }}>Throughput = Total de Itens Entregues / Período de Tempo</code>
    </div>

    <h3>4. Cumulative Flow Diagram (CFD)</h3>
    <p>O gráfico definitivo do fluxo. Mostra a quantidade de cartões em cada fase do processo ao longo do tempo. As faixas do gráfico mostram o WIP, e a distância horizontal mostra o Lead Time.</p>
    <ContentBox color="var(--accent-blue)">
      <strong>Como ler o CFD:</strong> Se uma faixa (ex: "Em Dev") estiver engordando, significa que a equipe está começando mais do que terminando, criando um gargalo enorme que vai explodir o Lead Time no futuro.
    </ContentBox>
  </div>
);

const Simulador = () => (
  <div>
    <h1 style={{ color: 'var(--accent-purple)', marginBottom: '16px' }}>8. Como Jogar o Simulador</h1>
    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Aprenda a operar o simulador para testar todos esses conceitos na prática.</p>

    <h3>A Equipe (Avatares e Horas)</h3>
    <p>O jogo não usa rolagem aleatória de dados. Você gerencia a <strong>capacidade em horas</strong> de uma equipe fixa formada por Avatares:</p>
    <ul>
      <li><strong>Desenvolvedores (Dev):</strong> 16 horas diárias (2 pessoas).</li>
      <li><strong>Qualidade (QA):</strong> 8 horas diárias (1 pessoa).</li>
      <li><strong>Cliente/Produto (UAT):</strong> 8 horas diárias (1 pessoa).</li>
    </ul>

    <h3>O Passo a Passo</h3>
    <ol style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <li><strong>Puxe o Trabalho:</strong> Arraste os cartões do Backlog para a fase de Desenvolvimento. Fique de olho no Limite de WIP no cabeçalho das colunas (ex: 3/3).</li>
      <li><strong>Alocação de Esforço:</strong> No cartão, clique no botão <strong>[ +8h ]</strong> para alocar um dia inteiro de um avatar na tarefa, ou <strong>[ +1h ]</strong> para finalizar o restinho necessário. Isso descontará do pool de horas do dia.</li>
      <li><strong>Avance o Cartão:</strong> Quando a barra de progresso da fase atual for concluída (aparecer um ✓), mova o cartão para a próxima fila (ex: <em>Para Testar</em>).</li>
      <li><strong>O Próximo Dia:</strong> Quando suas horas acabarem, clique em "Próximo Dia" no Painel de Controle. A equipe dorme e acorda com as horas recarregadas. O relógio das métricas avança!</li>
      <li><strong>Bloqueios Surpresa:</strong> Use o botão <strong>Simular Bloqueio</strong> para travar um cartão ativo. Veja o impacto que isso causa na coluna e no seu fluxo antes de clicar em "Resolver"!</li>
    </ol>
  </div>
);

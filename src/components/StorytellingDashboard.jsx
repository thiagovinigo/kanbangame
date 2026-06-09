import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './StorytellingDashboard.css';

export const StorytellingDashboard = ({ isOpen, onClose }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [highlightedCard, setHighlightedCard] = useState(null);

  // Scroll to top when day changes
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentDay]);

  if (!isOpen) return null;

  const days = [
    { name: 'SEG', desc: 'Daily + Incidente' },
    { name: 'TER', desc: 'Repl. + Ref. Técnico' },
    { name: 'QUA', desc: 'Entrega + Feedback' },
    { name: 'QUI', desc: 'Demo Mensal' },
    { name: 'SEX', desc: 'Retrospectiva' }
  ];

  const hlCard = (id) => {
    setHighlightedCard(id);
    // After 2 seconds, remove highlight
    setTimeout(() => {
      setHighlightedCard(prev => prev === id ? null : prev);
    }, 2500);
  };

  const isCardHi = (id) => highlightedCard === id ? ' s-hi' : '';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-primary)', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      
      {/* Header */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>🎬 Exemplo Real: Squad Open Banking</h1>
            <span style={{ color: 'var(--text-muted)' }}>Simulação de uma semana com Scrumban</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentDay(prev => Math.max(0, prev - 1))}
            disabled={currentDay === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={18} /> Dia Anterior
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentDay(prev => Math.min(4, prev + 1))}
            disabled={currentDay === 4}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Próximo Dia <ChevronRight size={18} />
          </button>
          <button onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '12px' }}>
            <X size={20} /> Fechar
          </button>
        </div>
      </header>

      <main className="storytelling-wrapper" ref={scrollRef}>
        <div className="section" style={{ display: 'block' }}>
          <div className="story-header-box">
            <h3>🏦 Squad Open Banking — Banco Digital</h3>
            <p>Acompanhe o que acontece na semana. Nos diálogos, clique nos <strong style={{color:'#f97316'}}>tags #numerados</strong> para o card piscar no board acima.</p>
            <div className="squad-chips">
              <div className="squad-chip">👩 Ana — PO</div>
              <div className="squad-chip">👨 Carlos — SM/Coach</div>
              <div className="squad-chip">🧑‍💻 Rafael — Tech Lead</div>
              <div className="squad-chip">👩‍💻 Beatriz — Eng</div>
              <div className="squad-chip">🧑‍💻 Diego — Eng</div>
              <div className="squad-chip">👩‍🔬 Luana — QA</div>
            </div>
          </div>

          <div className="week-nav-story">
            {days.map((day, idx) => (
              <button 
                key={idx} 
                className={`day-btn ${currentDay === idx ? 's-active' : ''}`}
                onClick={() => setCurrentDay(idx)}
              >
                <span className="dn">{day.name}</span>
                <span className="ds">{day.desc}</span>
                <div className="dd"></div>
              </button>
            ))}
          </div>

          <div className="story-board">
            <div style={{fontSize:'9px', fontWeight:800, color:'#64748b', letterSpacing:'1px', marginBottom:'6px'}}>
              📋 BOARD ATUAL — <span style={{color:'#f97316'}}>clique nos números nos diálogos abaixo para destacar o card aqui</span>
            </div>
            <div className="s-board">

              {/* ZONA OPÇÕES */}
              <div className="s-zone" style={{background:'#1a1a2e', border:'1px solid #2d2d5e'}}>
                <div className="s-zone-lbl" style={{background:'#2d2d5e', color:'#818cf8'}}>🗂️ OPÇÕES (não comprometido)</div>
                <div style={{display:'flex', gap:'5px'}}>
                  <div className="s-bcol" style={{minWidth:'128px'}}>
                    <div className="s-bh" style={{background:'#2d2d5e', color:'#818cf8'}}>📥 Backlog<span className="wlbl">ilimitado</span></div>
                    <div className={`sk${isCardHi('sk10')}`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#10</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>Integração Pix v2<span className="ssz">M</span></div>
                    <div className={`sk${isCardHi('sk11')}`}><div className="sk-top"><span className="snum">#11</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Dark mode config<span className="ssz">P</span></div>
                    <div className={`sk${isCardHi('sk12')}`}><div className="sk-top"><span className="snum">#12</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Atualizar docs API<span className="ssz">P</span></div>
                    {currentDay < 1 && <div className={`sk${isCardHi('sk09')}`} style={{borderColor:'#94a3b8'}}><div className="sk-top"><span className="snum">#09</span><span className="stag" style={{color:'#94a3b8'}}>INTANG.</span></div>Logs de auditoria<span className="ssz">P</span></div>}
                    <div className={`sk${isCardHi('sk13')}`} style={{borderColor:'#94a3b8'}}><div className="sk-top"><span className="snum">#13</span><span className="stag" style={{color:'#94a3b8'}}>INTANG.</span></div>Refactor cache auth<span className="ssz">M</span></div>
                    {currentDay >= 1 && <div className={`sk${isCardHi('sk09')} s-new`} style={{borderColor:'#94a3b8'}}><div className="sk-top"><span className="snum">#09</span><span className="stag" style={{color:'#94a3b8'}}>INTANG.</span></div>Logs de auditoria<span className="ssz">P</span></div>}
                  </div>
                  <div className="s-bcol" style={{minWidth:'118px'}}>
                    <div className="s-bh" style={{background:'#1e3a5f', color:'#60a5fa'}}>🔍 Ref. Negócio<span className="wlbl">WIP: 4 / atual: 2</span></div>
                    <div className="s-wi"><div className="s-wd on"></div><div className="s-wd on"></div><div className="s-wd"></div><div className="s-wd"></div></div>
                    {currentDay < 1 && <div className={`sk${isCardHi('sk08')}`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#08</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>OAuth 2.1 (BCB)<span className="ssz">M</span></div>}
                    {currentDay >= 1 && <div className={`sk${isCardHi('sk08')} s-done`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#08</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>OAuth 2.1 (BCB)<span className="ssz">M</span></div>}
                  </div>
                </div>
              </div>

              {/* COMMITMENT POINT */}
              <div className="s-cp"><div className="s-bl">🎯 CP</div></div>

              {/* ZONA COMPROMETIDA */}
              <div className="s-zone" style={{background:'#1a1200', border:'1px solid #451a03'}}>
                <div className="s-zone-lbl" style={{background:'#451a03', color:'#fb923c'}}>⚡ ZONA COMPROMETIDA</div>
                <div style={{display:'flex', gap:'5px'}}>

                  {/* PRONTO PUXAR */}
                  <div className="s-bcol" style={{minWidth:'118px'}}>
                    <div className="s-bh" style={{background:'#451a03', color:'#fb923c'}}>✅ Pronto/Puxar<span className="wlbl">WIP:5 / limiar:2</span></div>
                    <div className="s-wi"><div className="s-wd on"></div><div className="s-wd on"></div><div className="s-wd on"></div><div className="s-wd"></div><div className="s-wd"></div></div>
                    <div className="s-ll">🚨 EXPEDITE</div>
                    <div style={{minHeight:'14px'}} id="sexp-slot"></div>
                    <div className="s-ld"></div>
                    <div className={`sk${isCardHi('sk05')}`} style={{borderColor:'#f97316'}}><div className="sk-top"><span className="snum">#05</span><span className="stag" style={{color:'#f97316'}}>HIGH VALUE</span></div>API Webhooks<span className="ssz">M</span></div>
                    <div className={`sk${isCardHi('sk06')}`}><div className="sk-top"><span className="snum">#06</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Filtro por data<span className="ssz">P</span></div>
                    <div className={`sk${isCardHi('sk07')}`}><div className="sk-top"><span className="snum">#07</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Endpoint saldo v2<span className="ssz">M</span></div>
                    {currentDay >= 2 && <div className={`sk${isCardHi('sk08')} s-new`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#08</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>OAuth 2.1 (BCB)<span className="ssz">M</span></div>}
                  </div>

                  {/* EM PROGRESSO */}
                  <div className="s-bcol" style={{minWidth:'118px'}}>
                    <div className="s-bh" style={{background:'#450a0a', color:'#fca5a5'}}>🔨 Em Progresso<span className="wlbl">WIP: 3 / atual: 2</span></div>
                    <div className="s-wi"><div className="s-wd on"></div><div className="s-wd on"></div><div className="s-wd"></div></div>
                    <div className="s-ll">🚨 EXPEDITE LANE</div>
                    <div style={{minHeight:'22px'}} id="sexp-prog">
                      {currentDay === 0 && (
                        <div className={`sk s-urg${isCardHi('sexp-prog')}`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#EXP</span><span className="stag" style={{color:'#7c3aed'}}>EXPEDITE</span></div>Bug /saldo 504<span className="ssz">P</span></div>
                      )}
                    </div>
                    <div className="s-ld"></div>
                    {currentDay < 3 && <div className={`sk${isCardHi('sk03')}`} style={{borderColor:'#f97316'}}><div className="sk-top"><span className="snum">#03</span><span className="stag" style={{color:'#f97316'}}>HIGH VALUE</span></div>Endpoint consentimento<span className="ssz">M</span></div>}
                    {currentDay === 0 && <div className={`sk${isCardHi('sk04')} s-hi`}><div className="sk-top"><span className="snum">#04</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Extrato paginado<span className="ssz">P</span></div>}
                    {currentDay === 2 && <div className={`sk${isCardHi('sk15')} s-new`} style={{borderColor:'#f97316'}}><div className="sk-top"><span className="snum">#15</span><span className="stag" style={{color:'#f97316'}}>HIGH VALUE</span></div>Bug: cursor encoding<span className="ssz">P</span></div>}
                  </div>

                  {/* BLOQUEADO */}
                  <div className="s-bcol" style={{minWidth:'90px'}}>
                    <div className="s-bh" style={{background:'#450a0a', color:'#fca5a5'}}>🚧 Bloqueado<span className="wlbl">meta: 0</span></div>
                  </div>

                  {/* CODE REVIEW */}
                  <div className="s-bcol" style={{minWidth:'118px'}}>
                    <div className="s-bh" style={{background:'#1e3a5f', color:'#60a5fa'}}>👁️ Code Review<span className="wlbl">WIP: 2 / atual: 1</span></div>
                    <div className="s-wi"><div className="s-wd on"></div><div className="s-wd"></div></div>
                    {currentDay < 1 && <div className={`sk${isCardHi('sk02')}`} style={{borderColor:'#2563eb'}}><div className="sk-top"><span className="snum">#02</span><span className="stag" style={{color:'#2563eb'}}>STANDARD</span></div>Paginação parceiros<span className="ssz">P</span></div>}
                    {currentDay >= 3 && <div className={`sk${isCardHi('sk08')} s-new`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#08</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>OAuth 2.1 (BCB)<span className="ssz">M</span></div>}
                    {currentDay >= 3 && <div className={`sk${isCardHi('sk03')} s-new`} style={{borderColor:'#f97316'}}><div className="sk-top"><span className="snum">#03</span><span className="stag" style={{color:'#f97316'}}>HIGH VALUE</span></div>Endpoint consentimento<span className="ssz">M</span></div>}
                  </div>

                  {/* QA */}
                  <div className="s-bcol" style={{minWidth:'118px'}}>
                    <div className="s-bh" style={{background:'#14532d', color:'#86efac'}}>🧪 QA / Teste<span className="wlbl">WIP: 2 / atual: 1</span></div>
                    <div className="s-wi"><div className="s-wd on"></div><div className="s-wd"></div></div>
                    <div className={`sk${isCardHi('sk01')} ${currentDay >= 1 ? 's-done' : ''}`} style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">#01</span><span className="stag" style={{color:'#16a34a'}}>HIGH VALUE</span></div>Rate Limiting API<span className="ssz">M</span></div>
                    {currentDay >= 1 && currentDay < 2 && <div className={`sk${isCardHi('sk04')} s-new`}><div className="sk-top"><span className="snum">#04</span><span className="stag" style={{color:'#475569'}}>STANDARD</span></div>Extrato paginado<span className="ssz">P</span></div>}
                    {currentDay >= 4 && <div className={`sk${isCardHi('sk08')} s-new`} style={{borderColor:'#7c3aed'}}><div className="sk-top"><span className="snum">#08</span><span className="stag" style={{color:'#7c3aed'}}>HIGH VALUE</span></div>OAuth 2.1 (BCB)<span className="ssz">M</span></div>}
                  </div>

                </div>
              </div>

              {/* DELIVERY POINT */}
              <div className="s-dp"><div className="s-bl">🚀 DP</div></div>

              {/* ZONA ENTREGUE */}
              <div className="s-zone" style={{background:'#0a1f0a', border:'1px solid #14532d'}}>
                <div className="s-zone-lbl" style={{background:'#14532d', color:'#86efac'}}>✅ ENTREGUE</div>
                <div className="s-bcol" style={{minWidth:'108px'}}>
                  <div className="s-bh" style={{background:'#14532d', color:'#86efac'}}>🚀 Em Produção<span className="wlbl">ilimitado</span></div>
                  <div className="sk s-done" style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">D1</span><span className="stag" style={{color:'#16a34a'}}>✓ DONE</span></div>Auth JWK</div>
                  <div className="sk s-done" style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">D2</span><span className="stag" style={{color:'#16a34a'}}>✓ DONE</span></div>Endpoint status</div>
                  {currentDay >= 1 && <div className="sk s-done s-new" style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">#01</span><span className="stag" style={{color:'#16a34a'}}>✓ DONE</span></div>Rate Limiting API</div>}
                  {currentDay >= 2 && <div className="sk s-done s-new" style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">#04</span><span className="stag" style={{color:'#16a34a'}}>✓ DONE</span></div>Extrato Paginado</div>}
                  {currentDay >= 3 && <div className="sk s-done s-new" style={{borderColor:'#16a34a'}}><div className="sk-top"><span className="snum">#15</span><span className="stag" style={{color:'#16a34a'}}>✓ DONE</span></div>Cursor encoding</div>}
                </div>
              </div>

            </div>
          </div>{/* /story-board */}

          {/* ===== DAY 0 — SEGUNDA ===== */}
          {currentDay === 0 && (
            <div className="s-panel s-on">
              <div className="evs">
                <div className="ev ev-daily">
                  <div className="ev-hd"><span className="ev-time">09:00</span><span className="ev-type" style={{color:'#f97316'}}>☀️ DAILY STANDUP — 13 min · Board da direita para a esquerda</span></div>
                  <div className="ev-body">Carlos abre o board. Todos olham para o board — não para quem fala. Começa da direita: QA → Code Review → Em Progresso.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos (SM):</strong> Começando pela direita. QA: temos o <span className="cref" onClick={()=>hlCard('sk01')}>#01 Rate Limiting API</span>. Luana, tudo ok?</div></div>
                    <div className="dm r"><div className="av" style={{background:'#14532d', color:'#86efac'}}>L</div><div className="bb"><strong>Luana:</strong> Sim, terminando hoje. Falta validar o critério técnico de 200ms de p99 — conforme o DoR técnico que definimos.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Code Review: <span className="cref" onClick={()=>hlCard('sk02')}>#02 Paginação parceiros</span>. Está há 1 dia. Beatriz, quando você revisa?</div></div>
                    <div className="dm r"><div className="av" style={{background:'#7f1d1d', color:'#fca5a5'}}>B</div><div className="bb"><strong>Beatriz:</strong> Faço depois do stand-up — dentro do SLA de 8h para itens M.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Em Progresso: WIP = 2/3, temos espaço. <span className="cref" onClick={()=>hlCard('sk03')}>#03 Endpoint consentimento</span> — Rafael?</div></div>
                    <div className="dm r"><div className="av" style={{background:'#ea580c', color:'#fff'}}>R</div><div className="bb"><strong>Rafael:</strong> Em andamento, sem bloqueio. Entrego amanhã.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> <span className="cref" onClick={()=>hlCard('sk04')}>#04 Extrato paginado</span> — esse item está com o highlight porque está quase pronto. Diego?</div></div>
                    <div className="dm r"><div className="av" style={{background:'#ea580c', color:'#fff'}}>D</div><div className="bb"><strong>Diego:</strong> Terminando agora. PR aberto em 30 minutos.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Pronto para Puxar tem 3 itens — acima do limiar de 2. Sem reposição hoje. Bloqueios?</div></div>
                    <div className="dm"><div className="av" style={{background:'#7c3aed', color:'#fff'}}>A</div><div className="bb"><strong>Ana (PO):</strong> Nenhum bloqueio. Daily encerrada em 13 min. 🎉</div></div>
                  </div>
                </div>

                <div className="ev ev-inc">
                  <div className="ev-hd"><span className="ev-time">11:23</span><span className="ev-type" style={{color:'#dc2626'}}>🚨 INCIDENTE — Protocolo Expedite acionado</span></div>
                  <div className="ev-body">Parceiro Santander: <strong>GET /saldo</strong> retornando 504 para 100% das requisições. 40.000 clientes sem acesso ao extrato.</div>
                  <div className="dlg">
                    <div className="dm al"><div className="av" style={{background:'#7f1d1d', color:'#fca5a5'}}>🔔</div><div className="bb"><strong>Santander → #incidents:</strong> /saldo retornando 504 Gateway Timeout. Impacto: 100% das chamadas. Precisamos de resolução urgente!</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Protocolo Expedite acionado. Crio card <span className="cref" onClick={()=>hlCard('sexp-prog')}>#EXP Bug /saldo 504</span> na Expedite Lane. Diego e Beatriz — pausem o que estão fazendo. Rafael, você lidera.</div></div>
                    <div className="dm r"><div className="av" style={{background:'#ea580c', color:'#fff'}}>R</div><div className="bb"><strong>Rafael:</strong> Olhando os logs de produção. Suspeita inicial: o cache de token não está renovando antes do vencimento.</div></div>
                    <div className="dm r"><div className="av" style={{background:'#7f1d1d', color:'#fca5a5'}}>B</div><div className="bb"><strong>Beatriz:</strong> Confirmado no Redis. TTL configurado: 3600s. Token expira em: 3500s. Diferença de 100s causa race condition na renovação.</div></div>
                    <div className="dm r"><div className="av" style={{background:'#ea580c', color:'#fff'}}>R</div><div className="bb"><strong>Rafael:</strong> Fix: adicionar margem de 10% no TTL (3240s em vez de 3600s). 2 linhas de código. Deploy em 5 min.</div></div>
                    <div className="dm"><div className="av" style={{background:'#16a34a', color:'#fff'}}>✓</div><div className="bb" style={{background:'#0a1f0a', color:'#86efac'}}><strong>Sistema 12:04:</strong> Deploy realizado. Taxa de erro: 0%. Santander confirmou normalização. ✅ TTR total: 41 minutos.</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== DAY 1 — TERÇA ===== */}
          {currentDay === 1 && (
            <div className="s-panel s-on">
              <div className="evs">
                <div className="ev ev-daily">
                  <div className="ev-hd"><span className="ev-time">09:00</span><span className="ev-type" style={{color:'#f97316'}}>☀️ DAILY STANDUP — 11 min</span></div>
                  <div className="ev-body"><span className="cref" onClick={()=>hlCard('sk01')}>#01 Rate Limiting</span> entrou em produção ontem à noite! Pronto/Puxar caiu para 2 itens → abaixo do limiar de 2.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Boa notícia: <span className="cref" onClick={()=>hlCard('sk01')}>#01 Rate Limiting</span> passou pelo DoD e foi para produção ontem. Parabéns, Luana! Pronto/Puxar está com 2 itens — no limiar. Preciso de replenishment hoje. Ana, às 14h?</div></div>
                    <div className="dm r"><div className="av" style={{background:'#7c3aed', color:'#fff'}}>A</div><div className="bb"><strong>Ana:</strong> Confirma. Já tenho os 3 candidatos preparados com DoR de negócio.</div></div>
                  </div>
                </div>

                <div className="ev ev-repl">
                  <div className="ev-hd"><span className="ev-time">14:00</span><span className="ev-type" style={{color:'#2563eb'}}>🔧 QUEUE REPLENISHMENT — 28 min</span></div>
                  <div className="ev-body">Ana apresenta 3 candidatos do backlog. Time aplica o DoR de negócio em cada um.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#7c3aed', color:'#fff'}}>A</div><div className="bb"><strong>Ana:</strong> Candidato 1: <span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth 2.1 (BCB)</span>. Candidato 2: <span className="cref" onClick={()=>hlCard('sk09')}>#09 Logs de auditoria</span>. Candidato 3: <span className="cref" onClick={()=>hlCard('sk06')}>Paginação /consents</span>.</div></div>
                    <div className="dm r"><div className="av" style={{background:'#14532d', color:'#86efac'}}>L</div><div className="bb"><strong>Luana:</strong> Sobre o <span className="cref" onClick={()=>hlCard('sk09')}>#09</span>: "o que exatamente logar" não está definido. DoR incompleto! Não passa.</div></div>
                    <div className="dm"><div className="av" style={{background:'#7c3aed', color:'#fff'}}>A</div><div className="bb"><strong>Ana:</strong> Boa captura! <span className="cref" onClick={()=>hlCard('sk09')}>#09</span> volta ao backlog.</div></div>
                  </div>
                </div>

                <div className="ev ev-tech">
                  <div className="ev-hd"><span className="ev-time">14:30</span><span className="ev-type" style={{color:'#0891b2'}}>🔧 REFINAMENTO TÉCNICO — 22 min</span></div>
                  <div className="ev-body">Rafael, Beatriz e Diego analisam os 2 itens.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#ea580c', color:'#fff'}}>R</div><div className="bb bc"><strong>Rafael:</strong> <span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth</span>: Node 18 não suporta o algoritmo EdDSA. Precisa de upgrade para Node 20. Farei um Spike de 4h para verificar o esforço.</div></div>
                  </div>
                  <div className="ins"><strong>💡 Por que o Refinamento Técnico importou:</strong> Sem ele, o <span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth</span> entraria em progresso e descobriria o problema do Node 18 no meio da implementação — gerando um bloqueio de 2 a 3 dias. 22 minutos economizaram 3 dias de lead time.</div>
                </div>
              </div>
            </div>
          )}

          {/* ===== DAY 2 — QUARTA ===== */}
          {currentDay === 2 && (
            <div className="s-panel s-on">
              <div className="evs">
                <div className="ev ev-daily">
                  <div className="ev-hd"><span className="ev-time">09:00</span><span className="ev-type" style={{color:'#f97316'}}>☀️ DAILY STANDUP — 14 min</span></div>
                  <div className="ev-body">Grande dia: <span className="cref" onClick={()=>hlCard('sk04')}>#04 Extrato paginado</span> sai de QA. <span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth</span> entra em Pronto/Puxar.</div>
                </div>

                <div className="ev ev-note">
                  <div className="ev-hd"><span className="ev-time">11:30</span><span className="ev-type" style={{color:'#16a34a'}}>📤 <span className="cref" onClick={()=>hlCard('sk04')}>#04 Extrato paginado</span> → Produção (10% rollout)</span></div>
                </div>

                <div className="ev ev-inc">
                  <div className="ev-hd"><span className="ev-time">14:00</span><span className="ev-type" style={{color:'#dc2626'}}>⚠️ Feedback crítico — <span className="cref" onClick={()=>hlCard('sk04')}>#04</span> bloqueado em 10%</span></div>
                  <div className="ev-body">Bradesco detecta problema de segurança no rollout.</div>
                  <div className="dlg">
                    <div className="dm al"><div className="av" style={{background:'#7f1d1d', color:'#fca5a5'}}>🔔</div><div className="bb"><strong>Bradesco → #parceiros:</strong> <span className="cref" onClick={()=>hlCard('sk04')}>#04 Extrato paginado</span> — o campo "cursor" expõe o ID interno. Precisa ser base64.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> Criado <span className="cref" onClick={()=>hlCard('sk15')}>#15 Bug HIGH VALUE</span>. Diego puxa assim que acabar o card atual.</div></div>
                  </div>
                  <div className="ins"><strong>💡 Scrumban em ação:</strong> O item HIGH VALUE entra na frente da fila e foi para produção em &lt;22 horas. Não precisou esperar o "próximo sprint".</div>
                </div>
              </div>
            </div>
          )}

          {/* ===== DAY 3 — QUINTA ===== */}
          {currentDay === 3 && (
            <div className="s-panel s-on">
              <div className="evs">
                <div className="ev ev-daily">
                  <div className="ev-hd"><span className="ev-time">09:00</span><span className="ev-type" style={{color:'#f97316'}}>☀️ DAILY STANDUP — 11 min · Dia de Demo</span></div>
                  <div className="ev-body">Daily enxuta — demo às 15h. <span className="cref" onClick={()=>hlCard('sk04')}>#04</span> e <span className="cref" onClick={()=>hlCard('sk15')}>#15</span> a caminho de 100% rollout.</div>
                </div>

                <div className="ev ev-note">
                  <div className="ev-hd"><span className="ev-time">12:34</span><span className="ev-type" style={{color:'#16a34a'}}>🚀 <span className="cref" onClick={()=>hlCard('sk15')}>#15 cursor encoding</span> → Produção · <span className="cref" onClick={()=>hlCard('sk04')}>#04</span> vai a 100% rollout</span></div>
                </div>

                <div className="ev ev-demo">
                  <div className="ev-hd"><span className="ev-time">15:00</span><span className="ev-type" style={{color:'#7c3aed'}}>🎬 DEMO MENSAL — 52 min</span></div>
                  <div className="ev-body">Presentes: Squad + Gerente de Parcerias + Dr. Ferreira (BCB) + Parceiros.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#16a34a', color:'#fff'}}>M</div><div className="bb" style={{background:'#0a1f0a', color:'#86efac'}}><strong>Marcos (Bradesco):</strong> Impressionante. Vocês responderam ao problema de segurança mais rápido que nossa equipe interna.</div></div>
                    <div className="dm r"><div className="av" style={{background:'#1d4ed8', color:'#fff'}}>F</div><div className="bb"><strong>Dr. Ferreira (BCB):</strong> Sobre o <span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth 2.1</span> — quando estará disponível?</div></div>
                    <div className="dm"><div className="av" style={{background:'#7c3aed', color:'#fff'}}>A</div><div className="bb"><strong>Ana:</strong> Temos <strong>alta confiança de entrega na próxima semana</strong> com nosso lead time atual. Bem antes do prazo.</div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== DAY 4 — SEXTA ===== */}
          {currentDay === 4 && (
            <div className="s-panel s-on">
              <div className="evs">
                <div className="ev ev-daily">
                  <div className="ev-hd"><span className="ev-time">09:00</span><span className="ev-type" style={{color:'#f97316'}}>☀️ DAILY STANDUP — 12 min</span></div>
                  <div className="ev-body"><span className="cref" onClick={()=>hlCard('sk08')}>#08 OAuth</span> passou por Code Review e está em QA. Retrospectiva em 1 hora.</div>
                </div>

                <div className="ev ev-ret">
                  <div className="ev-hd"><span className="ev-time">10:00</span><span className="ev-type" style={{color:'#16a34a'}}>📊 RETROSPECTIVA DE FLUXO — 85 min · Com CFD real</span></div>
                  <div className="ev-body">Carlos projeta o CFD da quinzena. Todos olham para dados — não para percepções.</div>
                  <div className="dlg">
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> "A banda de Code Review engrossou na semana 1. WIP = 2/2 travado por 3 dias. O que aconteceu?"</div></div>
                    <div className="dm r"><div className="av" style={{background:'#14532d', color:'#86efac'}}>L</div><div className="bb"><strong>Luana:</strong> Só Rafael e Beatriz fazem review de código de API. Diego e eu nunca fizemos. É concentração de conhecimento.</div></div>
                    <div className="dm"><div className="av" style={{background:'#1e3a5f', color:'#60a5fa'}}>C</div><div className="bb bc"><strong>Carlos:</strong> "Proposta de Experimento: Diego faz pair review com Rafael em pelo menos 2 PRs nas próximas 2 semanas."</div></div>
                  </div>
                </div>

                <div className="ws">
                  <div style={{fontSize:'14px', fontWeight:800, color:'#fff', marginBottom:'10px'}}>📊 Resumo da Semana — Squad Open Banking</div>
                  <div className="ws-g">
                    <div className="ws-b"><div className="ws-v">4</div><div className="ws-l">cards entregues</div></div>
                    <div className="ws-b"><div className="ws-v">41m</div><div className="ws-l">TTR incident</div></div>
                    <div className="ws-b"><div className="ws-v">22h</div><div className="ws-l">feedback Bradesco → produção</div></div>
                    <div className="ws-b"><div className="ws-v">78</div><div className="ws-l">NPS parceiros</div></div>
                    <div className="ws-b"><div className="ws-v">0</div><div className="ws-l">bloqueios crônicos</div></div>
                    <div className="ws-b"><div className="ws-v">2</div><div className="ws-l">experimentos retro</div></div>
                  </div>
                  <div className="pr"><div className="pr-lh"><span>Lead Time médio (meta: &lt;8d)</span><span style={{color:'#16a34a'}}>6 dias ✅</span></div><div className="pr-b"><div className="pr-f" style={{width:'75%', background:'#16a34a'}}></div></div></div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

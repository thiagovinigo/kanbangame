import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { KanbanGuide } from './components/KanbanGuide';
import { PolicyModal } from './components/PolicyModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ReplenishmentModal } from './components/ReplenishmentModal';
import { DailyModal } from './components/DailyModal';
import { DailyGuidePanel } from './components/DailyGuidePanel';
import { RetrospectiveDashboard } from './components/RetrospectiveDashboard';
import { DemoModal } from './components/DemoModal';
import { NarratorOverlay } from './components/NarratorOverlay';
import { useAutoSimulation } from './hooks/useAutoSimulation';
import { LayoutDashboard, GraduationCap, UserPlus, Activity, BarChart3, Presentation, PlayCircle } from 'lucide-react';
import './index.css';

function AppContent() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [policyColumn, setPolicyColumn] = useState(null);
  const [isReplenishmentOpen, setIsReplenishmentOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const simulation = useAutoSimulation({
    setIsReplenishmentOpen,
    setIsDailyOpen,
    setIsDemoOpen,
    setIsRetroOpen
  });

  return (
    <div className="app-container">
      <header className="header glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', padding: '8px', borderRadius: '8px' }}>
            <LayoutDashboard size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Simulador Kanban</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aprenda Fluxo & Limites</span>
          </div>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={simulation.startSimulation} 
            disabled={simulation.isActive}
            title="Iniciar Tutorial/Simulação Guiada" 
            style={{ background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: 'white' }}
          >
            <PlayCircle size={18} />
            Auto-Simulação
          </button>
          <button className="btn btn-secondary" onClick={() => setIsDemoOpen(true)} title="Fazer Reunião de Demonstração (Review)" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
            <Presentation size={18} />
            Demo
          </button>
          <button className="btn btn-secondary" onClick={() => setIsRetroOpen(true)} title="Fazer Service Delivery Review" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
            <BarChart3 size={18} />
            Retrospectiva
          </button>
          <button className="btn btn-secondary" onClick={() => setIsDailyOpen(true)} title="Fazer Reunião Diária (Kanban Meeting)" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
            <Activity size={18} />
            Daily
          </button>
          <button className="btn btn-secondary" onClick={() => setIsReplenishmentOpen(true)} title="Fazer Reunião de Replenishment" style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
            <UserPlus size={18} />
            Replenishment
          </button>
          <button className="btn btn-secondary" onClick={() => setIsRulesOpen(true)}>
            <GraduationCap size={18} />
            Aprender Kanban
          </button>
        </div>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ControlPanel />
        <Board onOpenPolicy={(col) => setPolicyColumn(col)} />
        <MetricsPanel />
      </main>
      <KanbanGuide isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <ReplenishmentModal isOpen={isReplenishmentOpen} onClose={() => setIsReplenishmentOpen(false)} />
      <DailyModal isOpen={isDailyOpen} onClose={() => setIsDailyOpen(false)} />
      <RetrospectiveDashboard isOpen={isRetroOpen} onClose={() => setIsRetroOpen(false)} />
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <DailyGuidePanel />
      <PolicyModal isOpen={!!policyColumn} onClose={() => setPolicyColumn(null)} column={policyColumn} />
      <FeedbackModal />
      {simulation.isActive && (
        <NarratorOverlay 
          message={simulation.message}
          isEndOfDay={simulation.isEndOfDay}
          currentQuiz={simulation.currentQuiz}
          onStartQuiz={simulation.handleStartQuiz}
          onAnswerQuiz={simulation.handleAnswerQuiz}
          onNext={simulation.nextStep}
          onSkip={simulation.stopSimulation}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;

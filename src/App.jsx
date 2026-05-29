import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { Board } from './components/Board';
import { ControlPanel } from './components/ControlPanel';
import { MetricsPanel } from './components/MetricsPanel';
import { KanbanGuide } from './components/KanbanGuide';
import { PolicyModal } from './components/PolicyModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LayoutDashboard, GraduationCap } from 'lucide-react';
import './index.css';

function AppContent() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [policyColumn, setPolicyColumn] = useState(null);

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
        <button className="btn btn-secondary" onClick={() => setIsRulesOpen(true)}>
          <GraduationCap size={18} />
          Aprender Kanban
        </button>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ControlPanel />
        <Board onOpenPolicy={(col) => setPolicyColumn(col)} />
        <MetricsPanel />
      </main>
      <KanbanGuide isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <PolicyModal isOpen={!!policyColumn} onClose={() => setPolicyColumn(null)} column={policyColumn} />
      <FeedbackModal />
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

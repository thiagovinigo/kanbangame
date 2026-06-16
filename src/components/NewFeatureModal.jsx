import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../utils/supabaseClient';
import { X, Sparkles, Loader2 } from 'lucide-react';

export const NewFeatureModal = ({ onClose, onFeatureCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Chamar a IA para quebrar a Feature em Histórias
      const aiResponse = await fetch('/api/breakdown-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureTitle: title, featureDescription: description })
      });

      if (!aiResponse.ok) {
        throw new Error('Falha ao se comunicar com a Inteligência Artificial');
      }

      const aiData = await aiResponse.json();
      const stories = aiData.stories || [];

      // 2. Salvar a Feature no Supabase
      const { data: featureData, error: featureError } = await supabase
        .from('features')
        .insert([{ title, description }])
        .select()
        .single();

      if (featureError) throw featureError;

      // 3. Salvar as Histórias geradas no Supabase (coluna Backlog IA)
      const cardsToInsert = stories.map((story) => ({
        id: `ai-card-${crypto.randomUUID().slice(0, 8)}`,
        feature_id: featureData.id,
        column_id: 'col-ai-backlog',
        title: story.title,
        description: story.description,
        type: story.type || 'padrao',
        points: story.points || 2,
        artifacts: { prd: null, spec: null, qa: null, stories: null, releaseNotes: null },
        risks: [],
        ai_status: 'Gerado pelo PO Copilot',
        updater_run: false
      }));

      const { error: cardsError } = await supabase
        .from('cards')
        .insert(cardsToInsert);

      if (cardsError) throw cardsError;

      // Sucesso
      if (onFeatureCreated) {
        onFeatureCreated(featureData, cardsToInsert);
      }
      onClose();

    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao processar a feature');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="glass-panel" style={{
        width: '500px', maxWidth: '90%', padding: '24px', position: 'relative',
        background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
        borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', marginTop: 0 }}>
          <Sparkles size={24} /> Criar Nova Feature (Épico)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          O <strong>PO Copilot</strong> irá analisar sua ideia e quebrá-la em Histórias de Usuário técnicas prontas para o Kanban.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
              O que você deseja construir? (Título)
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Sistema de Login via Google"
              disabled={isLoading}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-glass)',
                color: 'white', fontSize: '1rem', boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 500 }}>
              Detalhes ou Regras de Negócio (Opcional)
            </label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Ex: Deve suportar Apple e Google, o usuário deve receber email de boas vindas..."
              disabled={isLoading}
              rows={4}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-glass)',
                color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !title.trim()}
            style={{
              marginTop: '8px', padding: '14px', borderRadius: '8px',
              background: isLoading ? 'var(--bg-glass)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem',
              cursor: isLoading || !title.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Processando com IA...</> : <><Sparkles size={18} /> Quebrar em Histórias</>}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

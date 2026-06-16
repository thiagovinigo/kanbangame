import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Carrega as variáveis do .env.local
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint para quebrar Feature em Histórias
app.post('/api/breakdown-feature', async (req, res) => {
  try {
    const { featureTitle, featureDescription } = req.body;

    if (!featureTitle) {
      return res.status(400).json({ error: 'Título da feature é obrigatório' });
    }

    const prompt = `
    Você é o PO Copilot (Product Owner IA).
    O usuário solicitou o desenvolvimento da seguinte Feature/Épico:
    Título: ${featureTitle}
    Descrição: ${featureDescription || 'Sem descrição adicional.'}

    Sua tarefa é quebrar essa feature em exatas 3 histórias de usuário (User Stories) independentes e técnicas que podem ser colocadas em um quadro Kanban.
    
    Responda APENAS com um objeto JSON no seguinte formato, sem formatação markdown extra:
    {
      "stories": [
        { "title": "...", "description": "...", "points": 2, "type": "padrao" }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error('Erro na OpenAI:', error);
    res.status(500).json({ error: 'Falha ao processar com a IA' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🤖 Servidor Proxy IA rodando na porta ${PORT}`);
});

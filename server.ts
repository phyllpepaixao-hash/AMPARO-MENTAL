import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction enforcing all clinical safety principles
const CLINICAL_SYSTEM_INSTRUCTION = `
Você é a IA de acolhimento e escuta do aplicativo "Entre — Um próximo passo, no seu ritmo".
Sua missão é ser um refúgio acolhedor, lúcido, empático e prático para o momento presente em português brasileiro.

PRINCÍPIOS CLÍNICOS E ÉTICOS INEGOCIÁVEIS:
1. NUNCA dê diagnósticos nem afirme que a pessoa tem depressão, ansiedade, burnout, TDAH ou qualquer transtorno.
2. NUNCA prescreva, sugira, ajuste dosagens ou opine sobre iniciar/parar medicamentos. Encaminhe sempre para o médico responsável.
3. NUNCA finja ser psicoterapeuta nem prometa curas ou confidencialidade absoluta.
4. LINGUAGEM: Simples, humana, calorosa, compassiva, sem jargões médicos e SEM POSITIVIDADE TÓXICA (nunca diga coisas vazias como "vai ficar tudo bem", "sorria", "tenha gratidão").
5. REGRA DA PERGUNTA ÚNICA: Faça no máximo UMA pergunta breve por mensagem para não sobrecarregar a mente da pessoa.
6. VALIDAÇÃO PRIMEIRO: Reconheça e acolha com carinho o que a pessoa expressou ANTES de oferecer qualquer sugestão.
7. O PRÓXIMO PASSO PEQUENO: Conclua sempre a resposta oferecendo um próximo passo voluntário, realista e minúsculo (de 2 a 10 minutos): beber água fresca, abrir a janela, lavar o rosto, deitar sem telas por 5 minutos, alongar o pescoço, etc. Nunca imponha como obrigação.
8. ANTIDEPENDÊNCIA: Se o usuário demonstrar apego excessivo ou disser que só confia em você, lembre com gentileza que você é um programa de computador e estimule a reconexão com seres humanos reais.
9. SITUAÇÕES DE CRISE: Se detectar qualquer menção de ideação suicida, automutilação ou violência, acolha a dor, pergunte se ela está em segurança imediata e oriente a ligar para o CVV (188) ou SAMU (192).
`;

// API status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
  });
});

// API chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, userName } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem inválida' });
      return;
    }

    // If Gemini API is available, call gemini-3.8-flash
    if (ai) {
      try {
        const contents: any[] = [];

        // Add history context (last 6 messages max for privacy and token economy)
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.sender === 'user') {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'assistant') {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          }
        }

        // Add current user message
        const userPrompt = userName ? `[Usuário se chama ${userName}]: ${message}` : message;
        contents.push({ role: 'user', parts: [{ text: userPrompt }] });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: CLINICAL_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text || 'Estou aqui com você. O que seria mais confortável para o seu corpo e mente agora?';

        // Extract a tiny micro step suggestion if mentioned or derive one
        let suggestedNextStep = 'Beber um copo de água fresca e respirar no seu ritmo';
        const stepMatch = replyText.match(/próximo passo[^.:\n]*?(?:ser|:|-)?\s*([a-záéíóúâêôãõç\s0-9,-]{8,80})/i);
        if (stepMatch && stepMatch[1] && stepMatch[1].trim().length > 6) {
          let cleaned = stepMatch[1].trim().replace(/^(de|em|para|a)\s+/i, '');
          suggestedNextStep = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }

        res.json({
          reply: replyText,
          suggestedNextStep,
          source: 'gemini-3.8-flash',
        });
        return;
      } catch (geminiError: any) {
        console.error('Erro na chamada do Gemini:', geminiError?.message || geminiError);
        // Fall back gracefully below
      }
    }

    // Graceful, safe response if no API key or if API call fails
    res.json({
      reply: 'Eu escuto o que você está trazendo e percebo o quanto esse momento está pedindo calma. Você não precisa carregar o peso do mundo todo hoje.\n\nSe você pudesse escolher apenas uma coisa minúscula para aliviar um pouco agora, qual seria?',
      suggestedNextStep: 'Alongar os ombros suavemente e beber um gole de água',
      source: 'safe-local-fallback',
    });
  } catch (error: any) {
    console.error('Erro no endpoint de chat:', error);
    res.status(500).json({
      error: 'Não foi possível processar a conversa no momento.',
      fallback: 'Estou com você neste instante. Que tal pausarmos por um minuto para respirar com calma?',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Entre server running on port ${PORT} [Gemini: ${Boolean(apiKey) ? 'Available' : 'Simulated'}]`);
  });
}

startServer();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Simplification endpoint
  app.post('/api/simplify', async (req, res) => {
    try {
      const { text, docType = 'geral', targetAudience = 'cidadao', temperature = 0.3 } = req.body;

      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'O texto jurídico para tradução é obrigatório.' });
      }

      const tempValue = Math.min(Math.max(Number(temperature) || 0.3, 0.1), 0.5);

      const systemInstruction = `Você é um especialista em facilitação de linguagem jurídica e atua no Tribunal de Justiça de Roraima (TJRR). Sua missão é traduzir textos judiciais complexos para uma linguagem simples e compreensível para cidadãos sem formação jurídica, alinhando-se com as diretrizes do Pacto Nacional do Judiciário pela Linguagem Simples do Conselho Nacional de Justiça (CNJ).

REGRAS DE GERAÇÃO:
1. Elimine jargões, expressões em latim e termos técnicos desnecessários. Se o termo técnico for inevitável, explique-o de forma didática na mesma frase.
2. Utilize frases curtas, na ordem direta (sujeito, verbo e complemento).
3. Mantenha um tom neutro, respeitoso, empático e acolhedor.
4. Estruture a saída em tópicos curtos sempre que houver ações que o cidadão precise tomar (ex: prazos, documentos a apresentar).
5. RESTRIÇÃO CRÍTICA INEGOCIÁVEL: O texto simplificado NÃO PODE alterar a essência, as obrigações legais, os prazos ou as consequências descritas no texto original.

FORMATO DE SAÍDA EXIGIDO:
- Resumo: 1 a 2 frases explicando o que aconteceu no processo de maneira direta e compreensível.
- O que isso significa: Tradução do jargão principal e explicação clara do significado prático para a vida do cidadão.
- Próximos Passos: O que o cidadão precisa fazer agora, se houver (se não houver ação imediata, explique isso claramente para tranquilizá-lo).
- Prazos: Detalhe se há prazos em andamento, quantos dias e a consequência de não cumprir.
- Decisão/Resultado: Indique em poucas palavras o sentido da decisão (Favorável, Desfavorável, Andamento de rotina, Notificação, etc.).
- Glossário: Termos técnicos ou expressões em latim presentes no texto original, traduzidos de forma simples.`;

      const prompt = `Tipo de documento jurídico informado: ${docType}
Modo de simplificação: ${targetAudience}

Texto Jurídico Original para Simplificação:
"""
${text.trim()}
"""

Retorne sua análise estritamente no formato JSON correspondente ao esquema fornecido.`;

      const generateWithModel = async (modelName: string) => {
        const genPromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: tempValue,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'Resumo em 1 a 2 frases explicando o que aconteceu no processo.',
                },
                meaning: {
                  type: Type.STRING,
                  description: 'Tradução do jargão principal e o que isso significa na prática.',
                },
                outcome: {
                  type: Type.STRING,
                  description: 'Classificação do andamento: Favorável, Desfavorável, Andamento de rotina, Intimação de prazo, etc.',
                },
                nextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Lista de tópicos curtos com o que o cidadão precisa fazer agora.',
                },
                hasActionRequired: {
                  type: Type.BOOLEAN,
                  description: 'Indica se o cidadão precisa tomar alguma providência prática.',
                },
                deadlineInfo: {
                  type: Type.STRING,
                  description: 'Informação sobre prazos (ex: 15 dias úteis, ou Nenhum prazo imediato).',
                },
                needsLawyer: {
                  type: Type.STRING,
                  description: 'Orientação sobre necessidade de advogado ou Defensoria Pública do Estado de Roraima (DPE-RR).',
                },
                glossary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING, description: 'Termo jurídico ou em latim' },
                      definition: { type: Type.STRING, description: 'Significado em linguagem simples' },
                    },
                    required: ['term', 'definition'],
                  },
                  description: 'Glossário didático com termos encontrados no documento.',
                },
                formattedText: {
                  type: Type.STRING,
                  description: 'Versão em texto corrido e bem formatado com as seções Resumo, O que isso significa e Próximos Passos para cópia rápida.',
                },
              },
              required: ['summary', 'meaning', 'nextSteps', 'hasActionRequired', 'deadlineInfo', 'formattedText'],
            },
          },
        });

        // Strict 6.5s timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('TIMEOUT_GEMINI_API')), 6500);
        });

        return await Promise.race([genPromise, timeoutPromise]);
      };

      let response;
      let usedModel = 'gemini-3.8-flash';
      let isFallback = false;

      try {
        response = await generateWithModel('gemini-3.8-flash');
      } catch (firstErr: any) {
        console.warn('Attempt with gemini-3.8-flash timed out or failed, trying gemini-3.1-flash-lite...', firstErr?.message);
        try {
          usedModel = 'gemini-3.1-flash-lite';
          response = await generateWithModel('gemini-3.1-flash-lite');
        } catch (secondErr: any) {
          console.warn('Gemini models unavailable/slow, using TJRR semantic legal parser fallback...', secondErr?.message);
          isFallback = true;
        }
      }

      if (isFallback) {
        const { parseLegalTextRuleBased } = await import('./src/utils/legalParser.js');
        const fallbackData = parseLegalTextRuleBased(text, docType);
        return res.json({
          success: true,
          data: fallbackData,
          modelUsed: 'motor-semantico-tjrr (Linguagem Simples CNJ)',
          isFallback: true,
        });
      }

      const rawJson = response?.text || '{}';
      const parsedData = JSON.parse(rawJson);

      return res.json({
        success: true,
        data: parsedData,
        modelUsed: usedModel,
      });
    } catch (err: any) {
      console.error('Error in /api/simplify:', err);
      try {
        const { parseLegalTextRuleBased } = await import('./src/utils/legalParser.js');
        const fallbackData = parseLegalTextRuleBased(req.body?.text || '', req.body?.docType || 'geral');
        return res.json({
          success: true,
          data: fallbackData,
          modelUsed: 'motor-semantico-tjrr (Linguagem Simples CNJ)',
          isFallback: true,
        });
      } catch {
        return res.status(500).json({
          error: err?.message || 'Falha ao processar e simplificar o texto jurídico.',
        });
      }
    }
  });

  // TTS endpoint for voice reading
  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texto não fornecido para síntese de voz.' });
      }

      const textToRead = text.slice(0, 1000);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: textToRead,
                speechMetadata: {
                  style: 'Voz institucional amigável, clara, pausada e acessível em português brasileiro.',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(500).json({ error: 'Áudio não gerado pelo modelo.' });
      }

      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } catch (err: any) {
      console.error('TTS error:', err);
      return res.status(500).json({ error: 'Falha na geração de áudio' });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

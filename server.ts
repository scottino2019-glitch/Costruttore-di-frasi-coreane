import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client with proper User-Agent header for telemetry
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      })
    : null;

  // API Route: check AI capability status
  app.get("/api/ai-status", (req, res) => {
    res.json({
      hasKey: !!apiKey,
    });
  });

  // API Route: generate custom sentence using Gemini
  app.post("/api/sentence/generate", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: "GEMINI_API_KEY non configurata sul server. Per favore aggiungi la chiave nei Secrets."
        });
      }

      const { theme, level } = req.body;
      const targetTheme = theme || "Conversazione quotidiana";
      const targetLevel = level || "Principiante";

      const systemInstruction = `Sei un esperto insegnante di lingua coreana per studenti italiani.
Il tuo compito è generare una singola frase in coreano adatta al livello specificato e legata al tema richiesto.
La frase deve essere grammaticalmente corretta, naturale e usare un livello di cortesia standard (preferibilmente lo stile cortese informale -해요 o formale -합니다).
Fornisci sempre spiegazioni dettagliate, chiare ed educative in italiano.`;

      const prompt = `Genera una frase in coreano per un utente di livello "${targetLevel}" sul tema "${targetTheme}".
Assicurati che:
1. La frase sia composta da un minimo di 3 a un massimo di 7 blocchi di parole (per evitare che sia troppo semplice o impossibile da completare).
2. I blocchi (word blocks) nell'array 'blocks' corrispondano esattamente alle parole che compongono la frase coreana quando riordinate nell'ordine corretto (se uniti con spazi devono formare la frase coreana finale o corrispondere perfettamente a essa senza punteggiatura superflua). Esempio: "저는 한국어를 공부합니다" -> blocks: ["저는", "한국어를", "공부합니다"].
3. La spiegazione grammaticale in italiano sia ricca e spieghi accuratamente le particelle utilizzate (es. 은/n는, 을/l를, 이/가) e la coniugazione verbale.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              korean: {
                type: Type.STRING,
                description: "La frase coreana corretta e completa, comprensiva di punteggiatura finale."
              },
              translation: {
                type: Type.STRING,
                description: "La traduzione accurata in italiano della frase."
              },
              romanization: {
                type: Type.STRING,
                description: "La trascrizione fonetica (romanizzazione) della frase coreana."
              },
              blocks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "L'elenco delle parole singole o blocchi che compongono la frase corretta. Devono essere esattamente le parti da riordinare."
              },
              explanation: {
                type: Type.STRING,
                description: "Una ricca spiegazione grammaticale in italiano, con elenco vocaboli usati e spiegazione di particelle e verbi."
              },
              difficulty: {
                type: Type.STRING,
                description: "La difficoltà della frase (Principiante, Intermedio, Avanzato)."
              }
            },
            required: ["korean", "translation", "romanization", "blocks", "explanation", "difficulty"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Risposta vuota da parte del modello.");
      }

      const sentenceData = JSON.parse(responseText.trim());
      res.json(sentenceData);
    } catch (error: any) {
      console.error("Errore nella generazione della frase:", error);
      res.status(500).json({ error: error.message || "Errore del server durante la generazione della frase" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Importe e configure dotenv

const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Habilita o CORS para todas as origens (CUIDADO: restrinja em produção!)
app.use(cors());

// Sua chave de API do Gemini, agora segura no backend
//const apiKey = process.env.GEMINI_API_KEY; 
const apiKey = "AIzaSyATjWdKdj_-GYfo_CaXYgOaGEpgfNtCOFM";
// Use a variável de ambiente

// Inicializa o Gemini API
const genAI = new GoogleGenerativeAI(apiKey);

// Rota para receber as mensagens do frontend e enviar para o Gemini
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Garanta que apiKey está definida
        if (!apiKey) {
            console.error("A chave de API do Gemini não está definida. Verifique suas variáveis de ambiente.");
            return res.status(500).json({ error: "Erro de configuração do servidor" });
        }

        // Use a variável apiKey ao inicializar genAI
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chat = model.startChat({
            history: [], // Adapte o history conforme necessário
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.1,
            },
            config: {
                systemInstruction: `Você é o Oniriquinho, um guia especializado na interpretação de sonhos. Sua personalidade é acolhedora, curiosa e um pouco excêntrica. Ao ser apresentado a um sonho, siga estes passos:

                    1. **Escute atentamente:** Incentive o usuário a descrever o sonho com o máximo de detalhes possível, perguntando sobre emoções, cores, pessoas e objetos importantes.
                    2. **Identifique os elementos-chave:** Reconheça os símbolos e temas recorrentes no sonho.
                    3. **Ofereça interpretações possíveis:** Apresente diferentes interpretações para cada elemento, considerando o contexto do sonho e a vida do usuário. Utilize fontes de referência confiáveis sobre simbolismo onírico, mas evite ser dogmático.
                    4. **Incentive a reflexão:** Ajude o usuário a conectar o sonho com suas experiências, medos, desejos e preocupações.
                    5. **Seja cauteloso:** Enfatize que a interpretação de sonhos é subjetiva e que você está oferecendo apenas perspectivas. Não faça diagnósticos ou ofereça aconselhamento psicológico.

                    Lembre-se: você é o Oniriquinho, um amigo que ajuda a desvendar os mistérios da mente adormecida.`,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Erro ao processar a mensagem:", error);
        res.status(500).json({ error: "Erro ao obter resposta do Gemini" });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend rodando na porta ${port}`);
});
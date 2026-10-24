# Entre — Um próximo passo, no seu ritmo.

**Entre** é um aplicativo web progressivo de apoio ao bem-estar emocional, projetado em português brasileiro com foco em acolhimento, privacidade rigorosa, segurança clínica e clareza no momento presente. O app não substitui psicoterapia, psiquiatria ou atendimento médico de emergência, mas atua como um companheiro gentil para ajudar adultos a atravessarem momentos de sobrecarga, ansiedade, estresse ou cansaço através de pequenos passos seguros e viáveis (2 a 10 minutos).

---

## 🌟 Principais Recursos

1. **Check-in Emocional Sem Julgamentos:** Registro diário de humor, energia e necessidades emocionais, sem diagnósticos automáticos.
2. **Chat de Escuta com IA (Gemini Server-Side):** Assistência empática baseada no modelo `gemini-3.8-flash`, com diretrizes clínicas estritas (recusa de diagnósticos, recusa de conselhos de medicação e interceptador determinístico de crises).
3. **Mecanismo de Segurança e Crises (CVV / SAMU / SOS):** Interceptação imediata de termos de risco, exibindo contatos de emergência verificados no Brasil (CVV 188, SAMU 192) e opções de preparação de mensagens voluntárias para pessoas de confiança.
4. **Próximo Passo Prático:** Sugestões acionáveis e realistas para sair do paralisante "tudo ou nada".
5. **Diário com bloqueio opcional por PIN:** as anotações são armazenadas no navegador. O PIN da interface não deve ser tratado como criptografia dos dados armazenados.
6. **Paisagens Sonoras Offline (Web Audio API):** Síntese em tempo real de Chuva Suave, Ruído Marrom, Ondas do Mar e Tom Zen 432Hz sem downloads pesados.
7. **Ritual de Desaceleração Noturna:** Ferramentas para soltar o dia, avaliar a bateria de energia e induzir ao sono com ruído marrom.
8. **Preparação para Terapia e Consultas:** Organização de resumos semanais de check-ins e dúvidas para levar ao profissional de saúde.
9. **Transparência e LGPD:** Exportação e restauração completa de dados em JSON, modo visitante sem cadastro obrigatório, além de controles de acessibilidade (Modo Baixo Estímulo e Redução de Movimento).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS (v4), Lucide React.
- **Backend:** Node.js, Express, TypeScript (`tsx`), `@google/genai` (v2.4.0).
- **Áudio:** Web Audio API (geração procedural offline).
- **Armazenamento:** `localStorage` e `sessionStorage` (Privacidade em primeiro lugar).

---

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm ou yarn

---

## 🚀 Instalação e Execução Local

1. Clone o repositório ou abra o projeto no ambiente AI Studio.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente baseando-se no arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Adicione sua chave da API Gemini na variável `GEMINI_API_KEY` (ou configure no painel Secrets do AI Studio).
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O aplicativo estará disponível em `http://localhost:3000`.

---

## 📦 Compilação e Produção

Para compilar o aplicativo para produção:
```bash
npm run build
```

Para iniciar o servidor em modo de produção:
```bash
npm start
```

---

## 🧪 Testes e Verificação

Para executar a verificação de tipos TypeScript e o linter:
```bash
npm run lint
```

---

## 🔒 Privacidade, LGPD e Limitações

- **Armazenamento Local:** check-ins, diário, preferências e histórico do chat são armazenados no navegador. O armazenamento local não é criptografia e pode ser acessado por quem tiver acesso ao perfil do navegador. Quando a IA está habilitada, mensagens enviadas ao chat são encaminhadas ao backend e podem ser processadas pelo provedor de IA; não afirme que todas as conversas permanecem exclusivamente locais.
- **IA e Limitações:** As chamadas de IA passam pelo backend Express para proteger a chave da API. O modelo está instruído estritamente a não realizar diagnósticos, não prescrever medicamentos e direcionar casos agudos para serviços humanos de emergência.
- **Modo Visitante:** O aplicativo é totalmente funcional sem exigir criação de conta ou login em servidores externos.


## Refinamento visual (versão de trabalho)

- Identidade de marca ajustada para Entre na navegação superior.
- Novos tratamentos visuais para a página inicial e os cartões do EntrePlay, com cores ambientais distintas e estados de foco.
- Favoritos do EntrePlay persistidos no armazenamento local com validação básica dos dados lidos.
- Textos de privacidade atualizados para não prometer criptografia ou ausência de transferência de mensagens do chat.
- A compilação de produção ainda precisa ser validada no ambiente com as dependências instaladas.

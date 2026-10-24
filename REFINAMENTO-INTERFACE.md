# Entre — refinamento visual e transparência

## Alterações aplicadas

- Marca do cabeçalho alterada de Amparo para Entre.
- Identidade visual aprimorada com aurora de fundo, hero do EntrePlay, cartões de jogo com atmosferas de cores diferentes, estados de foco e hover e navegação inferior refinada.
- Favoritos do EntrePlay persistidos em `localStorage`, com validação do formato lido.
- Cartões de jogos recebem suporte a foco e ativação por teclado.
- Textos de privacidade revisados para distinguir dados armazenados no navegador do envio de mensagens ao serviço de IA.
- README atualizado para não alegar que PIN equivale a criptografia ou que todas as conversas ficam exclusivamente locais.

## Limitações e verificações pendentes

- `npm install --ignore-scripts --no-audit --no-fund` excedeu o tempo disponível neste ambiente; por isso, não foi possível confirmar `npm run lint` nem `npm run build`.
- As alterações visuais não foram verificadas por teste visual em navegador ou dispositivo físico.
- O armazenamento do diário continua baseado no mecanismo existente; esta entrega não implementa criptografia de ponta a ponta.
- A revisão completa da lógica de segurança do chat e testes de crise continua sendo uma tarefa separada antes de qualquer lançamento público.

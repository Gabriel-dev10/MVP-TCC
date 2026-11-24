# Deploy do MaricáMais na Vercel

## Publicar

1. Importe no Vercel o repositório que contém o `package.json` deste projeto.
2. Use o comando de build `npm run build` (ou `bun run build`).
3. Deixe o diretório de saída ser detectado pelo Nitro. O preset `vercel` gera a saída no formato esperado pela plataforma.
4. Publique. Não são necessárias variáveis de ambiente nem um servidor de banco de dados para esta demonstração.

O projeto usa TanStack Start com SSR. Não configure a saída como `.output/public` nem adicione um rewrite para `/index.html`: isso descartaria o servidor SSR gerado pelo Nitro.

## Base de dados simulada

Os dados iniciais são carregados de `src/data/demo.ts`. Cadastros, anúncios, alterações de status, mensagens de interesse e lances são armazenados em `localStorage` no navegador, na chave `maricamais:database:v1`.

Essa persistência permite testar os principais fluxos e mantém os dados após atualizar a página, mas é apenas local: os dados não são enviados à Vercel, não são compartilhados entre dispositivos ou usuários e podem ser apagados pelo navegador. O projeto não oferece autenticação, processamento de pagamentos nem transações reais. Para produção, substitua a base simulada por um banco persistente e adicione autenticação e autorização antes de permitir operações administrativas.

## Desenvolvimento e validação

```bash
npm install
npm run dev
npm test
npm run build
```

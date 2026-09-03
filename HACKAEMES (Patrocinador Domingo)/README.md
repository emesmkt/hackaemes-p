# HACKAEMES EDIÇÃO_01

Site estático responsivo para convite informativo dos patrocinadores confirmados do HACKAEMES.

## Como visualizar

Na pasta do projeto, inicie um servidor local:

```powershell
node server.mjs
```

Depois abra:

```text
http://localhost:4173
```

Se preferir usar o roteiro do `package.json` pelo PowerShell:

```powershell
npm.cmd run dev
```

## Estrutura

- `index.html`: estrutura semântica das quatro seções.
- `styles.css`: identidade visual, responsividade, foco e animações.
- `script.js`: preenchimento dos dados, rolagem suave e marcador da seção atual.
- `site.config.js`: textos, data, horário, endereço, link do Google Maps e caminho do logo.
- `server.mjs`: servidor local simples, sem dependências externas.
- `assets/HackaEmes.svg`: caminho reservado para o logo oficial quando ele for adicionado.

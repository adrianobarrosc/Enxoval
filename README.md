# Projeto Enxoval 🍼

🌐 **Site:** https://adrianobarrosc.github.io/Enxoval/

Site estático (HTML, CSS e JavaScript puros, sem dependências) para acompanhar a gestação e montar o enxoval do bebê.

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | **Ante-página**: tema infantil genérico em tons pastéis, com crianças brincando, e o formulário (Nome do Bebê, Semanas de Gestação, Tema de Preferência). |
| `enxoval.html` | **Página resultante** — "Enxoval de (nome)": título; dois blocos iguais (ilustração do bebê na semana atual + contagem regressiva); e o checklist do enxoval. |

## Como funciona

- **Cada envio do formulário cria uma página nova**, com identificador próprio, aberta em outra aba (`enxoval.html?id=…&nome=…&semanas=…&tema=…&data=AAAA-MM-DD`). O link funciona em qualquer aparelho.
- A ante-página lista as páginas já criadas naquele navegador (**Minhas páginas**), com opção de remover. Cada página guarda o próprio checklist.
- A `data` é o dia em que o formulário foi preenchido. A partir dela a página calcula sozinha a semana atual e a data provável do parto (40 semanas):
  - **bloco da direita** (contagem regressiva) muda **todo dia** (e o relógio corre em tempo real);
  - **bloco da esquerda** (estágio do bebê) muda a **cada nova semana**.
- **Checklist** em 4 blocos — Roupinhas, Utensílios, Equipamentos e Coisas para a mamãe:
  - quantidades ajustadas à estação prevista do nascimento (hemisfério sul), com opção de trocar para *Calor*, *Meia-estação* ou *Frio*;
  - clicar no nome de um item abre uma pesquisa "o que é …";
  - os itens marcados ficam salvos no navegador.
- **Instalar como app (PWA):** cada página de resultado gera o próprio manifesto, então cada bebê vira um app separado ("Enxoval de …", ícone do tema, abre direto na página). Funciona sem internet depois de aberto uma vez.
  - Android / Chrome / Edge: botão **📲 Instalar como app** no topo da página.
  - iPhone / iPad (Safari): **Compartilhar → Adicionar à Tela de Início**.
- **Checklist compartilhado (opcional, via Firebase):** com o Firebase configurado, todos que abrirem o mesmo link veem as mesmas marcações e a mesma porcentagem, em tempo real. Sem configuração ou sem internet, as marcações ficam salvas no aparelho.
- 9 temas: Nuvens e Arco-íris, Ursinhos, Safári, Fundo do Mar, Espaço, Jardim Encantado, Super-heróis, Bonecas e Fazendinha.

## Estrutura

```
index.html        ante-página
enxoval.html      página do enxoval
css/style.css     estilos compartilhados
js/temas.js       paletas e enfeites de cada tema
js/paginas.js     lista das páginas criadas (uma por envio)
js/app.js         manifesto de cada página + botão de instalar
js/sync.js        sincronização do checklist (Firebase Realtime Database)
js/firebase-config.js  configuração do Firebase (null = só no aparelho)
database.rules.json    regras de segurança do banco
sw.js             service worker (uso offline)
icons/            ícones do app, um por tema
js/dados.js       desenvolvimento semana a semana + itens do checklist
js/enxoval.js     cálculos de datas, ilustração e checklist
```

> Ao alterar arquivos do site, aumente `VERSAO` em `sw.js` (ex.: `enxoval-v2`) para que os apps instalados baixem a versão nova.

## Ativar a sincronização (Firebase)

1. Em https://console.firebase.google.com crie um projeto (o Google Analytics pode ficar desligado).
2. Menu **Build → Realtime Database → Criar banco de dados** (local: `us-central1`; modo bloqueado).
3. Na aba **Regras**, cole o conteúdo de `database.rules.json` e clique em **Publicar**.
4. Em **Configurações do projeto → Seus apps**, adicione um app **Web** (`</>`), copie o objeto `firebaseConfig` e cole em `js/firebase-config.js` no lugar de `null`.

## Publicar

Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`. O site fica em `https://adrianobarrosc.github.io/Enxoval/`.

Para testar localmente: `python3 -m http.server` na pasta do projeto e abra `http://localhost:8000`.

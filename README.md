# Projeto Enxoval 🍼

Site estático (HTML, CSS e JavaScript puros, sem dependências) para acompanhar a gestação e montar o enxoval do bebê.

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | **Ante-página**: tema infantil genérico em tons pastéis, com crianças brincando, e o formulário (Nome do Bebê, Semanas de Gestação, Tema de Preferência). |
| `enxoval.html` | **Página resultante** — "Enxoval de (nome)": título; dois blocos iguais (ilustração do bebê na semana atual + contagem regressiva); e o checklist do enxoval. |

## Como funciona

- O formulário envia os dados pela URL (`enxoval.html?nome=…&semanas=…&tema=…&data=AAAA-MM-DD`) e também guarda no navegador (`localStorage`).
- A `data` é o dia em que o formulário foi preenchido. A partir dela a página calcula sozinha a semana atual e a data provável do parto (40 semanas):
  - **bloco da direita** (contagem regressiva) muda **todo dia** (e o relógio corre em tempo real);
  - **bloco da esquerda** (estágio do bebê) muda a **cada nova semana**.
- **Checklist** em 4 blocos — Roupinhas, Utensílios, Equipamentos e Coisas para a mamãe:
  - quantidades ajustadas à estação prevista do nascimento (hemisfério sul), com opção de trocar para *Calor*, *Meia-estação* ou *Frio*;
  - clicar no nome de um item abre uma pesquisa "o que é …";
  - os itens marcados ficam salvos no navegador.
- 7 temas: Nuvens e Arco-íris, Ursinhos, Safári, Fundo do Mar, Espaço, Jardim Encantado e Fazendinha.

## Estrutura

```
index.html        ante-página
enxoval.html      página do enxoval
css/style.css     estilos compartilhados
js/temas.js       paletas e enfeites de cada tema
js/dados.js       desenvolvimento semana a semana + itens do checklist
js/enxoval.js     cálculos de datas, ilustração e checklist
```

## Publicar

Em **Settings → Pages**, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`. O site fica em `https://adrianobarrosc.github.io/enxoval/`.

Para testar localmente: `python3 -m http.server` na pasta do projeto e abra `http://localhost:8000`.

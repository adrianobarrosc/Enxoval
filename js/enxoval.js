/* Projeto Enxoval — lógica da página resultante
 * A página recalcula tudo a partir da data em que o formulário foi preenchido:
 *  - bloco direito (contagem) muda todo dia
 *  - bloco esquerdo (desenvolvimento) muda a cada nova semana
 */
(function () {
  const DIA = 86400000;
  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const $ = (id) => document.getElementById(id);

  /* ---------- Leitura dos dados (URL > armazenamento local) ---------- */
  function lerDados() {
    const qs = new URLSearchParams(location.search);
    let salvo = null;
    try { salvo = JSON.parse(localStorage.getItem("enxoval:dados") || "null"); } catch (e) {}
    const nome = qs.get("nome") || (salvo && salvo.nome);
    const semanas = parseInt(qs.get("semanas") || (salvo && salvo.semanas), 10);
    const tema = qs.get("tema") || (salvo && salvo.tema) || "nuvens";
    const data = qs.get("data") || (salvo && salvo.data) || isoLocal(new Date());
    if (!nome || !Number.isInteger(semanas)) return null;
    return { nome, semanas: Math.min(42, Math.max(1, semanas)), tema, data };
  }

  function isoLocal(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function dataLocal(iso) { const [a, m, d] = iso.split("-").map(Number); return new Date(a, m - 1, d); }
  function diasEntre(a, b) { // diferença em dias de calendário (imune ao horário de verão)
    return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DIA);
  }
  function addDias(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  const fmt = (n) => n.toLocaleString("pt-BR");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const dados = lerDados();
  if (!dados) {
    aplicarTema("nuvens");
    $("pagina").innerHTML = `<div class="aviso-vazio bloco"><h1>Ops! 🍼</h1>
      <p>Ainda não sabemos o nome do bebê nem as semanas de gestação.</p>
      <p><a class="botao" style="max-width:320px;margin:auto" href="index.html">Preencher agora</a></p></div>`;
    return;
  }

  const tema = aplicarTema(dados.tema);
  espalharEnfeites($("enfeites"), tema.deco, 16);
  document.title = `Enxoval de ${dados.nome}`;
  $("titulo").textContent = `Enxoval de ${dados.nome}`;
  $("link-editar").href = "index.html?" + new URLSearchParams({ nome: dados.nome, tema: dados.tema }).toString();

  const referencia = dataLocal(dados.data);
  const dpp = addDias(referencia, 280 - dados.semanas * 7); // data provável do parto (40 semanas)
  const chaveCheck = "enxoval:check:" + slug(dados.nome);

  /* ---------- Estado calculado para "hoje" ---------- */
  function estadoHoje() {
    const hoje = new Date();
    const diasGestacao = dados.semanas * 7 + diasEntre(referencia, hoje);
    return {
      hoje,
      diasGestacao,
      semana: Math.floor(diasGestacao / 7),
      diasRestantes: diasEntre(hoje, dpp)
    };
  }

  /* ---------- Ilustração lúdica do bebê ---------- */
  function desenharBebe(sem) {
    const pele = "#FFD7C2", contorno = "#E3A487";
    let miolo = "";
    if (sem <= 5) {
      const r = 5 + (sem - 3) * 3;
      miolo = `
        <circle cx="100" cy="104" r="${r + 10}" fill="#fff" opacity=".55"/>
        <circle cx="100" cy="104" r="${r}" fill="${pele}" stroke="${contorno}" stroke-width="2"/>
        <text x="132" y="78" font-size="16">✨</text><text x="58" y="140" font-size="12">✨</text>`;
    } else if (sem <= 9) {
      const s = 0.45 + (sem - 6) * 0.15;
      miolo = `
        <g transform="translate(100 104) scale(${s})">
          <path d="M-8 -42 C 30 -46 40 -8 26 18 C 14 40 -20 44 -30 22 C -38 6 -22 -4 -26 -18 C -30 -32 -22 -40 -8 -42Z"
                fill="${pele}" stroke="${contorno}" stroke-width="3" vector-effect="non-scaling-stroke"/>
          <circle cx="-4" cy="-24" r="3.5" fill="#6b5a7a"/>
          <circle cx="6" cy="6" r="7" fill="#F49AB0"><animate attributeName="r" values="6;8;6" dur="0.7s" repeatCount="indefinite"/></circle>
          <path d="M24 16 q22 14 36 30" stroke="#F3B6C6" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>`;
    } else {
      const s = Math.min(1, 0.5 + (sem - 10) * (0.5 / 28));
      const cabeca = 34 * (1 + Math.max(0, 30 - sem) / 70); // cabeça proporcionalmente maior no início
      miolo = `
        <g transform="translate(104 102) scale(${s.toFixed(3)})">
          <path d="M12 30 C 40 50 30 70 70 78" stroke="#F3B6C6" stroke-width="7" fill="none" stroke-linecap="round"/>
          <ellipse cx="14" cy="16" rx="40" ry="34" transform="rotate(-25 14 16)" fill="${pele}" stroke="${contorno}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
          <ellipse cx="32" cy="36" rx="26" ry="14" transform="rotate(-48 32 36)" fill="${pele}" stroke="${contorno}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
          <ellipse cx="10" cy="54" rx="12" ry="7" fill="${pele}" stroke="${contorno}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
          <circle cx="-22" cy="-22" r="${cabeca.toFixed(1)}" fill="${pele}" stroke="${contorno}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
          <circle cx="-4" cy="-18" r="6" fill="${pele}" stroke="${contorno}" stroke-width="2" vector-effect="non-scaling-stroke"/>
          <path d="M-34 -26 q6 6 12 0" stroke="#6b5a7a" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="-38" cy="-12" r="6" fill="#F7A9BC" opacity=".6"/>
          <path d="M-46 -6 q4 4 9 0" stroke="#6b5a7a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M-30 ${(-22 - cabeca + 4).toFixed(1)} q8 -9 15 -1" stroke="#C99577" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M4 4 Q-14 12 -28 6" stroke="${pele}" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path d="M4 4 Q-14 12 -28 6" stroke="${contorno}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".6"/>
        </g>`;
    }
    return `
      <svg viewBox="0 0 200 200" role="img" aria-label="Ilustração do bebê na semana ${sem}">
        <circle cx="100" cy="100" r="96" fill="var(--c2)"/>
        <circle cx="100" cy="100" r="84" fill="color-mix(in srgb, var(--c1) 55%, white)"/>
        <circle cx="52" cy="62" r="6" fill="#fff" opacity=".7"/>
        <circle cx="62" cy="48" r="3" fill="#fff" opacity=".7"/>
        <circle cx="150" cy="140" r="5" fill="#fff" opacity=".6"/>
        <circle cx="140" cy="54" r="3.5" fill="#fff" opacity=".6"/>
        ${miolo}
      </svg>`;
  }

  function renderBebe(est) {
    const sem = Math.max(1, Math.min(42, est.semana));
    const d = dadosDaSemana(sem);
    $("etq-semana").textContent = `Semana ${sem}`;
    $("titulo-bebe").textContent = sem >= 40 ? `${dados.nome} está prontinho(a)!` : `Como ${dados.nome} está`;
    $("ilustra-bebe").innerHTML = desenharBebe(sem);
    $("fruta-emoji").textContent = d.emoji;
    $("fruta-nome").textContent = d.fruta;
    $("med-cm").textContent = d.cm < 1 ? `${fmt(d.cm * 10)} mm` : `${fmt(d.cm)} cm`;
    $("med-g").textContent = d.g == null ? "< 1 g" : d.g >= 1000 ? `${fmt(d.g / 1000)} kg` : `${fmt(d.g)} g`;
    $("med-tri").textContent = sem <= 13 ? "1º" : sem <= 27 ? "2º" : "3º";
    $("fato").textContent = sem < 4 ? "Tudo está só começando: as células se multiplicam sem parar! 🌱" : d.fato;
  }

  /* ---------- Contagem regressiva divertida ---------- */
  function sabadosAte(hoje, fim) {
    let n = 0;
    for (let d = new Date(hoje); d < fim; d = addDias(d, 1)) if (d.getDay() === 6) n++;
    return n;
  }

  function renderContagem(est) {
    // dias completos restantes (o mesmo número exibido em destaque)
    const dr = est.diasRestantes > 0 ? Math.floor((dpp.getTime() - Date.now()) / DIA) : est.diasRestantes;
    const pct = Math.max(0, Math.min(100, (est.diasGestacao / 280) * 100));
    $("trilha-preenchido").style.width = pct + "%";
    $("trilha-viajante").style.left = pct + "%";
    $("trilha-pct").textContent = Math.round(pct) + "% da jornada";

    const li = [];
    if (est.diasRestantes > 0 && dr === 0) {
      $("titulo-contagem").textContent = `${dados.nome} chega amanhã!`;
      li.push("🎒 Falta menos de um dia para a data provável. Mala pronta?");
    } else if (dr > 0) {
      $("titulo-contagem").textContent = `Faltam para ${dados.nome} chegar`;
      const sem = Math.floor(dr / 7), resto = dr % 7;
      li.push(`🗓️ ${sem} semana${sem !== 1 ? "s" : ""}${resto ? ` e ${resto} dia${resto !== 1 ? "s" : ""}` : ""} até ${dpp.getDate()} de ${MESES[dpp.getMonth()]}`);
      li.push(`😴 ${fmt(dr)} noites de sono tranquilo — aproveitem!`);
      const sab = sabadosAte(est.hoje, dpp);
      li.push(`🛍️ ${sab} fim${sab !== 1 ? "s" : ""} de semana para terminar o enxoval`);
      li.push(`💓 o coraçãozinho vai bater umas ${fmt(Math.round(dr * 24 * 60 * 140 / 1e6 * 10) / 10)} milhões de vezes até lá`);
      li.push(`🌕 ${dr >= 30 ? `cerca de ${fmt(Math.round(dr / 29.5))} lua${Math.round(dr / 29.5) !== 1 ? "s" : ""} cheia${Math.round(dr / 29.5) !== 1 ? "s" : ""}` : "menos de uma lua cheia"}`);
    } else if (est.diasRestantes >= 0) {
      $("titulo-contagem").textContent = "É hoje!";
      li.push("🎉 Hoje é a data provável do parto! Mala pronta?");
    } else {
      $("titulo-contagem").textContent = "A data provável já passou";
      li.push(`🎈 Passaram ${-dr} dia${-dr !== 1 ? "s" : ""} da data provável — ${dados.nome} pode chegar a qualquer momento (ou já chegou!).`);
    }
    $("curiosidades").innerHTML = li.map((t) => `<li>${esc(t)}</li>`).join("");

    const diaDoAno = Math.floor((est.hoje - new Date(est.hoje.getFullYear(), 0, 0)) / DIA);
    $("mensagem-dia").textContent = MENSAGENS_DO_DIA[diaDoAno % MENSAGENS_DO_DIA.length];
  }

  function tique() {
    const ms = dpp.getTime() - Date.now();
    if (ms <= 0) {
      $("dias").textContent = "0";
      $("dias-legenda").textContent = "dias 🎉";
      ["rel-h", "rel-m", "rel-s"].forEach((id) => ($(id).textContent = "00"));
      return;
    }
    const d = Math.floor(ms / DIA);
    const h = Math.floor((ms % DIA) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    $("dias").textContent = fmt(d);
    $("dias-legenda").textContent = d === 1 ? "dia" : "dias";
    $("rel-h").textContent = String(h).padStart(2, "0");
    $("rel-m").textContent = String(m).padStart(2, "0");
    $("rel-s").textContent = String(s).padStart(2, "0");
  }

  /* ---------- Checklist ---------- */
  let marcados = {};
  try { marcados = JSON.parse(localStorage.getItem(chaveCheck) || "{}"); } catch (e) {}
  const estPrevista = estacaoDoMes(dpp.getMonth());
  let estacao = estPrevista.chave;
  try { estacao = localStorage.getItem(chaveCheck + ":estacao") || estacao; } catch (e) {}

  function salvar() {
    try {
      localStorage.setItem(chaveCheck, JSON.stringify(marcados));
      localStorage.setItem(chaveCheck + ":estacao", estacao);
    } catch (e) {}
  }

  function rotuloQtd(q) {
    if (typeof q === "string") return /^\d+$/.test(q) ? `${q} un.` : q;
    const n = q[estacao];
    return n ? `${n} un.` : null;
  }

  function renderChecklist(est) {
    $("info-nascimento").innerHTML =
      `Previsão de nascimento: <b>${dpp.getDate()} de ${MESES[dpp.getMonth()]} de ${dpp.getFullYear()}</b> — ` +
      `${estPrevista.emoji} ${estPrevista.nome}. As quantidades se ajustam ao clima escolhido ao lado ` +
      `<span style="opacity:.75">(mora numa cidade quente o ano todo? Escolha “Calor”)</span>.`;
    $("dica-semana").textContent = dicaDaSemana(est.semana);
    document.querySelectorAll("#estacoes button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.est === estacao)));

    let total = 0, feitos = 0;
    $("categorias").innerHTML = CHECKLIST.map((cat) => {
      const itens = cat.itens
        .map(([nome, q, obs, busca]) => ({ nome, obs, busca, qtd: rotuloQtd(q), id: cat.id + ":" + slug(nome) }))
        .filter((i) => i.qtd);
      const feitosCat = itens.filter((i) => marcados[i.id]).length;
      total += itens.length; feitos += feitosCat;
      const lis = itens.map((i) => {
        const url = "https://www.google.com/search?q=" + encodeURIComponent("o que é " + (i.busca || i.nome + " bebê"));
        const ok = !!marcados[i.id];
        return `<li class="item${ok ? " feito" : ""}">
          <input type="checkbox" id="${esc(i.id)}" data-id="${esc(i.id)}" ${ok ? "checked" : ""} aria-label="Já tenho: ${esc(i.nome)}">
          <span class="texto">
            <a class="nome-item" href="${url}" target="_blank" rel="noopener" title="Pesquisar: o que é ${esc(i.nome)}?">${esc(i.nome)}</a>
            <span class="selo">${esc(i.qtd)}</span>
            ${i.obs ? `<span class="obs">${esc(i.obs)}</span>` : ""}
          </span>
        </li>`;
      }).join("");
      return `<section class="categoria" style="--cat:var(--${cat.cor})">
        <header><h3><span aria-hidden="true">${cat.emoji}</span> ${cat.titulo}</h3>
        <span class="contador">${feitosCat}/${itens.length}</span></header>
        <ul>${lis}</ul></section>`;
    }).join("");

    $("progresso-texto").textContent = `${feitos} de ${total} itens prontos (${total ? Math.round((feitos / total) * 100) : 0}%)`;
    $("progresso-barra").style.width = (total ? (feitos / total) * 100 : 0) + "%";
  }

  $("categorias").addEventListener("change", (ev) => {
    const cb = ev.target;
    if (!cb.matches("input[type=checkbox]")) return;
    if (cb.checked) marcados[cb.dataset.id] = true; else delete marcados[cb.dataset.id];
    salvar();
    renderChecklist(estadoHoje());
    const novo = document.getElementById(cb.dataset.id);
    if (novo) novo.focus();
  });

  $("estacoes").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-est]");
    if (!b) return;
    estacao = b.dataset.est;
    salvar();
    renderChecklist(estadoHoje());
  });

  /* ---------- Render inicial e atualização automática ---------- */
  let diaRenderizado = null;
  function renderTudo() {
    const est = estadoHoje();
    diaRenderizado = isoLocal(est.hoje);
    renderBebe(est);
    renderContagem(est);
    renderChecklist(est);
    try {
      localStorage.setItem("enxoval:dados", JSON.stringify({ ...dados, semanasAtuais: Math.min(42, Math.max(1, est.semana)) }));
    } catch (e) {}
  }

  renderTudo();
  tique();
  setInterval(() => {
    tique();
    if (isoLocal(new Date()) !== diaRenderizado) renderTudo(); // virou o dia: atualiza blocos
  }, 1000);
})();

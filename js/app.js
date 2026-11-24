/* Projeto Enxoval — instalação como app (PWA)
 * Cada página de resultado gera o próprio manifesto, então cada bebê vira
 * um app separado: nome "Enxoval de …", ícone do tema e abertura direto na página.
 */
(function () {
  const params = new URLSearchParams(location.search);
  const nome = params.get("nome");
  const temaChave = params.get("tema") || "nuvens";
  const temas = typeof TEMAS !== "undefined" ? TEMAS : {};
  const chaveValida = temas[temaChave] ? temaChave : "nuvens";
  const tema = temas[chaveValida] || { c1: "#BDE0FE", bg: "#FFF8F0" };
  const base = new URL("./", location.href).href; // raiz do site (funciona em /Enxoval/)
  const icone = (tam) => `${base}icons/${chaveValida}-${tam}.png`;

  function addHead(tag, attrs) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
    return el;
  }

  /* ---------- Manifesto próprio desta página ---------- */
  if (nome) {
    const id = params.get("id") || nome;
    const titulo = `Enxoval de ${nome}`;
    const manifesto = {
      id: `${base}enxoval/${encodeURIComponent(id)}`,
      name: titulo,
      short_name: titulo.length > 12 ? nome.slice(0, 12) : titulo,
      description: `Checklist do enxoval, contagem regressiva e acompanhamento da gestação de ${nome}.`,
      lang: "pt-BR",
      start_url: location.href,
      scope: base,
      display: "standalone",
      orientation: "portrait-primary",
      background_color: tema.bg,
      theme_color: tema.c1,
      icons: [
        { src: icone(192), sizes: "192x192", type: "image/png", purpose: "any" },
        { src: icone(512), sizes: "512x512", type: "image/png", purpose: "any" },
        { src: icone(512), sizes: "512x512", type: "image/png", purpose: "maskable" }
      ]
    };
    const blob = new Blob([JSON.stringify(manifesto)], { type: "application/manifest+json" });
    addHead("link", { rel: "manifest", href: URL.createObjectURL(blob) });

    // iPhone/iPad: "Adicionar à Tela de Início" usa estas informações
    addHead("link", { rel: "apple-touch-icon", href: icone(180) });
    addHead("meta", { name: "apple-mobile-web-app-capable", content: "yes" });
    addHead("meta", { name: "mobile-web-app-capable", content: "yes" });
    addHead("meta", { name: "apple-mobile-web-app-title", content: manifesto.short_name });
    addHead("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" });
  }
  addHead("meta", { name: "theme-color", content: tema.c1 });

  /* ---------- Service worker (offline) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(base + "sw.js", { scope: base }).catch(() => {});
    });
  }

  /* ---------- Botão "Instalar como app" ---------- */
  const botao = document.getElementById("botao-instalar");
  const dicaIOS = document.getElementById("dica-ios");
  if (!botao) return;

  const jaInstalado = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (jaInstalado || !nome) return;

  let pedido = null;
  window.addEventListener("beforeinstallprompt", (ev) => {
    ev.preventDefault();
    pedido = ev;
    botao.hidden = false;
  });
  window.addEventListener("appinstalled", () => {
    botao.hidden = true;
    pedido = null;
  });

  if (ehIOS) {
    botao.hidden = false; // no iOS a instalação é feita pelo menu Compartilhar
  }

  botao.addEventListener("click", async () => {
    if (pedido) {
      pedido.prompt();
      await pedido.userChoice;
      pedido = null;
      botao.hidden = true;
    } else if (dicaIOS) {
      dicaIOS.hidden = !dicaIOS.hidden;
    }
  });
})();

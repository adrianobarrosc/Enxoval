/* Projeto Enxoval — temas infantis em tons pastéis
 * Cada tema define a paleta (variáveis CSS) e os enfeites que flutuam pela página. */
const TEMAS = {
  nuvens: {
    nome: "Nuvens e Arco-íris", emoji: "🌈",
    bg: "#FFF8F0", c1: "#BDE0FE", c2: "#FFC8DD", c3: "#CDB4DB", c4: "#FFF3B0", ink: "#5B5170",
    deco: ["☁️", "🌈", "⭐", "🎈", "☁️", "💛"]
  },
  ursinhos: {
    nome: "Ursinhos", emoji: "🧸",
    bg: "#FDF6EC", c1: "#EBD9C8", c2: "#F7D9D9", c3: "#C9E4DE", c4: "#FAEDCB", ink: "#6B4F3F",
    deco: ["🧸", "🍯", "🎀", "⭐", "🧸", "🐾"]
  },
  safari: {
    nome: "Safári", emoji: "🦁",
    bg: "#F6FBF2", c1: "#CDE8C4", c2: "#FBE7A1", c3: "#F9D5B9", c4: "#DCEBDD", ink: "#4E5B3A",
    deco: ["🦁", "🦒", "🐘", "🌿", "🦓", "🐒"]
  },
  mar: {
    nome: "Fundo do Mar", emoji: "🐳",
    bg: "#F0FAFB", c1: "#BFE6EE", c2: "#C9F2E3", c3: "#FFE3D3", c4: "#E2EEFF", ink: "#2F5866",
    deco: ["🐳", "🐠", "🐙", "🫧", "🐚", "🦀"]
  },
  espaco: {
    nome: "Espaço", emoji: "🚀",
    bg: "#F5F3FF", c1: "#D7D2FB", c2: "#C7E1FF", c3: "#FFE9B8", c4: "#FBD3E9", ink: "#463F73",
    deco: ["🚀", "🪐", "⭐", "🌙", "👩‍🚀", "✨"]
  },
  jardim: {
    nome: "Jardim Encantado", emoji: "🌷",
    bg: "#FFF7FA", c1: "#FAD4E1", c2: "#D6F0D8", c3: "#FFF0B5", c4: "#E4D9F5", ink: "#6A4760",
    deco: ["🌷", "🦋", "🐞", "🌼", "🐝", "🍄"]
  },
  herois: {
    nome: "Super-heróis", emoji: "🦸",
    bg: "#F4F7FF", c1: "#C8D8FF", c2: "#FFCACA", c3: "#FFE8A3", c4: "#D9F0FF", ink: "#3A4675",
    deco: ["🦸", "⚡", "💥", "🦸‍♀️", "⭐", "🛡️"]
  },
  bonecas: {
    nome: "Bonecas", emoji: "🪆",
    bg: "#FFF5F8", c1: "#FBD0E0", c2: "#E9D5FF", c3: "#FFE2CC", c4: "#FDF0C4", ink: "#6B3F5A",
    deco: ["🪆", "🎀", "👗", "💖", "👒", "🌸"]
  },
  fazendinha: {
    nome: "Fazendinha", emoji: "🐑",
    bg: "#FBF9EE", c1: "#E6F0C8", c2: "#FFE1C6", c3: "#D9ECF7", c4: "#F6E3F0", ink: "#5A5235",
    deco: ["🐑", "🐄", "🐥", "🌻", "🐷", "🐴"]
  }
};

function aplicarTema(chave) {
  const t = TEMAS[chave] || TEMAS.nuvens;
  const r = document.documentElement.style;
  r.setProperty("--bg", t.bg);
  r.setProperty("--c1", t.c1);
  r.setProperty("--c2", t.c2);
  r.setProperty("--c3", t.c3);
  r.setProperty("--c4", t.c4);
  r.setProperty("--ink", t.ink);
  return t;
}

/* Enfeites flutuantes de fundo (decorativos, ignorados por leitores de tela) */
function espalharEnfeites(container, emojis, qtd = 14) {
  container.innerHTML = "";
  for (let i = 0; i < qtd; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = (Math.random() * 96) + "%";
    s.style.top = (Math.random() * 96) + "%";
    s.style.fontSize = (18 + Math.random() * 26) + "px";
    s.style.animationDelay = (-Math.random() * 12) + "s";
    s.style.animationDuration = (9 + Math.random() * 8) + "s";
    container.appendChild(s);
  }
}

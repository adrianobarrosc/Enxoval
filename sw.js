/* Projeto Enxoval — service worker
 * Permite instalar as páginas como app e abri-las sem internet.
 * Páginas (HTML): busca na rede primeiro e guarda cópia; sem rede, usa a cópia.
 * Arquivos estáticos e fontes: usa a cópia e atualiza em segundo plano.
 */
const VERSAO = "enxoval-v2";
const ESSENCIAIS = [
  "./",
  "./index.html",
  "./enxoval.html",
  "./css/style.css",
  "./js/temas.js",
  "./js/dados.js",
  "./js/paginas.js",
  "./js/enxoval.js",
  "./js/app.js"
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const mesmaOrigem = url.origin === self.location.origin;
  const fonte = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!mesmaOrigem && !fonte) return;

  // Páginas: rede primeiro (os dados vêm na URL, então ignoramos a query no cache)
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req)
        .then((resp) => {
          const copia = resp.clone();
          caches.open(VERSAO).then((c) => c.put(url.pathname, copia));
          return resp;
        })
        .catch(() => caches.match(url.pathname, { ignoreSearch: true })
          .then((r) => r || caches.match("./enxoval.html")))
    );
    return;
  }

  // Estáticos e fontes: cache primeiro, atualizando em segundo plano
  ev.respondWith(
    caches.match(req, { ignoreSearch: mesmaOrigem }).then((emCache) => {
      const daRede = fetch(req)
        .then((resp) => {
          if (resp && (resp.ok || resp.type === "opaque")) {
            const copia = resp.clone();
            caches.open(VERSAO).then((c) => c.put(req, copia));
          }
          return resp;
        })
        .catch(() => emCache);
      return emCache || daRede;
    })
  );
});

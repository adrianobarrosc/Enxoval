/* Projeto Enxoval — service worker
 * Permite instalar as páginas como app e abri-las sem internet.
 * Arquivos do site: busca sempre a versão mais nova na rede e guarda uma cópia;
 * sem internet, usa a cópia guardada. Fontes do Google: usa a cópia (não mudam).
 */
const VERSAO = "enxoval-v4";
const ESSENCIAIS = [
  "./",
  "./index.html",
  "./enxoval.html",
  "./css/style.css",
  "./js/temas.js",
  "./js/dados.js",
  "./js/paginas.js",
  "./js/enxoval.js",
  "./js/app.js",
  "./js/firebase-config.js",
  "./js/sync.js"
];

self.addEventListener("install", (ev) => {
  // cache: "reload" evita guardar cópias antigas vindas do cache HTTP do navegador
  ev.waitUntil(
    caches.open(VERSAO)
      .then((c) => c.addAll(ESSENCIAIS.map((u) => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
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

  // Fontes: cópia guardada primeiro (arquivos que não mudam)
  if (fonte) {
    ev.respondWith(
      caches.match(req).then((emCache) => emCache || fetch(req).then((resp) => {
        const copia = resp.clone();
        caches.open(VERSAO).then((c) => c.put(req, copia));
        return resp;
      }))
    );
    return;
  }

  // Arquivos do site: rede primeiro (sem cache HTTP), cópia guardada só sem internet.
  // Os dados de cada página vêm na URL, então a cópia ignora a query.
  const chave = url.origin + url.pathname;
  ev.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((resp) => {
        if (resp && resp.ok) {
          const copia = resp.clone();
          caches.open(VERSAO).then((c) => c.put(chave, copia));
        }
        return resp;
      })
      .catch(() => caches.match(chave, { ignoreSearch: true })
        .then((r) => r || (req.mode === "navigate" ? caches.match(new URL("./enxoval.html", self.location).href) : undefined))
        .then((r) => r || Response.error()))
  );
});

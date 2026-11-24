/* Projeto Enxoval — páginas criadas
 * Cada envio do formulário vira uma página própria, com identificador único.
 * A lista fica guardada no navegador (localStorage); cada página também tem
 * um link completo, que funciona em qualquer aparelho.
 */
const CHAVE_LISTA = "enxoval:paginas";

function listarPaginas() {
  try {
    const l = JSON.parse(localStorage.getItem(CHAVE_LISTA) || "[]");
    return Array.isArray(l) ? l : [];
  } catch (e) { return []; }
}

function gravarLista(lista) {
  try { localStorage.setItem(CHAVE_LISTA, JSON.stringify(lista)); } catch (e) {}
}

function salvarPagina(p) {
  const lista = listarPaginas();
  const i = lista.findIndex((x) => x.id === p.id);
  if (i >= 0) lista[i] = { ...lista[i], ...p };
  else lista.unshift(p);
  gravarLista(lista);
}

function buscarPagina(id) {
  return listarPaginas().find((x) => x.id === id) || null;
}

function removerPagina(id) {
  gravarLista(listarPaginas().filter((x) => x.id !== id));
  try {
    localStorage.removeItem("enxoval:check:" + id);
    localStorage.removeItem("enxoval:check:" + id + ":estacao");
  } catch (e) {}
}

function novoIdPagina() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function urlDaPagina(p) {
  return "enxoval.html?" + new URLSearchParams({
    id: p.id, nome: p.nome, semanas: p.semanas, tema: p.tema, data: p.data
  }).toString();
}

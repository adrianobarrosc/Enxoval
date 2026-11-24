/* Projeto Enxoval — sincronização do checklist (Firebase Realtime Database)
 * Todos que abrirem o mesmo link veem as mesmas marcações e a mesma
 * porcentagem, atualizadas em tempo real. Sem configuração ou sem internet,
 * o checklist continua funcionando só no aparelho.
 *
 * Estrutura no banco:  enxovais/<id da página>/marcados/<id do item> = true
 *                      enxovais/<id da página>/estacao = "v" | "m" | "i"
 */
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

const status = document.getElementById("status-sync");
function mostrarStatus(texto, tipo) {
  if (!status) return;
  status.hidden = false;
  status.textContent = texto;
  status.dataset.tipo = tipo;
}

async function iniciar() {
  const ponte = window.EnxovalChecklist;
  const config = window.FIREBASE_CONFIG;
  if (!ponte || !config || !config.databaseURL) return; // sem configuração: modo local

  let app, db;
  try {
    const { initializeApp } = await import(SDK + "firebase-app.js");
    db = await import(SDK + "firebase-database.js");
    app = initializeApp(config);
  } catch (e) {
    mostrarStatus("📴 Sem conexão — marcações salvas neste aparelho", "offline");
    return;
  }

  const banco = db.getDatabase(app);
  const raiz = db.ref(banco, "enxovais/" + ponte.idPagina);
  let primeiraLeitura = true;

  // Recebe as marcações de todos em tempo real
  db.onValue(raiz, async (snap) => {
    const remoto = snap.val() || {};
    const marcadosRemotos = remoto.marcados || {};

    // Página que já tinha marcações locais antes da sincronização existir:
    // na primeira leitura, envia o que só existe neste aparelho.
    if (primeiraLeitura) {
      primeiraLeitura = false;
      const locais = ponte.obterMarcados();
      const faltando = Object.keys(locais).filter((k) => locais[k] && !marcadosRemotos[k]);
      if (!snap.exists() && (faltando.length || ponte.obterEstacao())) {
        const pacote = { estacao: ponte.obterEstacao(), atualizadoEm: db.serverTimestamp() };
        faltando.forEach((k) => (pacote["marcados/" + k] = true));
        try { await db.update(raiz, pacote); } catch (e) {}
        return; // o onValue dispara de novo com os dados enviados
      }
    }

    ponte.aplicarRemoto(marcadosRemotos, remoto.estacao);
  }, () => {
    mostrarStatus("⚠️ Não foi possível sincronizar — marcações salvas neste aparelho", "erro");
  });

  // Mostra se está conectado
  db.onValue(db.ref(banco, ".info/connected"), (snap) => {
    if (snap.val() === true) mostrarStatus("🔄 Sincronizado — todos com este link veem as mesmas marcações", "ok");
    else mostrarStatus("📴 Sem conexão — as marcações serão enviadas quando a internet voltar", "offline");
  });

  // Envia as mudanças feitas aqui
  ponte.aoMarcar = (item, marcado) => {
    const caminho = db.ref(banco, `enxovais/${ponte.idPagina}/marcados/${item}`);
    (marcado ? db.set(caminho, true) : db.remove(caminho)).catch(() => {});
    db.set(db.ref(banco, `enxovais/${ponte.idPagina}/atualizadoEm`), db.serverTimestamp()).catch(() => {});
  };
  ponte.aoMudarEstacao = (est) => {
    db.update(raiz, { estacao: est, atualizadoEm: db.serverTimestamp() }).catch(() => {});
  };
}

iniciar();

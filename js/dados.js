/* Projeto Enxoval — dados
 * 1) Desenvolvimento semana a semana (comparações lúdicas, medidas aproximadas)
 * 2) Checklist do enxoval, com quantidades por estação do nascimento
 *    v = verão | m = meia-estação (outono/primavera) | i = inverno
 *    Quantidade 0 = item não entra naquela estação.
 */

// Medidas aproximadas: até a 19ª semana, do topo da cabeça ao bumbum; a partir da 20ª, da cabeça aos pés.
const SEMANAS = {
  4:  { fruta: "semente de papoula", emoji: "🌱", cm: 0.1, g: null, fato: "O embrião acabou de se aninhar no útero. Tudo começa aqui!" },
  5:  { fruta: "semente de gergelim", emoji: "🌱", cm: 0.2, g: null, fato: "O tubo neural, que vai formar o cérebro e a coluna, está se formando." },
  6:  { fruta: "lentilha", emoji: "🫘", cm: 0.6, g: null, fato: "O coraçãozinho começa a bater — bem rapidinho!" },
  7:  { fruta: "mirtilo", emoji: "🫐", cm: 1.0, g: null, fato: "Brotinhos de braços e pernas estão aparecendo." },
  8:  { fruta: "framboesa", emoji: "🍓", cm: 1.6, g: 1, fato: "Os dedinhos das mãos e dos pés começam a se separar." },
  9:  { fruta: "cereja", emoji: "🍒", cm: 2.3, g: 2, fato: "Já dá pequenos movimentos, ainda impossíveis de sentir." },
  10: { fruta: "morango", emoji: "🍓", cm: 3.1, g: 4, fato: "Os órgãos principais estão formados: agora ele(a) é chamado(a) de feto." },
  11: { fruta: "azeitona gigante", emoji: "🫒", cm: 4.1, g: 7, fato: "As unhas começam a crescer e os ossinhos vão endurecendo." },
  12: { fruta: "limão", emoji: "🍋", cm: 5.4, g: 14, fato: "Aparecem os primeiros reflexos: abre e fecha as mãozinhas." },
  13: { fruta: "vagem de ervilha", emoji: "🫛", cm: 7.4, g: 23, fato: "As impressões digitais já estão se formando." },
  14: { fruta: "pêssego", emoji: "🍑", cm: 8.7, g: 43, fato: "Faz caretinhas: franze a testa e mexe a boca." },
  15: { fruta: "maçã", emoji: "🍎", cm: 10.1, g: 70, fato: "Já percebe a luz, mesmo com as pálpebras fechadas." },
  16: { fruta: "abacate", emoji: "🥑", cm: 11.6, g: 100, fato: "Os ossinhos do ouvido se formam: logo vai ouvir sua voz." },
  17: { fruta: "pera", emoji: "🍐", cm: 13, g: 140, fato: "Começa a acumular gordurinha para se manter quentinho." },
  18: { fruta: "pimentão", emoji: "🫑", cm: 14.2, g: 190, fato: "Boceja, soluça e se espreguiça lá dentro." },
  19: { fruta: "manga", emoji: "🥭", cm: 15.3, g: 240, fato: "Uma camada protetora (vérnix) cobre a pele delicada." },
  20: { fruta: "banana", emoji: "🍌", cm: 25.6, g: 300, fato: "Metade do caminho! Os chutinhos ficam mais fáceis de sentir." },
  21: { fruta: "cenoura", emoji: "🥕", cm: 26.7, g: 360, fato: "Engole líquido amniótico e já sente sabores do que você come." },
  22: { fruta: "espiga de milho", emoji: "🌽", cm: 27.8, g: 430, fato: "As sobrancelhas e os cílios estão aparecendo." },
  23: { fruta: "laranja grande", emoji: "🍊", cm: 28.9, g: 500, fato: "Reconhece sons de fora, como a sua voz e músicas." },
  24: { fruta: "melão pequeno", emoji: "🍈", cm: 30, g: 600, fato: "Os pulmões começam a produzir substâncias para respirar." },
  25: { fruta: "brócolis", emoji: "🥦", cm: 34.6, g: 660, fato: "O cabelinho começa a ganhar cor e textura." },
  26: { fruta: "alface", emoji: "🥬", cm: 35.6, g: 760, fato: "Os olhinhos começam a abrir!" },
  27: { fruta: "berinjela", emoji: "🍆", cm: 36.6, g: 875, fato: "Dorme e acorda em ciclos — e pode estar sonhando." },
  28: { fruta: "coco", emoji: "🥥", cm: 37.6, g: 1000, fato: "Bem-vindo(a) ao 3º trimestre! Já pisca os olhos." },
  29: { fruta: "abóbora pequena", emoji: "🎃", cm: 38.6, g: 1150, fato: "Os músculos e os pulmões continuam amadurecendo." },
  30: { fruta: "repolho", emoji: "🥬", cm: 39.9, g: 1300, fato: "O cérebro cresce rapidinho, ganhando dobrinhas." },
  31: { fruta: "abacaxi pequeno", emoji: "🍍", cm: 41.1, g: 1500, fato: "Vira a cabeça de um lado para o outro." },
  32: { fruta: "moranga", emoji: "🎃", cm: 42.4, g: 1700, fato: "As unhas dos pés já estão prontas." },
  33: { fruta: "abacaxi", emoji: "🍍", cm: 43.7, g: 1900, fato: "Os ossos endurecem, mas o crânio fica flexível para o parto." },
  34: { fruta: "melão", emoji: "🍈", cm: 45, g: 2100, fato: "Está ficando gordinho(a) e com a pele mais lisinha." },
  35: { fruta: "melão grande", emoji: "🍈", cm: 46.2, g: 2400, fato: "O espaço está ficando apertado: os movimentos mudam." },
  36: { fruta: "alface-romana", emoji: "🥬", cm: 47.4, g: 2600, fato: "Muitos bebês já se viram de cabeça para baixo." },
  37: { fruta: "acelga", emoji: "🥬", cm: 48.6, g: 2900, fato: "Termo precoce: está quase pronto(a) para nascer!" },
  38: { fruta: "abóbora", emoji: "🎃", cm: 49.8, g: 3100, fato: "Treina respirar, sugar e agarrar." },
  39: { fruta: "melancia pequena", emoji: "🍉", cm: 50.7, g: 3300, fato: "Tudo pronto! Agora é só esperar o grande dia." },
  40: { fruta: "melancia", emoji: "🍉", cm: 51.2, g: 3500, fato: "Data provável do parto! Pode chegar a qualquer momento." }
};

function dadosDaSemana(sem) {
  const s = Math.max(4, Math.min(40, sem));
  return SEMANAS[s];
}

// Estação no Brasil (hemisfério sul) pelo mês previsto do nascimento
function estacaoDoMes(mes /* 0-11 */) {
  if (mes === 11 || mes <= 1) return { chave: "v", nome: "verão", emoji: "☀️" };
  if (mes <= 4) return { chave: "m", nome: "outono", emoji: "🍂" };
  if (mes <= 7) return { chave: "i", nome: "inverno", emoji: "❄️" };
  return { chave: "m", nome: "primavera", emoji: "🌸" };
}

/* Checklist — [nome, quantidades {v,m,i} ou texto fixo, observação, termo de busca opcional] */
const CHECKLIST = [
  {
    id: "roupinhas", titulo: "Roupinhas", emoji: "👕", cor: "c2",
    itens: [
      ["Body manga curta", { v: 8, m: 6, i: 4 }, "Metade RN, metade P — o RN serve por pouco tempo"],
      ["Body manga longa", { v: 4, m: 6, i: 8 }, "Algodão; útil até no calor por causa do ar-condicionado"],
      ["Body regata", { v: 4, m: 0, i: 0 }, "Para os dias bem quentes"],
      ["Mijão (calça com pé)", { v: 4, m: 6, i: 6 }, "Tamanhos RN e P", "mijão calça com pé bebê"],
      ["Macacão manga curta", { v: 4, m: 2, i: 0 }, "Suedine ou algodão leve"],
      ["Macacão manga longa", { v: 3, m: 4, i: 6 }, "Plush ou soft no frio; algodão no calor", "macacão manga longa bebê recém-nascido"],
      ["Casaquinho", { v: 1, m: 3, i: 4 }, "Lã, tricô ou moletom no inverno", "casaquinho de bebê recém-nascido"],
      ["Pares de meia", { v: 4, m: 6, i: 8 }, "Felpudas no frio", "meia de bebê recém-nascido"],
      ["Touca", { v: 1, m: 2, i: 3 }, "Leve e respirável — a maternidade costuma ser fria", "touca de bebê recém-nascido"],
      ["Pares de luva sem dedos", { v: 2, m: 2, i: 3 }, "Evitam arranhõezinhos no rosto", "luva de bebê recém-nascido"],
      ["Manta", { v: 2, m: 2, i: 3 }, "Musselina no verão; soft ou malha mais grossa no inverno", "manta para bebê recém-nascido"],
      ["Saco de dormir para bebê", { v: 0, m: 1, i: 2 }, "Aquece sem cobertor solto no berço", "saco de dormir bebê"],
      ["Roupa de saída da maternidade", { v: 1, m: 1, i: 1 }, "A primeira roupinha especial 💕", "saída de maternidade bebê"],
      ["Babador / fralda de boca", { v: 6, m: 6, i: 6 }, "Para golfadas e arrotinhos", "fralda de boca bebê"]
    ]
  },
  {
    id: "utensilios", titulo: "Utensílios", emoji: "🧴", cor: "c1",
    itens: [
      ["Pacotes de fralda descartável RN e P", { v: 4, m: 4, i: 4 }, "O recém-nascido usa de 8 a 12 fraldas por dia; compre mais P que RN", "fralda descartável recém-nascido tamanho RN P"],
      ["Fraldas de pano", { v: 12, m: 12, i: 12 }, "Mil e uma utilidades: ombro, troca, banho", "fralda de pano bebê"],
      ["Lenço umedecido ou algodão", { v: 2, m: 2, i: 2 }, "Para os primeiros dias, muitos pediatras indicam algodão com água", "lenço umedecido recém-nascido"],
      ["Pomada para assaduras", { v: 1, m: 1, i: 1 }, "Use a indicada pelo pediatra", "pomada para assadura bebê"],
      ["Sabonete líquido neutro", { v: 1, m: 1, i: 1 }, "Próprio para recém-nascido", "sabonete líquido neutro recém-nascido"],
      ["Shampoo neutro", { v: 1, m: 1, i: 1 }, "Fórmula suave, sem lágrimas", "shampoo neutro bebê"],
      ["Álcool 70% para o coto umbilical", { v: 1, m: 1, i: 1 }, "Siga a orientação da maternidade/pediatra", "cuidado coto umbilical álcool 70"],
      ["Toalha com capuz", { v: 2, m: 3, i: 3 }, "Macia e que seque rápido", "toalha com capuz bebê"],
      ["Escova ou pente de cerdas macias", { v: 1, m: 1, i: 1 }, "", "escova de cabelo cerdas macias bebê"],
      ["Tesourinha ou cortador de unha", { v: 1, m: 1, i: 1 }, "Ponta arredondada", "cortador de unha bebê ponta arredondada"],
      ["Termômetro digital", { v: 1, m: 1, i: 1 }, "Para a farmacinha do bebê", "termômetro digital bebê"],
      ["Aspirador nasal + soro fisiológico", { v: 1, m: 1, i: 1 }, "Ajuda a desentupir o narizinho", "aspirador nasal bebê"],
      ["Jogos de lençol para berço", { v: 3, m: 3, i: 4 }, "Com elástico, bem ajustados ao colchão", "lençol de berço com elástico"],
      ["Sabão neutro para roupas de bebê", { v: 1, m: 1, i: 1 }, "Lave todas as roupinhas antes do uso", "sabão neutro para roupa de bebê"],
      ["Bolsa de maternidade", { v: 1, m: 1, i: 1 }, "Com divisórias e trocador", "bolsa maternidade"],
      ["Repelente indicado para bebês / mosquiteiro", { v: 1, m: 1, i: 0 }, "Confira a idade mínima do produto com o pediatra", "mosquiteiro para berço"]
    ]
  },
  {
    id: "equipamentos", titulo: "Equipamentos", emoji: "🛒", cor: "c3",
    itens: [
      ["Berço ou moisés com colchão", "1", "Prefira modelos com selo do Inmetro", "berço com selo inmetro"],
      ["Bebê conforto (cadeirinha para carro)", "1", "Obrigatório para andar de carro — selo do Inmetro", "bebê conforto cadeirinha recém-nascido"],
      ["Carrinho de passeio", "1", "Que recline totalmente para recém-nascido", "carrinho de bebê reclinável recém-nascido"],
      ["Banheira ou balde ofurô", "1", "Com suporte para facilitar o banho", "banheira de bebê"],
      ["Trocador", "1", "Fixo na cômoda ou portátil", "trocador de fralda bebê"],
      ["Cômoda ou organizadores", "1", "Para guardar roupinhas e fraldas", "cômoda para quarto de bebê"],
      ["Sling ou canguru", "1", "Colo com as mãos livres", "sling para bebê"],
      ["Luminária de luz suave", "1", "Para as mamadas e trocas noturnas", "luminária abajur luz suave quarto de bebê"],
      ["Ventilador ou climatizador silencioso", { v: 1, m: 0, i: 0 }, "Mantém o quartinho fresco", "ventilador silencioso quarto de bebê"],
      ["Umidificador de ar", { v: 0, m: 1, i: 1 }, "Ajuda no tempo seco", "umidificador de ar quarto de bebê"],
      ["Babá eletrônica", "opcional", "Útil se o quarto do bebê for longe do seu", "babá eletrônica"],
      ["Poltrona de amamentação", "opcional", "Conforto para as madrugadas", "poltrona de amamentação"]
    ]
  },
  {
    id: "mamae", titulo: "Coisas para a mamãe", emoji: "🤱", cor: "c4",
    itens: [
      ["Camisolas ou pijamas com abertura frontal", { v: 3, m: 3, i: 3 }, "Facilitam a amamentação", "camisola amamentação abertura frontal"],
      ["Sutiãs de amamentação", { v: 3, m: 3, i: 3 }, "Compre no último mês, quando o corpo já mudou", "sutiã de amamentação"],
      ["Absorventes para seios", { v: 1, m: 1, i: 1 }, "Mantêm os mamilos secos", "absorvente para seios amamentação"],
      ["Pacotes de absorvente pós-parto/noturno", { v: 2, m: 2, i: 2 }, "", "absorvente pós-parto"],
      ["Calcinhas de cintura alta", { v: 5, m: 5, i: 5 }, "Confortáveis no pós-parto (e na cesárea)", "calcinha pós-parto cintura alta"],
      ["Cinta pós-parto", { v: 1, m: 1, i: 1 }, "Só com orientação médica", "cinta pós-parto"],
      ["Creme ou pomada para mamilos", { v: 1, m: 1, i: 1 }, "Ajuda a prevenir rachaduras", "pomada lanolina para mamilos"],
      ["Roupão ou robe", { v: 1, m: 1, i: 1 }, "Mais leve no verão, mais quentinho no inverno", "roupão maternidade"],
      ["Chinelos (banho e quarto)", { v: 2, m: 2, i: 2 }, "", "chinelo para maternidade"],
      ["Pares de meia", { v: 0, m: 2, i: 3 }, "", "meia para pós-parto maternidade"],
      ["Almofada de amamentação", { v: 1, m: 1, i: 1 }, "Apoia o bebê e poupa suas costas", "almofada de amamentação"],
      ["Kit de higiene pessoal", { v: 1, m: 1, i: 1 }, "Escova, pasta, shampoo, desodorante, escova de cabelo", "kit higiene mala maternidade"],
      ["Roupa confortável para a saída", { v: 1, m: 1, i: 1 }, "", "roupa saída maternidade mãe"],
      ["Garrafinha de água", { v: 1, m: 1, i: 1 }, "Amamentar dá muita sede!", "garrafa de água amamentação"],
      ["Documentos e exames", "1 pasta", "RG/CPF, cartão do pré-natal, plano de saúde ou cartão SUS, últimos exames", "documentos para levar na maternidade"],
      ["Sacolas para roupa suja", { v: 2, m: 2, i: 2 }, "", "sacola roupa suja mala maternidade"]
    ]
  }
];

/* Dicas conforme a fase da gestação */
function dicaDaSemana(sem) {
  if (sem <= 13) return "🌱 1º trimestre: sem pressa! Comece pesquisando e anotando o que ganhar ou comprar.";
  if (sem <= 27) return "🛍️ 2º trimestre: ótima fase para montar o enxoval, o quartinho e a lista do chá de bebê.";
  if (sem <= 33) return "🧺 Hora de lavar as roupinhas com sabão neutro e começar a arrumar a mala da maternidade.";
  if (sem <= 36) return "🎒 Deixe a mala da maternidade pronta perto da porta e o bebê conforto instalado no carro.";
  return "🎉 Reta final! Mala pronta, documentos separados — agora é só esperar o grande dia.";
}

const MENSAGENS_DO_DIA = [
  "Cada dia que passa, um pouquinho mais perto do primeiro abraço! 🤗",
  "Hoje é um ótimo dia para cantar uma música para a barriga 🎶",
  "Respira fundo: vai dar tudo certo — e vai ser lindo! 💕",
  "Que tal separar um tempinho para descansar hoje? 😴",
  "O bebê já reconhece a sua voz: conte como foi o seu dia! 🗣️",
  "Beba água, mamãe! 💧",
  "Uma foto da barriga hoje? Depois vocês vão adorar ver 📸",
  "Pequenos passos: risque um item da lista hoje ✅",
  "Carinho na barriga também é conversa 🫶",
  "Já pensou em qual será a primeira música que vão ouvir juntos? 🎵",
  "Hoje o bebê cresceu mais um pouquinho 🌱",
  "Lembre-se: o enxoval não precisa ser perfeito, precisa ser feito com amor 🧸",
  "Peça ajuda sempre que precisar — rede de apoio é tudo! 🤝",
  "Faltam alguns dias a menos do que ontem! ⏳"
];

/* =============================================================
   Choji's Kitchen – cozinha.js
   Painel da Cozinha (Dark Kitchen): pedidos por cliente,
   status, cronômetros em tempo real.
============================================================= */

// ─────────────────────────────────────────
//  ESTADO GLOBAL
// ─────────────────────────────────────────
let orders       = [];
let liveInterval = null;

const WARN_SECONDS = 10 * 60;
const LATE_SECONDS = 15 * 60;

// ─────────────────────────────────────────
//  ELEMENTOS DOM
// ─────────────────────────────────────────
const listaNovos   = document.getElementById("listaNovos");
const listaPreparo = document.getElementById("listaPreparo");
const listaProntos = document.getElementById("listaProntos");

const badgeNovos   = document.getElementById("badgeNovos");
const badgePreparo = document.getElementById("badgePreparo");
const badgeProntos = document.getElementById("badgeProntos");

const statNovos    = document.getElementById("statNovos");
const statPreparo  = document.getElementById("statPreparo");
const statProntos  = document.getElementById("statProntos");
const statAtrasados= document.getElementById("statAtrasados");

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────
function generateOrderNumber() {
  // ID de 5 dígitos, ex: #55418
  return "#" + Math.floor(10000 + Math.random() * 90000);
}

function formatHHMM(ts) {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function elapsedSec(order) {
  return Math.floor((Date.now() - order.startedAt) / 1000);
}

function waitText(order) {
  const min = Math.floor(elapsedSec(order) / 60);
  return `Aguardando há ${min} min`;
}

// ─────────────────────────────────────────
//  CRUD DE PEDIDOS
// ─────────────────────────────────────────
function moveOrder(id, newStatus) {
  const order = orders.find(o => o.id === id);
  if (!order) return;
  order.status = newStatus;
  if (newStatus === "entregue") {
    setTimeout(() => {
      orders = orders.filter(o => o.id !== id);
      render();
    }, 400);
  }
  // Reinicia o relógio do tempo de espera ao mudar de coluna
  order.startedAt = Date.now();
  render();
}

function cancelOrder(id) {
  orders = orders.filter(o => o.id !== id);
  render();
}

// ─────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────
function render() {
  const novos     = orders.filter(o => o.status === "novo");
  const preparo   = orders.filter(o => o.status === "preparo");
  const prontos   = orders.filter(o => o.status === "pronto");
  const atrasados = orders.filter(o => o.status !== "entregue" && elapsedSec(o) >= LATE_SECONDS);

  statNovos.textContent     = novos.length;
  statPreparo.textContent   = preparo.length;
  statProntos.textContent   = prontos.length;
  statAtrasados.textContent = atrasados.length;

  badgeNovos.textContent   = novos.length;
  badgePreparo.textContent = preparo.length;
  badgeProntos.textContent = prontos.length;

  renderColumn(listaNovos,   novos,   "novo");
  renderColumn(listaPreparo, preparo, "preparo");
  renderColumn(listaProntos, prontos, "pronto");
}

function renderColumn(container, list, colStatus) {
  container.innerHTML = "";

  if (list.length === 0) {
    const emptyMessages = {
      novo:    "Nenhum pedido novo",
      preparo: "Nenhum pedido em preparo",
      pronto:  "Nenhum pedido pronto",
    };
    container.innerHTML = `<div class="empty-col">${emptyMessages[colStatus]}</div>`;
    return;
  }

  list.forEach(order => {
    container.appendChild(createOrderCard(order, colStatus));
  });
}

function buildItemsHTML(items) {
  return items.map(it => {
    const variant = it.variant ? ` <span class="item-variant">(${it.variant})</span>` : "";
    return `${it.qty}x ${it.name}${variant}`;
  }).join("<br>");
}

function createOrderCard(order, colStatus) {
  const sec = elapsedSec(order);
  const isLate = sec >= LATE_SECONDS;

  const card = document.createElement("div");
  card.className = `order-card${isLate ? " late" : ""}`;
  card.dataset.id = order.id;

  // Badge de status (canto superior direito)
  const badgeMap = {
    novo:    { text: "Novo",       cls: "" },
    preparo: { text: "Em Preparo", cls: "yellow" },
    pronto:  { text: "Pronto",     cls: "green" },
  };
  const badge = badgeMap[colStatus];

  // Botões de ação por status
  let actions = "";
  if (colStatus === "novo") {
    actions = `
      <button class="btn-action btn-iniciar" data-action="preparo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Iniciar Preparo
      </button>
      <button class="btn-action btn-cancelar" data-action="cancel">Cancelar</button>
    `;
  } else if (colStatus === "preparo") {
    actions = `
      <button class="btn-action btn-pronto" data-action="pronto">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        Marcar como Pronto
      </button>
      <button class="btn-action btn-cancelar" data-action="cancel">Cancelar</button>
    `;
  } else if (colStatus === "pronto") {
    actions = `
      <button class="btn-action btn-entregar" data-action="entregue">
        🚀 Enviar para Entrega
      </button>
    `;
  }

  card.innerHTML = `
    <div class="order-top">
      <span class="order-id">Pedido ${order.id}</span>
      <span class="order-status-badge ${badge.cls}">${badge.text}</span>
    </div>
    <div class="order-time">${formatHHMM(order.createdAt)}</div>
    <div class="order-customer">${order.cliente}</div>

    <div class="order-items">${buildItemsHTML(order.items)}</div>

    <div class="order-meta">
      <span class="order-wait">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${waitText(order)}
      </span>
      <span class="order-est">Tempo est.: ${order.estMin} min</span>
    </div>

    <div class="order-actions">${actions}</div>
  `;

  card.querySelectorAll(".btn-action").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "cancel") cancelOrder(order.id);
      else moveOrder(order.id, action);
    });
  });

  return card;
}

// ─────────────────────────────────────────
//  TICKER (atualiza textos de espera a cada 30s)
// ─────────────────────────────────────────
function startLive() {
  if (liveInterval) return;
  liveInterval = setInterval(() => {
    render();
  }, 30 * 1000);
}

function stopLive() {
  clearInterval(liveInterval);
  liveInterval = null;
}

// ─────────────────────────────────────────
//  BOTÃO "AO VIVO" — toggle
// ─────────────────────────────────────────
const btnLive = document.getElementById("btnLive");
let isLive = true;

btnLive.addEventListener("click", () => {
  isLive = !isLive;
  if (isLive) {
    startLive();
    btnLive.innerHTML = `<span class="live-dot"></span> Ao Vivo`;
    btnLive.style.background = "";
  } else {
    stopLive();
    btnLive.innerHTML = `⏸ Pausado`;
    btnLive.style.background = "#555";
  }
});

// ─────────────────────────────────────────
//  INIT – pedido de demonstração (igual à imagem)
// ─────────────────────────────────────────
function initDemo() {
  const now = Date.now();

  orders.push({
    id:        "#55418",
    cliente:   "João Silva",
    items:     [{ qty: 1, name: "Missô Akai Especial", variant: "regular" }],
    estMin:    50,
    status:    "novo",
    createdAt: now - 1 * 60 * 1000,
    startedAt: now - 1 * 60 * 1000,
  });

  render();
  startLive();
}

initDemo();

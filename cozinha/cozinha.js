/* =============================================================
   Choji's Kitchen – cozinha.js  [ATUALIZADO]
   Lê pedidos reais de chojiOrders via choji-orders.js
   e atualiza o status em tempo real (polling 5s).
============================================================= */

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

const statNovos     = document.getElementById("statNovos");
const statPreparo   = document.getElementById("statPreparo");
const statProntos   = document.getElementById("statProntos");
const statAtrasados = document.getElementById("statAtrasados");

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────
function formatHHMM(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function elapsedSec(order) {
  return Math.floor((Date.now() - (order.startedAt || order.createdAt)) / 1000);
}

function waitText(order) {
  const min = Math.floor(elapsedSec(order) / 60);
  return `Aguardando há ${min} min`;
}

function buildItemsHTML(items) {
  if (!items || items.length === 0) return "—";
  return items.map(it => {
    const opts = [];
    if (it.size === "grande")                  opts.push("Porção Grande");
    if (it.adicionais && it.adicionais.length) opts.push("➕ " + it.adicionais.join(", "));
    if (it.remover    && it.remover.length)    opts.push("➖ sem " + it.remover.join(", "));
    if (it.obs)                                opts.push("📝 " + it.obs);
    const optsLine = opts.length
      ? `<div class="item-opts">${opts.join(" · ")}</div>`
      : "";
    return `<div>${it.qty}x ${it.name}${optsLine}</div>`;
  }).join("");
}

// ─────────────────────────────────────────
//  AÇÕES — delegam ao ChojiOrders
// ─────────────────────────────────────────
function moveOrder(id, newStatus) {
  ChojiOrders.updateStatus(id, newStatus);
  render();
}

function cancelOrder(id) {
  ChojiOrders.cancelOrder(id);
  render();
}

// ─────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────
function render() {
  // Pedidos relevantes para a cozinha: novo, preparo, pronto
  const allOrders = ChojiOrders.getAll().filter(o =>
    ["novo","preparo","pronto"].includes(o.status)
  );

  const novos   = allOrders.filter(o => o.status === "novo");
  const preparo = allOrders.filter(o => o.status === "preparo");
  const prontos = allOrders.filter(o => o.status === "pronto");
  const atrasados = allOrders.filter(o => elapsedSec(o) >= LATE_SECONDS);

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
    const msgs = {
      novo:    "Nenhum pedido novo",
      preparo: "Nenhum pedido em preparo",
      pronto:  "Nenhum pedido pronto",
    };
    container.innerHTML = `<div class="empty-col">${msgs[colStatus]}</div>`;
    return;
  }
  list.forEach(order => container.appendChild(createOrderCard(order, colStatus)));
}

function createOrderCard(order, colStatus) {
  const sec    = elapsedSec(order);
  const isLate = sec >= LATE_SECONDS;

  const card = document.createElement("div");
  card.className = `order-card${isLate ? " late" : ""}`;
  card.dataset.id = order.id;

  const badgeMap = {
    novo:    { text: "Novo",       cls: "" },
    preparo: { text: "Em Preparo", cls: "yellow" },
    pronto:  { text: "Pronto",     cls: "green" },
  };
  const badge = badgeMap[colStatus];

  let actions = "";
  if (colStatus === "novo") {
    actions = `
      <button class="btn-action btn-iniciar" data-action="preparo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Iniciar Preparo
      </button>
      <button class="btn-action btn-cancelar" data-action="cancel">Cancelar</button>`;
  } else if (colStatus === "preparo") {
    actions = `
      <button class="btn-action btn-pronto" data-action="pronto">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        Marcar como Pronto
      </button>
      <button class="btn-action btn-cancelar" data-action="cancel">Cancelar</button>`;
  } else if (colStatus === "pronto") {
    if (order.deliveryType === "pickup") {
      actions = `
        <button class="btn-action btn-entregar" data-action="concluida">
          ✅ Pedido Retirado
        </button>`;
    } else {
      actions = `
        <button class="btn-action btn-entregar" data-action="disponivel">
          🚀 Enviar para Entrega
        </button>`;
    }
  }

  // Nome do cliente legível
  const clienteLabel = order.clienteNome || order.cliente || "Cliente";
  const tipoEntrega  = order.deliveryType === "pickup"
    ? '<span style="font-size:.78rem;background:#fef3c7;color:#92400e;padding:.15rem .5rem;border-radius:6px;margin-left:.4rem;">🏠 Retirada</span>'
    : '<span style="font-size:.78rem;background:#dbeafe;color:#1d4ed8;padding:.15rem .5rem;border-radius:6px;margin-left:.4rem;">🚚 Delivery</span>';

  card.innerHTML = `
    <div class="order-top">
      <span class="order-id">Pedido ${order.id}${tipoEntrega}</span>
      <span class="order-status-badge ${badge.cls}">${badge.text}</span>
    </div>
    <div class="order-time">${formatHHMM(order.createdAt)}</div>
    <div class="order-customer">${clienteLabel}</div>
    <div class="order-items">${buildItemsHTML(order.items)}</div>
    <div class="order-meta">
      <span class="order-wait">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        ${waitText(order)}
      </span>
      <span class="order-est">Total: R$ ${Number(order.total || 0).toFixed(2).replace(".",",")}</span>
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
//  POLLING — atualiza a cada 3 segundos
// ─────────────────────────────────────────
function startLive() {
  if (liveInterval) return;
  liveInterval = setInterval(render, 3000);
}

function stopLive() {
  clearInterval(liveInterval);
  liveInterval = null;
}

// Sincroniza imediatamente quando qualquer aba (inclusive a mesma) salva um pedido
ChojiOrders.onUpdate(() => render());

// ─────────────────────────────────────────
//  BOTÃO "AO VIVO"
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
//  INIT
// ─────────────────────────────────────────
render();
startLive();

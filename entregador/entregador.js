/* =============================================================
   Choji's Kitchen – entregas.js
   Painel de Entregas: gestão de status, filtros, cronômetros
============================================================= */

// ─────────────────────────────────────────
//  ESTADO
// ─────────────────────────────────────────
let deliveries   = [];
let deliveryCounter = 1;
let activeFilter = "disponiveis";
let ticker       = null;

// ─────────────────────────────────────────
//  DOM
// ─────────────────────────────────────────
const deliveryList    = document.getElementById("deliveryList");
const statDisponiveis = document.getElementById("statDisponiveis");
const statAndamento   = document.getElementById("statAndamento");
const statConcluidas  = document.getElementById("statConcluidas");
const modalOverlay    = document.getElementById("modalOverlay");
const btnAddDelivery  = document.getElementById("btnAddDelivery");
const btnCancelModal  = document.getElementById("btnCancelModal");
const btnConfirmModal = document.getElementById("btnConfirmModal");
const inputCliente    = document.getElementById("inputCliente");
const inputEndereco   = document.getElementById("inputEndereco");
const inputItens      = document.getElementById("inputItens");
const inputEntregador = document.getElementById("inputEntregador");
const btnSair         = document.querySelector(".btn-sair");

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────
function formatElapsed(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function genId() {
  return `#${String(deliveryCounter++).padStart(3, "0")}`;
}

function statusLabel(status) {
  return { disponivel: "Disponível", andamento: "Em Andamento", concluida: "Concluída" }[status] || status;
}

function statusBadgeClass(status) {
  return { disponivel: "badge-disponivel", andamento: "badge-andamento", concluida: "badge-concluida" }[status];
}

function statusCardClass(status) {
  return { disponivel: "status-disponivel", andamento: "status-andamento", concluida: "status-concluida" }[status];
}

function statusIconClass(status) {
  return { disponivel: "ci-blue", andamento: "ci-yellow", concluida: "ci-green" }[status];
}

function statusIcon(status) {
  if (status === "disponivel") return `
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 3H8l-2 4h12l-2-4z"/>
    </svg>`;
  if (status === "andamento") return `
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>`;
  return `
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`;
}

// ─────────────────────────────────────────
//  CRUD
// ─────────────────────────────────────────
function addDelivery({ cliente, endereco, itens, entregador }) {
  deliveries.push({
    id: genId(),
    cliente:    cliente  || "Cliente sem nome",
    endereco:   endereco || "Endereço não informado",
    itens:      itens    || "Itens não especificados",
    entregador: entregador || "A definir",
    status:     "disponivel",
    createdAt:  Date.now(),
  });
  render();
}

function updateStatus(id, newStatus) {
  const d = deliveries.find(d => d.id === id);
  if (d) { d.status = newStatus; render(); }
}

function removeDelivery(id) {
  deliveries = deliveries.filter(d => d.id !== id);
  render();
}

// ─────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────
function render() {
  const disponiveis = deliveries.filter(d => d.status === "disponivel");
  const andamento   = deliveries.filter(d => d.status === "andamento");
  const concluidas  = deliveries.filter(d => d.status === "concluida");

  // Stats
  statDisponiveis.textContent = disponiveis.length;
  statAndamento.textContent   = andamento.length;
  statConcluidas.textContent  = concluidas.length;

  // Filter visible list
  let visible;
  if      (activeFilter === "disponiveis") visible = disponiveis;
  else if (activeFilter === "andamento")   visible = andamento;
  else                                     visible = concluidas;

  deliveryList.innerHTML = "";

  if (visible.length === 0) {
    const msgs = {
      disponiveis: ["Nenhuma entrega disponível no momento", "Aguarde novos pedidos chegarem"],
      andamento:   ["Nenhuma entrega em andamento",          "Inicie uma entrega disponível"],
      concluidas:  ["Nenhuma entrega concluída hoje",        "Conclua entregas em andamento"],
    };
    const [title, sub] = msgs[activeFilter];
    deliveryList.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
          <rect x="1" y="3" width="15" height="13" rx="1"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <span class="empty-title">${title}</span>
        <span class="empty-sub">${sub}</span>
      </div>`;
    return;
  }

  visible.forEach((d, i) => {
    const el = createCard(d);
    el.style.animationDelay = `${i * 50}ms`;
    deliveryList.appendChild(el);
  });
}

function createCard(d) {
  const elapsed = Date.now() - d.createdAt;
  const card = document.createElement("div");
  card.className = `delivery-card ${statusCardClass(d.status)}`;
  card.dataset.id = d.id;

  // Actions per status
  let actions = "";
  if (d.status === "disponivel") {
    actions = `
      <button class="btn-card-action btn-iniciar"  data-action="andamento">▶ Iniciar</button>
      <button class="btn-card-action btn-remover"  data-action="remove">✕</button>`;
  } else if (d.status === "andamento") {
    actions = `
      <button class="btn-card-action btn-concluir" data-action="concluida">✓ Concluir</button>
      <button class="btn-card-action btn-remover"  data-action="remove">✕</button>`;
  } else {
    actions = `
      <button class="btn-card-action btn-remover"  data-action="remove">✕ Remover</button>`;
  }

  card.innerHTML = `
    <div class="card-icon ${statusIconClass(d.status)}">${statusIcon(d.status)}</div>
    <div class="card-info">
      <div class="card-top">
        <span class="card-id">${d.id}</span>
        <span class="status-badge ${statusBadgeClass(d.status)}">${statusLabel(d.status)}</span>
      </div>
      <div class="card-client">${d.cliente}</div>
      <div class="card-address">📍 ${d.endereco}</div>
      <div class="card-items">🍜 ${d.itens}</div>
      <div class="card-actions">${actions}</div>
    </div>
    <div class="card-meta">
      <div class="card-driver">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        ${d.entregador}
      </div>
      <span class="card-time" data-timer="${d.id}">${formatElapsed(elapsed)}</span>
    </div>
  `;

  // Wire actions
  card.querySelectorAll(".btn-card-action").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "remove") removeDelivery(d.id);
      else updateStatus(d.id, action);
    });
  });

  return card;
}

// ─────────────────────────────────────────
//  TICKER — atualiza timers a cada 1s
// ─────────────────────────────────────────
function startTicker() {
  if (ticker) return;
  ticker = setInterval(() => {
    document.querySelectorAll("[data-timer]").forEach(el => {
      const id = el.dataset.timer;
      const d  = deliveries.find(d => d.id === id);
      if (d) el.textContent = formatElapsed(Date.now() - d.createdAt);
    });
  }, 1000);
}

// ─────────────────────────────────────────
//  FILTROS
// ─────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });
});

// ─────────────────────────────────────────
//  SAIR — volta para a página principal
// ─────────────────────────────────────────
if (btnSair) {
  btnSair.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

// ─────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────
function openModal() {
  [inputCliente, inputEndereco, inputItens, inputEntregador].forEach(i => i.value = "");
  modalOverlay.classList.add("open");
  setTimeout(() => inputCliente.focus(), 100);
}

function closeModal() { modalOverlay.classList.remove("open"); }

btnAddDelivery.addEventListener("click", openModal);
btnCancelModal.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

btnConfirmModal.addEventListener("click", () => {
  const cliente    = inputCliente.value.trim();
  const endereco   = inputEndereco.value.trim();
  const itens      = inputItens.value.trim();
  const entregador = inputEntregador.value.trim();
  addDelivery({ cliente, endereco, itens, entregador });
  closeModal();
  // Switch to disponíveis tab
  document.querySelector('[data-filter="disponiveis"]').click();
});

[inputCliente, inputEndereco, inputItens, inputEntregador].forEach(inp => {
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter")  btnConfirmModal.click();
    if (e.key === "Escape") closeModal();
  });
});

// ─────────────────────────────────────────
//  DEMO DATA
// ─────────────────────────────────────────
function initDemo() {
  const now = Date.now();

  deliveries = [
    {
      id: genId(), status: "disponivel",
      cliente: "Naruto Uzumaki – Pedido #038",
      endereco: "Rua dos Ramen, 9 – Apto 7",
      itens: "3x Tonkotsu Densetsu, 1x Gyoza",
      entregador: "A definir",
      createdAt: now - 2 * 60 * 1000,
    },
    {
      id: genId(), status: "andamento",
      cliente: "Sakura Haruno – Pedido #037",
      endereco: "Av. Konoha, 521 – Casa",
      itens: "1x Shoyu Kyoto, 2x Takoyaki",
      entregador: "Kenji Yamada",
      createdAt: now - 11 * 60 * 1000,
    },
    {
      id: genId(), status: "andamento",
      cliente: "Rock Lee – Pedido #036",
      endereco: "Travessa da Juventude, 42",
      itens: "2x Tori Paitan, 1x Matcha Latte",
      entregador: "Hana Mori",
      createdAt: now - 7 * 60 * 1000,
    },
    {
      id: genId(), status: "concluida",
      cliente: "Kakashi Hatake – Pedido #035",
      endereco: "Rua do Sharingan, 1 – Bloco B",
      itens: "1x Missô Akai Especial",
      entregador: "Ryu Tanaka",
      createdAt: now - 45 * 60 * 1000,
    },
  ];

  render();
  startTicker();
}

initDemo();

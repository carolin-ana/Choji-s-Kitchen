/* =============================================================
   Choji's Kitchen – pedidos.js  [ATUALIZADO]
   Lê e gerencia pedidos reais via choji-orders.js
============================================================= */

let currentId = null;

// ─────────────────────────────────────────
//  STATUS MAP (para CSS/ícones)
// ─────────────────────────────────────────
const statusDisplay = {
  novo:       { cls: "st-recebido",  icon: "🕐",  label: "Recebido" },
  preparo:    { cls: "st-preparo",   icon: "👨‍🍳", label: "Em Preparo" },
  pronto:     { cls: "st-pronto",    icon: "📦",  label: "Pronto" },
  disponivel: { cls: "st-atribuido", icon: "👤",  label: "Atribuído" },
  andamento:  { cls: "st-rota",      icon: "🚚",  label: "Em Rota" },
  concluida:  { cls: "st-entregue",  icon: "✓",   label: "Entregue" },
  entregue:   { cls: "st-entregue",  icon: "✓",   label: "Entregue" },
  cancelado:  { cls: "st-cancelado", icon: "⊘",   label: "Cancelado" },
};

function getDisplay(status) {
  return statusDisplay[status] || { cls: "st-recebido", icon: "🕐", label: status };
}

function findById(id) {
  return ChojiOrders.getAll().find(p => p.id === id);
}

// ─────────────────────────────────────────
//  STATS
// ─────────────────────────────────────────
function updateStats(orders) {
  const today = new Date().toLocaleDateString("pt-BR");
  const todayOrders = orders.filter(o => {
    try { return o.data && o.data.includes(new Date().getDate()); } catch(e) { return true; }
  });

  const counts = {
    hoje:       orders.length,
    recebido:   orders.filter(o => o.status === "novo").length,
    preparo:    orders.filter(o => o.status === "preparo").length,
    pronto:     orders.filter(o => o.status === "pronto").length,
    andamento:  orders.filter(o => o.status === "andamento").length,
    entregue:   orders.filter(o => ["concluida","entregue"].includes(o.status)).length,
  };

  const statEls = document.querySelectorAll(".stat-card .stat-value");
  if (statEls.length >= 6) {
    statEls[0].textContent = counts.hoje;
    statEls[1].textContent = counts.recebido;
    statEls[2].textContent = counts.preparo;
    statEls[3].textContent = counts.pronto;
    statEls[4].textContent = counts.andamento;
    statEls[5].textContent = counts.entregue;
  }
}

// ─────────────────────────────────────────
//  RENDER
// ─────────────────────────────────────────
function render() {
  const orders = ChojiOrders.getAll();
  updateStats(orders);

  const list = document.getElementById("ordersList");
  if (!list) return;

  if (orders.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:3rem;color:#888;">
        <div style="font-size:3rem;margin-bottom:1rem;">📭</div>
        <div style="font-size:1.1rem;font-weight:600;">Nenhum pedido ainda</div>
        <div style="font-size:0.9rem;margin-top:0.5rem;">Os pedidos feitos pelos clientes aparecerão aqui</div>
      </div>`;
    return;
  }

  list.innerHTML = orders.map(p => {
    const s = getDisplay(p.status);
    const finalized = ["concluida","entregue","cancelado"].includes(p.status);
    const itensCount = (p.items || []).length;
    return `
      <div class="order-row">
        <div class="col-num">
          <span class="lbl">Nº Pedido</span>
          <span class="num">${p.id}</span>
        </div>
        <div class="col-cli">
          <div class="nome">👤 ${p.clienteNome || p.cliente || "Cliente"}</div>
          <div class="data">📅 ${p.data || "—"}</div>
        </div>
        <div class="col-total">
          <span class="lbl">Total</span>
          <div class="val">R$ ${Number(p.total || 0).toFixed(2)}</div>
        </div>
        <div class="col-status">
          <span class="lbl">Status</span>
          <div><span class="status-pill ${s.cls}">${s.icon} ${s.label}</span></div>
        </div>
        <div class="col-actions">
          <button class="btn-act" onclick="openDetails('${p.id}')">👁 Ver</button>
          ${!finalized ? `<button class="btn-act orange" onclick="openStatus('${p.id}')">⟳ Status</button>` : ""}
          ${!finalized ? `<button class="btn-act danger" onclick="openCancel('${p.id}')">⊘</button>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

// ─────────────────────────────────────────
//  MODAL DETALHES
// ─────────────────────────────────────────
function openDetails(id) {
  currentId = id;
  const p = findById(id);
  if (!p) return;
  const s = getDisplay(p.status);

  document.getElementById("dNum").textContent    = p.id;
  document.getElementById("dData").textContent   = p.data || "—";

  const dStatus = document.getElementById("dStatus");
  dStatus.className   = `status-pill ${s.cls}`;
  dStatus.textContent = `${s.icon} ${s.label}`;

  document.getElementById("dCliente").textContent = p.clienteNome || p.cliente || "Cliente";
  document.getElementById("dTel").textContent     = p.tel || "—";

  const payLabels = { card: "Cartão de Crédito", pix: "PIX", cash: "Dinheiro" };
  document.getElementById("dPag").textContent = payLabels[p.payType] || p.payType || "—";
  document.getElementById("dTotal2").textContent = `R$ ${Number(p.total || 0).toFixed(2)}`;

  // Endereço
  let endStr = "—";
  if (p.deliveryType === "pickup") {
    endStr = "Retirada no restaurante";
  } else if (p.address) {
    const a = p.address;
    endStr = [a.addr, a.comp, a.bairro, `${a.cidade || ""}/${a.estado || ""}`]
      .filter(x => x && x !== "/").join(", ");
  }
  document.getElementById("dEnd").textContent = endStr;

  const items = p.items || [];
  document.getElementById("dQtd").textContent = items.length;
  document.getElementById("dItens").innerHTML = items.map(it => `
    <div class="item-row">
      <div>
        <div class="nome">${it.name}</div>
        <div class="qtd">${it.qty}x • R$ ${Number(it.finalPrice || 0).toFixed(2)} cada</div>
      </div>
      <div class="preco">R$ ${Number((it.finalPrice || 0) * it.qty).toFixed(2)}</div>
    </div>
  `).join("");

  document.getElementById("dTotal").textContent = `R$ ${Number(p.total || 0).toFixed(2)}`;
  openModal("modalDetalhes");
}

// ─────────────────────────────────────────
//  MODAL STATUS
// ─────────────────────────────────────────
function openStatus(id) {
  currentId = id;
  const p = findById(id);
  if (!p) return;
  const s = getDisplay(p.status);

  document.getElementById("sInfo").textContent = `Pedido ${p.id} - ${p.clienteNome || p.cliente || "Cliente"}`;
  const cur = document.getElementById("sCurrent");
  cur.className   = `status-pill ${s.cls}`;
  cur.textContent = `${s.icon} ${s.label}`;

  // Mapeia status interno para opção do select
  const selectMap = {
    novo: "Recebido", preparo: "Em Preparo", pronto: "Pronto",
    disponivel: "Saiu para Entrega", andamento: "Saiu para Entrega",
    concluida: "Entregue", entregue: "Entregue",
  };
  document.getElementById("sNew").value = selectMap[p.status] || "Recebido";

  closeModal("modalDetalhes");
  openModal("modalStatus");
}

function confirmStatus() {
  const p = findById(currentId);
  if (!p) return;

  // Mapeia label do select → status interno
  const statusMap = {
    "Recebido":           "novo",
    "Em Preparo":         "preparo",
    "Pronto":             "pronto",
    "Saiu para Entrega":  "andamento",
    "Entregue":           "concluida",
  };
  const selectedLabel = document.getElementById("sNew").value;
  const newStatus = statusMap[selectedLabel] || "novo";

  ChojiOrders.updateStatus(currentId, newStatus);
  render();
  closeModal("modalStatus");
}

// ─────────────────────────────────────────
//  MODAL CANCELAR
// ─────────────────────────────────────────
function openCancel(id) {
  currentId = id;
  const p = findById(id);
  if (!p) return;
  const s = getDisplay(p.status);

  document.getElementById("cNum").textContent    = p.id;
  document.getElementById("cCliente").textContent = p.clienteNome || p.cliente || "Cliente";
  document.getElementById("cTotal").textContent  = `R$ ${Number(p.total || 0).toFixed(2)}`;
  document.getElementById("cStatus").textContent = s.label;
  document.getElementById("cItens").textContent  = (p.items || []).length;

  closeModal("modalDetalhes");
  openModal("modalCancel");
}

function confirmCancel() {
  ChojiOrders.cancelOrder(currentId);
  render();
  closeModal("modalCancel");
}

// ─────────────────────────────────────────
//  HELPERS MODAL
// ─────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

document.querySelectorAll(".modal-overlay").forEach(o => {
  o.addEventListener("click", e => { if (e.target === o) o.classList.remove("active"); });
});

// ─────────────────────────────────────────
//  POLLING + SINCRONIZAÇÃO
// ─────────────────────────────────────────
ChojiOrders.onUpdate(() => render());
setInterval(render, 3000);

// ─────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────
render();

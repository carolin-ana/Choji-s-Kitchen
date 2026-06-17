/* ============================================================
   Choji's Kitchen — choji-orders.js
   Módulo central de pedidos (localStorage compartilhado)

   FLUXO DE STATUS:
   novo → preparo → pronto → disponivel → andamento → concluida/entregue

   Usado por: checkout.js, cozinha.js, entregador.js,
              entregas.js, pedidos.js, gerente.js
============================================================ */

const ChojiOrders = (() => {

  const KEY = "chojiOrders";

  // ── Leitura / Escrita ─────────────────────────────────────
  function getAll() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveAll(orders) {
    try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch (e) {}
  }

  // ── Adicionar pedido (chamado pelo checkout.js) ────────────
  function addOrder(orderData, cartPayload) {
    const orders = getAll();

    const subtotal = cartPayload.items.reduce((s, it) => s + it.finalPrice * it.qty, 0);
    const fee      = orderData.deliveryType === "pickup" ? 0 : 12;
    const disc     = cartPayload.discountPct ? subtotal * (cartPayload.discountPct / 100) : 0;
    const total    = subtotal + fee - disc;

    const order = {
      id:           orderData.orderNum,           // ex: "#55418"
      cliente:      orderData.email,              // substituir por nome quando tiver login
      clienteNome:  orderData.clienteNome || "Cliente",
      tel:          orderData.tel || "",
      data:         orderData.date,
      items:        cartPayload.items,
      subtotal,
      fee,
      discount:     disc,
      total,
      deliveryType: orderData.deliveryType,
      address:      orderData.address,
      payType:      orderData.payType,
      cardLast4:    orderData.cardLast4 || "",
      // Status do fluxo completo
      status:       "novo",          // novo → preparo → pronto → disponivel → andamento → entregue
      statusLabel:  "Recebido",
      createdAt:    Date.now(),
      startedAt:    Date.now(),
      // Entregador (preenchido na página de entregas)
      entregadorId:   null,
      entregadorNome: null,
      atribuidoAs:    null,
    };

    orders.unshift(order); // mais recente primeiro
    saveAll(orders);
    return order;
  }

  // ── Atualizar status de um pedido ─────────────────────────
  function updateStatus(id, newStatus) {
    const orders = getAll();
    const o = orders.find(o => o.id === id);
    if (!o) return false;

    o.status      = newStatus;
    o.statusLabel = STATUS_LABELS[newStatus] || newStatus;
    o.startedAt   = Date.now();

    // Quando entregue, registra hora de conclusão
    if (newStatus === "entregue" || newStatus === "concluida") {
      o.finishedAt = Date.now();
    }
    saveAll(orders);
    return true;
  }

  // ── Atribuir entregador ───────────────────────────────────
  function assignDelivery(id, entregador) {
    const orders = getAll();
    const o = orders.find(o => o.id === id);
    if (!o) return false;
    o.entregadorId   = entregador.id;
    o.entregadorNome = entregador.nome;
    const now = new Date();
    o.atribuidoAs = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    o.status      = "disponivel";
    o.statusLabel = "Atribuído";
    saveAll(orders);
    return true;
  }

  // ── Cancelar pedido ───────────────────────────────────────
  function cancelOrder(id) {
    const orders = getAll();
    const o = orders.find(o => o.id === id);
    if (!o) return false;
    o.status      = "cancelado";
    o.statusLabel = "Cancelado";
    saveAll(orders);
    return true;
  }

  // ── Filtros por status ────────────────────────────────────
  function getByStatus(...statuses) {
    return getAll().filter(o => statuses.includes(o.status));
  }

  // ── Mapa de labels legíveis ───────────────────────────────
  const STATUS_LABELS = {
    novo:        "Recebido",
    preparo:     "Em Preparo",
    pronto:      "Pronto",
    disponivel:  "Atribuído",
    andamento:   "Em Rota",
    concluida:   "Entregue",
    entregue:    "Entregue",
    cancelado:   "Cancelado",
  };

  // ── Mapa de status → classe CSS (pedidos.js / gerente.js) ─
  const STATUS_CSS = {
    novo:       "st-recebido",
    preparo:    "st-preparo",
    pronto:     "st-pronto",
    disponivel: "st-atribuido",
    andamento:  "st-rota",
    concluida:  "st-entregue",
    entregue:   "st-entregue",
    cancelado:  "st-cancelado",
  };

  const STATUS_ICONS = {
    novo:       "🕐",
    preparo:    "👨‍🍳",
    pronto:     "📦",
    disponivel: "👤",
    andamento:  "🚚",
    concluida:  "✓",
    entregue:   "✓",
    cancelado:  "⊘",
  };

  // ── Polling: chama callback quando localStorage muda ──────
  // (útil para sincronizar abas abertas ao mesmo tempo)
  function onUpdate(callback) {
    window.addEventListener("storage", e => {
      if (e.key === KEY) callback(getAll());
    });
  }

  // ── Formatar valor em BRL ─────────────────────────────────
  function fmt(v) {
    return "R$ " + Number(v).toFixed(2).replace(".", ",");
  }

  return {
    getAll, saveAll, addOrder,
    updateStatus, assignDelivery, cancelOrder,
    getByStatus, onUpdate, fmt,
    STATUS_LABELS, STATUS_CSS, STATUS_ICONS,
  };

})();

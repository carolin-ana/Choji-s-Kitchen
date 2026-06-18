/* =============================================================
   Choji's Kitchen — entregas.js  [ATUALIZADO]
   Gestão de Entregas (visão do gerente)
   Pedidos agora vêm do sistema real via choji-orders.js.

   OBS: ainda não existe um cadastro real de entregadores no
   sistema, então a lista abaixo continua fixa por enquanto.
   Quando isso existir, basta trocar `entregadores` por uma
   leitura do storage real, mantendo o resto igual.
============================================================= */

const entregadores = [
  { id: 'e1', nome: 'Pedro Santos', tel: '(11) 96543-2109', status: 'Disponível', ativas: 0, hoje: 12, aval: 4.8 },
  { id: 'e2', nome: 'Ana Lima',     tel: '(11) 95432-1098', status: 'Em Entrega',  ativas: 2, hoje: 8,  aval: 4.9 },
  { id: 'e3', nome: 'Carlos Souza', tel: '(11) 94321-0987', status: 'Disponível', ativas: 0, hoje: 15, aval: 5.0 },
];

let currentPedidoId      = null;
let selectedEntregadorId = null;
let activeStatusFilter   = 'Todos os status';
let searchTerm           = '';

// ─────────────────────────────────────────
//  STATUS MAP (status real do ChojiOrders → exibição)
// ─────────────────────────────────────────
const statusPillMap = {
  pronto:     'st-pronto',
  disponivel: 'st-atribuido',
  andamento:  'st-rota',
  concluida:  'st-entregue',
  entregue:   'st-entregue',
};
const statusLabelMap = {
  pronto:     'Pronto',
  disponivel: 'Atribuído',
  andamento:  'Em Rota',
  concluida:  'Entregue',
  entregue:   'Entregue',
};

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────
function elapsedMin(order) {
  return Math.floor((Date.now() - (order.startedAt || order.createdAt)) / 60000);
}

function buildEndereco(o) {
  if (o.deliveryType === "pickup") {
    return { rua: "Retirada no restaurante", bairro: "" };
  }
  const a = o.address || {};
  const cidadeEstado = (a.cidade && a.estado) ? `${a.cidade}/${a.estado}` : "";
  return {
    rua:    a.addr || "Endereço não informado",
    bairro: [a.bairro, cidadeEstado].filter(Boolean).join(" — "),
  };
}

function buildItens(o) {
  return (o.items || []).map(it => {
    const opts = [];
    if (it.size === "grande")                  opts.push("Porção Grande");
    if (it.adicionais && it.adicionais.length) opts.push("➕ " + it.adicionais.join(", "));
    if (it.remover    && it.remover.length)    opts.push("➖ sem " + it.remover.join(", "));
    if (it.obs)                                opts.push("📝 " + it.obs);
    const suffix = opts.length ? ` <span class="item-opt-tag">${opts.join(" · ")}</span>` : "";
    return {
      n: `${it.qty}x ${it.name}${suffix}`,
      p: (it.finalPrice || 0) * it.qty,
    };
  });
}

function getRelevantOrders() {
  return ChojiOrders.getAll().filter(o =>
    ["pronto", "disponivel", "andamento", "concluida", "entregue"].includes(o.status) &&
    o.deliveryType !== "pickup"   // retirada no local não aparece na gestão de entregas
  );
}

// ─────────────────────────────────────────
//  RENDER — ENTREGADORES (lista fixa, por enquanto)
// ─────────────────────────────────────────
function renderEntregadores() {
  document.getElementById('entregadoresList').innerHTML = entregadores.map(e => {
    const inicial = e.nome.charAt(0);
    const badge = e.status === 'Disponível' ? 'b-disponivel' : 'b-entrega';
    return `
      <div class="entregador-card">
        <div class="ent-top">
          <div class="ent-info">
            <div class="nome">${e.nome}</div>
            <div class="tel">📞 ${e.tel}</div>
            <span class="badge ${badge}">${e.status}</span>
          </div>
          <div class="avatar">${inicial}</div>
        </div>
        <div class="ent-stats">
          <div><div class="lbl">Ativas</div><div class="val val-orange">${e.ativas}</div></div>
          <div><div class="lbl">Hoje</div><div class="val val-green">${e.hoje}</div></div>
          <div><div class="lbl">Aval.</div><div class="val val-yellow">${e.aval.toFixed(1)}★</div></div>
        </div>
      </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────
//  STATS
// ─────────────────────────────────────────
function updateStats(orders) {
  const prontos    = orders.filter(o => o.status === 'pronto').length;
  const atribuidos = orders.filter(o => o.status === 'disponivel').length;
  const emRota     = orders.filter(o => o.status === 'andamento').length;
  const entregues  = orders.filter(o => ['concluida', 'entregue'].includes(o.status)).length;
  const disponiveisDrivers = entregadores.filter(e => e.status === 'Disponível').length;

  const vals = document.querySelectorAll('.stats-grid .stat-value');
  if (vals.length >= 5) {
    vals[0].textContent = prontos;
    vals[1].textContent = atribuidos;
    vals[2].textContent = emRota;
    vals[3].textContent = entregues;
    vals[4].textContent = disponiveisDrivers;
  }
}

// ─────────────────────────────────────────
//  FILTROS
// ─────────────────────────────────────────
function passesFilter(o) {
  const label = statusLabelMap[o.status] || o.status;
  if (activeStatusFilter !== 'Todos os status' && label !== activeStatusFilter) return false;
  if (searchTerm) {
    const term    = searchTerm.toLowerCase();
    const cliente = (o.clienteNome || o.cliente || '').toLowerCase();
    const id      = (o.id || '').toLowerCase();
    if (!cliente.includes(term) && !id.includes(term)) return false;
  }
  return true;
}

// ─────────────────────────────────────────
//  RENDER — PEDIDOS
// ─────────────────────────────────────────
function renderPedidos() {
  const orders = getRelevantOrders();
  updateStats(orders);

  const visible = orders.filter(passesFilter);
  const list = document.getElementById('pedidosList');
  if (!list) return;

  if (visible.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:3rem;color:#888;">
        Nenhum pedido encontrado para esse filtro
      </div>`;
    return;
  }

  list.innerHTML = visible.map(o => {
    const end   = buildEndereco(o);
    const itens = buildItens(o);
    const label = statusLabelMap[o.status] || o.status;
    const cls   = statusPillMap[o.status] || '';

    const barra = o.entregadorNome ? `
      <div class="ped-bar">
        <div class="left">
          <span>🕐 ${elapsedMin(o)} min</span>
          <span>🚚 ${o.entregadorNome}</span>
        </div>
        <span>${o.atribuidoAs ? 'Atribuído às ' + o.atribuidoAs : ''}</span>
      </div>` : `
      <div class="ped-bar">
        <div class="left"><span>🕐 ${elapsedMin(o)} min de espera</span></div>
      </div>`;

    let acoes = '';
    if (o.status === 'pronto') {
      acoes = `<button class="btn-primary" onclick="openAtribuir('${o.id}')">👤 Atribuir Entregador</button>`;
    } else if (o.status === 'disponivel') {
      acoes = `
        <button class="btn-purple" onclick="marcarSaiu('${o.id}')">➤ Saiu para Entrega</button>
        <button class="btn-outline-orange" onclick="openAtribuir('${o.id}')">🚚 Reatribuir</button>`;
    } else if (o.status === 'andamento') {
      acoes = `<button class="btn-primary" onclick="marcarEntregue('${o.id}')">✓ Marcar como Entregue</button>`;
    }

    return `
      <div class="pedido-card">
        <div class="ped-head">
          <div class="ped-title">
            <span class="nome">Pedido</span><span class="num">${o.id}</span>
            <span class="status-pill ${cls}">${label}</span>
          </div>
          <div class="ped-price">R$ ${Number(o.total || 0).toFixed(2)}</div>
        </div>
        <div class="ped-cliente">
          <span>👤 ${o.clienteNome || o.cliente || 'Cliente'}</span>
          <span>📞 ${o.tel || '—'}</span>
        </div>
        <div class="end-box">
          <div class="end-left">
            <span class="pin">📍</span>
            <div>
              <div class="rua">${end.rua}</div>
              <div class="bairro">${end.bairro}</div>
            </div>
          </div>
        </div>
        <div class="itens-label">Itens:</div>
        <div class="itens-list">
          ${itens.map(it => `<div class="item-row"><span>${it.n}</span><span class="preco">R$ ${it.p.toFixed(2)}</span></div>`).join('') || '<div class="item-row"><span>—</span></div>'}
        </div>
        ${barra}
        <div class="ped-actions">${acoes}</div>
      </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────
//  AÇÕES — delegam ao ChojiOrders
// ─────────────────────────────────────────
function openAtribuir(id) {
  currentPedidoId = id;
  selectedEntregadorId = null;
  const o = getRelevantOrders().find(x => x.id === id);
  if (!o) return;

  const end = buildEndereco(o);
  document.getElementById('aInfo').textContent   = `Pedido ${o.id} - ${o.clienteNome || o.cliente || 'Cliente'}`;
  document.getElementById('aRua').textContent    = end.rua;
  document.getElementById('aBairro').textContent = end.bairro || '—';
  document.getElementById('aDist').textContent   = '—';
  document.getElementById('aTempo').textContent  = `${elapsedMin(o)} min de espera`;
  document.getElementById('aValor').textContent  = `R$ ${Number(o.total || 0).toFixed(2)}`;

  document.getElementById('entSelectList').innerHTML = entregadores.map(e => {
    const badge = e.status === 'Disponível' ? 'b-disponivel' : 'b-entrega';
    return `
      <div class="ent-select-card" onclick="selectEntregador('${e.id}')" data-id="${e.id}">
        <div class="left">
          <div class="radio-dot"></div>
          <div>
            <div class="nome">${e.nome}</div>
            <div class="tel">${e.tel}</div>
            <div class="meta"><span>Ativas: ${e.ativas}</span><span>Hoje: ${e.hoje}</span><span>★ ${e.aval.toFixed(1)}</span></div>
          </div>
        </div>
        <span class="badge ${badge}">${e.status}</span>
      </div>
    `;
  }).join('');

  document.getElementById('btnConfirmAtribuir').disabled = true;
  document.getElementById('modalAtribuir').classList.add('active');
}

function selectEntregador(id) {
  selectedEntregadorId = id;
  document.querySelectorAll('.ent-select-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
  document.getElementById('btnConfirmAtribuir').disabled = false;
}

function confirmAtribuir() {
  if (!selectedEntregadorId) return;
  const ent = entregadores.find(e => e.id === selectedEntregadorId);
  if (ent) {
    ChojiOrders.assignDelivery(currentPedidoId, { id: ent.id, nome: ent.nome });
    renderPedidos();
  }
  closeModal('modalAtribuir');
}

function marcarSaiu(id) {
  ChojiOrders.updateStatus(id, 'andamento');
  renderPedidos();
}

function marcarEntregue(id) {
  ChojiOrders.updateStatus(id, 'concluida');
  renderPedidos();
}

// ─────────────────────────────────────────
//  MODAL HELPERS
// ─────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
});

// ─────────────────────────────────────────
//  FILTROS — bindings
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-wrap input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.trim();
      renderPedidos();
    });
  }

  const statusSelect = document.querySelectorAll('.filtros-row select')[0];
  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      activeStatusFilter = statusSelect.value;
      renderPedidos();
    });
  }

  renderEntregadores();
  renderPedidos();

  // Sincroniza quando outra aba muda o localStorage
  ChojiOrders.onUpdate(() => renderPedidos());

  // Polling a cada 3s (pega pedidos novos vindos da cozinha)
  setInterval(renderPedidos, 3000);
});

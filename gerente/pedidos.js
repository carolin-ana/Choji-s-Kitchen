const pedidos = [
  { id: '#1700000001', cliente: 'Ana Silva', tel: '(11) 99999-1111', data: '14/06/2026 às 16:00', total: 87.70, status: 'Entregue', pag: 'Cartão de Crédito', end: 'Rua das Flores, 100 - Centro', itens: [{ n: 'Lámen Especial', q: 1, p: 65 }, { n: 'Chá Verde', q: 1, p: 14 }] },
  { id: '#1700000002', cliente: 'Bruno Mendes', tel: '(11) 98765-4321', data: '14/06/2026 às 16:30', total: 118.90, status: 'Saiu para Entrega', pag: 'Dinheiro', end: 'Av. Paulista, 1578 - Bela Vista', itens: [{ n: 'Combo Família Choji', q: 1, p: 89.90 }, { n: 'Refrigerante 2L', q: 2, p: 12 }] },
  { id: '#1700000003', cliente: 'Carla Ferreira', tel: '(11) 97777-2222', data: '14/06/2026 às 16:45', total: 76.70, status: 'Pronto', pag: 'Pix', end: 'Rua Augusta, 555 - Consolação', itens: [{ n: 'Yakisoba da Casa', q: 1, p: 58 }, { n: 'Gyoza', q: 1, p: 18.70 }] },
  { id: '#1700000004', cliente: 'Daniel Rocha', tel: '(11) 96666-3333', data: '14/06/2026 às 16:50', total: 156.50, status: 'Em Preparo', pag: 'Cartão de Débito', end: 'Rua Oscar Freire, 200 - Jardins', itens: [{ n: 'Tonkotsu Densetsu', q: 2, p: 72 }, { n: 'Saquê', q: 1, p: 12.50 }] },
  { id: '#1700000005', cliente: 'Elisa Nakamura', tel: '(11) 95555-4444', data: '14/06/2026 às 16:57', total: 50.80, status: 'Recebido', pag: 'Pix', end: 'Rua Liberdade, 88 - Liberdade', itens: [{ n: 'Katsudon', q: 1, p: 50.80 }] },
  { id: '#1700000006', cliente: 'Fernando Lima', tel: '(11) 94444-5555', data: '14/06/2026 às 15:00', total: 93.80, status: 'Cancelado', pag: 'Cartão', end: 'Rua Vergueiro, 1234', itens: [{ n: 'Shoyu Clássico', q: 1, p: 68 }, { n: 'Mochi', q: 1, p: 25.80 }] },
];

const statusMap = {
  'Entregue': { cls: 'st-entregue', icon: '✓' },
  'Saiu para Entrega': { cls: 'st-rota', icon: '🚚' },
  'Pronto': { cls: 'st-pronto', icon: '📦' },
  'Em Preparo': { cls: 'st-preparo', icon: '👨‍🍳' },
  'Recebido': { cls: 'st-recebido', icon: '🕐' },
  'Cancelado': { cls: 'st-cancelado', icon: '⊘' },
};

let currentId = null;

function findById(id) { return pedidos.find(p => p.id === id); }

function render() {
  const list = document.getElementById('ordersList');
  list.innerHTML = pedidos.map(p => {
    const s = statusMap[p.status];
    const finalized = p.status === 'Entregue' || p.status === 'Cancelado';
    return `
      <div class="order-row">
        <div class="col-num"><span class="lbl">Nº Pedido</span><span class="num">${p.id}</span></div>
        <div class="col-cli">
          <div class="nome">👤 ${p.cliente}</div>
          <div class="data">📅 ${p.data}</div>
        </div>
        <div class="col-total"><span class="lbl">Total</span><div class="val">R$ ${p.total.toFixed(2)}</div></div>
        <div class="col-status"><span class="lbl">Status</span><div><span class="status-pill ${s.cls}">${s.icon} ${p.status}</span></div></div>
        <div class="col-actions">
          <button class="btn-act" onclick="openDetails('${p.id}')">👁 Ver</button>
          ${!finalized ? `<button class="btn-act orange" onclick="openStatus('${p.id}')">⟳ Status</button>` : ''}
          ${!finalized ? `<button class="btn-act danger" onclick="openCancel('${p.id}')">⊘</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openDetails(id) {
  currentId = id;
  const p = findById(id);
  const s = statusMap[p.status];
  document.getElementById('dNum').textContent = p.id;
  document.getElementById('dData').textContent = p.data;
  document.getElementById('dStatus').className = `status-pill ${s.cls}`;
  document.getElementById('dStatus').textContent = `${s.icon} ${p.status}`;
  document.getElementById('dCliente').textContent = p.cliente;
  document.getElementById('dTel').textContent = p.tel;
  document.getElementById('dPag').textContent = p.pag;
  document.getElementById('dTotal2').textContent = `R$ ${p.total.toFixed(2)}`;
  document.getElementById('dEnd').textContent = p.end;
  document.getElementById('dQtd').textContent = p.itens.length;
  document.getElementById('dItens').innerHTML = p.itens.map(it => `
    <div class="item-row">
      <div>
        <div class="nome">${it.n}</div>
        <div class="qtd">${it.q}x • R$ ${it.p.toFixed(2)} cada</div>
      </div>
      <div class="preco">R$ ${(it.q * it.p).toFixed(2)}</div>
    </div>
  `).join('');
  document.getElementById('dTotal').textContent = `R$ ${p.total.toFixed(2)}`;
  open('modalDetalhes');
}

function openStatus(id) {
  currentId = id;
  const p = findById(id);
  const s = statusMap[p.status];
  document.getElementById('sInfo').textContent = `Pedido ${p.id} - ${p.cliente}`;
  const cur = document.getElementById('sCurrent');
  cur.className = `status-pill ${s.cls}`;
  cur.textContent = `${s.icon} ${p.status}`;
  document.getElementById('sNew').value = p.status === 'Cancelado' ? 'Recebido' : p.status;
  closeModal('modalDetalhes');
  open('modalStatus');
}

function confirmStatus() {
  const p = findById(currentId);
  if (p) { p.status = document.getElementById('sNew').value; render(); }
  closeModal('modalStatus');
}

function openCancel(id) {
  currentId = id;
  const p = findById(id);
  document.getElementById('cNum').textContent = p.id;
  document.getElementById('cCliente').textContent = p.cliente;
  document.getElementById('cTotal').textContent = `R$ ${p.total.toFixed(2)}`;
  document.getElementById('cStatus').textContent = p.status;
  document.getElementById('cItens').textContent = p.itens.length;
  closeModal('modalDetalhes');
  open('modalCancel');
}

function confirmCancel() {
  const p = findById(currentId);
  if (p) { p.status = 'Cancelado'; render(); }
  closeModal('modalCancel');
}

function open(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
});

render();

const entregadores = [
  { id: 'e1', nome: 'Pedro Santos', tel: '(11) 96543-2109', status: 'Disponível', ativas: 0, hoje: 12, aval: 4.8 },
  { id: 'e2', nome: 'Ana Lima', tel: '(11) 95432-1098', status: 'Em Entrega', ativas: 2, hoje: 8, aval: 4.9 },
  { id: 'e3', nome: 'Carlos Souza', tel: '(11) 94321-0987', status: 'Disponível', ativas: 0, hoje: 15, aval: 5.0 },
];

const pedidos = [
  {
    id: '#12348', cliente: 'João Silva', tel: '(11) 98765-4321', total: 186.00, status: 'Pronto',
    rua: 'Rua das Flores, 123 - Apto 45', bairro: 'Vila Madalena', dist: '2.3 km', tempo: '25 min',
    itens: [{ n: '2x Tonkotsu Densetsu', p: 144.00 }, { n: '1x Gyoza Artesanal', p: 42.00 }],
    entregadorId: null, atribuidoAs: null,
  },
  {
    id: '#12347', cliente: 'Maria Costa', tel: '(11) 97654-3210', total: 106.00, status: 'Atribuído',
    rua: 'Av. Paulista, 1578 - Sala 203', bairro: 'Bela Vista', dist: '3.1 km', tempo: '30 min',
    itens: [{ n: '1x Gyudon Prime', p: 78.00 }, { n: '1x Mochi Artesanal', p: 28.00 }],
    entregadorId: 'e2', atribuidoAs: '20:15',
  },
];

const statusMap = {
  'Pronto': 'st-pronto',
  'Atribuído': 'st-atribuido',
  'Em Rota': 'st-rota',
  'Entregue': 'st-entregue',
};

let currentPedidoId = null;
let selectedEntregadorId = null;

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

function renderPedidos() {
  document.getElementById('pedidosList').innerHTML = pedidos.map(p => {
    const ent = entregadores.find(e => e.id === p.entregadorId);
    const barra = ent ? `
      <div class="ped-bar">
        <div class="left">
          <span>🕐 ${p.tempo}</span>
          <span>🚚 ${ent.nome}</span>
        </div>
        <span>Atribuído às ${p.atribuidoAs}</span>
      </div>` : `
      <div class="ped-bar">
        <div class="left"><span>🕐 ${p.tempo}</span></div>
      </div>`;

    const acoes = !ent ? `
      <button class="btn-primary" onclick="openAtribuir('${p.id}')">👤 Atribuir Entregador</button>
      <button class="btn-outline-orange" onclick="openAtribuir('${p.id}')">🚚 Atribuir</button>
    ` : (p.status === 'Atribuído' ? `
      <button class="btn-purple" onclick="marcarSaiu('${p.id}')">➤ Saiu para Entrega</button>
      <button class="btn-outline-orange" onclick="openAtribuir('${p.id}')">🚚 Reatribuir</button>
    ` : `
      <button class="btn-outline-orange" onclick="openAtribuir('${p.id}')">🚚 Reatribuir</button>
    `);

    return `
      <div class="pedido-card">
        <div class="ped-head">
          <div class="ped-title">
            <span class="nome">Pedido</span><span class="num">${p.id}</span>
            <span class="status-pill ${statusMap[p.status]}">${p.status}</span>
          </div>
          <div class="ped-price">R$ ${p.total.toFixed(2)}</div>
        </div>
        <div class="ped-cliente">
          <span>👤 ${p.cliente}</span>
          <span>📞 ${p.tel}</span>
        </div>
        <div class="end-box">
          <div class="end-left">
            <span class="pin">📍</span>
            <div>
              <div class="rua">${p.rua}</div>
              <div class="bairro">${p.bairro}</div>
            </div>
          </div>
          <div>
            <div class="dist-lbl">Distância</div>
            <div class="dist-val">${p.dist}</div>
          </div>
        </div>
        <div class="itens-label">Itens:</div>
        <div class="itens-list">
          ${p.itens.map(it => `<div class="item-row"><span>${it.n}</span><span class="preco">R$ ${it.p.toFixed(2)}</span></div>`).join('')}
        </div>
        ${barra}
        <div class="ped-actions">${acoes}</div>
      </div>
    `;
  }).join('');
}

function openAtribuir(id) {
  currentPedidoId = id;
  selectedEntregadorId = null;
  const p = pedidos.find(x => x.id === id);
  document.getElementById('aInfo').textContent = `Pedido ${p.id} - ${p.cliente}`;
  document.getElementById('aRua').textContent = p.rua;
  document.getElementById('aBairro').textContent = p.bairro;
  document.getElementById('aDist').textContent = p.dist;
  document.getElementById('aTempo').textContent = p.tempo;
  document.getElementById('aValor').textContent = `R$ ${p.total.toFixed(2)}`;

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
  const p = pedidos.find(x => x.id === currentPedidoId);
  if (p) {
    p.entregadorId = selectedEntregadorId;
    p.status = 'Atribuído';
    const now = new Date();
    p.atribuidoAs = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    renderPedidos();
  }
  closeModal('modalAtribuir');
}

function marcarSaiu(id) {
  const p = pedidos.find(x => x.id === id);
  if (p) { p.status = 'Em Rota'; renderPedidos(); }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
});

renderEntregadores();
renderPedidos();

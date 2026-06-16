let itens = [
  { nome:"Chashu (Porco)", cat:"Proteínas", atual:15, min:10, max:50, unid:"kg", custo:45, forn:"Açougue Premium", upd:"2024-03-25 14:30" },
  { nome:"Peito de Frango", cat:"Proteínas", atual:25, min:15, max:60, unid:"kg", custo:28, forn:"Açougue Premium", upd:"2024-03-25 10:00" },
  { nome:"Macarrão de Lámen", cat:"Massas e Grãos", atual:8, min:12, max:40, unid:"kg", custo:35, forn:"Importadora Yamato", upd:"2024-03-24 16:00" },
  { nome:"Shoyu Artesanal", cat:"Temperos e Condimentos", atual:4, min:6, max:20, unid:"L", custo:65, forn:"Importadora Yamato", upd:"2024-03-23 09:00" },
  { nome:"Missô Vermelho", cat:"Temperos e Condimentos", atual:18, min:8, max:30, unid:"kg", custo:55, forn:"Importadora Yamato", upd:"2024-03-25 11:00" },
  { nome:"Ovos", cat:"Proteínas", atual:120, min:100, max:300, unid:"unid", custo:0.80, forn:"Granja São Paulo", upd:"2024-03-25 08:00" },
  { nome:"Cebolinha", cat:"Vegetais", atual:3, min:5, max:15, unid:"kg", custo:12, forn:"Hortifruti Central", upd:"2024-03-24 07:00" },
  { nome:"Gengibre", cat:"Vegetais", atual:6, min:4, max:12, unid:"kg", custo:18, forn:"Hortifruti Central", upd:"2024-03-25 07:00" },
  { nome:"Tofu", cat:"Proteínas", atual:12, min:10, max:30, unid:"kg", custo:22, forn:"Importadora Yamato", upd:"2024-03-25 09:00" },
  { nome:"Embalagem Para Viagem (G)", cat:"Embalagens", atual:45, min:50, max:200, unid:"unid", custo:2.50, forn:"Embalagens Express", upd:"2024-03-24 15:00" },
  { nome:"Arroz Japonês", cat:"Massas e Grãos", atual:35, min:20, max:80, unid:"kg", custo:18, forn:"Importadora Yamato", upd:"2024-03-25 12:00" },
  { nome:"Alga Nori", cat:"Temperos e Condimentos", atual:5, min:8, max:25, unid:"pacotes", custo:32, forn:"Importadora Yamato", upd:"2024-03-23 14:00" },
];

let movs = [
  { item:"Macarrão de Lámen", motivo:"Produção do dia", data:"2024-03-25 12:00", user:"João Silva", qtd:-8 },
  { item:"Ovos", motivo:"Compra semanal", data:"2024-03-25 08:00", user:"Maria Costa", qtd:+60 },
  { item:"Shoyu Artesanal", motivo:"Produção do dia", data:"2024-03-24 18:00", user:"João Silva", qtd:-2 },
];

let onlyBaixo = false;
let editIdx = null, ajustIdx = null, excluirIdx = null, ajustTipo = 'entrada';

function getStatus(i) {
  if (i.atual <= i.min * 0.5) return { cls:'crit', label:'Crítico' };
  if (i.atual <= i.min) return { cls:'baixo', label:'Baixo' };
  return { cls:'norm', label:'Normal' };
}

function render() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('catFilter').value;
  const filtered = itens.filter(it => {
    if (q && !it.nome.toLowerCase().includes(q) && !(it.forn||'').toLowerCase().includes(q)) return false;
    if (cat && it.cat !== cat) return false;
    if (onlyBaixo) { const s = getStatus(it); if (s.cls === 'norm') return false; }
    return true;
  });

  document.getElementById('itemsList').innerHTML = filtered.map(it => {
    const s = getStatus(it);
    const idx = itens.indexOf(it);
    const pct = Math.min(100, Math.max(5, (it.atual / it.max) * 100));
    return `
      <div class="item-row">
        <div>
          <div class="item-nome">${it.nome}</div>
          <div class="item-data">Atualizado: ${it.upd}</div>
        </div>
        <div><span class="cat-badge">${it.cat}</span></div>
        <div class="estoque-cell">
          <div class="estoque-val">${it.atual} ${it.unid}</div>
          <div class="estoque-minmax">Min: ${it.min} / Max: ${it.max}</div>
          <div class="bar"><div class="${s.cls}" style="width:${pct}%"></div></div>
        </div>
        <div class="status-cell"><span class="st-badge ${s.cls}">${s.label}</span></div>
        <div>${it.forn||''}</div>
        <div class="custo">R$ ${it.custo.toFixed(2)}</div>
        <div class="actions">
          <button class="icon-btn ajust" title="Ajustar" onclick="openAjustar(${idx})">📦</button>
          <button class="icon-btn edit" title="Editar" onclick="openEditar(${idx})">✎</button>
          <button class="icon-btn del" title="Excluir" onclick="openExcluir(${idx})">🗑</button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('statTotal').textContent = itens.length;
  document.getElementById('statBaixo').textContent = itens.filter(i => getStatus(i).cls !== 'norm').length;
  const total = itens.reduce((s,i) => s + i.atual * i.custo, 0);
  document.getElementById('statValor').textContent = 'R$ ' + total.toFixed(2);
  document.getElementById('statForn').textContent = new Set(itens.map(i => i.forn).filter(Boolean)).size;

  renderMovs();
}

function renderMovs() {
  const html = (list, target) => list.map(m => {
    const isIn = m.qtd > 0;
    return `
      <div class="mov-row">
        <div class="mov-icon ${isIn?'in':'out'}">${isIn?'↗':'↘'}</div>
        <div class="mov-info">
          <div class="n">${m.item}</div>
          <div class="m">${m.motivo}</div>
          <div class="d">${m.data} • ${m.user}</div>
        </div>
        <div class="mov-qtd ${isIn?'in':'out'}">${isIn?'+':''}${m.qtd}</div>
      </div>`;
  }).join('');
  document.getElementById('movList').innerHTML = html(movs.slice(0,3));
  document.getElementById('histList').innerHTML = html(movs);
}

function openModal(id){ document.getElementById(id).classList.add('active'); }
function closeModal(id){ document.getElementById(id).classList.remove('active'); }

function toggleBaixo() {
  onlyBaixo = !onlyBaixo;
  document.getElementById('btnBaixo').classList.toggle('active', onlyBaixo);
  render();
}

function addItem() {
  itens.push({
    nome: nNome.value, cat: nCat.value,
    atual: +nAtual.value, min: +nMin.value, max: +nMax.value,
    unid: nUnid.value, custo: +nCusto.value, forn: nForn.value,
    upd: new Date().toISOString().slice(0,16).replace('T',' ')
  });
  document.querySelector('#modalNovo form').reset();
  closeModal('modalNovo'); render();
}

function openEditar(i) {
  editIdx = i; const it = itens[i];
  eNome.value = it.nome; eCat.value = it.cat;
  eAtual.value = it.atual; eMin.value = it.min; eMax.value = it.max;
  eUnid.value = it.unid; eCusto.value = it.custo; eForn.value = it.forn || '';
  openModal('modalEditar');
}
function saveEdit() {
  const it = itens[editIdx];
  it.nome = eNome.value; it.cat = eCat.value;
  it.atual = +eAtual.value; it.min = +eMin.value; it.max = +eMax.value;
  it.unid = eUnid.value; it.custo = +eCusto.value; it.forn = eForn.value;
  it.upd = new Date().toISOString().slice(0,16).replace('T',' ');
  closeModal('modalEditar'); render();
}

function openAjustar(i) {
  ajustIdx = i; const it = itens[i];
  document.getElementById('ajustarSub').textContent = `${it.nome} - Estoque atual: ${it.atual} ${it.unid}`;
  document.getElementById('qtdLabel').textContent = `Quantidade (${it.unid})`;
  aQtd.value = 0; aMotivo.value = '';
  setTipo('entrada');
  openModal('modalAjustar');
}
function setTipo(t) {
  ajustTipo = t;
  btnEntrada.classList.toggle('active', t==='entrada');
  btnSaida.classList.toggle('active', t==='saida');
  const btn = document.getElementById('btnConfirm');
  btn.textContent = t==='entrada' ? 'Confirmar Entrada' : 'Confirmar Saída';
  btn.className = 'btn-primary' + (t==='entrada' ? ' green' : '');
}
function confirmAjuste() {
  const it = itens[ajustIdx];
  const q = +aQtd.value;
  if (!q) return;
  const delta = ajustTipo === 'entrada' ? q : -q;
  it.atual = Math.max(0, it.atual + delta);
  it.upd = new Date().toISOString().slice(0,16).replace('T',' ');
  movs.unshift({ item: it.nome, motivo: aMotivo.value || (ajustTipo==='entrada'?'Entrada':'Saída'),
    data: it.upd, user: 'Usuário Atual', qtd: delta });
  closeModal('modalAjustar'); render();
}

function openExcluir(i) {
  excluirIdx = i;
  document.getElementById('excluirNome').textContent = itens[i].nome;
  openModal('modalExcluir');
}
function confirmExcluir() {
  itens.splice(excluirIdx, 1);
  closeModal('modalExcluir'); render();
}

render();

// ============================================================
// DADOS POR PERÍODO
// ============================================================
const PERIODOS = {
  semana: {
    receita: 26850, pedidos: 248, ticket: 108, clientes: 1284,
    receitaAnterior: 23850, pedidosAnterior: 229, ticketAnterior: 104, clientesAnterior: 1114,
    meta: 30000, entregues: 218, andamento: 30,
    melhorDia: 'R$ 5.200 (Sábado)',
    linha: {
      labels: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
      data:   [2500, 3200, 2800, 4000, 4500, 5500, 4900],
    },
    barras: {
      labels: ['Tonkotsu','Gyudon','Katsudon','Gyoza','Tom Yum'],
      data:   [45, 38, 32, 28, 25],
    },
    pizza: [
      { label: 'Donburi',  val: 40, color: '#f47b3a' },
      { label: 'Lámens',   val: 21, color: '#BC1A37' },
      { label: 'Bebidas',  val: 26, color: '#f5c451' },
      { label: 'Entradas', val: 13, color: '#f7b797' },
    ],
  },
  mes: {
    receita: 112400, pedidos: 1043, ticket: 107, clientes: 4820,
    receitaAnterior: 98700, pedidosAnterior: 960, ticketAnterior: 102, clientesAnterior: 4300,
    meta: 130000, entregues: 940, andamento: 103,
    melhorDia: 'R$ 18.400 (Semana 3)',
    linha: {
      labels: ['S1','S2','S3','S4'],
      data:   [24500, 28600, 31800, 27500],
    },
    barras: {
      labels: ['Tonkotsu','Gyudon','Tom Yum','Gyoza','Katsudon'],
      data:   [192, 158, 141, 119, 107],
    },
    pizza: [
      { label: 'Donburi',  val: 38, color: '#f47b3a' },
      { label: 'Lámens',   val: 25, color: '#BC1A37' },
      { label: 'Bebidas',  val: 23, color: '#f5c451' },
      { label: 'Entradas', val: 14, color: '#f7b797' },
    ],
  },
  ano: {
    receita: 1348000, pedidos: 12560, ticket: 107, clientes: 28400,
    receitaAnterior: 1120000, pedidosAnterior: 10800, ticketAnterior: 103, clientesAnterior: 23500,
    meta: 1500000, entregues: 11300, andamento: 1260,
    melhorDia: 'R$ 131.200 (Dezembro)',
    linha: {
      labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
      data:   [88000, 92000, 105000, 110000, 118000, 112000, 124000, 119000, 108000, 122000, 128000, 122000],
    },
    barras: {
      labels: ['Tonkotsu','Gyudon','Tom Yum','Katsudon','Gyoza'],
      data:   [2310, 1980, 1740, 1520, 1390],
    },
    pizza: [
      { label: 'Donburi',  val: 36, color: '#f47b3a' },
      { label: 'Lámens',   val: 28, color: '#BC1A37' },
      { label: 'Bebidas',  val: 22, color: '#f5c451' },
      { label: 'Entradas', val: 14, color: '#f7b797' },
    ],
  },
};

const PERIODO_LABELS = { semana: 'Esta Semana', mes: 'Este Mês', ano: 'Este Ano' };
let periodoAtual = 'semana';

// ============================================================
// UTILITÁRIOS
// ============================================================
function fmt(n) {
  if (n >= 1000000) return 'R$ ' + (n/1000000).toFixed(1).replace('.',',') + 'M';
  if (n >= 1000)    return 'R$ ' + (n/1000).toFixed(1).replace('.',',') + 'k';
  return 'R$ ' + n.toLocaleString('pt-BR');
}
function pct(atual, anterior) {
  const diff = ((atual - anterior) / anterior * 100).toFixed(1);
  return (diff > 0 ? '+' : '') + diff + '%';
}
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const parent = canvas.parentElement;
  const w = parent.clientWidth;
  const h = parent.clientHeight;
  canvas.style.width  = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, h };
}

// ============================================================
// ATUALIZA CARDS DO TOPO
// ============================================================
function updateCards(p) {
  const d = PERIODOS[p];
  const lbl = PERIODO_LABELS[p];

  document.querySelector('.section-title').innerHTML =
    `Desempenho de <span class="accent">${lbl}</span>`;

  // Highlight cards
  const cards = document.querySelectorAll('.h-card');

  // Receita
  cards[0].querySelector('.h-card-value').textContent = fmt(d.receita);
  cards[0].querySelector('.h-card-trend').textContent =
    `↗ ${pct(d.receita, d.receitaAnterior)} vs período anterior (${fmt(d.receitaAnterior)})`;
  cards[0].querySelector('.h-card-footer').innerHTML =
    `<span>Meta: ${fmt(d.meta)}</span>`;
  cards[0].querySelector('.progress-bar').style.width =
    Math.min(100, Math.round(d.receita / d.meta * 100)) + '%';

  // Pedidos
  cards[1].querySelector('.h-card-value').textContent = d.pedidos;
  cards[1].querySelector('.h-card-trend').textContent =
    `↗ ${pct(d.pedidos, d.pedidosAnterior)} vs período anterior (${d.pedidosAnterior} pedidos)`;
  cards[1].querySelector('.h-card-footer').innerHTML =
    `<span>Entregues: ${d.entregues}</span><span>Em andamento: ${d.andamento}</span>`;

  // Ticket
  cards[2].querySelector('.h-card-value').textContent = fmt(d.ticket);
  cards[2].querySelector('.h-card-trend').textContent =
    `↗ ${pct(d.ticket, d.ticketAnterior)} vs período anterior (${fmt(d.ticketAnterior)})`;
  cards[2].querySelector('.h-card-footer').innerHTML =
    `<span>Melhor: ${d.melhorDia}</span>`;

  // Stat cards
  const stats = document.querySelectorAll('.stat-card');
  stats[0].querySelector('.stat-value').textContent = fmt(d.receita);
  stats[0].querySelector('.stat-trend').textContent = `↗ ${pct(d.receita, d.receitaAnterior)} vs período anterior`;
  stats[1].querySelector('.stat-value').textContent = d.pedidos;
  stats[1].querySelector('.stat-trend').textContent = `↗ ${pct(d.pedidos, d.pedidosAnterior)} vs período anterior`;
  stats[2].querySelector('.stat-value').textContent = fmt(d.ticket);
  stats[2].querySelector('.stat-trend').textContent = `↗ ${pct(d.ticket, d.ticketAnterior)} vs período anterior`;
  stats[3].querySelector('.stat-value').textContent = d.clientes.toLocaleString('pt-BR');
  stats[3].querySelector('.stat-trend').textContent = `↗ ${pct(d.clientes, d.clientesAnterior)} vs período anterior`;
}

// ============================================================
// LINE CHART — Vendas
// ============================================================
function drawLineChart() {
  const canvas = document.getElementById('salesChart');
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const { labels, data } = PERIODOS[periodoAtual].linha;

  const pad = { l: 65, r: 24, t: 24, b: 36 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;

  const rawMax = Math.max(...data);
  const rawMin = Math.min(...data);
  const range  = rawMax - rawMin || 1;
  const yMax   = rawMax + range * 0.15;
  const yMin   = Math.max(0, rawMin - range * 0.15);
  const steps  = 5;

  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px Segoe UI, Arial';

  // Grid + Y labels
  for (let i = 0; i <= steps; i++) {
    const y   = pad.t + (ch * i / steps);
    const val = yMax - ((yMax - yMin) * i / steps);

    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#999'; ctx.textAlign = 'right';
    const label = val >= 1000 ? (val/1000).toFixed(0)+'k' : Math.round(val).toString();
    ctx.fillText(label, pad.l - 8, y + 4);
  }

  // Points
  const pts = data.map((v, i) => ({
    x: pad.l + (cw * i / Math.max(data.length - 1, 1)),
    y: pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch,
  }));

  // Area gradient
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
  grad.addColorStop(0, 'rgba(188,26,55,0.18)');
  grad.addColorStop(1, 'rgba(188,26,55,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pad.t + ch);
  pts.forEach((p, i) => {
    if (i === 0) { ctx.lineTo(p.x, p.y); return; }
    const prev = pts[i - 1];
    const mx = (prev.x + p.x) / 2;
    ctx.bezierCurveTo(mx, prev.y, mx, p.y, p.x, p.y);
  });
  ctx.lineTo(pts[pts.length - 1].x, pad.t + ch);
  ctx.closePath(); ctx.fill();

  // Line
  ctx.strokeStyle = '#BC1A37'; ctx.lineWidth = 2.5; ctx.setLineDash([]);
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) { ctx.moveTo(p.x, p.y); return; }
    const prev = pts[i - 1];
    const mx = (prev.x + p.x) / 2;
    ctx.bezierCurveTo(mx, prev.y, mx, p.y, p.x, p.y);
  });
  ctx.stroke();

  // Dots
  pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = '#BC1A37'; ctx.lineWidth = 2.5; ctx.stroke();
  });

  // X labels
  ctx.fillStyle = '#888'; ctx.textAlign = 'center'; ctx.font = '11px Segoe UI, Arial';
  labels.forEach((l, i) => ctx.fillText(l, pts[i].x, pad.t + ch + 22));
}

// ============================================================
// BAR CHART — Pratos mais vendidos
// ============================================================
function drawBarChart() {
  const canvas = document.getElementById('dishesChart');
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const { labels, data } = PERIODOS[periodoAtual].barras;

  const pad = { l: 52, r: 20, t: 24, b: 52 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;

  const rawMax = Math.max(...data);
  const yMax   = Math.ceil(rawMax * 1.2 / 10) * 10;
  const steps  = 5;

  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px Segoe UI, Arial';

  // Grid + Y labels
  for (let i = 0; i <= steps; i++) {
    const y   = pad.t + (ch * i / steps);
    const val = Math.round(yMax * (1 - i / steps));
    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cw, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#999'; ctx.textAlign = 'right';
    ctx.fillText(val, pad.l - 8, y + 4);
  }

  const slotW = cw / data.length;
  const barW  = Math.min(slotW * 0.55, 55);

  data.forEach((v, i) => {
    const bh = (v / yMax) * ch;
    const x  = pad.l + slotW * i + (slotW - barW) / 2;
    const y  = pad.t + ch - bh;
    const r  = Math.min(5, barW / 4);

    // Gradient bar
    const g = ctx.createLinearGradient(0, y, 0, y + bh);
    g.addColorStop(0, '#e03a5a');
    g.addColorStop(1, '#BC1A37');
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.arcTo(x + barW, y, x + barW, y + r, r);
    ctx.lineTo(x + barW, y + bh);
    ctx.lineTo(x, y + bh);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath(); ctx.fill();

    // Value on top
    ctx.fillStyle = '#444'; ctx.textAlign = 'center'; ctx.font = 'bold 11px Segoe UI, Arial';
    ctx.fillText(v, x + barW / 2, y - 6);

    // X labels
    ctx.font = '11px Segoe UI, Arial'; ctx.fillStyle = '#888';
    const lbl = labels[i].length > 8 ? labels[i].slice(0, 8) + '…' : labels[i];
    ctx.fillText(lbl, x + barW / 2, pad.t + ch + 18);
  });
}

// ============================================================
// DONUT CHART — Categorias
// ============================================================
function drawPieChart() {
  const canvas = document.getElementById('categoryChart');
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const items = PERIODOS[periodoAtual].pizza;
  const total = items.reduce((s, i) => s + i.val, 0);

  const legendH = 70;
  const cx = w / 2;
  const cy = (h - legendH) / 2 + 10;
  const outerR = Math.min(w * 0.38, (h - legendH) / 2 - 12);
  const innerR = outerR * 0.55;

  ctx.clearRect(0, 0, w, h);

  let start = -Math.PI / 2;
  items.forEach(it => {
    const ang = (it.val / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, start, start + ang);
    ctx.closePath();
    ctx.fillStyle = it.color; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    start += ang;
  });

  // Inner hole (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = '#fff'; ctx.fill();

  // Center text
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(total + '%', cx, cy + 4);
  ctx.font = '11px Segoe UI, Arial';
  ctx.fillStyle = '#888';
  ctx.fillText('total', cx, cy + 20);

  // Legend — 2 columns
  const ly = h - legendH + 12;
  const colW = w / 2;
  ctx.font = '12px Segoe UI, Arial';
  items.forEach((it, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const lx  = col * colW + 16;
    const lyy = ly + row * 22;
    ctx.fillStyle = it.color;
    ctx.beginPath();
    ctx.roundRect(lx, lyy, 12, 12, 3);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.textAlign = 'left';
    ctx.fillText(`${it.label} ${it.val}%`, lx + 16, lyy + 10);
  });
}

// ============================================================
// RENDER GERAL
// ============================================================
function renderAll() {
  updateCards(periodoAtual);
  drawLineChart();
  drawBarChart();
  drawPieChart();
}

// ============================================================
// SELETOR DE PERÍODO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('.period-select');
  if (select) {
    select.addEventListener('change', () => {
      periodoAtual = select.value;
      renderAll();
    });
  }
  renderAll();
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    drawLineChart();
    drawBarChart();
    drawPieChart();
  }, 100);
});

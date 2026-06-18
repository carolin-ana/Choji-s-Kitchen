/* ============================================
   Choji's Kitchen — confirmacao.js
============================================ */

const fmt = v => "R$ " + Number(v).toFixed(2).replace(".", ",");

// ---- Carrega dados do pedido ----
let payload = { items: [], discountPct: 0 };
let orderData = {};

try {
  const raw = localStorage.getItem("chojiCheckout");
  if (raw) payload = JSON.parse(raw);
} catch (e) {}

try {
  const raw = localStorage.getItem("chojiOrderConfirm");
  if (raw) orderData = JSON.parse(raw);
} catch (e) {}

// Fallback de exemplo
if (!payload.items || payload.items.length === 0) {
  payload.items = [
    { name: "Tonkotsu Densetsu", qty: 2, finalPrice: 72, size: "regular" },
    { name: "Gyudon Prime",      qty: 1, finalPrice: 78, size: "regular" }
  ];
  payload.discountPct = 10;
}

if (!orderData.orderNum) {
  orderData = {
    orderNum:    "#" + (Math.floor(Math.random() * 90000) + 10000),
    date:        formatDate(new Date()),
    email:       "joao.silva@email.com",
    deliveryType: "delivery",
    address:     { addr: "Rua das Flores, 123", comp: "Apto 45", bairro: "Centro", cidade: "São Paulo", estado: "SP", cep: "01234-567" },
    payType:     "card",
    cardLast4:   "1234"
  };
}

// ---- Número e data ----
document.getElementById("cfOrderNum").textContent  = orderData.orderNum;
document.getElementById("cfOrderDate").textContent = orderData.date;
document.getElementById("cfEmail").textContent      = orderData.email;

// ---- Items ----
const itemsEl = document.getElementById("cfItems");
payload.items.forEach(it => {
  const opts = [];
  if (it.size === "grande")                  opts.push("🍜 Porção Grande");
  if (it.adicionais && it.adicionais.length) opts.push("➕ " + it.adicionais.join(", "));
  if (it.remover    && it.remover.length)    opts.push("➖ sem " + it.remover.join(", "));
  if (it.obs)                                opts.push("📝 " + it.obs);
  const optsHTML = opts.length
    ? `<div class="cf-item-opts">${opts.map(o => `<span>${o}</span>`).join("")}</div>`
    : "";

  const row = document.createElement("div");
  row.className = "cf-item-row";
  row.innerHTML = `
    <div>
      <span>${it.qty}x ${it.name}</span>
      ${optsHTML}
    </div>
    <span class="cf-item-price">${fmt(it.finalPrice * it.qty)}</span>
  `;
  itemsEl.appendChild(row);
});

// ---- Endereço ----
const addrEl = document.getElementById("cfAddr");
if (orderData.deliveryType === "pickup") {
  addrEl.innerHTML = "Retirada no restaurante<br>Rua da Gastronomia, 456 – Jardim Gourmet, São Paulo/SP";
} else {
  const a = orderData.address;
  addrEl.innerHTML = `
    ${a.addr}<br>
    ${a.comp ? a.comp + "<br>" : ""}
    ${a.bairro} – ${a.cidade}/${a.estado}<br>
    CEP: ${a.cep}
  `;
}

// ---- Pagamento ----
const payLabels = { card: "Cartão de Crédito", pix: "PIX", cash: "Dinheiro" };
const payEl = document.getElementById("cfPay");
if (orderData.payType === "card") {
  payEl.innerHTML = `Cartão de Crédito<br>**** **** **** ${orderData.cardLast4 || "****"}`;
} else {
  payEl.textContent = payLabels[orderData.payType] || "—";
}

// ---- Totais ----
const subtotal = payload.items.reduce((s, it) => s + it.finalPrice * it.qty, 0);
const fee      = orderData.deliveryType === "pickup" ? 0 : 12;
const disc     = payload.discountPct ? subtotal * (payload.discountPct / 100) : 0;
const total    = subtotal + fee - disc;

document.getElementById("cfSubtotal").textContent = fmt(subtotal);
document.getElementById("cfFee").textContent      = fmt(fee);
document.getElementById("cfTotal").textContent    = fmt(total);

if (disc > 0) {
  document.getElementById("cfDiscountRow").style.display = "";
  document.getElementById("cfDiscount").textContent = "- " + fmt(disc);
}

// ---- Ações ----
function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: "Meu pedido na Choji's Kitchen",
      text:  `Fiz um pedido ${orderData.orderNum} na Choji's Kitchen! 🍜`,
      url:   window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Link copiado!"))
      .catch(() => alert("Não foi possível compartilhar."));
  }
}

function handleReceipt() {
  window.print();
}

// ---- Helpers ----
function formatDate(d) {
  const months = ["janeiro","fevereiro","março","abril","maio","junho",
                  "julho","agosto","setembro","outubro","novembro","dezembro"];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()} às ${h}:${m}`;
}

// ---- Botão Acompanhar Pedido ----
const btnAcompanhar = document.getElementById("btnAcompanhar");
if (btnAcompanhar) {
  btnAcompanhar.addEventListener("click", () => {
    const num = (orderData.orderNum || "").replace("#", "");

    // Salva em sessionStorage (mais confiável que localStorage para redirects imediatos)
    try {
      sessionStorage.setItem("chojiOrderConfirm", JSON.stringify(orderData));
      sessionStorage.setItem("chojiCheckout", JSON.stringify(payload));
    } catch(e) {}

    window.location.href = `cliente.html?rastrear=${num}`;
  });
}

// ---- Limpa localStorage ao sair para outras páginas (não para rastreamento) ----
// Só limpa quando o usuário navegar para fora sem ir ao rastreamento
window.addEventListener("pagehide", () => {
  // Se o destino for rastreamento, o cliente.js vai limpar após ler
  // Então só limpamos se não estivermos indo para cliente.html?rastrear
  const dest = sessionStorage.getItem("chojiNextDest") || "";
  if (!dest.includes("rastrear")) {
    localStorage.removeItem("chojiCheckout");
    localStorage.removeItem("chojiOrderConfirm");
  }
  sessionStorage.removeItem("chojiNextDest");
});

// ---- Botão Sair ----
document.querySelector(".btn-sair")?.addEventListener("click", () => {
  window.location.href = "../login/login.html";
});

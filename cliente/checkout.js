/* ============================================================
   Choji's Kitchen — checkout.js  [ATUALIZADO]
   Agora salva pedidos em chojiOrders (via choji-orders.js)
============================================================ */

const fmt = v => "R$ " + Number(v).toFixed(2).replace(".", ",");

// ---- Load perfil do cliente (salvo na página de perfil) ----
let _perfil = {};
try {
  const raw = localStorage.getItem("chojiPerfil");
  if (raw) _perfil = JSON.parse(raw);
} catch (e) {}

function perfilVal(key, fallback) {
  return (_perfil[key] && String(_perfil[key]).trim()) ? _perfil[key] : fallback;
}

// ---- Load cart ----
let payload = { items: [], discountPct: 0 };
try {
  const raw = localStorage.getItem("chojiCheckout");
  if (raw) payload = JSON.parse(raw);
} catch (e) {}

if (!payload.items || payload.items.length === 0) {
  payload.items = [{ name: "Tori Paitan", qty: 1, finalPrice: 69, size: "regular" }];
}

let deliveryType = "delivery";
let payType = "card";
let currentStep = 1;

// ---- Render sidebar ----
const sideItemsEl = document.getElementById("sideItems");
const sideSubEl   = document.getElementById("sideSubtotal");
const sideFeeEl   = document.getElementById("sideFee");
const sideTotEl   = document.getElementById("sideTotal");

function deliveryFee() { return deliveryType === "delivery" ? 12 : 0; }

function renderSide() {
  sideItemsEl.innerHTML = "";
  payload.items.forEach(it => {
    // Montar linhas de opcionais
    const opts = [];
    if (it.size === "grande") opts.push("🍜 Porção Grande");
    if (it.adicionais && it.adicionais.length) opts.push("➕ " + it.adicionais.join(", "));
    if (it.remover    && it.remover.length)    opts.push("➖ sem " + it.remover.join(", "));
    if (it.obs)                                opts.push("📝 " + it.obs);
    const optsHTML = opts.map(o =>
      `<div class="co-side-item-opt">${o}</div>`
    ).join("");

    const row = document.createElement("div");
    row.className = "co-side-item";
    row.innerHTML = `
      <div class="co-side-item-info">
        <div class="co-side-item-name">${it.qty}x ${it.name}</div>
        ${optsHTML}
      </div>
      <div class="co-side-item-price">${fmt(it.finalPrice * it.qty)}</div>
    `;
    sideItemsEl.appendChild(row);
  });
  const subtotal = payload.items.reduce((s, it) => s + it.finalPrice * it.qty, 0);
  const fee = deliveryFee();
  sideSubEl.textContent = fmt(subtotal);
  sideFeeEl.textContent = fmt(fee);
  sideTotEl.textContent = fmt(subtotal + fee);
}
renderSide();

// ---- Pré-preencher endereço do perfil salvo ----
(function preencherEndereco() {
  const campos = {
    fAddr:   perfilVal("end_end",    ""),
    fComp:   perfilVal("end_comp",   ""),
    fBairro: perfilVal("end_bairro", ""),
    fCidade: perfilVal("end_cidade", ""),
    fEstado: perfilVal("end_estado", ""),
    fCep:    perfilVal("end_cep",    ""),
  };
  Object.entries(campos).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val && !el.value) el.value = val;
  });
})();

// ---- Radio cards ----
function bindRadioGroup(selector, attr, onChange) {
  const cards = document.querySelectorAll(selector);
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const input = card.querySelector("input[type=radio]");
      if (input) input.checked = true;
      onChange(card.dataset[attr]);
    });
  });
}

bindRadioGroup('.co-radio-card[data-type]', 'type', val => {
  deliveryType = val;
  document.getElementById("addressCard").style.display =
    val === "delivery" ? "" : "none";
  renderSide();
});

bindRadioGroup('.co-radio-card[data-pay]', 'pay', val => {
  payType = val;
  document.getElementById("cardDataBlock").style.display =
    val === "card" ? "" : "none";
});

// ---- Stepper ----
function showStep(n) {
  currentStep = n;
  document.querySelectorAll(".co-step-pane").forEach(p => {
    p.hidden = Number(p.dataset.pane) !== n;
  });
  document.querySelectorAll(".co-step").forEach(s => {
    const num = Number(s.dataset.step);
    s.classList.toggle("active", num === n);
    s.classList.toggle("done", num < n);
  });
  document.querySelectorAll(".co-step-bar").forEach(b => {
    b.classList.toggle("active", Number(b.dataset.bar) < n);
  });
  if (n === 3) renderReview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
showStep(1);

document.getElementById("btnGoPayment").addEventListener("click", () => showStep(2));
document.getElementById("btnGoReview").addEventListener("click", () => showStep(3));
document.querySelectorAll("[data-prev]").forEach(b =>
  b.addEventListener("click", () => showStep(currentStep - 1))
);

// ---- Review ----
function renderReview() {
  const sumE = document.getElementById("sumEntrega");
  const sumP = document.getElementById("sumPagamento");
  if (deliveryType === "delivery") {
    const addr   = document.getElementById("fAddr").value;
    const comp   = document.getElementById("fComp").value;
    const bairro = document.getElementById("fBairro").value;
    const cidade = document.getElementById("fCidade").value;
    const estado = document.getElementById("fEstado").value;
    const cep    = document.getElementById("fCep").value;
    sumE.innerHTML = `
      ${addr}<br>
      ${comp ? comp + "<br>" : ""}
      ${bairro} – ${cidade}/${estado}<br>
      CEP: ${cep}
    `;
  } else {
    sumE.innerHTML = `Retirada no restaurante<br>Rua da Gastronomia, 456 – Jardim Gourmet, São Paulo/SP`;
  }
  const payLabel = { card: "Cartão de Crédito/Débito", pix: "PIX", cash: "Dinheiro" }[payType];
  sumP.innerHTML = payLabel;
}

// ---- Confirm ----
document.getElementById("btnConfirm").addEventListener("click", () => {

  const cardNumInput = document.querySelector('#cardDataBlock input[type=text]');
  const cardNum  = cardNumInput ? cardNumInput.value.replace(/\s/g, "") : "";
  const cardLast4 = cardNum.length >= 4 ? cardNum.slice(-4) : "****";

  const address = {
    addr:   (document.getElementById("fAddr")   || {}).value || "",
    comp:   (document.getElementById("fComp")   || {}).value || "",
    bairro: (document.getElementById("fBairro") || {}).value || "",
    cidade: (document.getElementById("fCidade") || {}).value || "",
    estado: (document.getElementById("fEstado") || {}).value || "",
    cep:    (document.getElementById("fCep")    || {}).value || ""
  };

  const orderNum = "#" + (Math.floor(Math.random() * 90000) + 10000);

  const now = new Date();
  const months = ["janeiro","fevereiro","março","abril","maio","junho",
                  "julho","agosto","setembro","outubro","novembro","dezembro"];
  const dateStr = `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()} às `
                + `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

  const orderData = {
    orderNum,
    date:         dateStr,
    email:        perfilVal("email", "joao.silva@email.com"),
    clienteNome:  perfilVal("nome",  "João Silva"),
    tel:          perfilVal("tel",   "(11) 99999-0000"),
    deliveryType,
    address,
    payType,
    cardLast4
  };

  // ── NOVO: salva no sistema central de pedidos ──────────────
  if (typeof ChojiOrders !== "undefined") {
    ChojiOrders.addOrder(orderData, payload);
  }

  // Mantém compatibilidade com confirmacao.js
  try {
    localStorage.setItem("chojiOrderConfirm", JSON.stringify(orderData));
    localStorage.setItem("chojiCheckout",     JSON.stringify(payload));
  } catch(e) {}

  window.location.href = "confirmacao.html";
});

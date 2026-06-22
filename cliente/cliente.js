/* ==============================================
   Choji's Kitchen – cliente.js
============================================== */

// --------------- DADOS DO CARDÁPIO ---------------
const menuItems = [
  { id:1,  name:"Tonkotsu Densetsu",    category:"lamens",     desc:"Caldo de ossos suínos cozido por 18h, chashu braseado, ovo ajitsuke e óleo de alho negro.", price:72, spicy:false, img:"../imagens/tonkotsu.png", adicionais:["Ovo extra +R$ 5,00","Chashu extra +R$ 12,00","Legumes extras +R$ 8,00","Tofu extra +R$ 6,00","Molho picante"], remover:["Alho negro","Cebolinha","Nori","Gengibre"] },
  { id:2,  name:"Shoyu Clássico Kyoto", category:"lamens",     desc:"Caldo leve de shoyu artesanal, lombo suíno macio e espinafre.", price:68, spicy:false, img:"https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=600&q=80", adicionais:["Ovo extra +R$ 5,00","Chashu extra +R$ 12,00","Espinafre extra +R$ 4,00","Molho picante"], remover:["Espinafre","Cebolinha","Menma","Gengibre"] },
  { id:3,  name:"Missô Akai Especial",  category:"lamens",     desc:"Caldo intenso de missô vermelho, porco agridoce e milho amanteigado.", price:70, spicy:true,  img:"../imagens/missoAkai.png", adicionais:["Ovo extra +R$ 5,00","Chashu extra +R$ 12,00","Legumes extras +R$ 8,00","Tofu extra +R$ 6,00","Molho picante"], remover:["Porco","Milho","Broto de bambu","Cebolinha","Gengibre"] },
  { id:4,  name:"Tori Paitan",          category:"lamens",     desc:"Caldo aveludado de frango reduzido lentamente, peito selado e shimeji.", price:69, spicy:false, img:"https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600&q=80", adicionais:["Ovo extra +R$ 5,00","Shimeji extra +R$ 7,00","Frango extra +R$ 10,00","Molho picante"], remover:["Shimeji","Cebolinha","Gengibre","Nori"] },
  { id:5,  name:"Gyudon Premium",       category:"donburi",    desc:"Fatias de wagyu marinadas em dashi e mirin sobre arroz japonês com gema curada.", price:89, spicy:false, img:"../imagens/gyudon.png", adicionais:["Gema extra +R$ 4,00","Wagyu extra +R$ 20,00","Cebolinha extra +R$ 2,00"], remover:["Cebola","Gengibre","Cebolinha"] },
  { id:6,  name:"Katsudon Crocante",    category:"donburi",    desc:"Lombinho empanado no panko, cebola caramelizada e ovo suave sobre arroz branco.", price:64, spicy:false, img:"../imagens/katsudon.png", adicionais:["Ovo extra +R$ 4,00","Katsu extra +R$ 14,00","Molho tonkatsu extra +R$ 3,00"], remover:["Cebola","Cebolinha","Nori"] },
  { id:7,  name:"Oyakodon da Casa",     category:"donburi",    desc:"Frango, ovo e cebolinha-verde cozidos em caldo suave de tsuyu.", price:58, spicy:false, img:"../imagens/oyakodon.png", adicionais:["Ovo extra +R$ 4,00","Frango extra +R$ 10,00","Cebolinha extra +R$ 2,00"], remover:["Cebolinha","Gengibre"] },
  { id:8,  name:"Gyoza Frito",          category:"entradas",   desc:"6 unidades de gyoza com porco e repolho, crocantes por fora, suculentos por dentro.", price:32, spicy:false, img:"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80", adicionais:["Porção extra (6un) +R$ 32,00","Molho picante +R$ 2,00","Molho ponzu +R$ 2,00"], remover:["Repolho","Cebolinha","Gengibre"] },
  { id:9,  name:"Takoyaki Especial",    category:"entradas",   desc:"Bolinhos de polvo com maionese japonesa, katsuobushi e molho okonomiyaki.", price:28, spicy:false, img:"../imagens/takoyaki.png ", adicionais:["Maionese extra +R$ 2,00","Katsuobushi extra +R$ 3,00"], remover:["Katsuobushi","Cebolinha","Molho okonomiyaki"] },
  { id:10, name:"Edamame com Flor de Sal", category:"entradas",desc:"Vagens de soja cozidas no vapor com flor de sal e limão siciliano.", price:18, spicy:false, vegetariano:true, img:"../imagens/edamame.png", adicionais:["Limão extra +R$ 1,00","Pimenta +R$ 1,00"], remover:["Limão","Flor de sal"] },
  { id:11, name:"Matcha Latte Gelado",  category:"bebidas",    desc:"Chá matcha cerimonial com leite integral e mel, servido com gelo.", price:19, spicy:false, vegetariano:true, img:"../imagens/matchaLatte.png", adicionais:["Leite condensado +R$ 2,00","Shot extra de matcha +R$ 4,00"], remover:["Mel","Gelo"] },
  { id:12, name:"Ramune Melancia",      category:"bebidas",    desc:"Clássica limonada japonesa gasosa com bola de mármore, sabor melancia.", price:15, spicy:false, vegetariano:true, img:"https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80", adicionais:[], remover:[] },
  { id:13, name:"Mochi de Morango",     category:"sobremesas", desc:"Bolinho de arroz glutinoso recheado com sorvete de morango e pasta de feijão.", price:22, spicy:false, vegetariano:true, img:"../imagens/mochi.png", adicionais:["Unidade extra +R$ 22,00","Calda de morango +R$ 3,00"], remover:["Pasta de feijão"] },
  { id:14, name:"Dorayaki com Azuki",   category:"sobremesas", desc:"Pancakes fofos recheados com pasta tradicional de feijão azuki.", price:20, spicy:false, vegetariano:true, img:"../imagens/dorayaki.png", adicionais:["Creme extra +R$ 3,00","Unidade extra +R$ 20,00"], remover:["Azuki"] },
];

// --------------- ESTADO ---------------
let activeCategory = "todos";
let searchQuery    = "";
let filterVeg      = false;
let cart           = []; // [{item, qty, finalPrice}]
let discountPct    = 0;

const COUPONS = { CHOJI10: 10, PRIMEIROPEDIDO: 15, DESCONTO20: 20 };

// --------------- ELEMENTOS ---------------
const grid        = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const catBtns     = document.querySelectorAll(".cat-btn");
const cartBadge   = document.getElementById("cartBadge");
const cartToast   = document.getElementById("cartToast");
const cartDrawer  = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose   = document.getElementById("cartClose");
const btnCart     = document.getElementById("btnCart");
const cartItemsEl = document.getElementById("cartItems");
const cartFooter  = document.getElementById("cartFooter");
const cartEmpty   = document.getElementById("cartEmpty");

// --------------- DRAWER OPEN/CLOSE ---------------
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

btnCart.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// --------------- CART RENDER ---------------
function fmt(val) {
  return "R$ " + val.toFixed(2).replace(".", ",");
}

function renderCart() {
  // limpa itens (mantém o empty)
  Array.from(cartItemsEl.children).forEach(c => {
    if (!c.id || c.id !== "cartEmpty") c.remove();
  });

  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
    cartBadge.textContent = "0";
    cartBadge.classList.remove("visible");
    return;
  }

  cartEmpty.style.display = "none";
  cartFooter.style.display = "flex";

  // Conta total de itens
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  cartBadge.textContent = totalQty;
  cartBadge.classList.add("visible");

  cart.forEach(entry => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.dataset.cartId = entry.item.id;
    // Montar linha de detalhes dos opcionais
    const detalhes = [];
    if (entry.size === "grande") detalhes.push("🍜 Porção Grande");
    if (entry.adicionais && entry.adicionais.length) detalhes.push("➕ " + entry.adicionais.join(", "));
    if (entry.remover && entry.remover.length)       detalhes.push("➖ sem " + entry.remover.join(", "));
    if (entry.obs)                                    detalhes.push("📝 " + entry.obs);
    const detalhesHTML = detalhes.length
      ? `<div class="cart-item-details">${detalhes.map(d => `<span>${d}</span>`).join("")}</div>`
      : "";

    div.innerHTML = `
      <img class="cart-item-img" src="${entry.item.img}" alt="${entry.item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${entry.item.name}</div>
        ${detalhesHTML}
        <div class="cart-item-price">${fmt(entry.finalPrice)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${entry.item.id}" data-idx="${cart.indexOf(entry)}">−</button>
          <span class="qty-value">${entry.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${entry.item.id}" data-idx="${cart.indexOf(entry)}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${entry.item.id}" data-idx="${cart.indexOf(entry)}" title="Remover">✕</button>
    `;
    cartItemsEl.appendChild(div);
  });

  updateTotals();

  // Eventos qty e remover — usa data-idx para suportar múltiplas
  // configurações do mesmo item (opcionais diferentes)
  cartItemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const entry = cart[idx];
      if (!entry) return;
      if (btn.dataset.action === "inc") entry.qty++;
      else if (btn.dataset.action === "dec") {
        entry.qty--;
        if (entry.qty <= 0) cart.splice(idx, 1);
      }
      renderCart();
    });
  });

  cartItemsEl.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      cart.splice(idx, 1);
      renderCart();
    });
  });
}

function updateTotals() {
  const subtotal = cart.reduce((s, c) => s + c.finalPrice * c.qty, 0);
  const discount = subtotal * (discountPct / 100);
  const total    = subtotal - discount;

  document.getElementById("cartSubtotal").textContent = fmt(subtotal);
  document.getElementById("cartTotal").textContent    = fmt(total);

  const discRow = document.getElementById("cartDiscountRow");
  if (discountPct > 0) {
    document.getElementById("cartDiscount").textContent = "-" + fmt(discount);
    discRow.classList.add("visible");
  } else {
    discRow.classList.remove("visible");
  }
}

// --------------- CUPOM ---------------
document.getElementById("couponBtn").addEventListener("click", () => {
  const val = document.getElementById("couponInput").value.trim().toUpperCase();
  let msg = document.getElementById("couponMsg");
  if (!msg) {
    msg = document.createElement("p");
    msg.id = "couponMsg";
    document.getElementById("couponInput").parentElement.insertAdjacentElement("afterend", msg);
  }
  if (COUPONS[val]) {
    discountPct = COUPONS[val];
    msg.className = "coupon-ok";
    msg.textContent = `✔ Cupom aplicado! ${discountPct}% de desconto.`;
    updateTotals();
  } else {
    discountPct = 0;
    msg.className = "coupon-err";
    msg.textContent = "✘ Cupom inválido.";
    updateTotals();
  }
});

// --------------- MODAL ---------------
const ADICIONAL_PRICES = { "5,00":5, "12,00":12, "8,00":8, "6,00":6, "4,00":4, "7,00":7, "10,00":10, "20,00":20, "2,00":2, "3,00":3, "14,00":14, "32,00":32, "1,00":1 };

function parseAdicionalPrice(str) {
  const m = str.match(/\+R\$\s*([\d,]+)/);
  return m ? (ADICIONAL_PRICES[m[1]] || 0) : 0;
}

function openModal(item) {
  const existing = document.getElementById("itemModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "itemModal";
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" id="modalClose">✕</button>
      <h2 class="modal-title">${item.name}</h2>
      <p class="modal-desc">${item.desc}</p>
      <div class="modal-img-wrap">
        <img src="${item.img}" alt="${item.name}" />
        ${item.spicy ? '<span class="badge-spicy modal-spicy">🌶️🌶️ Picante</span>' : ""}
      </div>
      <div class="modal-price-row">
        <span class="modal-price" id="modalPrice">${fmt(item.price)}</span>
      </div>
      <div class="modal-section">
        <h4>Tamanho da Porção</h4>
        <label class="radio-option"><input type="radio" name="tamanho" value="0" checked /> Regular (padrão)</label>
        <label class="radio-option"><input type="radio" name="tamanho" value="30" /> Grande (+30% no preço) - Estilo Choji! 🍜</label>
      </div>
      ${item.adicionais.length ? `
      <div class="modal-section">
        <h4>Adicionais (opcionais)</h4>
        ${item.adicionais.map(a => {
          const hasPrice = a.includes("+R$");
          const price = hasPrice ? parseAdicionalPrice(a) : 0;
          const label = hasPrice ? a.replace(/\+R\$\s*[\d,]+/, "").trim() : a;
          const priceStr = hasPrice ? `<span class="check-price">+R$ ${price.toFixed(2).replace(".",",")}</span>` : "";
          return `<label class="check-option"><input type="checkbox" class="adicional-check" data-price="${price}" /><span>${label}</span>${priceStr}</label>`;
        }).join("")}
      </div>` : ""}
      ${item.remover.length ? `
      <div class="modal-section">
        <h4>Remover Ingredientes (opcionais)</h4>
        ${item.remover.map(r => `<label class="check-option"><input type="checkbox" /><span>${r}</span></label>`).join("")}
      </div>` : ""}
      <div class="modal-section">
        <h4>Observações (opcional)</h4>
        <textarea class="modal-obs" placeholder="Ex: sem cebola, pouco sal, etc."></textarea>
      </div>
      <button class="modal-btn-add" id="modalAddBtn">🛒 Adicionar ao Carrinho</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const closeModal = () => {
    modal.classList.add("modal-hide");
    setTimeout(() => { modal.remove(); document.body.style.overflow = ""; }, 250);
  };

  document.getElementById("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  // Preço dinâmico
  const priceEl = document.getElementById("modalPrice");
  const calcPrice = () => {
    let total = item.price;
    if (modal.querySelector('input[name="tamanho"]:checked')?.value === "30") total *= 1.3;
    modal.querySelectorAll(".adicional-check:checked").forEach(cb => total += parseFloat(cb.dataset.price) || 0);
    priceEl.textContent = fmt(total);
    return total;
  };

  modal.querySelectorAll('input[name="tamanho"]').forEach(r => r.addEventListener("change", calcPrice));
  modal.querySelectorAll(".adicional-check").forEach(cb => cb.addEventListener("change", calcPrice));

  document.getElementById("modalAddBtn").addEventListener("click", () => {
    const finalPrice = calcPrice();

    // Tamanho da porção
    const tamanhoVal = modal.querySelector('input[name="tamanho"]:checked')?.value;
    const size = tamanhoVal === "30" ? "grande" : "regular";

    // Adicionais marcados
    const adicionaisSelecionados = [];
    modal.querySelectorAll(".adicional-check:checked").forEach(cb => {
      const label = cb.closest("label").querySelector("span")?.textContent?.trim();
      if (label) adicionaisSelecionados.push(label);
    });

    // Ingredientes para remover
    const removerSelecionados = [];
    modal.querySelectorAll(".modal-section").forEach(sec => {
      if (sec.querySelector("h4")?.textContent?.includes("Remover")) {
        sec.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
          const label = cb.closest("label").querySelector("span")?.textContent?.trim();
          if (label) removerSelecionados.push(label);
        });
      }
    });

    // Observações
    const obs = modal.querySelector(".modal-obs")?.value?.trim() || "";

    addToCart(item, finalPrice, { size, adicionais: adicionaisSelecionados, remover: removerSelecionados, obs });
    closeModal();
  });

  requestAnimationFrame(() => modal.classList.add("modal-show"));
}

// --------------- CARRINHO ---------------
function addToCart(item, finalPrice, opts = {}) {
  // Cada configuração de opcionais é um item distinto no carrinho
  // (ex: mesmo prato, tamanhos diferentes = entradas separadas)
  const { size = "regular", adicionais = [], remover = [], obs = "" } = opts;
  const existing = cart.find(c =>
    c.item.id === item.id &&
    c.size === size &&
    JSON.stringify(c.adicionais) === JSON.stringify(adicionais) &&
    JSON.stringify(c.remover) === JSON.stringify(remover) &&
    c.obs === obs
  );
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ item, qty: 1, finalPrice, size, adicionais, remover, obs });
  }
  renderCart();
  showToast();

  cartBadge.animate([{ transform:"scale(1.5)" },{ transform:"scale(1)" }], { duration:300, easing:"ease-out" });
}

let toastTimer;
function showToast() {
  cartToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => cartToast.classList.remove("show"), 2200);
}

// --------------- RENDERIZAÇÃO DE CARDS ---------------
function renderCards() {
  const filtered = menuItems.filter(item => {
    const matchCat    = activeCategory === "todos" || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
    const matchVeg    = !filterVeg || item.vegetariano === true;
    return matchCat && matchSearch && matchVeg;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><strong>Nenhum prato encontrado</strong>Tente outra categoria ou termo de busca.</div>`;
    return;
  }

  filtered.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 60}ms`;
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
        ${item.spicy ? '<span class="badge-spicy">🌶️🌶️</span>' : ""}
      </div>
      <div class="card-body">
        <div class="card-cat">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
          ${capitalize(item.category)}
        </div>
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-footer">
          <span class="card-price">R$ ${item.price.toFixed(2).replace(".", ",")}</span>
          <button class="btn-add" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Adicionar
          </button>
        </div>
      </div>
    `;

    card.addEventListener("click", e => { if (!e.target.closest(".btn-add")) openModal(item); });
    card.querySelector(".btn-add").addEventListener("click", e => { e.stopPropagation(); openModal(item); });

    grid.appendChild(card);
  });
}

// --------------- EVENTOS ---------------
catBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    catBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderCards();
  });
});

searchInput.addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderCards();
});

// Toggle painel de filtros
const btnFiltros  = document.getElementById("btnFiltros");
const filterPanel = document.getElementById("filterPanel");
const cbVeg       = document.getElementById("filterVegetariano");

btnFiltros?.addEventListener("click", () => {
  filterPanel.classList.toggle("open");
});

cbVeg?.addEventListener("change", () => {
  filterVeg = cbVeg.checked;
  renderCards();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const modal = document.getElementById("itemModal");
    if (modal) { modal.classList.add("modal-hide"); setTimeout(() => { modal.remove(); document.body.style.overflow = ""; }, 250); }
    else closeCart();
  }
});

// Finalizar pedido — vai para a página de checkout
document.getElementById("cartCheckoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;
  const payload = {
    items: cart.map(c => ({
      id:         c.item.id,
      name:       c.item.name,
      img:        c.item.img,
      qty:        c.qty,
      finalPrice: c.finalPrice,
      size:       c.size || "regular",
      adicionais: c.adicionais || [],
      remover:    c.remover    || [],
      obs:        c.obs        || ""
    })),
    discountPct: discountPct || 0
  };
  localStorage.setItem("chojiCheckout", JSON.stringify(payload));
  window.location.href = "checkout.html";
});

// --------------- UTILS ---------------
function capitalize(str) {
  const map = { lamens:"Lámens", donburi:"Donburi", entradas:"Entradas", bebidas:"Bebidas", sobremesas:"Sobremesas" };
  return map[str] || str;
}

// --------------- INIT ---------------
renderCards();
renderCart();

// --------------- SAIR ---------------
document.querySelector(".btn-sair")?.addEventListener("click", () => {
  window.location.href = "../login/login.html";
});

// --------------- MEUS PEDIDOS (dados reais via choji-orders.js) ---------------
// Mapeia o status interno do sistema (novo/preparo/pronto/disponivel/
// andamento/concluida/entregue/cancelado) para o vocabulário visual
// que esta página já usa (em-preparo / a-caminho / entregue / cancelado),
// já que o CSS só tem essas 4 classes definidas.
const STATUS_MAP_CLIENTE = {
  novo: 'em-preparo', preparo: 'em-preparo', pronto: 'em-preparo',
  disponivel: 'a-caminho', andamento: 'a-caminho',
  concluida: 'entregue', entregue: 'entregue',
  cancelado: 'cancelado',
};
const STATUS_LABEL_CLIENTE = {
  novo: 'Recebido', preparo: 'Em Preparo', pronto: 'Pronto',
  disponivel: 'A Caminho', andamento: 'A Caminho',
  concluida: 'Entregue', entregue: 'Entregue',
  cancelado: 'Cancelado',
};

function mapOrderToPedido(o) {
  return {
    id:          (o.id || '').replace('#', ''),
    rawStatus:   o.status,
    status:      STATUS_MAP_CLIENTE[o.status] || 'em-preparo',
    statusLabel: STATUS_LABEL_CLIENTE[o.status] || (o.statusLabel || o.status),
    data:        o.data || new Date(o.createdAt || Date.now()).toLocaleString('pt-BR'),
    createdAt:   o.createdAt || Date.now(),
    total:       Number(o.total || 0),
    itens:       (o.items || []).map(it => ({ nome: it.name, qtd: it.qty })),
  };
}

function getPedidosCliente() {
  if (typeof ChojiOrders === 'undefined') return [];
  return ChojiOrders.getAll()
    .filter(o => o.status !== 'cancelado')
    .map(mapOrderToPedido);
}

const svgReorder = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`;
const svgTrack   = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
const svgCheck   = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
const svgClock   = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>`;

function renderPedidos() {
  const lista = document.getElementById('pedidosList');
  if (!lista) return;
  const isActive = s => s === 'em-preparo' || s === 'a-caminho';

  const pedidos = getPedidosCliente();

  if (pedidos.length === 0) {
    lista.innerHTML = `<div style="text-align:center;padding:3rem;color:#888;">Você ainda não fez nenhum pedido</div>`;
    return;
  }

  lista.innerHTML = pedidos.map(p => {
    const icon = isActive(p.status) ? svgClock : svgCheck;
    const actionBtn = isActive(p.status)
      ? `<button class="btn-acompanhar">${svgTrack} Acompanhar Pedido</button>`
      : `<button class="btn-pedir-novamente">${svgReorder} Pedir Novamente</button>`;
    const totalFmt = p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const itensHTML = p.itens.map(i => `<li>${i.nome} x ${i.qtd}</li>`).join('');
    return `
      <div class="pedido-card">
        <div class="pedido-card-header">
          <div class="pedido-card-left">
            <div>
              <div class="pedido-numero">Pedido <span>#${p.id}</span></div>
              <div class="pedido-data">${p.data}</div>
            </div>
            <span class="pedido-status ${p.status}">${icon} ${p.statusLabel}</span>
          </div>
          <div class="pedido-valor">${totalFmt}</div>
        </div>
        <hr class="pedido-divider" />
        <div class="pedido-itens-titulo">Itens do pedido:</div>
        <ul class="pedido-itens-lista">${itensHTML}</ul>
        <div class="pedido-actions">${actionBtn}</div>
      </div>`;
  }).join('');
}

// --------------- NAVEGAÇÃO ENTRE PÁGINAS ---------------
(function initNav() {
  const pageCardapio = document.getElementById('pageCardapio');
  const pagePedidos  = document.getElementById('pagePedidos');
  const navLinks     = document.querySelectorAll('.nav-links a[data-page]');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (link.dataset.page === 'pedidos') {
        pageCardapio.classList.add('page-hidden');
        pagePedidos.classList.remove('page-hidden');
        renderPedidos();
      } else {
        pagePedidos.classList.add('page-hidden');
        pageCardapio.classList.remove('page-hidden');
      }
    });
  });
})();

// --------------- MEU PERFIL ---------------
function renderPerfilPedidosRecentes() {
  const container = document.getElementById('perfilPedidosRecentes');
  if (!container) return;

  const recentes = getPedidosCliente().slice(0, 2);
  const isAtivo = s => s === 'em-preparo' || s === 'a-caminho';

  container.innerHTML = recentes.map(p => {
    const ativo = isAtivo(p.status);
    const itensFmt = p.itens.map(i => `${i.qtd}x ${i.nome}`).join(', ');
    const totalFmt = p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Data formatada (a partir do timestamp real do pedido)
    const dObj = new Date(p.createdAt || Date.now());
    const horaObj = `${String(dObj.getHours()).padStart(2,'0')}:${String(dObj.getMinutes()).padStart(2,'0')}`;
    let dataFmt;
    if (ativo) {
      dataFmt = `Hoje às ${horaObj}`;
    } else {
      dataFmt = `${dObj.toLocaleDateString('pt-BR')} às ${horaObj}`;
    }

    const acompBtn = ativo
      ? `<button class="btn-acomp-mini">
           <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
           Acompanhar
         </button>`
      : '';

    return `
      <div class="perfil-pedido-item ${ativo ? 'ativo' : ''}">
        <div class="perfil-pedido-num">Pedido #${p.id}</div>
        <span class="perfil-pedido-status ${p.status}">${p.statusLabel}</span>
        <div class="perfil-pedido-data">${dataFmt}</div>
        <div class="perfil-pedido-itens">${itensFmt}</div>
        <div class="perfil-pedido-footer">
          <span class="perfil-pedido-valor">${totalFmt}</span>
          ${acompBtn}
        </div>
      </div>`;
  }).join('');
}

function showPerfilToast(msg) {
  let t = document.getElementById('perfilToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'perfilToast';
    t.className = 'perfil-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function initPerfil() {
  // --- Carrega dados salvos no localStorage ---
  const perfilSalvo = JSON.parse(localStorage.getItem('chojiPerfil') || '{}');

  // Informações pessoais
  const camposPessoal = { nome: 'Nome', email: 'Email', tel: 'Tel', cpf: 'Cpf' };
  Object.entries(camposPessoal).forEach(([key, f]) => {
    if (perfilSalvo[key] !== undefined) {
      const disp = document.getElementById('disp' + f);
      const inp  = document.getElementById('inp'  + f);
      if (disp) disp.textContent = perfilSalvo[key];
      if (inp)  inp.value        = perfilSalvo[key];
    }
  });

  // Endereço
  const camposEnd = { end_cep: 'Cep', end_end: 'End', end_comp: 'Comp',
                      end_bairro: 'Bairro', end_cidade: 'Cidade', end_estado: 'Estado' };
  Object.entries(camposEnd).forEach(([key, f]) => {
    if (perfilSalvo[key] !== undefined) {
      const disp = document.getElementById('disp' + f);
      const inp  = document.getElementById('inp'  + f);
      if (disp) disp.textContent = perfilSalvo[key];
      if (inp)  inp.value        = perfilSalvo[key];
    }
  });

  // --- Informações Pessoais ---
  const pessoalFields = ['Nome', 'Email', 'Tel', 'Cpf'];
  const btnEdit = document.getElementById('btnEditPessoal');
  const actP    = document.getElementById('actPessoal');

  btnEdit?.addEventListener('click', () => {
    pessoalFields.forEach(f => {
      document.getElementById('disp' + f).style.display = 'none';
      document.getElementById('inp'  + f).style.display = '';
    });
    actP.style.display = 'flex';
    btnEdit.style.display = 'none';
  });

  document.getElementById('btnSavePessoal')?.addEventListener('click', () => {
    const perfil = JSON.parse(localStorage.getItem('chojiPerfil') || '{}');
    pessoalFields.forEach(f => {
      const val = document.getElementById('inp' + f).value;
      const disp = document.getElementById('disp' + f);
      disp.textContent = val;
      disp.style.display = '';
      document.getElementById('inp' + f).style.display = 'none';
      // Salva no perfil (chave lowercase: nome, email, tel, cpf)
      perfil[f.toLowerCase()] = val;
    });
    localStorage.setItem('chojiPerfil', JSON.stringify(perfil));
    actP.style.display = 'none';
    btnEdit.style.display = '';
    showPerfilToast('✔ Informações salvas!');
  });

  document.getElementById('btnCancelPessoal')?.addEventListener('click', () => {
    pessoalFields.forEach(f => {
      document.getElementById('disp' + f).style.display = '';
      document.getElementById('inp'  + f).style.display = 'none';
    });
    actP.style.display = 'none';
    btnEdit.style.display = '';
  });

  // --- Endereço ---
  const endFields = ['Cep', 'End', 'Comp', 'Bairro', 'Cidade', 'Estado'];
  const btnEditEnd  = document.getElementById('btnEditEnd');
  const actE        = document.getElementById('actEndereco');

  btnEditEnd?.addEventListener('click', () => {
    endFields.forEach(f => {
      document.getElementById('disp' + f).style.display = 'none';
      document.getElementById('inp'  + f).style.display = '';
    });
    actE.style.display = 'flex';
    btnEditEnd.style.display = 'none';
  });

  document.getElementById('btnSaveEnd')?.addEventListener('click', () => {
    const perfil = JSON.parse(localStorage.getItem('chojiPerfil') || '{}');
    endFields.forEach(f => {
      const val = document.getElementById('inp' + f).value;
      const disp = document.getElementById('disp' + f);
      disp.textContent = val;
      disp.style.display = '';
      document.getElementById('inp' + f).style.display = 'none';
      // Salva no perfil (chave lowercase: cep, end, comp, bairro, cidade, estado)
      perfil['end_' + f.toLowerCase()] = val;
    });
    localStorage.setItem('chojiPerfil', JSON.stringify(perfil));
    actE.style.display = 'none';
    btnEditEnd.style.display = '';
    showPerfilToast('✔ Endereço salvo!');
  });

  document.getElementById('btnCancelEnd')?.addEventListener('click', () => {
    endFields.forEach(f => {
      document.getElementById('disp' + f).style.display = '';
      document.getElementById('inp'  + f).style.display = 'none';
    });
    actE.style.display = 'none';
    btnEditEnd.style.display = '';
  });

  // --- Senha ---
  const btnAlterarSenha = document.getElementById('btnAlterarSenha');
  const senhaFields     = document.getElementById('senhaFields');

  btnAlterarSenha?.addEventListener('click', () => {
    const open = senhaFields.style.display === 'block';
    senhaFields.style.display = open ? 'none' : 'block';
  });

  document.getElementById('btnSaveSenha')?.addEventListener('click', () => {
    const nova  = document.getElementById('inpSenhaNova').value;
    const conf  = document.getElementById('inpSenhaConf').value;
    if (!nova) return showPerfilToast('⚠ Digite a nova senha.');
    if (nova !== conf) return showPerfilToast('⚠ As senhas não coincidem.');
    senhaFields.style.display = 'none';
    ['inpSenhaAtual','inpSenhaNova','inpSenhaConf'].forEach(id => document.getElementById(id).value = '');
    showPerfilToast('✔ Senha alterada com sucesso!');
  });

  document.getElementById('btnCancelSenha')?.addEventListener('click', () => {
    senhaFields.style.display = 'none';
    ['inpSenhaAtual','inpSenhaNova','inpSenhaConf'].forEach(id => document.getElementById(id).value = '');
  });

  // --- Ver todos os pedidos ---
  document.getElementById('btnVerPedidos')?.addEventListener('click', () => {
    document.querySelector('.nav-links a[data-page="pedidos"]')?.click();
  });
}

// --------------- ATUALIZA NAVEGAÇÃO p/ 3 páginas ---------------
(function patchNav() {
  const pageCardapio = document.getElementById('pageCardapio');
  const pagePedidos  = document.getElementById('pagePedidos');
  const pagePerfil   = document.getElementById('pagePerfil');
  const navLinks     = document.querySelectorAll('.nav-links a[data-page]');
  const cartBtn      = document.getElementById('btnCart');

  function setCartVisible(visible) {
    if (cartBtn) cartBtn.style.display = visible ? '' : 'none';
  }

  // Remove listeners antigos clonando os links
  navLinks.forEach(link => {
    const clone = link.cloneNode(true);
    link.parentNode.replaceChild(clone, link);
  });

  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-links a[data-page]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      pageCardapio.classList.add('page-hidden');
      pagePedidos.classList.add('page-hidden');
      pagePerfil.classList.add('page-hidden');

      const page = link.dataset.page;
      if (page === 'pedidos') {
        pagePedidos.classList.remove('page-hidden');
        setCartVisible(false);
        renderPedidos();
      } else if (page === 'perfil') {
        pagePerfil.classList.remove('page-hidden');
        setCartVisible(false);
        renderPerfilPedidosRecentes();
      } else {
        pageCardapio.classList.remove('page-hidden');
        setCartVisible(true);
      }
    });
  });
})();

// Inicializa perfil
initPerfil();

// --------------- RASTREAMENTO ---------------
const timelineSteps = [
  {
    key: 'recebido',
    nome: 'Pedido Recebido',
    desc: 'Seu pedido foi confirmado e está na fila de preparo',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>`,
    tempo: '40–60 minutos',
  },
  {
    key: 'preparo',
    nome: 'Em Preparo',
    desc: 'Nossos chefs estão preparando seu pedido com cuidado',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/><circle cx="12" cy="12" r="10" stroke-linecap="round"/></svg>`,
    tempo: '20–35 minutos',
  },
  {
    key: 'pronto',
    nome: 'Pronto',
    desc: 'Seu pedido está pronto e aguardando retirada/entrega',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    tempo: '15–25 minutos',
  },
  {
    key: 'entrega',
    nome: 'Saiu para Entrega',
    desc: 'Pedido a caminho do endereço de entrega',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h8zm0 0l2-5h4l2 5"/></svg>`,
    tempo: '5–15 minutos',
  },
  {
    key: 'entregue',
    nome: 'Entregue',
    desc: 'Pedido entregue com sucesso! Bom apetite!',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    tempo: null,
  },
];

const svgCheck13 = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
const svgClock13 = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>`;

let rastrPedidoAtual = null;
let rastrStepAtual   = 1; // índice do step ativo na timeline (0=recebido, 1=preparo, etc.)

// Mapeia o status real do pedido (ChojiOrders) pro índice da timeline visual
function statusToStepIndex(rawStatus) {
  const idx = {
    novo: 0, preparo: 1, pronto: 2,
    disponivel: 3, andamento: 3,
    concluida: 4, entregue: 4,
  };
  return idx[rawStatus] ?? 1;
}

function abrirRastreamento(pedido) {
  rastrPedidoAtual = pedido;
  rastrStepAtual   = pedido && pedido.rawStatus ? statusToStepIndex(pedido.rawStatus) : 1;

  document.getElementById('pageCardapio').classList.add('page-hidden');
  document.getElementById('pagePedidos').classList.add('page-hidden');
  document.getElementById('pagePerfil').classList.add('page-hidden');
  document.getElementById('pageRastreamento').classList.remove('page-hidden');

  // Esconde carrinho
  const cartBtn = document.getElementById('btnCart');
  if (cartBtn) cartBtn.style.display = 'none';

  document.querySelectorAll('.nav-links a[data-page]').forEach(l => l.classList.remove('active'));

  renderRastreamento();
}

function renderRastreamento() {
  const p    = rastrPedidoAtual;
  const step = timelineSteps[rastrStepAtual];
  const agora = new Date();
  const horaFmt = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dataFmt = agora.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  // Subtítulo
  document.getElementById('rastrSubtitulo').textContent =
    `Pedido #${p.id} – ${dataFmt} às ${horaFmt}`;

  // Card status atual
  document.getElementById('rastrStatusIcon').innerHTML = step.icon;
  document.getElementById('rastrStatusNome').textContent = step.nome;
  document.getElementById('rastrStatusDesc').textContent = step.desc;
  document.getElementById('rastrStatusHora').textContent = `Atualizado às ${horaFmt}`;
  document.getElementById('rastrTempoEst').textContent   = step.tempo || '–';

  // Timeline
  const tl = document.getElementById('rastrTimeline');
  tl.innerHTML = timelineSteps.map((s, i) => {
    const state = i < rastrStepAtual ? 'done' : i === rastrStepAtual ? 'active' : 'pending';
    return `
      <div class="rastr-tl-item ${state}">
        <div class="rastr-tl-dot">${s.icon}</div>
        <div class="rastr-tl-body">
          <div class="rastr-tl-nome">
            ${s.nome}
            <span class="rastr-tl-check">${svgCheck13}</span>
          </div>
          <div class="rastr-tl-desc">${s.desc}</div>
          ${state !== 'pending' ? `<div class="rastr-tl-hora">${svgClock13} ${horaFmt}</div>` : ''}
        </div>
      </div>`;
  }).join('');

  // Resumo do pedido
  const resumoEl = document.getElementById('rastrResumoItens');
  resumoEl.innerHTML = p.itens.map(item => {
    const preco = (item.qtd * (rastrPedidoAtual.total / p.itens.reduce((s,i) => s + i.qtd, 0))).toFixed(2).replace('.', ',');
    return `<div class="rastr-resumo-item"><span>${item.qtd}x ${item.nome}</span><span>R$ ${preco}</span></div>`;
  }).join('');

  const totalFmt = p.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('rastrTotal').textContent = totalFmt;
}

// Botão Atualizar — busca o status real do pedido via ChojiOrders
document.getElementById('rastrAtualizar')?.addEventListener('click', function() {
  this.classList.add('spinning');
  setTimeout(() => {
    this.classList.remove('spinning');

    if (typeof ChojiOrders !== 'undefined' && rastrPedidoAtual) {
      const real = ChojiOrders.getAll().find(o => (o.id || '').replace('#', '') === String(rastrPedidoAtual.id));
      if (real) {
        rastrPedidoAtual.rawStatus = real.status;
        rastrStepAtual = statusToStepIndex(real.status);
        renderRastreamento();
        return;
      }
    }
    // Sem sistema real disponível: simula avanço (comportamento antigo)
    if (rastrStepAtual < timelineSteps.length - 1) rastrStepAtual++;
    renderRastreamento();
  }, 800);
});

// Botão Voltar
document.getElementById('rastrVoltar')?.addEventListener('click', () => {
  document.getElementById('pageRastreamento').classList.add('page-hidden');
  document.getElementById('pagePedidos').classList.remove('page-hidden');
  document.querySelector('.nav-links a[data-page="pedidos"]')?.classList.add('active');
  renderPedidos();
});

// --------------- PATCH: conecta botões Acompanhar ao rastreamento ---------------
// Sobrescreve renderPedidos para adicionar listener nos botões
const _renderPedidosOrig = renderPedidos;
renderPedidos = function() {
  _renderPedidosOrig();
  document.querySelectorAll('.btn-acompanhar').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pedido-card');
      const numText = card.querySelector('.pedido-numero span').textContent; // "#12346"
      const id = numText.replace('#', '').trim();
      const pedido = getPedidosCliente().find(p => String(p.id) === id);
      if (pedido) abrirRastreamento(pedido);
    });
  });
};

// Também conecta nos pedidos recentes do perfil
const _renderPerfilOrig = renderPerfilPedidosRecentes;
renderPerfilPedidosRecentes = function() {
  _renderPerfilOrig();
  document.querySelectorAll('.btn-acomp-mini').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.perfil-pedido-item');
      const numText = item.querySelector('.perfil-pedido-num').textContent; // "Pedido #12346"
      const id = numText.replace(/\D/g, '').trim();
      const pedido = getPedidosCliente().find(p => String(p.id) === id);
      if (pedido) abrirRastreamento(pedido);
    });
  });
};

// --------------- FOOTER LINKS ---------------
document.querySelectorAll('.footer-links a[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(`.nav-links a[data-page="${link.dataset.page}"]`);
    if (target) target.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// --------------- DEEP LINK: ?rastrear=NUMERO ---------------
// Chamado quando vindo de confirmacao.html via "Acompanhar Pedido"
(function checkRastrearParam() {
  const params  = new URLSearchParams(window.location.search);
  const numStr  = params.get('rastrear');
  if (!numStr) return;

  // Tenta construir pedido a partir do localStorage (pedido recém-confirmado)
  let pedido = null;

  try {
    // Prioriza sessionStorage (gravado imediatamente antes do redirect)
    const orderRaw = sessionStorage.getItem('chojiOrderConfirm') ||
                     localStorage.getItem('chojiOrderConfirm');
    const cartRaw  = sessionStorage.getItem('chojiCheckout') ||
                     localStorage.getItem('chojiCheckout');

    const order = orderRaw ? JSON.parse(orderRaw) : null;
    const cart  = cartRaw  ? JSON.parse(cartRaw)  : null;

    if (order && cart && cart.items && cart.items.length > 0) {
      const subtotal = cart.items.reduce((s, it) => s + it.finalPrice * it.qty, 0);
      const fee      = order.deliveryType === 'pickup' ? 0 : 12;
      const disc     = cart.discountPct ? subtotal * (cart.discountPct / 100) : 0;
      const total    = subtotal + fee - disc;

      pedido = {
        id:          numStr,
        rawStatus:   'novo',
        status:      'em-preparo',
        statusLabel: 'Recebido',
        data:        order.date || new Date().toLocaleString('pt-BR'),
        createdAt:   Date.now(),
        total:       total,
        itens:       cart.items.map(it => ({ nome: it.name, qtd: it.qty }))
      };

      // Limpa após leitura
      sessionStorage.removeItem('chojiOrderConfirm');
      sessionStorage.removeItem('chojiCheckout');
      localStorage.removeItem('chojiOrderConfirm');
      localStorage.removeItem('chojiCheckout');
    }
  } catch(e) {}

  // Fallback: busca nos pedidos reais pelo id
  if (!pedido) {
    const id = numStr.replace('#', '').trim();
    pedido = getPedidosCliente().find(p => String(p.id) === id) || null;
  }

  // Aguarda o DOM estar pronto e abre rastreamento
  function tryAbrir() {
    if (typeof abrirRastreamento === 'function' &&
        document.getElementById('pageRastreamento')) {
      abrirRastreamento(pedido);
      // Limpa parâmetro da URL sem recarregar
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      setTimeout(tryAbrir, 50);
    }
  }
  tryAbrir();
})();

// --------------- DEEP LINK: ?page=PAGINA ---------------
// Chamado quando vindo de confirmacao.html pelos links da navbar
(function checkPageParam() {
  const params = new URLSearchParams(window.location.search);
  const page   = params.get('page');
  if (!page) return;

  function tryNav() {
    const link = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (link) {
      link.click();
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      setTimeout(tryNav, 50);
    }
  }
  tryNav();
})();

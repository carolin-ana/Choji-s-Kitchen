const pratos = [
  { nome: "Lámen Especial Choji", cat: "Lamen", catLabel: "Lámen", desc: "Lámen tradicional com ovo, chashu, nori e cebolinha em caldo cremoso", preco: 65, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600", disp: true, pop: true },
  { nome: "Tom Yum Lámen", cat: "Lamen", catLabel: "Lámen", desc: "Caldo picante tailandês com camarão, cogumelos e ervas frescas", preco: 70, img: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=600", disp: true, pop: true },
  { nome: "Yakisoba da Casa", cat: "Donburi", catLabel: "Donburi", desc: "Macarrão grelhado com legumes frescos, frango e molho especial", preco: 58, img: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600", disp: true, pop: true },
  { nome: "Tonkotsu Densetsu", cat: "Lamen", catLabel: "Lámen", desc: "Caldo cremoso de ossos de porco cozidos por 18h, chashu macio, ovo marinado e cebolinha", preco: 72, img: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=600", disp: true, pop: false },
  { nome: "Shoyu Clássico Kyoto", cat: "Lamen", catLabel: "Lámen", desc: "Caldo de frango e shoyu artesanal, noodles frescos, ovo marinado e nori", preco: 68, img: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600", disp: true, pop: false },
  { nome: "Gyudon Prime", cat: "Donburi", catLabel: "Donburi", desc: "Carne bovina premium sobre arroz, com molho especial e ovo onsen", preco: 78, img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600", disp: true, pop: false },
  { nome: "Katsudon Artesanal", cat: "Donburi", catLabel: "Donburi", desc: "Tonkatsu crocante com ovo, cebola e molho sobre arroz japonês", preco: 65, img: "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600", disp: true, pop: false },
  { nome: "Gyoza Artesanal", cat: "Entrada", catLabel: "Entrada", desc: "6 unidades de gyoza recheados com porco e vegetais, servido com molho especial", preco: 32, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600", disp: true, pop: true },
  { nome: "Tempurá Especial da Casa", cat: "Entrada", catLabel: "Entrada", desc: "Mix de legumes e camarão empanados em massa leve e crocante", preco: 45, img: "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=600", disp: true, pop: false },
  { nome: "Mochi Artesanal", cat: "Sobremesa", catLabel: "Sobremesa", desc: "3 unidades de mochi recheado com pasta de feijão doce", preco: 28, img: "https://images.unsplash.com/photo-1631206753348-db44968fd440?w=600", disp: true, pop: false },
  { nome: "Dorayaki Clássico", cat: "Sobremesa", catLabel: "Sobremesa", desc: "Panquecas japonesas recheadas com doce de feijão azuki", preco: 26, img: "https://images.unsplash.com/photo-1606851094291-6efae152bb87?w=600", disp: false, pop: false },
  { nome: "Chá Verde Sencha", cat: "Bebida", catLabel: "Bebida", desc: "Chá verde premium japonês servido quente", preco: 14, img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600", disp: true, pop: false },
  { nome: "Saquê Junmai", cat: "Bebida", catLabel: "Bebida", desc: "Saquê premium servido gelado ou aquecido (300ml)", preco: 32, img: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600", disp: true, pop: false },
];

function render() {
  const grid = document.getElementById('dishGrid');
  grid.innerHTML = pratos.map((p, i) => `
    <div class="dish-card">
      <div class="dish-img-wrap ${!p.disp ? 'inativo' : ''}">
        <img src="${p.img}" alt="${p.nome}">
        ${p.pop ? '<span class="badge-popular">Popular</span>' : ''}
        ${!p.disp ? '<span class="badge-indisp">Indisponível</span>' : ''}
      </div>
      <div class="dish-body">
        <div class="dish-name">${p.nome}</div>
        <span class="dish-cat cat-${p.cat.toLowerCase()}">${p.catLabel}</span>
        <p class="dish-desc">${p.desc}</p>
        <div class="dish-price">R$ ${p.preco.toFixed(2)}</div>
        <div class="dish-actions">
          <button class="btn-status ${!p.disp ? 'inativo' : ''}" onclick="toggleStatus(${i})">
            ${p.disp ? '👁 Ativo' : '🚫 Inativo'}
          </button>
          <button class="btn-icon" onclick="openEdit(${i})">✏</button>
          <button class="btn-icon danger" onclick="removerPrato(${i})">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleStatus(i) { pratos[i].disp = !pratos[i].disp; render(); }
let delIndex = null;
function removerPrato(i) {
  const p = pratos[i];
  delIndex = i;
  document.getElementById('delNome').textContent = p.nome;
  document.getElementById('delImg').src = p.img;
  document.getElementById('delDesc').textContent = p.desc;
  document.getElementById('modalExcluir').classList.add('active');
}
function confirmDelete() {
  if (delIndex !== null) { pratos.splice(delIndex, 1); delIndex = null; render(); }
  closeModal('modalExcluir');
}

function openNewModal() { document.getElementById('modalNovo').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openEdit(i) {
  const p = pratos[i];
  document.getElementById('editNome').value = p.nome;
  document.getElementById('editDesc').value = p.desc;
  document.getElementById('editPreco').value = p.preco;
  document.getElementById('editCat').value = p.catLabel;
  document.getElementById('editImg').value = p.img;
  document.getElementById('editDisp').checked = p.disp;
  document.getElementById('editPop').checked = p.pop;
  document.getElementById('modalEditar').classList.add('active');
}

document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) o.classList.remove('active'); });
});

render();

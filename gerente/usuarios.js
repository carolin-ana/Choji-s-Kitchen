const users = [
  { nome:"Carlos Tanaka", email:"carlos.tanaka@chojiskitchen.com", tel:"(11) 98765-4321", funcao:"cozinha", status:"ativo", perms:3 },
  { nome:"Marina Yoshida", email:"marina.yoshida@chojiskitchen.com", tel:"(11) 97654-3210", funcao:"cozinha", status:"ativo", perms:4 },
  { nome:"Pedro Santos", email:"pedro.santos@chojiskitchen.com", tel:"(11) 96543-2109", funcao:"entregador", status:"ativo", perms:4 },
  { nome:"Ana Lima", email:"ana.lima@chojiskitchen.com", tel:"(11) 95432-1098", funcao:"entregador", status:"ativo", perms:3 },
  { nome:"Roberto Nakamura", email:"roberto.nakamura@chojiskitchen.com", tel:"(11) 94321-0987", funcao:"cozinha", status:"inativo", perms:2 },
];

function render() {
  const list = document.getElementById("usersList");
  list.innerHTML = users.map((u,i) => {
    const initial = u.nome[0];
    const roleClass = u.funcao === "cozinha" ? "role-cozinha" : "role-entregador";
    const roleLabel = u.funcao === "cozinha" ? "👨‍🍳 Cozinha" : "🛵 Entregador";
    const statusClass = u.status === "ativo" ? "status-ativo" : "status-inativo";
    const statusLabel = u.status === "ativo" ? "Ativo" : "Inativo";
    const toggleBtn = u.status === "ativo"
      ? `<button class="icon-btn danger" onclick="openDesativar(${i})" title="Desativar">⊘</button>`
      : `<button class="icon-btn success" title="Ativar">✓</button>`;
    return `
      <div class="user-card">
        <div class="avatar">${initial}</div>
        <div class="user-info">
          <h3>${u.nome}</h3>
          <div>✉ ${u.email}</div>
          <div>📞 ${u.tel}</div>
        </div>
        <div class="user-col"><div class="user-col-label">Função</div><span class="role-badge ${roleClass}">${roleLabel}</span></div>
        <div class="user-col"><div class="user-col-label">Status</div><span class="status-badge ${statusClass}">${statusLabel}</span></div>
        <div class="user-col"><div class="user-col-label">Permissões</div><span class="perm-count">${u.perms} ativas</span></div>
        <div class="actions">
          <button class="icon-btn edit" onclick="openEditar(${i})" title="Editar">✎</button>
          <button class="icon-btn perm" onclick="openPerm(${i})" title="Permissões">🛡</button>
          ${toggleBtn}
        </div>
      </div>`;
  }).join("");
}

function openModal(id){ document.getElementById(id).classList.add("active"); }
function closeModal(id){ document.getElementById(id).classList.remove("active"); }
function openNovoUsuario(){ openModal("modalNovo"); }
function openEditar(i){
  const u = users[i];
  document.getElementById("editNome").value = u.nome;
  document.getElementById("editEmail").value = u.email;
  document.getElementById("editTel").value = u.tel;
  openModal("modalEditar");
}
function openPerm(i){
  const u = users[i];
  document.getElementById("permUser").textContent = `${u.nome} - ${u.funcao === "cozinha" ? "Cozinha" : "Entregador"}`;
  openModal("modalPerm");
}
function openDesativar(i){
  const u = users[i];
  document.getElementById("desativarNome").textContent = u.nome;
  document.getElementById("desativarFuncao").textContent = u.funcao === "cozinha" ? "Cozinha" : "Entregador";
  document.getElementById("desativarEmail").textContent = u.email;
  openModal("modalDesativar");
}

document.querySelectorAll(".modal-overlay").forEach(o => {
  o.addEventListener("click", e => { if(e.target === o) o.classList.remove("active"); });
});

render();

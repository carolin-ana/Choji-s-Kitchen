const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            const target = document.getElementById(button.dataset.tab);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();

        const role = document.getElementById('loginRole').value;
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!role || !email || !password) {
            alert('Preencha todos os campos de login.');
            return;
        }

        alert(`Login realizado como ${role}.\nEmail: ${email}`);
        loginForm.reset();

        const rotas = {
            cliente:    '../cliente/cliente.html',
            cozinha:    '../cozinha/cozinha.html',
            entregador: '../entregador/entregador.html',
            gerente:    '../gerente/gerente.html',
        };
        window.location.href = rotas[role] || '../index.html';
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();

        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Preencha todos os campos do cadastro.');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        alert(`Cadastro realizado com sucesso!\nBem-vindo, ${name}.`);
        registerForm.reset();
        window.location.href = '../index.html';
    });
}

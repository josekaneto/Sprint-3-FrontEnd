function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const setColor = (id, cssVar) => {
        let v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        if (v.startsWith('rgb')) v = '#' + v.match(/\d+/g).slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
        document.getElementById(id).value = v;
    };
    setColor('cor1', '--color-pink');
    setColor('cor2', '--color-purple');
});

// Função para salvar usuário no localStorage
function salvarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Função para buscar usuário por email
function buscarUsuario(email) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.find(u => u.email === email);
}

// Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = e.target;
        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const senha = form.senha.value;
        const confirmarSenha = form.confirmarSenha.value;
        const numero = form.numero.value.trim();
        const cep = form.cep.value.trim();
        const endereco = form.endereco.value.trim();
        const adicional = form.adicional.value.trim();
        const erro = document.getElementById('cadastroErro');

        erro.classList.add('hidden');

        if (!nome || !email || !senha || !confirmarSenha) {
            erro.textContent = 'Preencha todos os campos obrigatórios.';
            erro.classList.remove('hidden');
            return;
        }
        if (senha !== confirmarSenha) {
            erro.textContent = 'As senhas não coincidem.';
            erro.classList.remove('hidden');
            return;
        }
        if (buscarUsuario(email)) {
            erro.textContent = 'Email já cadastrado.';
            erro.classList.remove('hidden');
            return;
        }

        salvarUsuario({
            nome,
            email,
            senha,
            numero,
            cep,
            endereco,
            adicional
        });
        localStorage.setItem('usuarioLogado', JSON.stringify({
            nome,
            email
        }));
        alert('Conta criada com sucesso!');
        window.location.href = './loginPerfil.html';
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value.trim();
        const senha = form.senha.value;
        const erro = document.getElementById('loginErro');

        erro.classList.add('hidden');

        const usuario = buscarUsuario(email);
        if (!usuario || usuario.senha !== senha) {
            erro.textContent = 'Email ou senha inválidos.';
            erro.classList.remove('hidden');
            return;
        }
        localStorage.setItem('usuarioLogado', JSON.stringify({
            nome: usuario.nome,
            email: usuario.email
        }));
        window.location.href = './indexPosLogin.html';
    });
}

// Recuperação de Senha com EmailJS
const recuperarForm = document.getElementById('recuperarForm');
if (recuperarForm) {
    recuperarForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value.trim();
        const erro = document.getElementById('recuperarErro');
        const sucesso = document.getElementById('recuperarSucesso');

        erro.classList.add('hidden');
        sucesso.classList.add('hidden');

        const usuario = buscarUsuario(email);
        if (!usuario) {
            erro.textContent = 'Email não cadastrado.';
            erro.classList.remove('hidden');
            console.log('Recuperação: email não cadastrado:', email);
            alert('Erro: Email não cadastrado.');
            return;
        }

        // Envio do email fake com EmailJS
        emailjs.init('Rkmh0Mj2yBUfq8CCY');
        emailjs.send('service_5v1p42q', 'template_yac7cdw', {
            to_email: email,         // deve bater com {{to_email}} no template
            name: usuario.nome       // deve bater com {{name}} no template
        }).then(function (response) {
            sucesso.textContent = 'Email de recuperação enviado! Verifique sua caixa de entrada.';
            sucesso.classList.remove('hidden');
        }, function (error) {
            erro.textContent = 'Erro ao enviar email: ' + JSON.stringify(error);
            erro.classList.remove('hidden');
            console.error('Erro ao enviar email:', error);
            alert('Erro ao enviar email: ' + JSON.stringify(error));
        });
    });
}
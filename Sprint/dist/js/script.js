function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const setColor = (id, cssVar) => {
        let v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        if (v.startsWith('rgb')) v = '#' + v.match(/\d+/g).slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
        const el = document.getElementById(id);
        if (el) el.value = v;
    };
    setColor('cor1', '--color-pink');
    setColor('cor2', '--color-purple');

    // Chama as notícias da Women Super League se o container existir
    if (document.getElementById('noticiasContainer')) {
        newsWomenSuperLeague();
    }
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

async function newsWomenSuperLeague() {
    try {
        const response = await fetch('https://newsapi.org/v2/everything?q=Women-Super-League&apiKey=30939f006bd6433e930278b2aaa79a09');
        const data = await response.json();
        const noticiasContainer = document.getElementById('noticiasContainer');
        // Adiciona padding lateral ao container
        noticiasContainer.className = 'max-w-3xl mx-auto flex flex-col gap-6 md:px-10 px-10';

        noticiasContainer.innerHTML = '';

        if (data.articles && data.articles.length > 0) {
            data.articles.slice(0, 6).forEach(article => {
                const noticia = document.createElement('div');
                noticia.className = 'flex gap-4 items-start bg-white/80 border border-[var(--color-purple)] rounded-lg shadow-sm p-4 md:p-6 hover:shadow-lg transition mb-2';

                noticia.innerHTML = `
                    <img src="${article.urlToImage || '../../public/Logo-preta.png'}" alt="Imagem da notícia"
                        class="w-20 h-20 md:w-28 md:h-28 object-cover rounded-md border border-gray-200 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-base md:text-lg text-[var(--color-purple)] mb-1 line-clamp-2">${article.title}</h3>
                        <p class="text-sm text-gray-700 mb-1 line-clamp-2" style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${article.description || ''}</p>
                        <div class="flex items-center justify-between">
                            <a href="${article.url}" target="_blank" class="text-[var(--color-pink)] text-xs underline font-semibold">Leia mais</a>
                            <span class="text-xs text-gray-500 ml-2">${new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>
                `;
                noticiasContainer.appendChild(noticia);
            });
        } else {
            noticiasContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        const noticiasContainer = document.getElementById('noticiasContainer');
        if (noticiasContainer) {
            noticiasContainer.innerHTML = '<p>Erro ao carregar notícias.</p>';
        }
    }
}
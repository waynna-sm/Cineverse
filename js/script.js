
/* =====================================
   CINEVERSE - INTERAÇÕES
===================================== */

// MENU MOBILE
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

if (menuBtn && menu) {
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('aberto');
        const aberto = menu.classList.contains('aberto');
        menuBtn.textContent = aberto ? '×' : '☰';
        menuBtn.setAttribute('aria-expanded', String(aberto));
    });
}

// FECHAR MENU AO CLICAR EM UM LINK
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
        menu?.classList.remove('aberto');
        if (menuBtn) {
            menuBtn.textContent = '☰';
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
});

// ANIMAÇÃO AO ROLAR A PÁGINA
if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.revelar').forEach(elemento => {
        observador.observe(elemento);
    });
} else {
    document.querySelectorAll('.revelar').forEach(elemento => {
        elemento.classList.add('visivel');
    });
}

// FILTRO E BUSCA DE FILMES
const botoesFiltro = document.querySelectorAll('.filtro-btn');
const filmes = document.querySelectorAll('.filme-card');
const campoBusca = document.querySelector('#buscaFilme');

let categoriaAtual = 'todos';

function filtrarFilmes() {
    const pesquisa = campoBusca
        ? campoBusca.value.toLowerCase().trim()
        : '';

    filmes.forEach(filme => {
        const categoria = filme.dataset.categoria || '';
        const nome = (
            filme.dataset.nome ||
            filme.querySelector('h3')?.textContent ||
            ''
        ).toLowerCase();

        const correspondeCategoria =
            categoriaAtual === 'todos' ||
            categoria === categoriaAtual;

        const correspondeBusca = nome.includes(pesquisa);

        filme.style.display =
            correspondeCategoria && correspondeBusca
                ? ''
                : 'none';
    });
}

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => b.classList.remove('ativo'));

        botao.classList.add('ativo');
        categoriaAtual = botao.dataset.filtro;

        filtrarFilmes();
    });
});

if (campoBusca) {
    campoBusca.addEventListener('input', filtrarFilmes);
}

// VALIDAÇÃO DO FORMULÁRIO
const formulario = document.querySelector('#formContato');

if (formulario) {
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nome = document.querySelector('#nome');
        const email = document.querySelector('#email');
        const assunto = document.querySelector('#assunto');
        const mensagem = document.querySelector('#mensagem');
        const resposta = document.querySelector('#resposta');

        document.querySelectorAll('.erro').forEach(erro => {
            erro.textContent = '';
        });

        let valido = true;

        if (nome.value.trim().length < 3) {
            document.querySelector('#erroNome').textContent =
                'Digite seu nome completo.';
            valido = false;
        }

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

        if (!emailValido) {
            document.querySelector('#erroEmail').textContent =
                'Digite um e-mail válido.';
            valido = false;
        }

        if (!assunto.value) {
            document.querySelector('#erroAssunto').textContent =
                'Selecione um assunto.';
            valido = false;
        }

        if (mensagem.value.trim().length < 10) {
            document.querySelector('#erroMensagem').textContent =
                'A mensagem precisa ter pelo menos 10 caracteres.';
            valido = false;
        }

        if (!valido) {
            resposta.textContent =
                'Verifique os campos destacados e tente novamente.';
            resposta.className = 'erro';
            return;
        }

        resposta.textContent =
            `Obrigado, ${nome.value.trim()}! Sua mensagem foi validada com sucesso.`;
        resposta.className = 'sucesso';

        const mensagemSalva = {
            nome: nome.value.trim(),
            email: email.value.trim(),
            assunto: assunto.value,
            mensagem: mensagem.value.trim(),
            data: new Date().toISOString()
        };

        try {
            const mensagens = JSON.parse(localStorage.getItem('cineverseMensagens') || '[]');
            mensagens.push(mensagemSalva);
            localStorage.setItem('cineverseMensagens', JSON.stringify(mensagens));
        } catch (erro) {
            resposta.textContent =
                'A mensagem foi validada, mas não pôde ser salva neste navegador.';
            resposta.className = 'erro';
        }

        formulario.reset();
    });
}

// ANO AUTOMÁTICO NO RODAPÉ
document.querySelectorAll('.ano').forEach(elemento => {
    elemento.textContent = new Date().getFullYear();
});

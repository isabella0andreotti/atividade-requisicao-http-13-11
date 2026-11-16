
//  Obter os elementos HTML
const formulario = document.getElementById('cep-form');
const campoCep = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

// Evento de envio do formulário
formulario.addEventListener('submit', async (event) => {

    //  Impedir o recarregamento da página
    event.preventDefault();

    //  Ocultar os resultados anteriores
    resultado.hidden = true;

    //  Ler o CEP e remover espaços
    const cep = campoCep.value.trim();

    //  Validar o formato do CEP
    if (!/^\d{5}-?\d{3}$/.test(cep)) {
        mensagem.textContent = 'CEP inválido.';
        return;
    }

    // Informar que a consulta começou
    mensagem.textContent = 'Consultando...';
    campoCep.disabled = true;

    //  Remover o hífen do CEP
    const cepFormatado = cep.replace('-', '');

    try {

        //  Fazer a requisição ao ViaCEP
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cepFormatado}/json/`
        );

        //  Verificar se a resposta foi bem-sucedida
        if (!resposta.ok) {
            mensagem.textContent = 'Erro ao consultar o serviço.';
            return;
        }

        //  Converter a resposta para JSON
        const dados = await resposta.json();

        // Verificar se o CEP foi encontrado
        if (dados.erro) {
            mensagem.textContent = 'CEP não encontrado.';
            return;
        }

        //  Preencher os resultados
        document.getElementById('valor-cep').textContent = dados.cep;

        document.getElementById('valor-logradouro').textContent =
            dados.logradouro || 'Não informado';

        document.getElementById('valor-bairro').textContent =
            dados.bairro || 'Não informado';

        document.getElementById('valor-cidade').textContent =
            dados.localidade;

        document.getElementById('valor-uf').textContent = dados.uf;

        document.getElementById('valor-ibge').textContent = dados.ibge;

        //  Exibir os resultados
        mensagem.textContent = 'Resposta do ViaCEP:';
        resultado.hidden = false;

    } catch (erro) {

        // Tratar erros de conexão
        mensagem.textContent = 'Falha na conexão com o serviço.';

    } finally {

        //  Finalizar a consulta
        campoCep.disabled = false;
        campoCep.focus();

    }

});

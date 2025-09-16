// Função para carregar as vagas do localStorage
function getVagas() {
    const vagasJSON = localStorage.getItem('vagas');
    return vagasJSON ? JSON.parse(vagasJSON) : [];
}

// Função para salvar as vagas no localStorage
function saveVagas(vagas) {
    localStorage.setItem('vagas', JSON.stringify(vagas));
}

// Lógica de cadastro e listagem
document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const urlParams = new URLSearchParams(window.location.search);
    const idVagaParaEditar = urlParams.get('id');

    // MODO DE EDIÇÃO
    if (cadastroForm && idVagaParaEditar) {
        const vagas = getVagas();
        const vagaExistente = vagas.find(vaga => vaga.idvaga === idVagaParaEditar);
        
        if (vagaExistente) {
            document.querySelector('h2').textContent = 'Alterar Vaga de Emprego';
            document.getElementById('idvaga').value = vagaExistente.idvaga;
            document.getElementById('idvaga').readOnly = true; // Impede a edição do ID
            document.getElementById('descricao').value = vagaExistente.descricao;
            document.getElementById('reqObrigatorios').value = vagaExistente.reqObrigatorios;
            document.getElementById('reqDesejaveis').value = vagaExistente.reqDesejaveis;
            document.getElementById('remuneracao').value = vagaExistente.remuneracao;
            document.getElementById('beneficios').value = vagaExistente.beneficios;
            document.getElementById('localTrabalho').value = vagaExistente.localTrabalho;
            document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
        }

        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const vagas = getVagas();
            const index = vagas.findIndex(vaga => vaga.idvaga === idVagaParaEditar);

            if (index !== -1) {
                vagas[index] = {
                    idvaga: idVagaParaEditar,
                    descricao: document.getElementById('descricao').value,
                    reqObrigatorios: document.getElementById('reqObrigatorios').value,
                    reqDesejaveis: document.getElementById('reqDesejaveis').value,
                    remuneracao: document.getElementById('remuneracao').value,
                    beneficios: document.getElementById('beneficios').value,
                    localTrabalho: document.getElementById('localTrabalho').value,
                };
                saveVagas(vagas);
                alert('Vaga alterada com sucesso!');
                window.location.href = 'index.html';
            }
        });
    } 
    
    // MODO DE CADASTRO
    else if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const novaVaga = {
                idvaga: document.getElementById('idvaga').value,
                descricao: document.getElementById('descricao').value,
                reqObrigatorios: document.getElementById('reqObrigatorios').value,
                reqDesejaveis: document.getElementById('reqDesejaveis').value,
                remuneracao: document.getElementById('remuneracao').value,
                beneficios: document.getElementById('beneficios').value,
                localTrabalho: document.getElementById('localTrabalho').value,
            };

            const vagas = getVagas();
            vagas.push(novaVaga);
            saveVagas(vagas);

            alert('Vaga cadastrada com sucesso!');
            this.reset();
        });
    }

    // Lógica de listagem e exclusão (permanece a mesma)
    const listaTableBody = document.getElementById('lista-vagas');
    if (listaTableBody) {
        const vagas = getVagas();
        renderVagas(vagas);

        listaTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-delete')) {
                const vagaId = event.target.dataset.id;
                if (confirm(`Tem certeza que deseja excluir a vaga #${vagaId}?`)) {
                    const vagas = getVagas();
                    const vagasAtualizadas = vagas.filter(vaga => vaga.idvaga !== vagaId);
                    saveVagas(vagasAtualizadas);
                    renderVagas(vagasAtualizadas);
                    alert(`Vaga #${vagaId} excluída.`);
                }
            } else if (event.target.classList.contains('btn-edit')) {
                const vagaId = event.target.dataset.id;
                window.location.href = `cadastro.html?id=${vagaId}`;
            }
        });
    }
});

// Função para renderizar as vagas na tabela
function renderVagas(vagas) {
    const listaTableBody = document.getElementById('lista-vagas');
    listaTableBody.innerHTML = '';

    if (vagas.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="5" class="empty-message">Nenhuma vaga cadastrada.</td>`;
        listaTableBody.appendChild(emptyRow);
        return;
    }

    vagas.forEach(vaga => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vaga.idvaga}</td>
            <td>${vaga.descricao}</td>
            <td>R$ ${parseFloat(vaga.remuneracao).toFixed(2).replace('.', ',')}</td>
            <td>${vaga.localTrabalho}</td>
            <td class="action-buttons">
                <button class="btn-edit" data-id="${vaga.idvaga}">Alterar</button>
                <button class="btn-delete" data-id="${vaga.idvaga}">Excluir</button>
            </td>
        `;
        listaTableBody.appendChild(row);
    });
}
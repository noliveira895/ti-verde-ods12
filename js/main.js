document.addEventListener('DOMContentLoaded', () => {
    // Caminho relativo ao JS que está em /js/
    fetch('../data/pesquisa.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o JSON: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados de pesquisa carregados:', data);

            // 1. Gráfico da HOME (Distribuição Amostral)
            const ctxGeral = document.getElementById('graficoGeral');
            if (ctxGeral) {
                criarGraficoGeral(ctxGeral, data);
            }

            // 2. Gráfico da PÁGINA DE ENTREVISTAS (Comparativo de Conscientização)
            const ctxEntrevistas = document.getElementById('graficoEntrevistas');
            if (ctxEntrevistas) {
                criarGraficoEntrevistas(ctxEntrevistas, data);
            }
        })
        .catch(error => {
            console.error('Falha ao carregar ou processar dados do dashboard:', error);
            // Mensagem de erro no console para diagnóstico
        });
});


// FUNÇÃO 1: GRÁFICO DA HOME - Distribuição dos Entrevistados
function criarGraficoGeral(ctx, data) {
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Empresas (' + data.totalEmpresas + ')', 'Outros Grupos (' + data.totalOutrosGrupos + ')'],
            datasets: [{
                data: [data.totalEmpresas, data.totalOutrosGrupos],
                backgroundColor: ['#007bff', '#ffcc00'], // Azul e Amarelo para distinção
                hoverBackgroundColor: ['#0056b3', '#cca300'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribuição Amostral (Total de ' + data.totalEnvolvidos + ' Entrevistados)',
                    font: { size: 16 }
                }
            }
        }
    });
}


// FUNÇÃO 2: GRÁFICO DA PÁGINA DE ENTREVISTAS - Comparativo de Indicadores
function criarGraficoEntrevistas(ctx, data) {
    // Cálculo de Percentuais (dados do JSON)
    const empresasConhecimento = (data.conhecimentoODS12.empresasSim / data.totalEmpresas) * 100; // 7/9 = ~78%
    const outrosConhecimento = (data.conhecimentoODS12.outrosGruposSim / data.totalOutrosGrupos) * 100; // 10/16 = 62.5%
    
    // Usando dados simulados de e-lixo do público geral para um segundo indicador
    const descarteCorreto = (data.descarteE_Lixo.pontoColeta / data.totalOutrosGrupos) * 100; // 5/16 = 31.25%
    const guardaEmCasa = (data.descarteE_Lixo.guardaEmCasa / data.totalOutrosGrupos) * 100; // 8/16 = 50%

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Empresas', 'Outros Grupos'],
            datasets: [
                {
                    label: 'Conhecimento da ODS 12 (%)',
                    data: [empresasConhecimento, outrosConhecimento],
                    backgroundColor: '#0b6b3a' // Verde (ODS 12)
                },
                {
                    label: 'Descarte Correto de E-Lixo (%)',
                    data: [data.praticaColetaSeletiva.empresasSim / data.totalEmpresas * 100, descarteCorreto],
                    backgroundColor: '#007bff' // Azul
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Conscientização ODS 12 e Descarte de Resíduos por Grupo',
                    font: { size: 16 }
                },
                legend: { position: 'bottom' }
            },
            scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentual (%)' } }
            }
        }
    });
}

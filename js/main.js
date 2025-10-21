// js/main.js

// Variáveis globais 'agg' e 'surveyData' são carregadas via js/data.js

// UTIL: get element safely
const $ = sel => document.querySelector(sel);

/**
 * 1. Inicializa os gráficos para a página principal (index.html)
 */
function initHomeCharts() {
  // Verifica se as variáveis de dados foram carregadas com sucesso
  if (typeof agg === 'undefined' || typeof surveyData === 'undefined') {
    console.error("Dados da pesquisa (data.js) não carregados ou indefinidos.");
    return;
  }

  // --- Gráfico 1: Pie de Grupos (index.html) ---
  const ctxPie = document.getElementById('pieGroups');
  if (ctxPie) {
    const groups = agg.groups;
    const labels = Object.keys(groups);
    const data = Object.values(groups);
    new Chart(ctxPie.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          label: 'Grupos',
          backgroundColor: ['#00796B', '#30B4A0', '#546E7A', '#90A4AE'], // Usando a nova paleta
          borderColor: '#ffffff',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // --- Gráfico 2: Bar de Conscientização (Contagem de Notas 0-5) (index.html) ---
  const ctxBar = document.getElementById('barAwareness');
  if (ctxBar) {
    // Constrói contagens de notas 0 a 5 (índice da pergunta 9 = 8)
    const counts = [0, 0, 0, 0, 0, 0];
    surveyData.forEach(s => {
      const val = Number(s.answers[8]) || 0;
      counts[Math.max(0, Math.min(5, val))] += 1;
    });

    new Chart(ctxBar.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['0', '1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Número de respostas',
          data: counts,
          backgroundColor: '#30B4A0',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  // --- Preenche Estatísticas Textuais (index.html) ---
  updateTextualStats();
}

/**
 * 2. Inicializa os gráficos para a página de detalhes (entrevistas.html)
 */
function initDetailCharts() {
  // Verifica se as variáveis de dados foram carregadas com sucesso
  if (typeof agg === 'undefined' || typeof surveyData === 'undefined') {
    console.error("Dados da pesquisa (data.js) não carregados ou indefinidos.");
    return;
  }
  
  const labels = Object.keys(agg.avgAwarenessByGroup);
  const avgs = Object.values(agg.avgAwarenessByGroup);

  // --- Gráfico 3: Média de Conscientização por Grupo (entrevistas.html) ---
  const ctx = document.getElementById('barsByGroup');
  if (ctx) {
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Nota média (0-5)',
          data: avgs,
          backgroundColor: '#00796B'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    });
  }

  // --- Gráfico 4: Políticas/Treinamentos "Sim" por Grupo (entrevistas.html) ---
  const groupsYes = {};
  const groupsTotal = {};
  // Pergunta sobre políticas/treinamentos (índice 3 da lista de respostas)
  surveyData.forEach(s => {
    const g = s.group;
    groupsTotal[g] = (groupsTotal[g] || 0) + 1;
    // Resposta 'Sim' para pergunta 4 (answers[3])
    if (String(s.answers[3]).toLowerCase().includes("sim")) {
      groupsYes[g] = (groupsYes[g] || 0) + 1;
    }
  });

  const ctx2 = document.getElementById('stackedPolicies');
  if (ctx2) {
    const yes = labels.map(l => groupsYes[l] || 0);
    const no = labels.map(l => (groupsTotal[l] || 0) - (groupsYes[l] || 0));

    new Chart(ctx2.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
            label: 'Tem Política/Treinamento (Sim)',
            data: yes,
            backgroundColor: '#00796B'
          },
          {
            label: 'Não/Não sei',
            data: no,
            backgroundColor: '#cccccc'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

/**
 * 3. Preenche as estatísticas textuais na página principal
 */
function updateTextualStats() {
  if (typeof agg === 'undefined' || typeof surveyData === 'undefined') return;

  const meanElem = document.getElementById('meanAwareness');
  if (meanElem) {
    meanElem.textContent = agg.meanAwareness.toFixed(2);
  }

  const percElem = document.getElementById('percSelective');
  if (percElem) {
    percElem.textContent = agg.percSelective.toFixed(0) + '%';
  }
}


/* 4. INICIALIZAÇÃO: Chama as funções corretas ao carregar a página */
document.addEventListener('DOMContentLoaded', () => {
  // Tenta inicializar os gráficos da Home (index.html)
  if (document.getElementById('pieGroups') && document.getElementById('barAwareness')) {
    initHomeCharts();
  }
  
  // Tenta inicializar os gráficos de Detalhes (entrevistas.html)
  if (document.getElementById('barsByGroup') && document.getElementById('stackedPolicies')) {
    initDetailCharts();
  }
});

// js/main.js

// Variável global 'agg' e 'surveyData' são carregadas via js/data.js

// UTIL: get element safely
const $ = sel => document.querySelector(sel);

/**
 * 1. Inicializa os gráficos para a página principal (index.html)
 */
function initHomeCharts() {
  if (!window.agg || !window.surveyData) return;

  // --- Gráfico 1: Pie de Grupos ---
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
          backgroundColor: ['#0b6b3a', '#234e3a', '#4a9c6b', '#7fb998'],
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

  // --- Gráfico 2: Bar de Conscientização (Contagem de Notas 0-5) ---
  const ctxBar = document.getElementById('barAwareness');
  if (ctxBar) {
    // Constrói contagens de notas 0 a 5 (índice da pergunta 9 = 8)
    const counts = [0, 0, 0, 0, 0, 0];
    surveyData.forEach(s => {
      const val = Number(s.answers[8]) || 0; // Pergunta sobre conhecimento ODS/descarte
      counts[Math.max(0, Math.min(5, val))] += 1;
    });
    new Chart(ctxBar.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['0', '1', '2', '3', '4', '5'],
        datasets: [{
          label: 'Número de respostas',
          data: counts,
          backgroundColor: '#0b6b3a',
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
            beginAtZero: true
          }
        }
      }
    });
  }

  // --- Preenche Estatísticas Textuais (Highlights) ---
  const meanElem = document.getElementById('meanAwareness');
  if (meanElem) meanElem.textContent = agg.meanAwareness.toFixed(2);

  const percSelectiveElem = document.getElementById('percSelective');
  if (percSelectiveElem) percSelectiveElem.textContent = `${agg.percSelective}%`;
}


/**
 * 2. Inicializa os gráficos para a página de entrevistas (entrevistas.html)
 */
function initInterviewCharts() {
  if (!window.agg || !window.surveyData) return;

  const groups = agg.groups;
  const labels = Object.keys(groups);

  // --- Gráfico 3: Barras Simples (Média de Conscientização por Grupo) ---
  // Averages per group (agg.avgAwarenessByGroup)
  const avgs = labels.map(l => agg.avgAwarenessByGroup[l]);
  const ctx = document.getElementById('barsByGroup');
  if (ctx) {
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Nota média (0-5)',
          data: avgs,
          backgroundColor: '#0b6b3a',
          borderRadius: 4
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

  // --- Gráfico 4: Barras Empilhadas (Políticas/Treinamentos "Sim" vs. "Não" por Grupo) ---
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
            backgroundColor: '#0b6b3a'
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


/* Inicializa os gráficos corretos dependendo dos elementos presentes na página */
document.addEventListener('DOMContentLoaded', () => {
  if ($('#pieGroups')) {
    initHomeCharts();
  }
  if ($('#barsByGroup')) {
    initInterviewCharts();
  }
});

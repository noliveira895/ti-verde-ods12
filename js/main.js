// js/main.js

// UTIL: get element safely
const $ = sel => document.querySelector(sel);

function initHomeCharts(){
  if(!window.agg || !window.surveyData) return;

  // Pie: groups
  const ctxPie = document.getElementById('pieGroups');
  if(ctxPie){
    const groups = agg.groups;
    const labels = Object.keys(groups);
    const data = Object.values(groups);
    new Chart(ctxPie.getContext('2d'), {
      type: 'doughnut',
      data: { labels, datasets:[{ data, label:'Grupos' }]},
      options:{ responsive:true, plugins:{legend:{position:'bottom'}} }
    });
  }

  // Bar: awareness distribution (0-5 average per person)
  const ctxBar = document.getElementById('barAwareness');
  if(ctxBar){
    // build counts of ratings 0..5
    const counts = [0,0,0,0,0,0];
    surveyData.forEach(s=>{
      const val = Number(s.answers[8]) || 0;
      counts[Math.max(0, Math.min(5, val))] += 1;
    });
    new Chart(ctxBar.getContext('2d'), {
      type:'bar',
      data:{ labels:['0','1','2','3','4','5'], datasets:[{ label:'Número de respostas', data:counts, borderRadius:6 }]},
      options:{ responsive:true, plugins:{legend:{display:false}} }
    });
  }

  // Fill textual stats
  const meanElem = document.getElementById('meanAwareness');
  if(meanElem) meanElem.textContent = agg.meanAwareness;

  const percSel = ((agg.selectiveCount / agg.total) * 100).toFixed(0) + '%';
  const percElem = document.getElementById('percSelective');
  if(percElem) percElem.textContent = percSel;
}

function initDetailsCharts(){
  if(!window.agg || !window.surveyData) return;

  // Bars by group: average rating (q9) per group
  const groups = {};
  surveyData.forEach(s=>{
    const g = s.group;
    groups[g] = groups[g] || { sum:0, n:0 };
    const val = Number(s.answers[8]) || 0;
    groups[g].sum += val; groups[g].n += 1;
  });
  const labels = Object.keys(groups);
  const avgs = labels.map(l => +(groups[l].sum / groups[l].n).toFixed(2));

  const ctx = document.getElementById('barsByGroup');
  if(ctx){
    new Chart(ctx.getContext('2d'), {
      type:'bar',
      data:{ labels, datasets:[{ label:'Nota média (0-5)', data:avgs }]},
      options:{ responsive:true, plugins:{legend:{display:false}} }
    });
  }

  // Stacked: policies/treinamentos "Sim" (q4) by group
  const groupsYes = {}; const groupsTotal = {};
  surveyData.forEach(s=>{
    const g = s.group;
    groupsTotal[g] = (groupsTotal[g]||0)+1;
    if(String(s.answers[3]).toLowerCase().includes("sim")) groupsYes[g] = (groupsYes[g]||0)+1;
  });
  const ctx2 = document.getElementById('stackedPolicies');
  if(ctx2){
    const yes = labels.map(l => groupsYes[l] || 0);
    const no = labels.map(l => (groupsTotal[l] || 0) - (groupsYes[l] || 0));
    new Chart(ctx2.getContext('2d'), {
      type:'bar',
      data:{
        labels,
        datasets:[
          { label:'Sim (tem treinamento/política)', data:yes },
          { label:'Não/Não sei', data:no }
        ]
      },
      options:{ responsive:true, scales:{ x:{ stacked:true }, y:{ stacked:true } }, plugins:{legend:{position:'bottom'}} }
    });
  }
}

/* initialize on load depending on elements present */
document.addEventListener('DOMContentLoaded', ()=>{
  // make surveyData and agg available globally (already defined in data.js)
  if(typeof surveyData === 'undefined' || typeof agg === 'undefined'){
    console.warn('Dados da pesquisa não encontrados (verifique js/data.js)');
  }

  initHomeCharts();
  initDetailsCharts();
});


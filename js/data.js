// js/data.js
// Amostra anônima de 25 entrevistados (agrupados). Cada resposta para 12 perguntas
// Campos: id, group, company (optional), role (optional), answers (array), photo (optional)
const surveyData = [
  // 9 from TransÔnibus (empresa)
  { id: 1, group: "empresa", company:"TransÔnibus", role:"Admin", photo:"imagens/participant1.jpg",
    answers: ["Sim","Sim","Sempre","Sim","Sim","Treinamento","Sim","Falta logística",4,"Não","Política interna","Mais pontos de coleta"] },
  { id: 2, group: "empresa", company:"TransÔnibus", role:"Mecânico", photo:"imagens/participant2.jpg",
    answers: ["Sim","Sim","Raramente","Não","Sim","Pontos de coleta","Sim","Falta informação",3,"Sim","Campanhas","Comunicação melhor"] },
  { id: 3, group: "empresa", company:"TransÔnibus", role:"Operador",
    answers: ["Sim","Sim","Às vezes","Sim","Sim","Reciclagem por parceiros","Sim","Custo",4,"Não","Treinamentos","Mais instruções visuais"] },
  { id: 4, group: "empresa", company:"TransÔnibus", role:"Oficial",
    answers: ["Sim","Sim","Sempre","Sim","Sim","Logística reversa","Sim","Processo confuso",5,"Não","Política","Melhor sinalização"] },
  { id: 5, group: "empresa", company:"TransÔnibus", role:"Técnico",
    answers: ["Sim","Sim","Raramente","Não","Não","Doação de peças","Não","Tempo","3","Sim","Nenhuma","Parcerias"] },
  { id: 6, group: "empresa", company:"TransÔnibus", role:"Suporte",
    answers: ["Sim","Sim","Às vezes","Sim","Sim","Reciclagem","Sim","Falta ponto de coleta",4,"Não","Campanhas","Mais pontos"] },
  { id: 7, group: "empresa", company:"TransÔnibus", role:"RH",
    answers: ["Sim","Sim","Sempre","Sim","Sim","Política interna","Sim","Custo logístico",5,"Não","Política","Treinamentos periódicos"] },
  { id: 8, group: "empresa", company:"TransÔnibus", role:"Supervisor",
    answers: ["Sim","Sim","Às vezes","Sim","Sim","Coleta seletiva","Sim","Falta rotina",4,"Sim","Incentivo","Melhor comunicação"] },
  { id: 9, group: "empresa", company:"TransÔnibus", role:"Estagiário",
    answers: ["Sim","Parcial","Raramente","Não","Não","Educação","Não","Desconhecimento",2,"Sim","Campanhas","Ações de conscientização"] },

  // 8 estudantes
  { id: 10, group:"estudante", role:"Aluno", answers:["Não","Parcial","Raramente","Não","Não","Campanhas","Não","Não sei onde descartar",2,"Não","Nenhuma","Pontos no campus"] },
  { id: 11, group:"estudante", role:"Aluno", answers:["Parcial","Não","Nunca","Não","Não","Mais informação","Não","Distância",1,"Sim","Informações","Mais pontos"] },
  { id: 12, group:"estudante", role:"Aluno", answers:["Não","Não","Raramente","Não","Não","Reciclagem","Não","Falta infraestrutura",2,"Não","Nenhuma","Campanhas"] },
  { id: 13, group:"estudante", role:"Aluno", answers:["Sim","Parcial","Às vezes","Sim","Não","Educação","Sim","Custo",3,"Não","Projetos","Maior visibilidade"] },
  { id: 14, group:"estudante", role:"Aluno", answers:["Não","Não","Nunca","Não","Não","Pontos fixos","Não","Não sei",1,"Não","Nenhuma","Ações práticas"] },
  { id: 15, group:"estudante", role:"Aluno", answers:["Parcial","Não","Raramente","Não","Não","Campanhas","Não","Falta tempo",2,"Não","Palestras","Divulgação"] },
  { id: 16, group:"estudante", role:"Aluno", answers:["Sim","Parcial","Às vezes","Sim","Não","Coleta em eventos","Sim","Custo",3,"Não","Parceiros","Pontos de entrega"] },
  { id: 17, group:"estudante", role:"Aluno", answers:["Não","Parcial","Raramente","Não","Não","Educação continuada","Não","Inércia",2,"Não","Nenhuma","Mais ações"] },

  // 8 trabalhadores/amigos informais
  { id: 18, group:"trabalhador", role:"Autônomo", answers:["Não","Não","Nunca","Não","Não","Dificuldade logística","Não","Custo",1,"Sim","Nenhuma","Coleta municipal"] },
  { id: 19, group:"trabalhador", role:"Comerciante", answers:["Parcial","Não","Raramente","Não","Não","Incentivos","Não","Falta informação",2,"Não","Incentivo","Campanhas locais"] },
  { id: 20, group:"trabalhador", role:"Operário", answers:["Não","Não","Raramente","Não","Não","Pontos comunitários","Não","Desinteresse",1,"Não","Nenhuma","Mais infraestrutura"] },
  { id: 21, group:"amigos", role:"Informal", answers:["Não","Não","Nunca","Não","Não","Sem solução clara","Não","Custo",1,"Não","Nenhuma","Incentivos financeiros"] },
  { id: 22, group:"amigos", role:"Informal", answers:["Parcial","Não","Às vezes","Não","Não","Doação/Revenda","Não","Falta tempo",2,"Não","Campanhas","Mais pontos"] },
  { id: 23, group:"amigos", role:"Informal", answers:["Não","Não","Nunca","Não","Não","Falta informação","Não","Não sei",1,"Não","Nenhuma","Parcerias"] },
  { id: 24, group:"trabalhador", role:"Entregador", answers:["Não","Parcial","Raramente","Não","Não","Pontos móveis","Não","Falta incentivo",2,"Não","Parcerias","Unidades móveis"] },
  { id: 25, group:"trabalhador", role:"Oficial", answers:["Parcial","Não","Às vezes","Não","Não","Reciclagem informal","Não","Custo",2,"Não","Nenhuma","Ações locais"] }
];

// Variável de Agregação (Aggregations) para Dashboards
// Esta função calcula e prepara os dados que o main.js precisa.
const agg = (function buildAgg(data){
  const total = data.length;
  const groups = {};
  let awarenessSum = 0;
  let selectiveCount = 0;
  
  data.forEach(d => {
    // 1. Contagem por grupo
    const groupKey = d.group;
    groups[groupKey] = (groups[groupKey] || 0) + 1;
    
    // 2. Conscientização média e total (Pergunta 9: answers[8])
    const q9Score = Number(d.answers[8]) || 0; 
    awarenessSum += q9Score;

    // 3. Coleta Seletiva na empresa/instituição (Pergunta 2: answers[1])
    const q2 = d.answers[1] ? d.answers[1].toLowerCase() : "";
    if(q2.includes("sim") || q2.includes("parcial")) selectiveCount++;
  });

  // Calcula médias de Conscientização por Grupo para o Dashboard Detalhado
  const avgAwarenessByGroup = {};
  Object.keys(groups).forEach(g => {
    const groupTotal = groups[g];
    let groupAwarenessSum = data
      .filter(d => d.group === g)
      .reduce((sum, d) => sum + (Number(d.answers[8]) || 0), 0);
    avgAwarenessByGroup[g] = groupAwarenessSum / groupTotal;
  });

  return {
    total,
    groups, // {empresa: 10, estudante: 8, ...}
    meanAwareness: awarenessSum / total, // Média geral
    percSelective: Math.round((selectiveCount / total) * 100), // Percentual de acesso a coleta
    avgAwarenessByGroup, // {empresa: 4.2, estudante: 2.5, ...}
  };
})(surveyData);

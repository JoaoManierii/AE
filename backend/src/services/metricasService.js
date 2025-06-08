/**
 * Serviço que implementa a funcionalidade do metricas.c
 * Baseado na implementação em C para calcular métricas estatísticas
 */

function calcularMetricas(params) {
  const {
    execucoes = [],
    algoritmo = 'PPC',  // PPC ou Genetico
    // Parâmetros adicionais conforme necessário
  } = params;

  // Implementação baseada no arquivo metricas.c
  // O arquivo original lê dados de um arquivo binário e calcula métricas
  
  const inicio = Date.now();
  
  // Verifica se há dados suficientes para calcular as métricas
  if (!execucoes || execucoes.length === 0) {
    return {
      erro: "Nenhum dado fornecido para cálculo",
      tempoExecucaoSegundos: "0.000"
    };
  }
  
  // Extrai os dados relevantes com base no tipo de algoritmo
  const fitnessDados = execucoes.map(exec => exec.fitness || 0);
  const tempoDados = execucoes.map(exec => parseFloat(exec.tempoExecucaoSegundos) || 0);
  const geracaoDados = execucoes.map(exec => exec.geracoes || 0);
  
  // Calcula a média dos valores
  const mediaFitness = fitnessDados.reduce((acc, val) => acc + val, 0) / fitnessDados.length;
  const mediaTempo = tempoDados.reduce((acc, val) => acc + val, 0) / tempoDados.length;
  const mediaGeracao = geracaoDados.reduce((acc, val) => acc + val, 0) / geracaoDados.length;
  
  // Calcula o desvio padrão do fitness
  let desvioPadrao = 0;
  for (let i = 0; i < fitnessDados.length; i++) {
    desvioPadrao += Math.pow(fitnessDados[i] - mediaFitness, 2);
  }
  desvioPadrao = Math.sqrt(desvioPadrao / fitnessDados.length);
  
  // Calcula valores mínimos e máximos
  const minFitness = Math.min(...fitnessDados);
  const maxFitness = Math.max(...fitnessDados);
  const minTempo = Math.min(...tempoDados);
  const maxTempo = Math.max(...tempoDados);
  
  const resultado = {
    algoritmo,
    numeroExecucoes: execucoes.length,
    fitness: {
      media: mediaFitness,
      desvioPadrao,
      minimo: minFitness,
      maximo: maxFitness
    },
    tempo: {
      media: mediaTempo.toFixed(3),
      minimo: minTempo.toFixed(3),
      maximo: maxTempo.toFixed(3)
    },
    geracoes: {
      media: Math.round(mediaGeracao),
    }
  };
  
  const fim = Date.now();
  
  return {
    ...resultado,
    tempoExecucaoSegundos: ((fim - inicio) / 1000).toFixed(3)
  };
}

module.exports = {
  calcularMetricas
};

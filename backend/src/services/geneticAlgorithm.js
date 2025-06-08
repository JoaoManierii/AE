/**
 * Serviço que implementa a funcionalidade do algoritmo genético do arquivo main.c
 * Baseado na implementação em C para encontrar uma frase alvo
 */

function gerarNumAleatorio(n) {
  return Math.floor(Math.random() * n);
}

// Calcula o fitness de um indivíduo baseado no número de caracteres
// distintos entre a frase alvo e a cópia
function fitness(frase, alvo) {
  let count = 0;
  for (let i = 0; i < alvo.length; i++) {
    if (frase[i] !== alvo[i]) count++;
  }
  return count;
}

// Altera o gene (caracter) de uma frase filho (cópia)
function mutacao(filho, alfabeto, mutacaoRate) {
  if (gerarNumAleatorio(100) <= mutacaoRate) {
    const pos = gerarNumAleatorio(filho.length);
    const novaLetra = alfabeto[gerarNumAleatorio(alfabeto.length)];
    filho = filho.substring(0, pos) + novaLetra + filho.substring(pos + 1);
  }
  return filho;
}

// Combina aleatóriamente os genes (caracteres) da frase pai e mãe
function recombinacaoUniforme(pai, mae) {
  let filho = '';
  for (let i = 0; i < pai.length; i++) {
    filho += gerarNumAleatorio(2) ? pai[i] : mae[i];
  }
  return filho;
}

// Seleção por torneio entre N indivíduos
function selecaoPorTorneio(populacao, qtd) {
  let melhor = populacao[gerarNumAleatorio(populacao.length)];
  for (let i = 1; i < qtd; i++) {
    const candidato = populacao[gerarNumAleatorio(populacao.length)];
    if (candidato.fitness < melhor.fitness) {
      melhor = candidato;
    }
  }
  return melhor;
}

function runGeneticAlgorithm(params) {
  const {
    fraseAlvo,
    populacao: tamanhoPopulacao = 900, // Valor padrão do main.c
    geracoes = 1800,                   // Valor padrão do main.c
    mutacao: taxaMutacao = 15,         // Valor padrão do main.c
    elitismo = 5,                      // Valor padrão do main.c
    torneio = 3,                       // Valor padrão do main.c
  } = params;

  // Determina o alfabeto (caracteres únicos na frase alvo)
  const alfabeto = [...new Set(fraseAlvo.split(''))];
  const populacao = [];

  // Inicialização da população
  for (let i = 0; i < tamanhoPopulacao; i++) {
    let frase = '';
    for (let j = 0; j < fraseAlvo.length; j++) {
      frase += alfabeto[gerarNumAleatorio(alfabeto.length)];
    }
    populacao.push({ frase, fitness: fitness(frase, fraseAlvo) });
  }

  const inicio = Date.now();
  let melhor = populacao[0];
  let geracaoConvergencia = geracoes;

  // Loop principal do algoritmo genético
  for (let gen = 0; gen < geracoes; gen++) {
    // Ordena a população pelo fitness (menor é melhor)
    populacao.sort((a, b) => a.fitness - b.fitness);
    
    // Verifica se encontrou uma solução melhor
    if (populacao[0].fitness < melhor.fitness) {
      melhor = populacao[0];
      if (melhor.fitness === 0) {
        // Encontrou a solução perfeita
        geracaoConvergencia = gen;
        break;
      }
    }

    // Aplica elitismo (mantém os melhores indivíduos)
    const novaPopulacao = populacao.slice(0, Math.floor(tamanhoPopulacao * elitismo / 100));

    // Cria nova população com recombinação e mutação
    while (novaPopulacao.length < tamanhoPopulacao) {
      const pai = selecaoPorTorneio(populacao, torneio);
      const mae = selecaoPorTorneio(populacao, torneio);
      let filho = recombinacaoUniforme(pai.frase, mae.frase);
      filho = mutacao(filho, alfabeto, taxaMutacao);
      novaPopulacao.push({ frase: filho, fitness: fitness(filho, fraseAlvo) });
    }

    // Substitui a população antiga pela nova
    populacao.length = 0;
    populacao.push(...novaPopulacao);
  }

  const fim = Date.now();

  return {
    fraseMelhor: melhor.frase,
    fraseAlvo: fraseAlvo,
    fitnessMelhor: melhor.fitness,
    geracaoConvergencia: geracaoConvergencia < geracoes ? geracaoConvergencia : 'Não convergiu',
    tamanhoPopulacao: tamanhoPopulacao,
    geracoesExecutadas: Math.min(geracaoConvergencia, geracoes),
    tempoExecucaoSegundos: ((fim - inicio) / 1000).toFixed(3)
  };
}

module.exports = {
  runGeneticAlgorithm
};

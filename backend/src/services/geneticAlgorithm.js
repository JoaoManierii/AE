function gerarNumAleatorio(n) {
  return Math.floor(Math.random() * n);
}

function fitness(frase, alvo) {
  let count = 0;
  for (let i = 0; i < alvo.length; i++) {
    if (frase[i] !== alvo[i]) count++;
  }
  return count;
}

function mutacao(filho, alfabeto, mutacaoRate) {
  if (gerarNumAleatorio(100) <= mutacaoRate) {
    const pos = gerarNumAleatorio(filho.length);
    const novaLetra = alfabeto[gerarNumAleatorio(alfabeto.length)];
    filho = filho.substring(0, pos) + novaLetra + filho.substring(pos + 1);
  }
  return filho;
}

function recombinacaoUniforme(pai, mae) {
  let filho = '';
  for (let i = 0; i < pai.length; i++) {
    filho += gerarNumAleatorio(2) ? pai[i] : mae[i];
  }
  return filho;
}

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
    populacao: tamanhoPopulacao = 100,
    geracoes = 1000,
    mutacao: taxaMutacao = 10,
    elitismo = 5,
    torneio = 3,
  } = params;

  const alfabeto = [...new Set(fraseAlvo.split(''))];
  const populacao = [];

  // Inicialização
  for (let i = 0; i < tamanhoPopulacao; i++) {
    let frase = '';
    for (let j = 0; j < fraseAlvo.length; j++) {
      frase += alfabeto[gerarNumAleatorio(alfabeto.length)];
    }
    populacao.push({ frase, fitness: fitness(frase, fraseAlvo) });
  }

  const inicio = Date.now();
  let melhor = populacao[0];

  for (let gen = 0; gen < geracoes; gen++) {
    populacao.sort((a, b) => a.fitness - b.fitness);
    if (populacao[0].fitness < melhor.fitness) {
      melhor = populacao[0];
    }

    const novaPopulacao = populacao.slice(0, Math.floor(tamanhoPopulacao * elitismo / 100));

    while (novaPopulacao.length < tamanhoPopulacao) {
      const pai = selecaoPorTorneio(populacao, torneio);
      const mae = selecaoPorTorneio(populacao, torneio);
      let filho = recombinacaoUniforme(pai.frase, mae.frase);
      filho = mutacao(filho, alfabeto, taxaMutacao);
      novaPopulacao.push({ frase: filho, fitness: fitness(filho, fraseAlvo) });
    }

    populacao.length = 0;
    populacao.push(...novaPopulacao);
  }

  const fim = Date.now();

  return {
    fraseMelhor: melhor.frase,
    fitnessMelhor: melhor.fitness,
    tempoExecucaoSegundos: ((fim - inicio) / 1000).toFixed(3)
  };
}

module.exports = {
  runGeneticAlgorithm
};

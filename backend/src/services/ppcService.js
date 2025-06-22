/**
 * Serviço que implementa a funcionalidade do PPC.c (Problema do Passeio do Cavalo)
 * Baseado no algoritmo genético implementado no arquivo PPC.c
 */

// Movimentos possíveis do cavalo (8 movimentos em L)
const MOVIMENTOS = [
  { dx: 2, dy: 1 }, { dx: 1, dy: 2 },
  { dx: -1, dy: 2 }, { dx: -2, dy: 1 },
  { dx: -2, dy: -1 }, { dx: -1, dy: -2 },
  { dx: 1, dy: -2 }, { dx: 2, dy: -1 }
];

/**
 * Gera um número aleatório entre 0 e n-1
 */
function gerarNumAleatorio(n) {
  return Math.floor(Math.random() * n);
}

/**
 * Converte um número de casa para coordenadas x,y
 */
function coordenadas(numeroCasa, tamanhoTabuleiro) {
  const x = Math.floor((numeroCasa - 1) / tamanhoTabuleiro) + 1;
  const y = ((numeroCasa - 1) % tamanhoTabuleiro) + 1;
  return { x, y };
}

/**
 * Verifica se uma posição é válida no tabuleiro
 */
function posicaoValida(x, y, tamanhoTabuleiro) {
  return x >= 1 && x <= tamanhoTabuleiro && y >= 1 && y <= tamanhoTabuleiro;
}

/**
 * Converte coordenadas x,y para número de casa
 */
function numeroCasa(x, y, tamanhoTabuleiro) {
  return (x - 1) * tamanhoTabuleiro + y;
}

/**
 * Verifica se uma casa é vizinho válido da outra (movimento de cavalo)
 */
function vizinhoValido(atual, proximo, tamanhoTabuleiro) {
  const { x: x1, y: y1 } = coordenadas(atual, tamanhoTabuleiro);
  const { x: x2, y: y2 } = coordenadas(proximo, tamanhoTabuleiro);
  
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
}

/**
 * Calcula o número de movimentos possíveis a partir de uma posição
 */
function movimentosPossiveis(x, y, tamanhoTabuleiro, visitadas) {
  let contador = 0;
  
  for (const movimento of MOVIMENTOS) {
    const novoX = x + movimento.dx;
    const novoY = y + movimento.dy;
    
    if (posicaoValida(novoX, novoY, tamanhoTabuleiro)) {
      const casa = numeroCasa(novoX, novoY, tamanhoTabuleiro);
      if (!visitadas[casa]) {
        contador++;
      }
    }
  }
  
  return contador;
}

/**
 * Implementa a regra de Warnsdorff para encontrar o próximo movimento
 * Escolhe o vizinho com menor número de saídas disponíveis
 */
function regraWarnsdorff(casa, tamanhoTabuleiro, visitadas) {
  const { x, y } = coordenadas(casa, tamanhoTabuleiro);
  let minMovimentos = 9; // Mais do que o máximo possível (8)
  let melhorCasa = 0;
  
  for (const movimento of MOVIMENTOS) {
    const novoX = x + movimento.dx;
    const novoY = y + movimento.dy;
    
    if (posicaoValida(novoX, novoY, tamanhoTabuleiro)) {
      const novaCasa = numeroCasa(novoX, novoY, tamanhoTabuleiro);
      
      if (!visitadas[novaCasa]) {
        const numMovimentos = movimentosPossiveis(novoX, novoY, tamanhoTabuleiro, visitadas);
        if (numMovimentos < minMovimentos) {
          minMovimentos = numMovimentos;
          melhorCasa = novaCasa;
        }
      }
    }
  }
  
  return melhorCasa;
}

/**
 * Calcula o fitness de um indivíduo (tamanho do percurso válido)
 */
function calcularFitness(individuo, tamanhoTabuleiro) {
  const visitadas = {};
  let contador = 0;
  
  // Marca a primeira posição como visitada
  visitadas[individuo.tour[0]] = true;
  
  for (let i = 0; i < individuo.tour.length - 1; i++) {
    const atual = individuo.tour[i];
    let proximo = individuo.tour[i + 1];
    
    if (vizinhoValido(atual, proximo, tamanhoTabuleiro) && !visitadas[proximo]) {
      visitadas[proximo] = true;
      contador++;
    } else {
      // Se o próximo movimento não for válido, tenta encontrar um movimento válido
      proximo = regraWarnsdorff(atual, tamanhoTabuleiro, visitadas);
      if (proximo === 0) {
        break; // Não há movimentos válidos
      }
      
      individuo.tour[i + 1] = proximo;
      visitadas[proximo] = true;
      contador++;
    }
  }
  
  return {
    ...individuo,
    fitness: contador
  };
}

/**
 * Inicializa a população com indivíduos aleatórios
 */
function inicializarPopulacao(tamanhoPopulacao, tamanhoTabuleiro) {
  const populacao = [];
  const tamanhoTotal = tamanhoTabuleiro * tamanhoTabuleiro;
  
  for (let i = 0; i < tamanhoPopulacao; i++) {
    // Cria um tour aleatório
    const tour = Array.from({ length: tamanhoTotal }, (_, i) => i + 1);
    
    // Embaralha o tour (exceto a primeira posição que é o centro do tabuleiro)
    const meio = Math.floor((tamanhoTotal + 1) / 2);
    tour[0] = meio;
    
    for (let j = 1; j < tamanhoTotal; j++) {
      const pos = Math.floor(Math.random() * (tamanhoTotal - 1)) + 1;
      [tour[j], tour[pos]] = [tour[pos], tour[j]];
    }
    
    populacao.push({ tour, fitness: 0 });
  }
  
  // Calcula o fitness inicial de cada indivíduo
  return populacao.map(individuo => calcularFitness(individuo, tamanhoTabuleiro));
}

/**
 * Mutação - altera um gene aleatório do indivíduo
 */
function mutacao(individuo, taxaMutacao, tamanhoTabuleiro) {
  const resultado = { ...individuo, tour: [...individuo.tour] };
  
  if (gerarNumAleatorio(100) <= taxaMutacao) {
    // Não muta a primeira posição
    const pos = gerarNumAleatorio(resultado.tour.length - 1) + 1;
    resultado.tour[pos] = gerarNumAleatorio(tamanhoTabuleiro * tamanhoTabuleiro) + 1;
  }
  
  return resultado;
}

/**
 * Recombinação uniforme entre dois indivíduos
 */
function recombinacaoUniforme(pai, mae) {
  const filho = { tour: [] };
  
  // Mantém a primeira posição do pai (centro do tabuleiro)
  filho.tour[0] = pai.tour[0];
  
  // Combina aleatoriamente os genes dos pais
  for (let i = 1; i < pai.tour.length; i++) {
    filho.tour[i] = gerarNumAleatorio(2) === 0 ? pai.tour[i] : mae.tour[i];
  }
  
  return filho;
}

/**
 * Seleção por torneio
 */
function selecaoPorTorneio(populacao, tamanhoTorneio) {
  let melhor = populacao[gerarNumAleatorio(populacao.length)];
  
  for (let i = 1; i < tamanhoTorneio; i++) {
    const candidato = populacao[gerarNumAleatorio(populacao.length)];
    if (candidato.fitness > melhor.fitness) {
      melhor = candidato;
    }
  }
  
  return melhor;
}

/**
 * Aplica elitismo - ordena a população e seleciona os melhores
 */
function aplicarElitismo(populacao, taxaElitismo) {
  // Ordena por fitness (maior é melhor)
  populacao.sort((a, b) => b.fitness - a.fitness);
  
  // Retorna o número de indivíduos selecionados pelo elitismo
  return Math.floor(populacao.length * taxaElitismo / 100);
}

/**
 * Executa o algoritmo genético para o PPC
 */
function executePPC(params) {
  const {
    tamanhoTabuleiro = 8,    // Reduzido para 8x8 para encontrar soluções mais rapidamente
    populacao = 1000,       // POPULACAO 1000
    geracoes = 10000,       // GERACOES 10000
    mutacao: taxaMutacao = 15,  // MUTACAO 15
    elitismo = 10,          // ELITISMO 10
    torneio = 3             // TORNEIO 3
  } = params;

  const inicio = Date.now();
  const tamanhoTotal = tamanhoTabuleiro * tamanhoTabuleiro;
  
  // Inicializa a população
  let populacaoAtual = inicializarPopulacao(populacao, tamanhoTabuleiro);
  
  // Encontra o melhor indivíduo inicial
  let melhor = populacaoAtual.reduce((a, b) => a.fitness > b.fitness ? a : b);
  let geracaoMelhor = 0;
  
  // Loop principal do algoritmo genético
  for (let geracao = 0; geracao < geracoes; geracao++) {
    // Aplica elitismo
    const numElite = aplicarElitismo(populacaoAtual, elitismo);
    const novaPopulacao = populacaoAtual.slice(0, numElite);
    
    // Cria nova população
    while (novaPopulacao.length < populacao) {
      // Seleção
      const pai = selecaoPorTorneio(populacaoAtual, torneio);
      const mae = selecaoPorTorneio(populacaoAtual, torneio);
      
      // Recombinação
      let filho = recombinacaoUniforme(pai, mae);
      
      // Mutação
      filho = mutacao(filho, taxaMutacao, tamanhoTabuleiro);
      
      // Avaliação
      filho = calcularFitness(filho, tamanhoTabuleiro);
      
      novaPopulacao.push(filho);
    }
    
    // Atualiza a população
    populacaoAtual = novaPopulacao;
    
    // Verifica se encontrou um indivíduo melhor
    const melhorAtual = populacaoAtual.reduce((a, b) => a.fitness > b.fitness ? a : b);
    if (melhorAtual.fitness > melhor.fitness) {
      melhor = melhorAtual;
      geracaoMelhor = geracao;
      
      // Se encontrou um percurso completo, para o algoritmo
      if (melhor.fitness === tamanhoTotal - 1) {
        break;
      }
    }
    
    // A cada 1000 gerações, verifica se houve progresso significativo
    if (geracao > 0 && geracao % 1000 === 0 && geracao - geracaoMelhor > 2000) {
      // Se não houve melhoria significativa nas últimas 2000 gerações, para o algoritmo
      break;
    }
  }
  
  const fim = Date.now();
  
  // Converte o tour para formato de coordenadas para visualização
  const percursoCompleto = melhor.tour.slice(0, melhor.fitness + 1).map((casa, index) => {
    const { x, y } = coordenadas(casa, tamanhoTabuleiro);
    return { x: x - 1, y: y - 1, ordem: index + 1 };
  });
  
  return {
    percursoCompleto,
    fitness: melhor.fitness,
    tamanhoTabuleiro,
    populacaoUtilizada: populacao,
    geracoes: geracaoMelhor + 1,
    percursoEncontrado: melhor.fitness === tamanhoTotal - 1,
    tempoExecucaoSegundos: ((fim - inicio) / 1000).toFixed(3)
  };
}

module.exports = {
  executePPC
};

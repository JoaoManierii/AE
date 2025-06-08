# EndPoints - API

## Algoritmo Genético

### POST /api/genetic/run

Este endpoint é responsável por executar o algoritmo genético para encontrar uma frase alvo, baseado na implementação do arquivo `main.c`.

#### Parâmetros

```json
{
  "fraseAlvo": "O Tejo tem grandes navios",
  "populacao": 900,
  "geracoes": 1800,
  "mutacao": 15,
  "elitismo": 5,
  "torneio": 3
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "fraseMelhor": "O Tejo tem grandes navios",
  "fraseAlvo": "O Tejo tem grandes navios",
  "fitnessMelhor": 0,
  "geracaoConvergencia": 342,
  "tamanhoPopulacao": 900,
  "geracoesExecutadas": 342,
  "tempoExecucaoSegundos": "0.123"
}
```

**Erro interno! 500**

- Exemplo de resposta:

```json
{
  "error": "Erro interno no servidor"
}
```

## PPC (Problema do Passeio do Cavalo)

### POST /api/ppc/execute

Este endpoint é responsável por executar o algoritmo genético para resolver o problema do passeio do cavalo, baseado na implementação do arquivo `PPC.c`.

#### Parâmetros

```json
{
  "tamanhoTabuleiro": 20,
  "populacao": 1000,
  "geracoes": 10000,
  "mutacao": 15,
  "elitismo": 10,
  "torneio": 3
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "percursoCompleto": [
    { "x": 3, "y": 5, "ordem": 1 },
    { "x": 5, "y": 6, "ordem": 2 },
    // ... outros movimentos
  ],
  "fitness": 42,
  "tamanhoTabuleiro": 20,
  "populacaoUtilizada": 1000,
  "geracoes": 5432,
  "percursoEncontrado": false,
  "tempoExecucaoSegundos": "1.234"
}
```

**Erro interno! 500**

- Exemplo de resposta:

```json
{
  "error": "Erro interno no servidor"
}
```

## Métricas

### POST /api/metricas/calcular

Este endpoint é responsável por calcular métricas estatísticas para resultados de execuções de algoritmos, baseado na implementação do arquivo `metricas.c`.

#### Parâmetros

```json
{
  "execucoes": [
    {
      "fitness": 42,
      "geracoes": 5432,
      "tempoExecucaoSegundos": "1.234"
    },
    {
      "fitness": 38,
      "geracoes": 4987,
      "tempoExecucaoSegundos": "1.123"
    },
    // ... outras execuções
  ],
  "algoritmo": "PPC"
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "algoritmo": "PPC",
  "numeroExecucoes": 10,
  "fitness": {
    "media": 40.2,
    "desvioPadrao": 2.3,
    "minimo": 38,
    "maximo": 45
  },
  "tempo": {
    "media": "1.178",
    "minimo": "1.123",
    "maximo": "1.234"
  },
  "geracoes": {
    "media": 5210
  },
  "tempoExecucaoSegundos": "0.005"
}
```

**Erro interno! 500**

- Exemplo de resposta:

```json
{
  "error": "Erro interno no servidor"
}
```
# EndPoints - API

## Algoritmo Genético

### POST /api/genetic/run

Este endpoint é responsável por executar o algoritmo genético para encontrar uma frase alvo.

#### Parâmetros

```json
{
  "fraseAlvo": "HELLO WORLD",
  "populacao": 100,
  "geracoes": 1000,
  "mutacao": 10,
  "elitismo": 5,
  "torneio": 3
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "fraseMelhor": "HELLO WORLD",
  "fitnessMelhor": 0,
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

## PPC (Problema do Percurso do Cavalo)

### POST /api/ppc/execute

Este endpoint é responsável por executar o algoritmo PPC para resolver o problema do percurso do cavalo.

#### Parâmetros

```json
{
  "tamanhoPopulacao": 100,
  "numeroGeracoes": 1000,
  "taxaMutacao": 0.1
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "melhorSolucao": "Solução encontrada",
  "valorFitness": 42.5,
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

Este endpoint é responsável por calcular métricas estatísticas para um conjunto de dados.

#### Parâmetros

```json
{
  "dados": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "tipoMetrica": "padrao"
}
```

#### Respostas

**OK! 200**

- Exemplo de resposta:

```json
{
  "media": 5.5,
  "mediana": 5.5,
  "minimo": 1,
  "maximo": 10,
  "tamanhoAmostra": 10,
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
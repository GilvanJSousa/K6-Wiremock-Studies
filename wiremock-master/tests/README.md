# Testes K6 para FakerAPI

Este diretório contém scripts de teste de carga e desempenho para a [FakerAPI](https://fakerapi.it), um serviço que fornece dados fictícios para desenvolvimento e testes.

## Arquivos de Teste

- `testFakerAPI.js` - Teste básico dos principais recursos da FakerAPI
- `testFakerAPI_custom.js` - Teste do recurso Custom para geração de dados personalizados
- `testFakerAPI_images.js` - Teste específico para o recurso de imagens com métricas adicionais
- `testFakerAPI_carga.js` - Teste de carga com diferentes estágios e intensidades

## Como Executar os Testes

Para executar os testes, você precisa ter o [K6](https://k6.io) instalado. Depois, execute um dos comandos abaixo:

```bash
# Teste básico
k6 run testFakerAPI.js

# Teste personalizado
k6 run testFakerAPI_custom.js

# Teste de imagens
k6 run testFakerAPI_images.js

# Teste de carga
k6 run testFakerAPI_carga.js
```

## Parâmetros da FakerAPI

Os testes utilizam os seguintes parâmetros principais:

- `_locale` - Define o idioma dos dados gerados (ex: pt_BR, en_US)
- `_quantity` - Define o número de registros a serem retornados
- `_seed` - Define uma semente para o gerador aleatório, garantindo resultados consistentes

### Recursos Testados

- `persons` - Gera pessoas fictícias
- `companies` - Gera empresas fictícias
- `products` - Gera produtos fictícios
- `addresses` - Gera endereços fictícios
- `books` - Gera livros fictícios
- `images` - Gera URLs de imagens
- `custom` - Permite definir campos personalizados

## Relatórios

Os testes geram relatórios HTML na pasta `report/`. Você pode abrir esses arquivos em qualquer navegador para ver os resultados detalhados dos testes.

## Métricas de Desempenho

Os testes coletam métricas como:

- Tempo de resposta
- Taxa de sucesso/falha
- Número de requisições por segundo
- Distribuição de tempos de resposta (percentis)

## Exemplos de Uso

Os scripts foram projetados para demonstrar diferentes aspectos da FakerAPI:

1. Verificação básica de funcionalidade
2. Teste de geração de dados personalizados
3. Análise de desempenho com métricas específicas
4. Simulação de carga variável com padrões realistas de uso

Para mais informações sobre a FakerAPI, consulte a [documentação oficial](https://fakerapi.it/docs). 
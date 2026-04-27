# Provas de conceito: Gestão Financeira

Resumo das provas de conceito em andamento e planejadas. Cada uma investiga um problema específico da gestão financeira de propriedades rurais, ordenadas por prioridade.

## 1. Custos variáveis: Estoque

Estoque de entrada + saída: quando existem erros, eles se tornam uma bola de neve. Os usuários estão desconfortáveis com esse caminho pois não têm um controle detalhado de saída.

**Escopo do experimento:** Estoque de entrada com números e de saída com expectativa de duração pode ser mais fácil.

[Ver prova de conceito detalhada](./inventory/README.md)

## 2. Arquitetura por plugin

A plataforma precisa ser extensível por terceiros — cooperativas, governos, empresas parceiras — sem que o núcleo precise ser alterado para cada nova integração, e sem comprometer a segurança ou a estabilidade do sistema.

**Escopo do experimento:** Um modelo inspirado no VS Code e no Figma, com plugins isolados em Workers e comunicação via API declarada, atende aos requisitos de extensibilidade e segurança.

[Ver prova de conceito detalhada](./plugin/README.md)

## 3. Primeiros acessos

Para calcular o COT (Custo Operacional Total), precisamos das informações de inventário de bens (depreciáveis e apreciáveis). Alimentar o sistema com esse histórico nas primeiras semanas de uso tende a ser a etapa mais trabalhosa e pode afastar os usuários.

**Desafio:** Como tornar esse processo de onboarding simples e intuitivo o suficiente para não afastar os usuários?

## 4. Inventário de bens: Depreciação e Apreciação

Depreciação é parte importante do cálculo do COT. Terra é um bem que tende a apreciar, o que exige tratamento diferente dos demais ativos.

**Questões em aberto:**

- O modelo de cálculo precisa ser validado técnica e praticamente com usuários reais.
- Terra e apreciação são os temas com menor cobertura na nossa base teórica — é necessário aprofundar o estudo antes de definir a implementação.

## 5. Visualização de dados

Sem uma boa visualização de dados históricos, o produtor não consegue conferir lançamentos anteriores, identificar itens não registrados ou comparar preços de produtos ao longo do tempo.

**Escopo do experimento:** Uma visualização dividida por categoria (ex.: alimentação) e subcategoria (ex.: volumoso), com filtros de período, atende às necessidades mais comuns de consulta.

## 6. Custo variável: Divisão entre recria e leite

> **Prioridade: Baixa**

Para calcular o custo com recria, os valores devem ser divididos entre recria e leite.

**Problemas a serem resolvidos:**

- Nem tudo terá como fazer a divisão sempre;
- O produtor pode esquecer de fazer a divisão;
- Como aferir essa informação?

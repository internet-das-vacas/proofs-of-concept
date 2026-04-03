# Provas de conceito: Gestão Financeira

Este documento é um resumo das provas de conceito em andamento. Cada uma investiga uma hipótese específica sobre a gestão financeira de propriedades rurais. As provas estão ordenadas por prioridade.

## 1. Custos variáveis: Estoque

> **Prioridade: Alta** — Primeira prova de conceito implementada.

Estoque de entrada + saída quando existem erros eles se tornam uma bola de neve e os usuários estão desconfortáveis com esse caminho pois não tem um controle detalhado de saída.

**Hipótese:** Estoque de entrada com números e de saída com expectativa de duração pode ser mais fácil.

[Ver prova de conceito detalhada](./inventory/README.md)

## 2. Arquitetura por plugin

Deixar a plataforma o mais plug-and-play possível, com a possibilidade de terceiros criarem plugins e extensões como Figma ou VS Code.

[Ver prova de conceito detalhada](./plugin/README.md)

## 3. Primeiros acessos

> **Prioridade: Alta**

Para fazer o cálculo do COT (Custo Operacional Total), precisamos das informações de inventário de bens (depreciáveis e apreciáveis).

**Hipótese:** As primeiras semanas usando o sistema podem ser as mais complicadas pois é quando o sistema deve ser alimentado com o histórico de bens da propriedade. Como fazer isso o mais simples e intuitivo possível para não afastar os usuários?

## 4. Inventário de bens: Depreciação

Depreciação é uma parte importante do cálculo financeiro para calcular o Custo Operacional Total.

**Hipótese:** Precisamos testar o sistema e nossas contas ao máximo para garantir que estejam fazendo sentido tecnicamente e para os usuários.

## 5. Inventário de bens: Apreciação

Terra é um bem que tende a apreciar.

**Hipótese:** Na nossa base teórica terra e apreciação é o que temos menos informações, precisamos nos aprofundar nesse assunto e entender como lidar com ele da melhor forma possível.

## 6. Custo variável: Divisão entre recria e leite

> **Prioridade: Baixa**

Para fazer o cálculo de custo com recria, os valores devem ser divididos entre recria e leite.

**Problemas a serem resolvidos:**

- Nem tudo terá como fazer a divisão sempre;
- O produtor pode esquecer de fazer a divisão;
- Como aferir essa informação?

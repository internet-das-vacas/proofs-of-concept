# Prova de conceito: Onboarding (Primeiros passos)

Para calcular o COT (Custo Operacional Total), precisamos das informações de inventário de bens (depreciáveis e apreciáveis). Alimentar o sistema com esse histórico nas primeiras semanas de uso tende a ser a etapa mais trabalhosa e pode afastar os usuários.

**Hipótese:** a partir de poucas perguntas básicas sobre a propriedade (terra e rebanho), é possível inferir um "sistema de produção" de referência e usá-lo para pré-preencher o formulário de inventário, reduzindo o esforço do usuário.

Os dados de referência vêm da planilha [`Custo_Leite_Abril_2026 CEPA CONSELEITE.xlsx`](./resources/Custo_Leite_Abril_2026%20CEPA%20CONSELEITE.xlsx), da pesquisa do CONSELEITE de Santa Catarina, que descreve 5 "sistemas" de produção (Sistema 1 a Sistema 5).

## Scripts de pré-execução

Dois scripts processam essa planilha antes do onboarding rodar no navegador:

1. `extract-reference-data.js` lê a planilha e gera os arquivos `resources/reference_*.json` (rebanho, terra, construções, equipamentos, máquinas), um por categoria, com os valores de cada um dos 5 sistemas.
2. `build-system-vectors.js` lê `reference_systems_herd.json` e `reference_systems_land.json` e gera dois arquivos: `reference_systems_ceilings.json` (o maior valor de cada dimensão entre os 5 sistemas, usado como referência de normalização) e `reference_systems_vectors.json` (o vetor normalizado de cada sistema, calculado com a mesma função `app/logic/farm_type_vector.js` usada depois para o vetor da propriedade do usuário).

## Busca vetorial (nearest neighbor)

A cada resposta do formulário "Dados básicos" (terra usada, terra de reserva, rebanho por faixa etária), `onboarding.js` monta um vetor normalizado da propriedade. Esse vetor é comparado por distância euclidiana (`app/logic/nearest_neighbor.js`) contra os vetores dos 5 sistemas de referência.

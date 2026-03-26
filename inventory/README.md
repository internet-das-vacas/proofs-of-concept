# Prova de Conceito: Estoque

**Problema:** Estoque de entrada + saída: quando existem erros, eles se tornam uma bola de neve. Os usuários estão desconfortáveis com esse caminho pois não têm um controle detalhado de saída.

**Hipótese:** Estoque de entrada com números e de saída com expectativa de duração pode ser mais fácil.

## Categorias de custos variáveis e amortização

### Tipos de amortização

- Estoque (ou uso)
- Recorrente (o mesmo valor todos os meses por um ano)
- Uso único (mês do pagamento)
- Anual Regressivo (estoque automatico de um ano para trás)

### Categorias

#### Alimentação

- Volumosos (silagem, pré-secado, feno, pastagem): Estoque (ou uso)
- Concentrados (ração, grãos, farelos): Estoque (ou uso)
- Minerais: Estoque (ou uso)
- Aditivos: Estoque (ou uso)
- Aleitamento (leite ou sucedâneo): Estoque (ou uso)

#### Medicamentos

- Vacina: Estoque (ou uso)
- Vermifugo: Estoque (ou uso)

#### Mão de obra

- Permanente : Recorrente
- Terceirizado: Recorrente
- Assistência técnica: Uso único

#### Serviços públicos

- Energia elétrica: Uso único
- Água e esgoto: Uso único
- Internet: Recorrente

#### Operação mecânica

- Diesel: Estoque (ou uso)
- Reparo: Uso único
- Transportes: Uso único

#### Despesas Financeiras

- Juros : Uso único
- Impostos: Anual Regressivo
- Multas: Uso único

#### Outros

- Estoque (ou uso)
- Recorrente (o mesmo valor todos os meses por um ano)
- Uso único (mês do pagamento)
- Anual Regressivo (estoque automatico de um ano para trás)

---

## Estrutura de dados

Precisamos guardar e manter dados de:

- Movimentações financeiras (separar por categorias)
- Estoques (separar por tipo específico)

A estrutura segue o modelo de double-entry bookkeeping, representado por três entidades: **Accounts**, **Entries** e **Transactions**.

> Referências técnicas utilizadas:
>
> - [Engineers Do Not Get to Make Startup Decisions — Álvaro Durán](https://news.alvaroduran.com/p/engineers-do-not-get-to-make-startup)
> - [Accounting for Computer Scientists — Martin Kleppmann](https://martin.kleppmann.com/2011/03/07/accounting-for-computer-scientists.html)

### Accounts (Contas)

Contas são simultaneamente "baldes" de valor e um ponto de vista particular de como esse valor muda ao longo do tempo.

Num sistema de Double Entry, o total de todos os Lançamentos `entries` não descartados do tipo crédito é igual ao total de todos os Lançamentos do tipo débito. Conceitualmente, isso significa que não importa como você movimenta dinheiro entre seus bolsos — o montante total permanece o mesmo.

Algumas contas `accounts` especiais — aquelas que representam o mundo exterior (consolidadas no Demonstrativo de Resultado - Profit & Loss statement) — são excepcionais: elas não podem ser balanceadas.

Uma Conta `account` tem uma relação de um-para-muitos com Lançamentos `entries`, e seu saldo total deve corresponder à agregação dos saldos individuais de todos os seus Lançamentos `entries`.

Algumas contas são "líquido crédito" (net credit) e outras "líquido débito" (net debit). Mas isso é uma expectativa: o fato de uma conta ser normalmente líquido débito (ex: saldo no banco) não impede que ela fique negativa (ex: cheque especial).

```javascript
{
  [name]: {
    id: "",
    description: "",
    type: "balance-sheet" | "profit-loss" | "depreciation" | "inventory-usage" // uma categoria de custo variável é balance sheet, venda de leite seria profit-loss, depreciação vai ganhando valor de bens depreciaveis e inventory vai ganhando valor de bens com estoque
  }
}
```

### Entries (Lançamentos)

Lançamentos representam o fluxo de recursos entre Contas `accounts`. Eles são sempre uma troca de valor e, portanto, sempre vêm em pares: cada Lançamento representa uma "perna" da troca.

```javascript
{
  id: "",
  date: "",
  amount: {
    currency: "BRL",
    cents: 100,
  },
  type: "inflow" | "outflow" // It need a twin of the opposite type
  account_id: "",
  transaction_id: "",
}
```

### Transactions (Transações)

Transações `transactions` garantem que os Lançamentos `entries` sejam pareados corretamente. O sistema não deve interagir com Lançamentos diretamente, mas através da entidade Transação `transaction`.

Lançamentos são criados em pares, e usamos Transações para garantir que tudo ocorra como esperado:

- Uma Transação só é efetivada quando todos os seus Lançamentos associados são efetivados;
- Uma Transação que falha parcialmente pode ser semanticamente desfeita com Lançamentos compensatórios.

```javascript
// Transaction General object
{
  date: "",
  type: "buy" || "sell" || "invest", // invest é para bens depreciáveis
  description: {
    tags: [], // vaccination
  }
}

// Transaction Financial object
{
  transaction_id: "",
  accounts: {
    source_id: "",
    destination_id: "",
  },
  amount: {
    currency: "BRL",
    cents: 100,
  },
  // No futuro extender para ter installments / dia do pagamento efetivo para poder calcular fluxo de caixa também
}

// Transaction Inventory object
{
  transaction_id: "",
  lifecycle: {
    good_through_date: "" // depreciação para bens e expectativa de duração de estoque para custos variáveis
  }
}
```

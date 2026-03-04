# Prova de conceito: Estoque

Estoque de entrada + saída quando existem erros eles se tornam uma bola de neve e os usuários estão desconfortáveis com esse caminho pois não tem um controle detalhado de saída.

Hipótese: Estoque de entrada com números e de saída com expectativa de duração pode ser mais fácil.  

## Categorias de custos variáveis

### Alimentação

- Volumosos (silagem, pré-secado, feno, pastagem)
- Concentrados (ração, grãos, farelos)
- Minerais
- Aditivos
- Aleitamento (leite ou sucedâneo)

### Medicamentos

- Vacina
- Vermifugo

### Mão de obra

- Permanente
- Terceirizado
- Assistência técnica

### Energia elétrica

### Operação mecânica

- Diesel
- Reparo
- Transportes

### Despesas Financeiras

- Juros
- Impostos
- Multas

### Outros

## Estrutura de dados

Precisamos manter tabs de:

- Movimentações financeiras (separar por categorias)
- Estoques (separar por tipo especifico)

----

Ledgers are conceptually a data model, represented by three entities: Accounts, Entries and Transactions.

### Accounts

Accounts are both buckets of value, and a particular point of view of how its value changes over time.

In a double-entry system, the collective amount of all non-discarded Entries with type credit and the collective amount of all non-discarded Entries with type debit is the same. Conceptually, this means that no matter how you move money in your pockets, the amount will stay the same.

A few special accounts, those that represent the outside world (consolidated into the Profit and Loss statement) are exceptional: They can’t be balanced.

It is associated with multiple Entries in a one-to-many relationship, and the total balance should match the aggregation of all its entries’ individual balances.

Some accounts are meant to be “net credit” and others “net debit”. “Meant to be” is the key here: just because an Account is supposed to be net debit (e.g., the cash in the bank) doesn’t mean it cannot be negative (e.g., overdrawn).

```javascript
{
  name: "",
  type: "balance-sheet" | "profit-loss" | "depreciation" | "inventory-usage" // uma categoria de custo variável é balance sheet, venda de leite seria profit-loss, depreciação vai ganhando valor de bens depreciaveis e inventory vai ganhando valor de bens com estoque
}
```

### Entries

Entries represent the flow of funds between Accounts. Crucially, they are always an exchange of value. Therefore, they always come in pairs: an Entry represents one leg of the exchange.

```javascript
{
  date: "",
  amount: {
    currency: "BRL",
    cents: 100,
  },
  type: "liability" | "asset"
  account_id: "",
}
```

### Transactions

The way we ensure that Entries are paired correctly is with Transactions. Ledgers shouldn’t interact with Entries directly, but through the Transaction entity.

Entries are created in pairs, and we use Transactions to make sure that everything goes how it’s supposed to go:

- A Transaction is posted only when its associated Entries are posted;
- A Transaction that fails partially can be semantically undone with compensating Entries.

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

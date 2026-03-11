import * as infra from "./infrastructure/index.js";
import * as logic from "./logic/index.js";
import * as models from "./models/index.js";

const history = document.getElementById("history");
const expenseForm = document.getElementById("expense");

expenseForm?.addEventListener("submit", (event) => {
  storeTransactionAndEntries(event, infra.database.transactions_state, infra.database.entries_state);
  renderToScreen(history, infra.database.transactions_state, infra.database.entries_state);
});

// Controllers
const storeTransactionAndEntries = (event, transaction_state, entries_state) => {
  event.preventDefault();

  const { date, type, amount, goodThrough } = infra.html.formResponses(event.target);
  const [account_destination, tag] = type.split("_");

  const amount_precise = amount * 100;
  const entry_amount = amount_precise / goodThrough;

  const date_object = new Date(date);
  const date_month = date_object.getMonth();
  const good_through_date_object = new Date(date);
  good_through_date_object.setMonth(date_month + Number(goodThrough));

  const transaction_id = crypto.randomUUID();
  const transaction = logic.double_entry.transaction(
    date_object,
    good_through_date_object,
    tag,
    account_destination,
    amount_precise,
  );

  const entries = logic.double_entry.entries(
    goodThrough,
    date,
    date_month,
    entry_amount,
    transaction_id,
    account_destination,
  );

  transaction_state.content = { [transaction_id]: transaction };
  entries_state.content = entries;
};

const renderToScreen = (renderTarget, transaction_state, entries_state) => {
  const transactions = transaction_state.content;
  const entries = entries_state.assetsPerDate;
  const dates = Object.keys(entries);

  const accountDescriptionByID = Object.keys(models.accounts.model).reduce(
    (acc, account_name) => {
      const account_data = models.accounts.model[account_name];
      return { ...acc, [account_data.id]: account_data.description };
    },
    {},
  );

  const listItems = dates.map((date) => {
    const dom_date_header = infra.html.dom("strong", date);

    const dom_entries_card = entries[date].map((entry) => {
      const amount = `-${
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(entry.amount.precise / 100)
      }`;
      const dom_description = infra.html.dom("small", `Gasto com ${accountDescriptionByID[entry.account_id]}`);
      const dom_title = infra.html.dom("h2", amount, dom_description);

      return dom_title;
    });

    return infra.html.dom("li", dom_date_header, ...dom_entries_card);
  });
  const dom_list = infra.html.dom("ul", ...listItems);
  renderTarget.replaceChildren(dom_list);
};

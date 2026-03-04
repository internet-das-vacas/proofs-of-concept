import * as infra_db from "./infrastructure/database.js";
import * as logic_doubleEntry from "./logic/double_entry.js";
import * as models_accounts from "./models/accounts.js";

const history = document.getElementById("history");
const expenseForm = document.getElementById("expense");

expenseForm?.addEventListener(
  "submit",
  (event) => {
    storeTransactionAndEntries(
      event,
      infra_db.transactions_state,
      infra_db.entries_state,
    );

    renderToScreen(
      history,
      infra_db.transactions_state,
      infra_db.entries_state,
    );
  },
);

// Aux / Util
const formResponses = (form_element) => {
  const target_is_form = form_element instanceof HTMLFormElement;
  if (!target_is_form) return;

  const formData = new FormData(form_element);
  return Object.fromEntries(formData.entries());
};

const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

// Controllers
const storeTransactionAndEntries = (
  event,
  transaction_state,
  entries_state,
) => {
  event.preventDefault();

  const { date, type: categoryAndTag, amount, goodThrough } = formResponses(
    event.target,
  );
  const [account_destination, tag] = categoryAndTag.split("_");

  const amount_precise = amount * 100;
  const entry_amount = amount_precise / goodThrough;

  const date_object = new Date(date);
  const date_month = date_object.getMonth();
  const good_through_date_object = new Date(date);
  good_through_date_object.setMonth(date_month + Number(goodThrough));

  const transaction_id = crypto.randomUUID();
  const transaction = logic_doubleEntry.transactionObject(
    date_object,
    good_through_date_object,
    tag,
    account_destination,
    amount_precise,
  );

  const entries = logic_doubleEntry.entriesList(
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

  const accountDescriptionByID = Object.keys(models_accounts.model).reduce(
    (acc, account_name) => {
      const account_data = models_accounts.model[account_name];
      return { ...acc, [account_data.id]: account_data.description };
    },
    {},
  );

  renderTarget.innerHTML = html`
    <ul>
      ${dates
        .map((date) =>
          html`
            <li>
              <strong>${date}</strong>
              ${entries[date].map((entry) =>
                html`
                  <h2 style="color: crimson">
                    -${new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(
                      entry.amount.precise / 100,
                    )} <small style="color: black">Gasto com ${accountDescriptionByID[
                      entry.account_id
                    ]}</small>
                  </h2>
                `
              ).join("")}
            </li>
          `
        ).join("")}
    </ul>
  `;
};

import * as infra from "./infrastructure/index.js";
import * as logic from "./logic/index.js";
import * as models from "./models/index.js";
import * as util from "./util/index.js";

const history = document.getElementById("history");
const expenseForm = document.getElementById("expense");

expenseForm?.addEventListener(
  "submit",
  (event) => {
    storeTransactionAndEntries(
      event,
      infra.database.transactions_state,
      infra.database.entries_state
    );

    renderToScreen(
      history,
      infra.database.transactions_state,
      infra.database.entries_state
    );
  }
);

// Controllers
const storeTransactionAndEntries = (
  event,
  transaction_state,
  entries_state
) => {
  event.preventDefault();

  const { date, type, amount, goodThrough } = util.form.responses(event.target);
  const [account_destination, tag] = type.split("_");

  const amount_precise = amount * 100;
  const entry_amount = amount_precise / goodThrough;

  const date_object = new Date(date);
  const date_month = date_object.getMonth();
  const good_through_date_object = new Date(date);
  good_through_date_object.setMonth(date_month + Number(goodThrough));

  const transaction_id = crypto.randomUUID();
  const transaction = logic.double_entry.transactionObject(
    date_object,
    good_through_date_object,
    tag,
    account_destination,
    amount_precise
  );

  const entries = logic.double_entry.entriesList(
    goodThrough,
    date,
    date_month,
    entry_amount,
    transaction_id,
    account_destination
  );

  transaction_state.content = { [transaction_id]: transaction };
  entries_state.content = entries;
};

const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

const renderToScreen = (renderTarget, transaction_state, entries_state) => {
  const transactions = transaction_state.content;
  const entries = entries_state.assetsPerDate;
  const dates = Object.keys(entries);

  const accountDescriptionByID = Object.keys(models.accounts.model).reduce(
    (acc, account_name) => {
      const account_data = models.accounts.model[account_name];
      return { ...acc, [account_data.id]: account_data.description };
    },
    {}
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
                      currency: "BRL"
                    }).format(entry.amount.precise / 100)}
                    <small style="color: black">Gasto com ${accountDescriptionByID[entry.account_id]}</small>
                  </h2>
                `
              ).join("")}
            </li>
          `
        ).join("")}
    </ul>
  `;
};

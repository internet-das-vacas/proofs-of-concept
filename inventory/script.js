import * as data from "./data/index.js";
import * as controller from "./controller/index.js";
import * as view from "./view/index.js";

const el_history = document.getElementById("history");
const el_expense_form = document.getElementById("expense");
const el_expense_dialog = document.getElementById("add-expense");
const el_edit_form = document.getElementById("edit");
const el_edit_dialog = document.getElementById("edit-expense");

const transactions_state = data.transactions.state;
const entries_state = data.entries.state;

el_expense_form?.addEventListener("submit", (event) => {
  controller.transaction_and_entries.create(event, transactions_state, entries_state);
  view.transaction_history.render(el_history, el_edit_dialog, transactions_state, entries_state);
  el_expense_dialog.close();
});

el_edit_form?.addEventListener("submit", (event) => {
  controller.transaction_and_entries.update(event, transactions_state, entries_state);
  view.transaction_history.render(el_history, el_edit_dialog, transactions_state, entries_state);
  el_edit_dialog.close();
});

el_edit_dialog.addEventListener("command", (event) => {
  if (event.command !== "show-modal") return;

  const transaction_id = event.source.getAttribute("data-transaction_id");
  view.edit_modal.populate(el_edit_form, transactions_state, transaction_id);
});

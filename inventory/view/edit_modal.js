import * as models from "../models/index.js";
import * as utils from "../utils/index.js";

export const populate = (el_edit_form, transaction_state, transaction_id) => {
  const el_value = document.getElementById("editExpenseAmount");
  const el_description = document.getElementById("editExpenseActivity");
  const input_date = document.getElementById("editDate");
  const input_amount = document.getElementById("editAmount");
  const input_good_through = document.getElementById("editGoodThrough");

  const transaction = transaction_state.byID(transaction_id);
  const transaction_value = transaction.finance.amount.precise;
  const transaction_value_formatted = utils.formatter.preciseToCurrency(transaction_value);
  const transaction_description = models.accounts.descriptionFromID(transaction.finance.accounts.destination_id);
  const transaction_name = models.accounts.nameFromID(transaction.finance.accounts.destination_id);

  el_value.innerText = transaction_value_formatted;
  el_description.innerText = transaction_description;

  input_date.valueAsDate = transaction.general.date;
  input_amount.setAttribute("value", transaction_value / 100);
  input_good_through.setAttribute("value", transaction.inventory.lifecycle.in_months);

  el_edit_form.dataset.transaction_id = transaction_id;
  el_edit_form.dataset.account_destination = transaction_name;
  el_edit_form.dataset.tag = transaction.general.description.tags[0];
};

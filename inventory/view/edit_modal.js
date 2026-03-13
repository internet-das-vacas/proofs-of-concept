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

  el_edit_form.dataset.transaction_id = transaction_id;

  el_value.innerText = utils.formatter.preciseToCurrency(transaction_value);
  el_description.innerText = models.accounts.descriptionByID(transaction.finance.accounts.destination_id);

  input_date.valueAsDate = transaction.general.date;
  input_amount.setAttribute("value", transaction_value / 100);
  input_good_through.setAttribute("value", transaction.inventory.lifecycle.in_months);
};

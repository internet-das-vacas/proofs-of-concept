import * as models from "../models/index.js";
import * as utils from "../utils/index.js";
import * as infra from "../infrastructure/index.js";

export const render = (renderTarget, edit_dialog, transaction_state, entries_state) => {
  const transactions = transaction_state.content;
  const entries = entries_state.assetsPerDate;
  const dates = Object.keys(entries);

  const dom_sections_by_date = dates.map((date) => {
    const entries_of_the_day = entries[date];
    const date_formatted = utils.formatter.stringToDate(date);
    const day_amount_precise = entries_of_the_day.reduce((acc, entry) => acc + entry.amount.precise, 0);
    const day_amount_formatted = utils.formatter.preciseToCurrency(-day_amount_precise);

    const dom_day_amount = infra.html.dom("small", day_amount_formatted);

    const dom_date_header = infra.html.dom("h3", date_formatted, dom_day_amount);

    const dom_entries_list_items = entries_of_the_day.map((entry) => {
      const amount_formatted = utils.formatter.preciseToCurrency(-entry.amount.precise);
      const description_text = `em ${models.accounts.descriptionByID(entry.account_id)}`;

      const transaction_lifecycle_in_months = transactions[entry.transaction_id].inventory.lifecycle.in_months;
      const hasInstallmentPlan = transaction_lifecycle_in_months > 1;
      const dom_installment = hasInstallmentPlan &&
        infra.html.dom("small", `${entry.installment}/${transaction_lifecycle_in_months}`);

      const dom_amount = infra.html.dom("strong", amount_formatted);
      const dom_text_description = infra.html.dom("span", dom_amount, description_text, dom_installment);
      const dom_edit_button = infra.html.dom("button", "✏️ Editar");
      dom_edit_button.command = "show-modal";
      dom_edit_button.commandForElement = edit_dialog;
      dom_edit_button.dataset.transaction_id = entry.transaction_id;

      return infra.html.dom("li", dom_text_description, dom_edit_button);
    });

    const dom_entries_list = infra.html.dom("ul", ...dom_entries_list_items);

    return infra.html.dom("section", dom_date_header, dom_entries_list);
  });

  renderTarget.replaceChildren(...dom_sections_by_date);
};

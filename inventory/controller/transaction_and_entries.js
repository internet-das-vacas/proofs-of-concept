import * as infra from "../infrastructure/index.js";
import { entries } from "../logic/double_entry.js";
import * as logic from "../logic/index.js";

const formData = (form_submit_event) => {
  const form = form_submit_event.target;

  const { date, type, amount, goodThrough } = infra.html.formResponses(form);
  const form_information = { date, type, amount, goodThrough };

  if (type) {
    const [account_destination, tag] = type.split("_");
    form_information.account_destination = account_destination;
    form_information.tag = tag;
  } else {
    form_information.account_destination = form.getAttribute("data-account_destination");
    form_information.tag = form.getAttribute("data-tag");
  }

  form_information.transaction_id = form.getAttribute("data-transaction_id");

  return form_information;
};

const adaptedData = (amount, goodThrough, date, is_a_delete_operation = false) => {
  const amount_precise = is_a_delete_operation ? 0 : (amount * 100);
  const entry_amount = is_a_delete_operation ? 0 : (amount_precise / goodThrough);

  const date_object = new Date(date);
  const date_month = date_object.getMonth();
  const good_through_date_object = new Date(date);
  good_through_date_object.setMonth(date_month + Number(goodThrough));

  return { amount_precise, entry_amount, date_object, date_month, good_through_date_object };
};

export const create = (event, transaction_state, entries_state) => {
  event.preventDefault();
  const { date, amount, goodThrough, account_destination, tag } = formData(event);

  const { amount_precise, entry_amount, date_object, date_month, good_through_date_object } = adaptedData(
    amount,
    goodThrough,
    date,
  );

  const transaction_id = crypto.randomUUID();

  const transaction = logic.double_entry.transaction(
    date_object,
    goodThrough,
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

  transaction_state.append = { [transaction_id]: transaction };
  entries_state.append = entries;
};

export const update = (event, transaction_state, entries_state) => {
  event.preventDefault();
  const { date, amount, goodThrough, account_destination, tag, transaction_id } = formData(event);

  const original_transaction = transaction_state.byID(transaction_id);
  const is_same_transaction = logic.double_entry.is_same_transaction(original_transaction, date, amount, goodThrough);
  if (is_same_transaction) return;

  const is_a_delete_operation = goodThrough === 0;

  const { amount_precise, entry_amount, date_object, date_month, good_through_date_object } = adaptedData(
    amount,
    goodThrough,
    date,
    is_a_delete_operation,
  );

  const transaction = logic.double_entry.transaction(
    date_object,
    goodThrough,
    good_through_date_object,
    tag,
    account_destination,
    amount_precise,
  );

  const transaction_existing_entries = entries_state.byTransactionID(transaction_id);
  const entries_to_negate = logic.double_entry.uniqueEntriesFromTransaction(transaction_existing_entries);

  const entries_negated = entries_to_negate.map((entry) =>
    logic.double_entry.entrySourceAndDestination(
      transaction_id,
      entry.date,
      entry.amount.precise,
      entry.installment,
      "outflow",
      account_destination,
    )
  ).flat();

  const entries_updated = logic.double_entry.entries(
    goodThrough,
    date_object,
    date_month,
    entry_amount,
    transaction_id,
    account_destination,
  );

  transaction_state.append = { [transaction_id]: transaction };
  entries_state.append = entries_negated;
  entries_state.append = entries_updated;
};

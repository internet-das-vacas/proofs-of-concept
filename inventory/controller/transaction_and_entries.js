import * as infra from "../infrastructure/index.js";
import * as logic from "../logic/index.js";

export const create = (event, transaction_state, entries_state) => {
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

  transaction_state.content = { [transaction_id]: transaction };
  entries_state.content = entries;
};

export const update = (event, transaction_state, entries_state) => {
  event.preventDefault();
  const form = event.target;

  const { date, amount, goodThrough } = infra.html.formResponses(form);
  const transaction_id = form.getAttribute("data-transaction_id");
  const original_transaction = transaction_state.byID(transaction_id);

  const is_same_transaction = logic.double_entry.is_same_transaction(original_transaction, date, amount, goodThrough);
  if (is_same_transaction) return;

  const transaction = logic.double_entry.transaction(
    date_object,
    goodThrough,
    good_through_date_object,
    tag,
    account_destination,
    amount_precise,
  );
  transaction_state.content = { [transaction_id]: transaction };

  // TODO: Continue this...

  console.log(date, amount, goodThrough, transaction_id);
};

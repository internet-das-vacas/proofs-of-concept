/**
 * @typedef {Object} entry_model
 * @prop {string} id
 * @prop {import('./amount.js').amount_model} amount
 * @prop {"inflow" | "outflow"} flow // Each entity needs a twin of the opposite type
 * @prop {string} account_id
 * @prop {number} installments
 * @prop {string} transaction_id
 */

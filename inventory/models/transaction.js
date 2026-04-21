// -------------
// General group
// -------------

/**
 * @typedef {Object} general_description
 * @prop {Array<string>} tags
 * @prop {string} text
 */

/**
 * @typedef {Object} general
 * @prop {Date} date
 * @prop {"buy" | "sell" | "invest"} type // invest for deprecable goods
 * @prop {general_description} description
 */

// -------------
// Finance group
// -------------

/**
 * @typedef {Object} finance_accounts
 * @prop {string} source_id
 * @prop {string} destination_id
 */

/**
 * @typedef {Object} finance
 * @prop {finance_accounts} accounts
 * @prop {import('./amount.js').amount_model} amount
 */

// ---------------
// Inventory group
// ---------------

/**
 * @typedef {Object} inventory_lifecycle
 * @prop {Date} good_through_date
 * @prop {number} in_months
 */

/**
 * @typedef {Object} inventory
 * @prop {inventory_lifecycle} lifecycle
 * @prop {number}  quantity
 */

// ---------------
// Transaction
// ---------------

/**
 * @typedef {Object} transaction_model
 * @prop {general} general
 * @prop {finance} finance
 * @prop {inventory} inventory
 */

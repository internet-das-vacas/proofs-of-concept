export const formResponses = (form_element) => {
  const target_is_form = form_element instanceof HTMLFormElement;
  if (!target_is_form) return;

  const formData = new FormData(form_element);
  return Object.fromEntries(formData.entries());
};

const elements = {};

export const dom = (tag, ...nodes) => {
  const element_exists = elements?.[tag];
  if (!element_exists) elements[tag] = document.createElement(tag);

  const node = document.importNode(elements[tag]);
  const nodes_with_content = nodes.filter((node) => !!node);

  node.append(...nodes_with_content);
  return node;
};

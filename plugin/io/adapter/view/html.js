const elements = {};

export const dom = ({ tag, attributes, children }) => {
  const element_exists = elements?.[tag];
  if (!element_exists) elements[tag] = document.createElement(tag);

  const node = document.importNode(elements[tag]);

  if (attributes) {
    const attribute_names = Object.keys(attributes);
    attribute_names.forEach((name) => node[name] = attributes[name]);
  }

  if (children) {
    const nodes_with_content = children.filter?.((node) => !!node) || [children];
    node.append(...nodes_with_content);
  }

  return node;
};

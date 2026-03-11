export const responses = (form_element) => {
  const target_is_form = form_element instanceof HTMLFormElement;
  if (!target_is_form) return;

  const formData = new FormData(form_element);
  return Object.fromEntries(formData.entries());
};

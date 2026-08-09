import vector_ceilings from "./resources/reference_systems_ceilings.json" with { type: "json" };
import vector_systems_reference from "./resources/reference_systems_vectors.json" with { type: "json" };

import * as logic_farmTypeVector from "./app/logic/farm_type_vector.js";
import * as logic_nearestNeighbor from "./app/logic/nearest_neighbor.js";

const form_onboarding = document.getElementById("onboardingBase");
const system_info_panel = document.getElementById("selected_system");

export const formResponses = (form_element) => {
  const formData = new FormData(form_element);
  return Object.fromEntries(formData.entries());
};

form_onboarding.addEventListener("input", (_) => {
  const onboarding_responses = formResponses(form_onboarding);
  const farm_type_vector = logic_farmTypeVector.normalized(onboarding_responses, vector_ceilings);

  const systems_entries = Object.entries(vector_systems_reference);
  const distances_sorted = systems_entries.map((system_entry) => {
    const [name, vector] = system_entry;
    const distance = logic_nearestNeighbor.distance(vector, farm_type_vector);
    return { name, distance };
  }).toSorted((a, b) => a.distance - b.distance);

  const system = distances_sorted[0].name;

  system_info_panel.innerText = system;
});

import vector_ceilings from "./resources/reference_systems_ceilings.json" with { type: "json" };
import vector_systems_reference from "./resources/reference_systems_vectors.json" with { type: "json" };

import reference_buildings from "./resources/reference_buildings.json" with { type: "json" };
import reference_equipement from "./resources/reference_equipement.json" with { type: "json" };
import reference_machines from "./resources/reference_machines.json" with { type: "json" };
const reference_inventory = { ...reference_buildings, ...reference_equipement, ...reference_machines };

import * as logic_farmTypeVector from "./app/logic/farm_type_vector.js";
import * as logic_nearestNeighbor from "./app/logic/nearest_neighbor.js";

const form_onboarding = document.getElementById("onboardingBase");
const system_info_panel = document.getElementById("selected_system");

const INVENTORY_SELECT_KEYS = new Set(["gerador"]);

export const formResponses = (form_element) => {
  const formData = new FormData(form_element);
  return Object.fromEntries(formData.entries());
};

const formatThousands = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "_");

const setFieldValue = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const updateOrdenhadeiraSelect = (system) => {
  const options = [
    "ordenhadeira_balde_ao_pe_c_dois_conjuntos",
    "ordenhadeira_canalizada_c_tres_conjuntos",
    "ordenhadeira_canalizada_c_quatro_conjuntos",
    "ordenhadeira_canalizada_c_seis_conjuntos",
  ];
  const selected = options.find((key) => reference_equipement[key][system] > 0) ?? "";
  setFieldValue(document.getElementById("ordenhadeira"), selected);
};

const updateLitersSelect = (selectId, keyPrefix, litersOptions, system) => {
  const selected = litersOptions.find((liters) => {
    const key = `${keyPrefix}_${formatThousands(liters)}_litros`;
    return reference_equipement[key][system] > 0;
  });
  setFieldValue(document.getElementById(selectId), selected ?? "");
};

const updateGeradorSelect = (system) => {
  const value = reference_equipement.gerador[system];
  setFieldValue(document.getElementById("gerador"), value > 0 ? value : "");
};

const updateInventoryForm = (system) => {
  for (const [key, valuesBySystem] of Object.entries(reference_inventory)) {
    if (INVENTORY_SELECT_KEYS.has(key)) continue;

    const element = document.getElementById(key);
    if (!element) continue;

    setFieldValue(element, valuesBySystem[system] ?? 0);
  }

  updateOrdenhadeiraSelect(system);
  updateLitersSelect(
    "resfriador_c_tanque_de_expansao",
    "resfriador_c_tanque_de_expansao",
    [500, 800, 2000, 5000],
    system,
  );
  updateLitersSelect("pulverizador_de_barras", "pulverizador_de_barras", [400, 600], system);
  updateGeradorSelect(system);
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
  updateInventoryForm(system);
});

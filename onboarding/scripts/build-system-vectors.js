import reference_herd from "../resources/reference_systems_herd.json" with { type: "json" };
import reference_land from "../resources/reference_systems_land.json" with { type: "json" };
import * as logic_farmTypeVector from "../app/logic/farm_type_vector.js";

const RESOURCES_DIR = `${import.meta.dirname}/../resources`;

function writeJson(fileName, data) {
  const outputPath = `${RESOURCES_DIR}/${fileName}`;
  Deno.writeTextFileSync(outputPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Gerado ${fileName}`);
}

function main() {
  const ceilings = {
    land_milk_ceil: reference_land.atividade_leiteira.sistema_5,
    land_others_ceil: reference_land.demais_atividades.sistema_4,
    land_nature_ceil: reference_land.areas_nao_aproveitaveis_ou_reserva.sistema_4,
    herd_cows_ceil: reference_herd.vacas_em_lactacao.sistema_5,
    herd_heifers_ceil: reference_herd.novilhas_em_recria.sistema_5,
    herd_calves_ceil: reference_herd.bezerras_ate_12_meses.sistema_5,
  };
  writeJson("reference_systems_ceilings.json", ceilings);

  const vectors = {};
  for (let n = 1; n <= 5; n++) {
    vectors[`sistema_${n}`] = logic_farmTypeVector.normalized({
      land_milk: reference_land.atividade_leiteira[`sistema_${n}`],
      land_others: reference_land.demais_atividades[`sistema_${n}`],
      land_nature: reference_land.areas_nao_aproveitaveis_ou_reserva[`sistema_${n}`],
      herd_cows: reference_herd.vacas_em_lactacao[`sistema_${n}`],
      herd_heifers: reference_herd.novilhas_em_recria[`sistema_${n}`],
      herd_calves: reference_herd.bezerras_ate_12_meses[`sistema_${n}`],
    }, ceilings);
  }
  writeJson("reference_systems_vectors.json", vectors);
}

main();

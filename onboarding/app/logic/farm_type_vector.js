const clamp = (number, max = 1, min = 0) => Number(Math.max(min, Math.min(number, max)).toFixed(4));

export const normalized = (
  { land_milk, land_others, land_nature, herd_cows, herd_heifers, herd_calves },
  { land_milk_ceil, land_others_ceil, land_nature_ceil, herd_cows_ceil, herd_heifers_ceil, herd_calves_ceil },
) => {
  const farm_type_vector = new Array(6);

  farm_type_vector[0] = clamp(land_milk / land_milk_ceil); // land used for milking related activities
  farm_type_vector[1] = clamp(land_others / land_others_ceil); // land used for other activities
  farm_type_vector[2] = clamp(land_nature / land_nature_ceil); // land not being used
  farm_type_vector[3] = clamp(herd_cows / herd_cows_ceil); // total number of cows
  farm_type_vector[4] = clamp(herd_heifers / herd_heifers_ceil); // total number of heifers
  farm_type_vector[5] = clamp(herd_calves / herd_calves_ceil); // total number of calves

  return farm_type_vector;
};

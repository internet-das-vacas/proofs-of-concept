export const distance = (vector_1, vector_2) => {
  // euclides
  const distances = vector_1.map((item, index) => item - vector_2[index]);
  return Math.hypot(...distances);
};

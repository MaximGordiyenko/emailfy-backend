export const calculateRate = (count, total) => {
  return total > 0 ? (count / total) * 100 : 0;
};

/**
 * Returns a new array containing the same items in random order, using
 * the Fisher–Yates algorithm. Does not mutate the input array.
 *
 * @param {Array<*>} array - The array to shuffle.
 * @returns {Array<*>} A new, randomly-ordered array.
 */
export function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
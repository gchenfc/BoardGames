/**
 * Shuffles array (by copy).
 * Usage:
 *   const shuffled = shuffleArray([1, 2, 3, 4, 5]);
 * 
 * See https://stackoverflow.com/a/12646864/9151520
 */

export default function shuffleArray(array_) {
  const array = [...array_];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

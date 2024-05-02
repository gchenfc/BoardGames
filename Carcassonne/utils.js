// Return an array of connected components
// e.g. "aaabbacc" -> [[0, 1, 2, 5], [3, 4], [6, 7]]
export function cc(string) {
  let ret = [];
  // loop over unique characters in string
  for (let c of new Set(string)) {
    if (c == "_") continue;
    let indices = [];
    for (let i = 0; i < string.length; i++) {
      if (string[i] === c) {
        indices.push(i);
      }
    }
    if (indices.length <= 1) continue;
    ret.push(indices);
  }
  return ret;
}

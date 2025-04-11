/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  return recursiveTrim("", 0, string, size ?? Number.MAX_SAFE_INTEGER);
}

function recursiveTrim(symbol, counter, text, size) {
  if (text.length === 0) {
    return "";
  }
  const letter = text.charAt(0);
  let slicedText = text.slice(1);
  if (size <= 0) {
    return recursiveTrim(letter, 0, slicedText, size);
  }

  if (letter === symbol) {
    if (counter < size) {
      return letter + recursiveTrim(letter, counter + 1, slicedText, size);
    } else {
      return recursiveTrim(letter, counter + 1, slicedText, size);
    }
  }
  return letter + recursiveTrim(letter, 1, slicedText, size);
}

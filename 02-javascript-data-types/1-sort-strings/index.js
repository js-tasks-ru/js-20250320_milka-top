/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let comparator = new Intl.Collator(["ru", "en"], {caseFirst: 'upper'});
  return arr.slice().sort(
    (a, b) => {
      switch (param) {
      case 'asc':
        return comparator.compare(a, b);
      case 'desc':
        return comparator.compare(b, a);
      }
    }
  );
}

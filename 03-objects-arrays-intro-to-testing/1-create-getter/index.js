/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let fields = path.split('.');
  return obj => {
    let current = obj;
    for (let field of fields) {
      if (!current.hasOwnProperty(field)) {
        return undefined;
      }
      current = current[field];
    }
    return current;
  };
}

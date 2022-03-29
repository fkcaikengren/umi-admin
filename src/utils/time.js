export function format(ISOString) {
  const d = new Date(ISOString);
  return `${d.getFullYear()}-${d.getDate()}-${
    d.getMonth() + 1
  } ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

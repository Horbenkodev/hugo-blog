export const parseCookie = (str) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, [key, val]) => {
      acc[decodeURIComponent(key.trim())] = decodeURIComponent(val.trim());
      return acc;
    }, {});

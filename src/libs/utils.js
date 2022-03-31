import maxBy from 'lodash/maxBy';

export function chunkLeft(str, size = 6) {
  if (typeof str === 'string') {
    const length = str.length;
    const chunks = Array(Math.ceil(length / size));
    for (let i = 0, index = 0; index < length; i++) {
      chunks[i] = str.slice(index, (index += size));
    }
    return chunks;
  }
}

export function countHexColors(hexColors) {
  return chunkLeft(hexColors).reduce((memo, color) => {
    const colorUpperCase = color.toUpperCase();
    if (!(colorUpperCase in memo)) {
      memo[colorUpperCase] = 0;
    }

    memo[colorUpperCase]++;

    return memo;
  }, {});
}

export function getPrimaryHexColor(hexColors) {
  return maxBy(Object.entries(countHexColors(hexColors)), ([color, count]) => count)[0];
}

// https://stackoverflow.com/a/50512049
export const hexToRGB = (hex, alpha = 1) => {
  let parseString = hex;
  if (hex.startsWith('#')) {
    parseString = hex.slice(1, 7);
  }
  if (parseString.length !== 6) {
    return null;
  }
  const r = parseInt(parseString.slice(0, 2), 16);
  const g = parseInt(parseString.slice(2, 4), 16);
  const b = parseInt(parseString.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function shortenTzAddress(address) {
  return `${address.substr(0, 5)}…${address.substr(-5)}`;
}

export const hexColorsToPng = (hexColors) => {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext('2d');
  const rgb = hexColors.match(/.{1,6}/g).map((x) => '#' + x);
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      ctx.fillStyle = rgb[x + y * 8];
      ctx.fillRect(x * 2, y * 2, 2, 2);
    }
  }
  return c.toDataURL('image/png');
};

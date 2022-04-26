import maxBy from 'lodash/maxBy';
import get from 'lodash/get';
import { PIXEL_FORMAT, COLOR_FORMAT } from '../consts';

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

export function getUsername(data, field) {
  return get(data, `${field}_profile.twitter`) ? `@${get(data, `${field}_profile.twitter`)}` : shortenTzAddress(data[`${field}_address`]);
}

export const hexColorsToPng = (hexColors) => {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  const rgb = hexColors.match(/.{1,6}/g).map((x) => '#' + x);
  const pixelSize = Math.floor(32 / PIXEL_FORMAT);
  const borderSize = 32 % PIXEL_FORMAT;

  for (let x = 0; x < PIXEL_FORMAT + borderSize; x++) {
    for (let y = 0; y < PIXEL_FORMAT + borderSize; y++) {
      if (x < borderSize || y < borderSize || x > 32 - borderSize || y > 32 - borderSize) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = rgb[x - borderSize + (y - borderSize) * PIXEL_FORMAT];
      }

      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
  return c.toDataURL('image/png');
};

export function shortenTzAddress(address) {
  return `${address.substr(0, 5)}…${address.substr(-5)}`;
}

const utf8decoder = new TextDecoder();

export const toHex = (str) => {
  if (COLOR_FORMAT === 'monochrome') {
    // thank you cables.and.pixels, for this code snippet!
    const ints = str.match(/.{1,2}/g).map((v) => parseInt(v, 16));
    return utf8decoder
      .decode(new Uint8Array(ints))
      .match(/.{1,2}/g)
      .map((v) => `${v}${v}${v}`)
      .join('');
  }

  return str;
};

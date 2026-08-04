import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const require = createRequire(import.meta.url);
const openFont = require('next/dist/compiled/@next/font/dist/fontkit').default;

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, '../src/app');
const svgPath = path.join(appDirectory, 'icon.svg');
const fontPath = path.resolve(scriptDirectory, '../src/assets/font/AlimamaFangYuanTiVF-Thin.ttf');

readFileSync(svgPath, 'utf8');

const PALETTE = {
  ink: [29, 29, 31, 255],
  dark: [38, 50, 68, 255],
  pearl: [247, 249, 252, 255],
  silver: [203, 213, 225, 255],
  blue: [41, 151, 255, 255],
  white: [255, 255, 255, 255],
};

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

const mixColor = (from, to, amount) =>
  from.map((channel, index) => Math.round(channel + (to[index] - channel) * clamp(amount, 0, 1)));

const blendColor = (bottom, top, opacity) => mixColor(bottom, top, clamp(opacity, 0, 1));

const radialBlend = (color, tint, x, y, centerX, centerY, radius, maximumOpacity) => {
  const distance = Math.hypot(x - centerX, y - centerY);
  const opacity = (1 - clamp(distance / radius, 0, 1)) ** 1.7 * maximumOpacity;
  return blendColor(color, tint, opacity);
};

const distanceToSegment = (x, y, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : clamp(((x - x1) * dx + (y - y1) * dy) / lengthSquared, 0, 1);
  const nearestX = x1 + t * dx;
  const nearestY = y1 + t * dy;
  return Math.hypot(x - nearestX, y - nearestY);
};

const distanceToPolyline = (x, y, points) => {
  let distance = Number.POSITIVE_INFINITY;
  for (let index = 1; index < points.length; index += 1) {
    const [x1, y1] = points[index - 1];
    const [x2, y2] = points[index];
    distance = Math.min(distance, distanceToSegment(x, y, x1, y1, x2, y2));
  }
  return distance;
};

const insideRoundedRectangle = (x, y, left, top, width, height, radius) => {
  const nearestX = clamp(x, left + radius, left + width - radius);
  const nearestY = clamp(y, top + radius, top + height - radius);
  return Math.hypot(x - nearestX, y - nearestY) <= radius;
};

const insidePolygon = (x, y, points) => {
  let inside = false;
  for (let current = 0, previous = points.length - 1; current < points.length; previous = current, current += 1) {
    const [currentX, currentY] = points[current];
    const [previousX, previousY] = points[previous];
    const crosses =
      currentY > y !== previousY > y &&
      x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
};

const cArc = [];
for (let degrees = 44; degrees <= 316; degrees += 2) {
  const radians = (degrees * Math.PI) / 180;
  cArc.push([250 + Math.cos(radians) * 170, 250 + Math.sin(radians) * 170]);
}

const font = openFont(readFileSync(fontPath));
const glyph = font.glyphForCodePoint('兮'.codePointAt(0));
const glyphTransform = ([x, y]) => [145 + x * 0.22, 350 - y * 0.22];

const flattenGlyph = (commands) => {
  const contours = [];
  let contour = null;
  let current = [0, 0];
  let start = [0, 0];

  const beginContour = (point) => {
    contour = [glyphTransform(point)];
    contours.push(contour);
    current = point;
    start = point;
  };

  for (const { command, args } of commands) {
    if (command === 'moveTo') {
      beginContour([args[0], args[1]]);
      continue;
    }

    if (!contour) continue;

    if (command === 'lineTo') {
      current = [args[0], args[1]];
      contour.push(glyphTransform(current));
      continue;
    }

    if (command === 'quadraticCurveTo') {
      const [controlX, controlY, endX, endY] = args;
      const [startX, startY] = current;
      for (let step = 1; step <= 12; step += 1) {
        const t = step / 12;
        const inverse = 1 - t;
        contour.push(
          glyphTransform([
            inverse * inverse * startX + 2 * inverse * t * controlX + t * t * endX,
            inverse * inverse * startY + 2 * inverse * t * controlY + t * t * endY,
          ]),
        );
      }
      current = [endX, endY];
      continue;
    }

    if (command === 'bezierCurveTo') {
      const [control1X, control1Y, control2X, control2Y, endX, endY] = args;
      const [startX, startY] = current;
      for (let step = 1; step <= 16; step += 1) {
        const t = step / 16;
        const inverse = 1 - t;
        contour.push(
          glyphTransform([
            inverse ** 3 * startX +
              3 * inverse * inverse * t * control1X +
              3 * inverse * t * t * control2X +
              t ** 3 * endX,
            inverse ** 3 * startY +
              3 * inverse * inverse * t * control1Y +
              3 * inverse * t * t * control2Y +
              t ** 3 * endY,
          ]),
        );
      }
      current = [endX, endY];
      continue;
    }

    if (command === 'closePath') {
      contour.push(glyphTransform(start));
      current = start;
    }
  }

  return contours;
};

const glyphContours = flattenGlyph(glyph.path.commands);

const insideGlyph = (x, y) => {
  if (x < 148 || x > 362 || y < 170 || y > 375) return false;
  let inside = false;
  for (const contour of glyphContours) {
    if (insidePolygon(x, y, contour)) inside = !inside;
  }
  return inside;
};

const glyphEdgeDistance = (x, y) => {
  let distance = Number.POSITIVE_INFINITY;
  for (const contour of glyphContours) distance = Math.min(distance, distanceToPolyline(x, y, contour));
  return distance;
};

const samplePearl = (x, y) => {
  const diagonal = clamp((x * 0.42 + y * 0.58 - 24) / 464, 0, 1);
  let color = mixColor(PALETTE.pearl, PALETTE.silver, diagonal);
  color = radialBlend(color, PALETTE.white, x, y, 144, 104, 330, 0.72);
  color = radialBlend(color, PALETTE.blue, x, y, 102, 424, 300, 0.14);
  color = radialBlend(color, [135, 150, 170, 255], x, y, 430, 406, 250, 0.1);
  return color;
};

const sampleColor = (x, y) => {
  if (!insideRoundedRectangle(x, y, 24, 24, 464, 464, 132)) return [0, 0, 0, 0];

  let color = samplePearl(x, y);

  const insideWhiteRim = insideRoundedRectangle(x, y, 31, 31, 450, 450, 125);
  const insideDarkRim = insideRoundedRectangle(x, y, 34, 34, 444, 444, 122);
  if (!insideWhiteRim) color = blendColor(color, PALETTE.white, 0.78);
  else if (!insideDarkRim) color = blendColor(color, [115, 129, 150, 255], 0.14);

  const shadowDistance = distanceToPolyline(x - 4, y - 9, cArc);
  if (shadowDistance <= 40) color = blendColor(color, PALETTE.dark, 0.2);

  const cDistance = distanceToPolyline(x, y, cArc);
  if (cDistance <= 40) color = blendColor(color, [96, 112, 134, 255], 0.3);
  if (cDistance <= 36) color = blendColor(color, [232, 240, 248, 255], 0.38);
  if (cDistance >= 27 && cDistance <= 36) color = blendColor(color, PALETTE.white, 0.44);
  if (cDistance <= 23) color = blendColor(color, [223, 233, 243, 255], 0.2);
  if (cDistance >= 25 && cDistance <= 33 && x + y < 430) color = blendColor(color, PALETTE.white, 0.7);
  if (cDistance >= 25 && cDistance <= 33 && y > 315) {
    color = blendColor(color, [96, 112, 134, 255], 0.18);
  }

  if (insideGlyph(x - 4, y - 7)) color = blendColor(color, PALETTE.dark, 0.2);
  if (insideGlyph(x, y)) {
    color = blendColor(color, PALETTE.ink, 0.86);
    if (y < 255) color = blendColor(color, [86, 98, 115, 255], 0.16);
    if (glyphEdgeDistance(x, y) < 4 && x + y < 510) color = blendColor(color, PALETTE.white, 0.24);
  }

  return color;
};

const render = (size) => {
  const supersampling = 4;
  const pixels = Buffer.alloc(size * size * 4);
  const scale = 512 / size;

  for (let pixelY = 0; pixelY < size; pixelY += 1) {
    for (let pixelX = 0; pixelX < size; pixelX += 1) {
      const totals = [0, 0, 0, 0];

      for (let sampleY = 0; sampleY < supersampling; sampleY += 1) {
        for (let sampleX = 0; sampleX < supersampling; sampleX += 1) {
          const x = (pixelX + (sampleX + 0.5) / supersampling) * scale;
          const y = (pixelY + (sampleY + 0.5) / supersampling) * scale;
          const color = sampleColor(x, y);
          for (let channel = 0; channel < 4; channel += 1) totals[channel] += color[channel];
        }
      }

      const pixelOffset = (pixelY * size + pixelX) * 4;
      const sampleCount = supersampling * supersampling;
      for (let channel = 0; channel < 4; channel += 1) {
        pixels[pixelOffset + channel] = Math.round(totals[channel] / sampleCount);
      }
    }
  }

  return pixels;
};

const crcTable = Array.from({ length: 256 }, (_, tableIndex) => {
  let value = tableIndex;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const pngChunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
};

const encodePng = (size, pixels) => {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;

  const rows = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    rows[rowOffset] = 0;
    pixels.copy(rows, rowOffset + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
};

const pngs = new Map([16, 32, 48, 180].map((size) => [size, encodePng(size, render(size))]));
writeFileSync(path.join(appDirectory, 'apple-icon.png'), pngs.get(180));

const faviconSizes = [16, 32, 48];
const directorySize = 6 + faviconSizes.length * 16;
let imageOffset = directorySize;
const iconHeader = Buffer.alloc(directorySize);
iconHeader.writeUInt16LE(0, 0);
iconHeader.writeUInt16LE(1, 2);
iconHeader.writeUInt16LE(faviconSizes.length, 4);

faviconSizes.forEach((size, index) => {
  const png = pngs.get(size);
  const entryOffset = 6 + index * 16;
  iconHeader[entryOffset] = size;
  iconHeader[entryOffset + 1] = size;
  iconHeader[entryOffset + 2] = 0;
  iconHeader[entryOffset + 3] = 0;
  iconHeader.writeUInt16LE(1, entryOffset + 4);
  iconHeader.writeUInt16LE(32, entryOffset + 6);
  iconHeader.writeUInt32LE(png.length, entryOffset + 8);
  iconHeader.writeUInt32LE(imageOffset, entryOffset + 12);
  imageOffset += png.length;
});

writeFileSync(
  path.join(appDirectory, 'favicon.ico'),
  Buffer.concat([iconHeader, ...faviconSizes.map((size) => pngs.get(size))]),
);

console.log('Generated pearl Liquid Glass C + authentic Xi glyph icons.');

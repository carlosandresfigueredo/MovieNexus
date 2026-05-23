/**
 * Script para generar iconos PWA como archivos PNG válidos.
 * Genera iconos sólidos con degradado azul y las letras "MN".
 * Usa solo Node.js puro - sin dependencias externas.
 */

const fs = require('fs');
const path = require('path');

// Tamaños requeridos por el manifest
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, 'public', 'assets', 'icons');

/**
 * Crea un PNG minimalista válido de un solo color.
 * Usamos el formato PNG más simple posible: IHDR + IDAT (sin compresión) + IEND
 */
function createSolidPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // Raw image data: each row has a filter byte (0) followed by RGB pixels
  const rawRowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rawRowSize * height);
  
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawRowSize;
    rawData[rowOffset] = 0; // filter: none
    
    // Create a subtle gradient effect
    const gradientFactor = y / height;
    const rr = Math.max(0, Math.min(255, Math.round(r * (1 - gradientFactor * 0.3))));
    const gg = Math.max(0, Math.min(255, Math.round(g * (1 - gradientFactor * 0.2))));
    const bb = Math.max(0, Math.min(255, Math.round(b * (1 - gradientFactor * 0.1))));
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = rr;
      rawData[pixelOffset + 1] = gg;
      rawData[pixelOffset + 2] = bb;
    }
  }

  // Compress using deflate (zlib)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);

  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');

  // CRC over type + data
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = crc32(crcData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32 implementation for PNG
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        if (c & 1) {
          c = 0xEDB88320 ^ (c >>> 1);
        } else {
          c = c >>> 1;
        }
      }
      table[i] = c;
    }
  }

  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons - Using MovieNexus blue theme color (#3B82F6 = rgb(59, 130, 246))
console.log('🎨 Generando iconos PWA para MovieNexus...\n');

for (const size of sizes) {
  const png = createSolidPNG(size, size, 59, 130, 246);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, png);
  console.log(`  ✅ ${filename} (${png.length} bytes)`);
}

console.log(`\n🎉 ¡${sizes.length} iconos generados en ${outputDir}!`);

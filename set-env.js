const fs = require('fs');

// El contenido que tendrá tu archivo de entorno
// process.env.API_KEY leerá la variable que configuraste en Vercel
const envConfigFile = `export const environment = {
  production: true,
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: '${process.env.API_KEY}',
  imgPath: 'https://image.tmdb.org/t/p'
};
`;

// Crear la carpeta environments si no existe
const targetFolderPath = './src/environments';
if (!fs.existsSync(targetFolderPath)) {
  fs.mkdirSync(targetFolderPath, { recursive: true });
}

// Crear el archivo environment.ts
const targetPath = './src/environments/environment.ts';
fs.writeFileSync(targetPath, envConfigFile);
console.log(`✅ Archivo environment.ts generado correctamente en Vercel.`);

// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const unzipper = require('unzipper');
const path = require('path');
const respuestasRoute = require('./routes/respuestas');
const whatsappRoute = require('./routes/enviarWhatsapp');

// Configurar variables de entorno
dotenv.config();

// Restaurar sesión de WhatsApp desde ZIP si no existe
const restoreSession = async () => {
  const zipPath = path.join(__dirname, 'wwebjs_auth.zip');
  const sessionPath = path.join(__dirname, '.wwebjs_auth');

  const sessionExists = fs.existsSync(sessionPath);
  const zipExists = fs.existsSync(zipPath);

  if (sessionExists) {
    // Verificamos si la sesión es válida o está vacía
    const sessionFiles = fs.readdirSync(sessionPath);
    if (sessionFiles.length === 0) {
      console.log('⚠️ Carpeta de sesión vacía. Restaurando desde ZIP...');
      await fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: sessionPath }))
        .promise();
      console.log('✅ Sesión restaurada desde ZIP');
    } else {
      console.log('🔒 Sesión ya presente. No se restaura ZIP');
    }
  } else if (zipExists) {
    console.log('🟡 No hay sesión. Restaurando desde ZIP...');
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: sessionPath }))
      .promise();
    console.log('✅ Sesión restaurada desde ZIP');
  } else {
    console.log('❌ No se encontró sesión ni ZIP para restaurar');
  }
};

// Ejecutar restauración antes de iniciar el servidor
(async () => {
  await restoreSession();
})();


const app = express();

// Servir archivos estáticos (QR incluido)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://seguimiento-frontend.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json()); // Para leer JSON en el body

// Rutas
app.use('/respuestas', respuestasRoute);
app.use('/enviar-whatsapp', whatsappRoute);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en puerto ${PORT}`);
});

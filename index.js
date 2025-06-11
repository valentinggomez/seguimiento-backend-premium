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
  const zipPath = './wwebjs_auth.zip';
  const sessionPath = './.wwebjs_auth';

  if (!fs.existsSync(sessionPath)) {
    console.log('🟡 Restaurando sesión desde ZIP...');
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: sessionPath }))
      .promise();
    console.log('✅ Sesión restaurada correctamente');
  } else {
    console.log('🔒 Sesión ya existente. No se restaura ZIP');
  }
};

// Ejecutar restauración antes de iniciar el servidor
await restoreSession();

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

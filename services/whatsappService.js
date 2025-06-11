const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: '.wwebjs_auth' }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async qr => {
  console.log('🟨 Escaneá este QR en: /qr.png');
  try {
    await qrcode.toFile('./public/qr.png', qr);
  } catch (err) {
    console.error('❌ Error al generar imagen QR:', err);
  }
});

client.on('ready', () => {
  console.log('✅ WhatsApp conectado');
});

client.initialize();

function formatearNumero(raw) {
  return `549${raw.replace(/\D/g, '')}@c.us`;
}

async function enviarMensaje(paciente, link) {
  const numero = formatearNumero(paciente.telefono);
  const mensaje = `👋 Hola ${paciente.nombre}, gracias por operarte con nosotros.

🗓 Cirugía: ${paciente.cirugia}
📅 Fecha: ${paciente.fecha_cirugia.split('-').reverse().join('/')}

Por favor completá el formulario de seguimiento postoperatorio en este link:
${link}

Muchas gracias – UDAP 🏥`;

  try {
    await client.sendMessage(numero, mensaje);
    console.log('📤 WhatsApp enviado a', numero);
  } catch (err) {
    console.error('❌ Error al enviar WhatsApp:', err);
  }
}

module.exports = { enviarMensaje };

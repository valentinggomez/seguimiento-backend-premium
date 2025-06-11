const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});


client.on('qr', qr => {
  console.log('🟨 Escaneá este QR con WhatsApp Web');
  qrcode.generate(qr, { small: true });
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

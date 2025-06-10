const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', qr => {
  console.log('🟨 Escaneá este QR con WhatsApp Web');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp conectado');

  const numero = '5492954657641@c.us'; // Reemplazá por TU número sin + ni espacios
  const mensaje = 'Hola! Este es tu formulario postoperatorio: https://seguimiento.vercel.app/form?id=ABC123';

  client.sendMessage(numero, mensaje)
    .then(() => console.log('📨 Mensaje enviado correctamente'))
    .catch(err => console.error('❌ Error al enviar:', err));
});

client.initialize();

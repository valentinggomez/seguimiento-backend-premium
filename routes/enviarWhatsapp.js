const express = require('express');
const router = express.Router();
const { enviarMensaje } = require('../services/whatsappService');

router.post('/', async (req, res) => {
  try {
    const { nombre, telefono, cirugia, fecha_cirugia, link } = req.body;

    if (!nombre || !telefono || !link || !cirugia || !fecha_cirugia) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    await enviarMensaje({ nombre, telefono, cirugia, fecha_cirugia }, link);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar WhatsApp:', error);
    res.status(500).json({ error: 'Error al enviar WhatsApp' });
  }
});

module.exports = router;

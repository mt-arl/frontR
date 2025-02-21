const express = require('express');
const router = express.Router();
const microphoneController = require('../controllers/microphoneControllers');

// Ruta para crear un nuevo micrófono
router.post('/create', microphoneController.createMicrophone);
router.get('/', microphoneController.getAllMicrophone);

module.exports = router;

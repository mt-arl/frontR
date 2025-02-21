const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Obtener todas las transacciones (incluye el campo calculado "investment")
router.get('/transactions', stockController.getAllTransactions);

// Obtener transacción por ID (pendiente de implementar en el controlador)
// router.get('/:id', stockController.getTransactionById);

// Crear una nueva transacción
router.post('/new', stockController.createTransaction);

// Actualizar una transacción (pendiente de implementar en el controlador)
// router.put('/:id', stockController.updateTransaction);

// Eliminar una transacción (pendiente de implementar en el controlador)
// router.delete('/:id', stockController.deleteTransaction);

module.exports = router;

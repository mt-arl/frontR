const pool = require('../config/db');

const stockController = {
  // Registra una nueva transacción
  createTransaction: async (req, res) => {
    try {
      const { stockSymbol, quantity, purchasePrice, purchaseTransFee, saleTransFee } = req.body;

      // Validación de datos requeridos
      if (
        !stockSymbol ||
        quantity === undefined ||
        purchasePrice === undefined ||
        purchaseTransFee === undefined ||
        saleTransFee === undefined
      ) {
        return res.status(400).json({ message: 'Todos los campos requeridos deben ser proporcionados.' });
      }

      // Validación de valores numéricos
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity debe ser un número positivo.' });
      }

      if (isNaN(purchasePrice) || purchasePrice <= 0) {
        return res.status(400).json({ message: 'Purchase Price debe ser mayor a 0.' });
      }

      if (isNaN(purchaseTransFee) || purchaseTransFee < 0) {
        return res.status(400).json({ message: 'Purchase Transaction Fee no puede ser negativo.' });
      }

      if (isNaN(saleTransFee) || saleTransFee < 0) {
        return res.status(400).json({ message: 'Sale Transaction Fee no puede ser negativo.' });
      }

      // Inserción en la base de datos (la columna "investment" se calcula automáticamente)
      const [result] = await pool.query(
        `INSERT INTO transactions 
          (stock_symbol, quantity, purchase_price, purchase_trans_fee, sale_trans_fee)
         VALUES (?, ?, ?, ?, ?)`,
        [stockSymbol, quantity, purchasePrice, purchaseTransFee, saleTransFee]
      );

      res.status(201).json({
        message: 'Transacción creada exitosamente.',
        transactionId: result.insertId,
      });
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // Obtiene todas las transacciones, incluyendo el campo calculado "investment"
  getAllTransactions: async (req, res) => {
    try {
      const [transactions] = await pool.query('SELECT * FROM transactions');
      res.json(transactions);
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  },
};

module.exports = stockController;

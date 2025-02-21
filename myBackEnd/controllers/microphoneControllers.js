const pool = require('../config/db');

const microphoneControllers = {

    createMicrophone: async (req, res) => {
    try {
      const { serial_number, brand, model, pieces, is_new, price, purchase_date } = req.body;

      // Validación de datos
      if (!serial_number || !brand || !model || !pieces || is_new === undefined || !price || !purchase_date) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (isNaN(pieces) || pieces <= 0) {
        return res.status(400).json({ message: 'Pieces must be a positive number.' });
      }

      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Price must be a valid number greater than 0.' });
      }

      // Inserción en la base de datos
      const [result] = await pool.query(
        `INSERT INTO microphone (serial_number, brand, model, pieces, is_new, price, purchase_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [serial_number, brand, model, pieces, is_new, price, purchase_date]
      );

      res.status(201).json({
        message: 'Successfully created microphone',
        microphoneId: result.insertId,
      });
    } catch (error) {
      console.error('Microphone Creation Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
   getAllMicrophone: async (req, res) => {
          try {
            const [microphones] = await pool.query('SELECT * FROM microphone');
              res.json(microphones);
          } catch (error) {
              res.status(500).json({ message: 'Error fetching microphones', error: error.message });
          }
      },

};

module.exports = microphoneControllers;

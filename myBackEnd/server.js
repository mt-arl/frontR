const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const microphoneRoutes = require('./routes/microphoneRoutes'); 
const stockRoutes = require('./routes/stockRoutes'); 


const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/microphones', microphoneRoutes); 
app.use('/api/vinil', userRoutes);
app.use('/api/stocks/purchase', stockRoutes);
app.use('/api/stocks', stockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;

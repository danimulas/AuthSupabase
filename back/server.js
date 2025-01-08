require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const connectDB = require('./db'); 
const UserModel = require('./models/User');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to verify the JWT token
const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No se proporcionó un token.' });
    }
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Error de Supabase:', error?.message || 'Usuario no encontrado');
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Error interno del servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Endpoint to manage the webhook from Supabase and save the user in MongoDB
app.post('/handle-user', async (req, res) => {
  try {
    const { record } = req.body;
  
    if (!record || !record.id || !record.email) {
      return res.status(400).json({ error: 'Faltan datos requeridos: id o email' });
    }
  
    const { id: supabaseId, email } = record;
  
    // Search for an existing user on MongoDB
    const existingUser = await UserModel.findOne({ supabaseId });
  
    if (existingUser) {
      return res.status(200).json({ message: 'El usuario ya existe', user: existingUser });
    }
  
    const newUser = new UserModel({
      supabaseId,
      email,
    });
  
    await newUser.save();
  
    res.status(201).json({ message: 'Usuario guardado en MongoDB', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint protected by JWT, who returns the user's email saved in MongoDB
app.get('/protected/hello', verifyJWT, async (req, res) => {
  
  try {
    // Obtain the user ID from the token
    const userId = req.user?.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario no encontrado en el token' });
    }

    // Search for the user in MongoDB
    const user = await UserModel.findOne({ supabaseId: userId });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log('Usuario encontrado, email:', user.email);
    // Return the user's email
    res.json({ message: 'Usuario encontrado', email: user.email });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Start the server
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

const mongoose = require('mongoose');

// Esquema del usuario
const userSchema = new mongoose.Schema({
  supabaseId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
});

// Modelo de usuario
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

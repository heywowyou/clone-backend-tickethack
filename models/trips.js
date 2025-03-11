const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
});

const Trip = mongoose.model('Trips', tripSchema);

module.exports = Trip;
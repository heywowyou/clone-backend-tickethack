const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://warren9555:xr6Z5bEVJumU7zzq@cluster0.kh3se.mongodb.net/TicketHack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));

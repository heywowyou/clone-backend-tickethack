const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
  bookedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "trips" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;

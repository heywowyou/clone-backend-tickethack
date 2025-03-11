var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Trip = require("../models/trips");

// Get all users
router.get("/", async function (req, res) {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found." });
  }

  res.status(200).json({ users });
});


/* Generate fake user
router.post("/create", async (req, res) => {
  const username = "Alice";
  const password = "Elk";
  const allTrips = await Trip.find();

  const shuffledTrips = allTrips.sort(() => 0.5 - Math.random());
  const cart = shuffledTrips.slice(0, 2).map((trip) => trip._id);
  const bookedTrips = shuffledTrips.slice(2, 4).map((trip) => trip._id);

  const user = new User({
    username,
    password,
    cart,
    bookedTrips,
  });

  await user.save();
  res.json({ message: "User created successfully", user });
}); */

module.exports = router;

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

// Add a trip to the user's cart
router.post("/:userId/cart", async (req, res) => {
  const { tripId } = req.body;
  const user = await User.findById(req.params.userId);
  const trip = await Trip.findById(tripId);

  if (!user || !trip) {
    return res.status(404).json({ message: "User or trip not found" });
  }

  // Add trip to cart if it's not already there
  if (!user.cart.includes(tripId)) {
    user.cart.push(tripId);
    await user.save();
  }

  res.status(200).json({ message: "Trip added to cart", cart: user.cart });
});

// Checkout: Move trips from cart to bookedTrips
router.post("/:userId/checkout", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Move trips from cart to bookedTrips
  user.bookedTrips.push(...user.cart);
  user.cart = [];
  await user.save();

  res
    .status(200)
    .json({ message: "Checkout successful", bookedTrips: user.bookedTrips });
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

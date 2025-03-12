var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Trip = require("../models/trips");
const session = require("express-session");

// Find session id
router.get("/session", async (req, res) => {
  const user = await User.findOne({ sessionId: { $ne: null } });
  if (user && user.sessionId) {
    res.json({ sessionId: user.sessionId });
  } else {
    res.status(404).json({ message: "No active session found" });
  }
});

// Get all users
router.get("/", async function (req, res) {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found." });
  }

  res.status(200).json({ users });
});

// get user by sessionid
router.get("/:sessionId", async (req, res) => {
  const user = await User.findOne({ sessionId: req.params.sessionId });
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: "No user found" });
  }
});

// Get users's cart
router.get("/:sessionId/cart", async (req, res) => {
  const { sessionId } = req.params;

  const user = await User.findOne({ sessionId }).populate("cart");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ cart: user.cart });
});

// Add a trip to the user's cart
router.post("/:sessionId/cart", async (req, res) => {
  const { tripId } = req.body;
  const user = await User.findOne({ sessionId: req.params.sessionId });
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
router.post("/:sessionId/checkout", async (req, res) => {
  const user = await User.findOne({ sessionId: req.params.sessionId });
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

// Get all user's trips
router.get("/:sessionId/bookings", async (req, res) => {
  const { sessionId } = req.params;

  const user = await User.findOne({ sessionId }).populate("bookedTrips");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ bookings: user.bookedTrips });
});

// Remove a trip from the user's cart
router.delete("/:sessionId/cart/:tripId", async (req, res) => {
  const { sessionId, tripId } = req.params;

  const user = await User.findOne({ sessionId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cart = user.cart.filter((id) => id.toString() !== tripId);
  await user.save();

  res.status(200).json({ message: "Trip removed from cart", cart: user.cart });
});

router.post("/CreateAccount", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Please provide username and password" });
    return;
  }

  const user = await User.findOne({ username });

  if (user) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  const newUser = new User({ username, password });

  try {
    await newUser.save();

    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
    };

    res.status(200).json({ message: "Account created successfully" });
  } catch {}
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier les informations d'identification de l'utilisateur
    const user = await User.findOne({ username: username, password: password });

    if (!user) {
      return res.status(401).send({ message: "Utilisateur non trouvé" });
    }

    if (user.password !== password) {
      return res.status(401).send({ message: "Mot de passe incorrect" });
    }

    // Enregistrer l'ID de session dans la base de données
    user.sessionId = req.sessionID; // `req.sessionID` contient l'ID de la session

    // Sauvegarder l'utilisateur avec l'ID de session
    await user.save();

    // Créer une session pour l'utilisateur
    req.session.user = user; // Enregistrer l'utilisateur dans la session

    res.send({ message: "Connexion réussie" });
  } catch (err) {
    res.status(500).send({ message: "erreur serveur" });
  }
});

module.exports = router;

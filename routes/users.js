var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Trip = require("../models/trips");
const session = require("express-session");

// Get all users
router.get("/", async function (req, res) {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found." });
  }

  res.status(200).json({ users });
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
      return res.status(401).send("Utilisateur non trouvé");
    }

    // Enregistrer l'ID de session dans la base de données
    user.sessionId = req.sessionID; // `req.sessionID` contient l'ID de la session

    // Sauvegarder l'utilisateur avec l'ID de session
    await user.save();

    // Créer une session pour l'utilisateur
    req.session.user = user; // Enregistrer l'utilisateur dans la session

    res.send("Connexion réussie");
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
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

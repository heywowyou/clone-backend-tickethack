var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Trip = require("../models/trips");

/* GET All trips */
router.get("/trips", function (req, res, next) {
  res.status(200).json({ message: "All good" });
});

// Get trips by names
router.get("/trips/:departure/:arrival", async function (req, res) {
  const { departure, arrival } = req.params;

  // Find trips using departure and arrival data
  const trips = await Trip.find({ departure, arrival });

  if (trips.length === 0) {
    return res.status(404).json({ message: "No trips found." });
  }

  res.status(200).json(trips);
});

module.exports = router;

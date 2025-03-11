var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");
const Trip = require("../models/trips");

/* GET All trips */
router.get("/trips", async function (req, res) {
  const trips = await Trip.find();

  if (trips.length === 0) {
    return res.status(404).json({ message: "No trips available." });
  }

  res.status(200).json(trips);
});

// Get trips by names
router.get("/trips/:departure/:arrival/:date", async function (req, res) {
  const { departure, arrival, date } = req.params;

  const formattedDate = moment(date, "YYYY-MM-DD").startOf("day"); // Commence à minuit
  const endOfDay = moment(formattedDate).endOf("day");

  const trips = await Trip.find({
    departure,
    arrival,
    date: { $gte: formattedDate.toDate(), $lte: endOfDay.toDate() },
  });

  if (trips.length === 0) {
    return res.status(404).json({ message: "No trips found." });
  }

  res.status(200).json({ trips });
});

module.exports = router;

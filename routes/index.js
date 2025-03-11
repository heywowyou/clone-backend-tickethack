var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Trip = require('../models/trips');

/* GET All trips */
router.get('/trips', function(req, res, next) {
res.status(200).json({message: "All good"});
});


//get trips by names 
router.get('/trips/:departure/:arrival', function(req, res, next) {


});



module.exports = router;

const express = require("express");

const getWeather = require("./get-weather");
const router = express.Router();

router.use("/get-weather", getWeather);

module.exports = router;

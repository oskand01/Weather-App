const express = require("express");
const axios = require("axios");

const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Prevent spamming requests
const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 6, // limit each IP to 2 requests per windowMs
});

const speedLimiter = slowDown({
  windowMs: 30 * 1000, // 30 seconds
  delayAfter: 1, // allow 1 requests per 1 minute, then...
  delayMs: 300, // begin adding 100ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

const router = express.Router();

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

let cachedData;
let cacheTime;
let cacheCity;
let searches = [];

const apiKeys = new Map();
apiKeys.set("12345", true);

router.get(
  "/:city",
  limiter /* 
  speedLimiter, */,
  /* (req, res, next) => {
    const apiKey = req.get("X-API-KEY");
    if (apiKeys.has(apiKey)) {
      next();
    } else {
      const Error = new Error("Invalid API Key");
      next(error);
    }
  }, */
  async (req, res, next) => {
    // in memory cache
    if (
      cacheTime &&
      cacheCity === req.params.city.toLowerCase() &&
      cacheTime > Date.now() - 300 * 1000
    ) {
      return res.json(cachedData);
    }
    try {
      const params = new URLSearchParams({
        q: req.params.city,
        appid: process.env.API_KEY,
        units: "metric",
      });

      // make api request
      const { data } = await axios.get(`${BASE_URL}${params}`);
      cacheCity = req.params.city.toLowerCase();
      cacheTime = Date.now();
      console.log(data.cod);

      let weather;

      if (data.cod === 200) {
        //console.log(data)

        weather = {
          success: true,
          city: data.name,
          iconId: data.weather[0].icon,
          temp: parseFloat(data.main.temp).toFixed(1),
          windSpeed: data.wind.speed.toFixed(1),
          humidity: data.main.humidity,
          country: data.sys.country,
          clouds: data.weather[0].description,
          feelsLike: parseFloat(data.main.feels_like).toFixed(1),
        };
        cachedData = weather;
        searches.push(weather);
        console.log("Searches: ", searches);
        res.json(weather);
      }
    } catch (error) {
      weather = {
        success: false,
        
      };
      res.json(weather);
      next(error);
    }
  }
);

module.exports = router;

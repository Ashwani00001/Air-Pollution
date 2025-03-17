require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;  


app.use(cors());
app.use(express.json());


app.get("/api/air-pollution", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }

        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await axios.get(url);

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


app.get("/api/get-coordinates", async (req, res) => {
    try {
        const { city, country } = req.query;

        if (!city || !country) {
            return res.status(400).json({ error: "City and Country are required" });
        }

        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${API_KEY}`;
        const response = await axios.get(url);

        if (response.data.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }

        res.json(response.data[0]); 
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch coordinates" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

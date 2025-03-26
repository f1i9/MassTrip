const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get('/api/location', async (req, res) => {
  try {
    // getting user's location based on their IP address
    const ipResponse = await axios.get('http://ip-api.com/json');
    const { lat, lon } = ipResponse.data;
    console.log(ipResponse.data);
    res.json({ latitude: lat, longitude: lon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

app.get('/api/nearby', async (req, res) => {
  const { lat, lng, radius = 1500, type = 'restaurant' } = req.query;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);

    const places = response.data.results.map(place => ({
      name: place.name,
      vicinity: place.vicinity,
      location: place.geometry.location,
    }));

    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get nearby locations' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
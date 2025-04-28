const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;
const cors = require('cors');


app.use(cors());

app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get('/api/location', async (req, res) => {
  try {
    // getting user's location based on their IP address
    const ipResponse = await axios.get('http://ip-api.com/json');
    const { lat, lon } = ipResponse.data;
    // console.log(ipResponse.data);
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

    console.log(response.data)

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

app.get('/api/autocomplete', async (req, res) => {
  const input = req.query.input;
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}&components=country:us|administrative_area:MA`;

  try {
    const response = await axios.get(googleMapsUrl);
    res.json(response.data.predictions);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    res.status(500).json({ error: 'Failed to get autocomplete results' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
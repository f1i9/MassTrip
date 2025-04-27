const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Use the Azure-provided port or default to 3001 locally
const port = process.env.PORT || 3001;

const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY is not set in environment variables.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());


app.get('/api/location', async (req, res) => {
  try {
    const ipResponse = await axios.get('http://ip-api.com/json');
    const { lat, lon } = ipResponse.data;
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

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

//Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

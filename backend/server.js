import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;
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

app.get('/api/autocomplete', async (req, res) => {
  const input = req.query.input;
  console.log("Received input:", input);
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`;
  console.log("Requesting URL:", googleMapsUrl);

  try {
    const response = await axios.get(googleMapsUrl);
    res.json(response.data.predictions);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    res.status(500).json({ error: 'Failed to get autocomplete results' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

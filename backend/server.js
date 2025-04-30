import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Needed for ES Modules (__dirname simulation)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
dotenv.config();

const app = express();

// Use Azure provided PORT, or default to 3001 locally
const port = process.env.PORT || 3001;

// Load the Google API Key
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY is not set in environment variables.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// === API Routes ===

// Support both with and without trailing slash
app.get(['/api/location', '/api/location/'], async (req, res) => {
  try {
    const ipResponse = await axios.get('http://ip-api.com/json');
    const { lat, lon } = ipResponse.data;
    res.json({ latitude: lat, longitude: lon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

app.get(['/api/nearby', '/api/nearby/'], async (req, res) => {
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

app.get(['/api/autocomplete', '/api/autocomplete/'], async (req, res) => {
  const input = req.query.input;
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(googleMapsUrl);
    res.json(response.data.predictions);
  } catch (error) {
    console.error('Error fetching data from Google Maps API:', error);
    res.status(500).json({ error: 'Failed to get autocomplete results' });
  }
});

// === Serve Static Frontend Files ===
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback route: serve index.html for all non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// === Start the Server ===
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

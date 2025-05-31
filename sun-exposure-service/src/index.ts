import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { calculateSunExposure } from './sunExposure';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.post('/sun-exposure', async (req, res) => {
  const { latitude, longitude, datetime } = req.body;
  
  if (!latitude || !longitude || !datetime) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await calculateSunExposure(latitude, longitude, datetime);
    res.json(result);
  } catch (error) {
    console.error('Error calculating sun exposure:', error);
    res.status(500).json({ error: 'Failed to calculate sun exposure' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Sun exposure service listening at http://0.0.0.0:${port}`);
}); 
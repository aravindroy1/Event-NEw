const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Environment variables fallback for local dev
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/booking-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Model
const BookingSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Booking = mongoose.model('Booking', BookingSchema);

// Routes
app.get('/booking', async (req, res) => {
  try {
    const items = await Booking.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/booking', async (req, res) => {
  try {
    const newItem = new Booking(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/booking/:id', async (req, res) => {
  try {
    const item = await Booking.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/booking/:id', async (req, res) => {
  try {
    const item = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/booking/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check inside route as required? Let's just put it at root
app.get('/', (req, res) => {
  res.send('booking-service is running!');
});

app.listen(PORT, () => {
  console.log(`booking-service running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Environment variables fallback for local dev
const PORT = process.env.PORT || 3006;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notification-service';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Model
const NotificationSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Notification = mongoose.model('Notification', NotificationSchema);

// Routes
app.get('/notifications', async (req, res) => {
  try {
    const items = await Notification.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/notifications', async (req, res) => {
  try {
    const newItem = new Notification(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notifications/:id', async (req, res) => {
  try {
    const item = await Notification.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/notifications/:id', async (req, res) => {
  try {
    const item = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/notifications/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check inside route as required? Let's just put it at root
app.get('/', (req, res) => {
  res.send('notification-service is running!');
});

app.listen(PORT, () => {
  console.log(`notification-service running on port ${PORT}`);
});

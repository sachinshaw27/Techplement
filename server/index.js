const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quotesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const quoteSchema = new mongoose.Schema({
  quote: String,
  author: String,
});

const Quote = mongoose.model('Quote', quoteSchema);


// Get random quote
app.get('/api/random-quote', async (req, res) => {
  const count = await Quote.countDocuments();
  const random = Math.floor(Math.random() * count);
  const quote = await Quote.findOne().skip(random);
  res.json(quote);
});

// Get all authors
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await Quote.distinct('author');
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors', error);
    res.status(500).send('Error fetching authors');
  }
});

// Get quotes by author
app.get('/api/quotes', async (req, res) => {
  const { author } = req.query;
  try {
    const quotes = await Quote.find({ author });
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes', error);
    res.status(500).send('Error fetching quotes');
  }
});

// Add new quote
app.post('/api/quotes', async (req, res) => {
  const { quote, author } = req.body;
  if (!quote || !author) {
    return res.status(400).send('Quote and author are required.');
  }

  try {
    const newQuote = new Quote({ quote, author });
    await newQuote.save();
    res.status(201).send(newQuote);
  } catch (error) {
    console.error('Error adding quote', error);
    res.status(500).send('Error adding quote');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

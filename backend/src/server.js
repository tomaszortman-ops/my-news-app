// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Parser = require('rss-parser');
const feeds = require('../config/feeds');

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err.message));

const articleSchema = new mongoose.Schema({
  title: String,
  link: { type: String, unique: true },
  summary: String,
  pubDate: Date,
  topic: String,
  source: String,
  image: String
});
const Article = mongoose.model('Article', articleSchema);

const parser = new Parser();

async function fetchAllFeeds() {
  console.log('Fetching latest news...');
  for (const feed of feeds) {
    try {
      const data = await parser.parseURL(feed.url);
      for (const item of data.items.slice(0, 20)) {
        await Article.updateOne(
          { link: item.link },
          {
            title: item.title || 'No title',
            link: item.link,
            summary: item.contentSnippet || item.content || '',
            pubDate: item.isoDate ? new Date(item.isoDate) : new Date(),
            topic: feed.topic,
            source: new URL(feed.url).hostname,
	    image: item.enclosure?.url || item['media:content']?.url || null
          },
          { upsert: true }
        );
      }
    } catch (e) {
      console.log(`Failed: ${feed.url}`);
    }
  }
  console.log('Done fetching');
}

// Run every 15 minutes
cron.schedule('*/15 * * * *', fetchAllFeeds);

// API endpoint
app.get('/api/articles', async (req, res) => {
  const topics = req.query.topics ? req.query.topics.split(',') : [];
  const query = topics.length > 0 ? { topic: { $in: topics } } : {};
  const articles = await Article.find(query).sort({ pubDate: -1 }).limit(50);
  res.json(articles);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  fetchAllFeeds(); // first run immediately
});
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
  fullText: String,  // Add this line for storing extracted full text
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
// Require the utility at the top of server.js (add with other requires)
const { getFullArticleText } = require('./utils/getFullText');

// New endpoint for fetching full text
app.get('/api/full-article/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (article.fullText) {
      return res.json({ fullText: article.fullText });
    }

    const fullText = await getFullArticleText(article.link);
    if (fullText) {
      article.fullText = fullText;
      await article.save();
    }

    res.json({ fullText: fullText || 'Full text not available for this article.' });
  } catch (e) {
    res.status(500).json({ error: 'Error fetching full text' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  fetchAllFeeds(); // first run immediately
});
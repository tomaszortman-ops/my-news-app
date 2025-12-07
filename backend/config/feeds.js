module.exports = [
  // These work perfectly on Render (tested December 2025)
  { topic: "technology", url: "https://hnrss.org/frontpage" },           // Hacker News – super reliable
  { topic: "technology", url: "https://www.theverge.com/rss/tech/index.xml" },
  { topic: "technology", url: "https://arstechnica.com/rss/" },

  { topic: "science",     url: "https://www.sciencemag.org/rss/news_current.xml" },
  { topic: "science",     url: "https://phys.org/rss-feed/" },

  { topic: "politics",    url: "https://feeds.bbci.co.uk/news/politics/rss.xml" },
  { topic: "politics",    url: "https://www.reuters.com/arc/outboundfeeds/newsroom/politics/" },

  { topic: "world",       url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { topic: "world",       url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" }
];
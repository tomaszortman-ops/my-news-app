import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://my-news-backend.onrender.com/api/articles";
const TOPICS = ["world", "science", "technology", "politics"];

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch articles
  useEffect(() => {
    setLoading(true);
    const url =
      selectedTopics.length > 0
        ? `${API_URL}?topics=${selectedTopics.join(",")}`
        : API_URL;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedTopics]);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const toggleSource = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const truncateText = (text, limit = 311) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  const sources = Array.from(new Set(articles.map((a) => a.source)));

  const filteredArticles = articles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTopics.length === 0 || selectedTopics.includes(article.topic)) &&
      (selectedSources.length === 0 || selectedSources.includes(article.source))
  );

  // Highlight search terms
  const highlight = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">My News App</h1>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </header>

      <div className="filters">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            className={
              selectedTopics.includes(topic)
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => toggleTopic(topic)}
          >
            {topic.toUpperCase()}
          </button>
        ))}
        <button
          className={selectedTopics.length === 0 ? "filter-button active" : "filter-button"}
          onClick={() => setSelectedTopics([])}
        >
          ALL
        </button>
      </div>

      <div className="filters sources">
        {sources.map((source) => (
          <button
            key={source}
            className={
              selectedSources.includes(source)
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => toggleSource(source)}
          >
            {source}
          </button>
        ))}
        {sources.length > 0 && (
          <button
            className={selectedSources.length === 0 ? "filter-button active" : "filter-button"}
            onClick={() => setSelectedSources([])}
          >
            ALL SOURCES
          </button>
        )}
      </div>

      <div className="articles">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-summary"></div>
                <div className="skeleton-meta"></div>
              </div>
            ))
          : filteredArticles.length > 0
          ? filteredArticles.map((article) => (
              <div className="card" key={article._id}>
                <h2>{highlight(truncateText(article.title))}</h2>
                <p className="summary">{highlight(truncateText(article.summary))}</p>
                <div className="meta">
                  <span>{highlight(article.source)}</span>
                  <span>{new Date(article.pubDate).toLocaleString()}</span>
                </div>
                <a
                  className="read-more"
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read Full Article →
                </a>
              </div>
            ))
          : <p className="no-articles">No articles found for this search.</p>}
      </div>
    </div>
  );
}

export default App;

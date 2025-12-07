import './App.css';
import { useEffect, useState } from 'react';

const API_URL = 'https://my-news-backend.onrender.com/api/articles';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Latest News</h1>

      {articles.length === 0 && <p>Loading...</p>}

      {articles.map((item) => (
        <div key={item._id} style={{ marginBottom: "20px" }}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <h3>{item.title}</h3>
          </a>
          <p>{item.summary}</p>
          <small>
            <strong>{item.source}</strong> — {new Date(item.pubDate).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;

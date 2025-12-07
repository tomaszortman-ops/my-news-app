import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const API_URL = 'https://my-news-backend.onrender.com/api/articles'; // CORRECT endpoint

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {data ? JSON.stringify(data.slice(0, 3), null, 2) : "Loading..."}
        </p>
      </header>
    </div>
  );
}

export default App;

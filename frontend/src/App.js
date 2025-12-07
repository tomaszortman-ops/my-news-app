import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const API_URL = 'https://my-news-backend.onrender.com'; // <- add this line

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/your-endpoint') // replace '/your-endpoint' with your backend route
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {data ? JSON.stringify(data) : "Loading..."}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

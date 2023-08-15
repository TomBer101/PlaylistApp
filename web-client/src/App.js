import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import PlaylistPage from './pages/PlaylistPage';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1 className='App-header'>Sound Card</h1>
      <Router>
        <PlaylistPage />
      </Router>
    </div>
  );
}

export default App;

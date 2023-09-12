import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PlaylistPage from './pages/PlaylistPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1 className='App-header'>Sound Card</h1>
      <Router>
          <Routes>
            <Route path='/playlist-page' element={<PlaylistPage />} />
            <Route path='/admin' element={<AdminPage />}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;

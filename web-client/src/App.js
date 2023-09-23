import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PlaylistPage from './pages/PlaylistPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1 className='App-header'>Sound Card</h1>
      <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/playlist-page' element={<PlaylistPage />} />
            <Route path='/admin' element={<AdminPage />}/> 
            {/* here i want the /admin could be accessed only after auth. so the base will be '/' and then redirected by it */}
          </Routes>
      </Router>
    </div>
  );
}

export default App;

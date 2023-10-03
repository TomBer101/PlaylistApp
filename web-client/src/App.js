import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {PlaylistPage,AdminPage} from './pages';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1 className='App-header'>Sound Card</h1>
          <Routes>
            <Route path='/' element={ <AdminPage />} />
            <Route path='/playlist-page/' element={<PlaylistPage />} />
          </Routes>
    </div>
  );
}

export default App;

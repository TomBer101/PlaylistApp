import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {PlaylistPage,AdminPage, Login, Signup } from './pages';
import ProtectedRoute from './components/auth/ProtectedRout'; 
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className="App">
    <h1 className='App-header'>Sound Card</h1>
          <Routes>
            {/* <Route path="/" exact element={<HomePage />} /> */}
            <Route path='/' element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>}/> 
            <Route path='/playlist-page' element={<PlaylistPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* here i want the /admin could be accessed only after auth. so the base will be '/' and then redirected by it */}
          </Routes>
    </div>
  );
}

export default App;

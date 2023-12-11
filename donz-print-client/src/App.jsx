import React, { useState, useEffect } from 'react';
import RoutesList from './pages/RoutesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <RoutesList />
    </BrowserRouter>
  )
}

export default App

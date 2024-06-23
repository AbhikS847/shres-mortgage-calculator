// src/App.js
import React from 'react';
import './App.css';
import MortgageCalculator from './components/MortgageCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MortgageCalculator />
      </header>
    </div>
  );
}

export default App;
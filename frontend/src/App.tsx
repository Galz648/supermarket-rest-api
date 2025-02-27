import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Placeholder components - these would be implemented in separate files
const Home = () => <div>Home Page</div>;
const SupermarketList = () => <div>Supermarket List</div>;
const SupermarketDetail = () => <div>Supermarket Detail</div>;
const ItemList = () => <div>Item List</div>;
const ItemDetail = () => <div>Item Detail</div>;
const PriceComparison = () => <div>Price Comparison</div>;
const ShoppingList = () => <div>Shopping List</div>;

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Israeli Supermarket Data Query</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/supermarkets" element={<SupermarketList />} />
            <Route path="/supermarkets/:id" element={<SupermarketDetail />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/compare" element={<PriceComparison />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Israeli Supermarket Data Query</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 

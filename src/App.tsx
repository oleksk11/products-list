import React from 'react';
import './App.css';
import ProductsPage from './components/ProductsPage/ProductsPage';
import { BrowserRouter, Route } from 'react-router-dom';
import { Product, generateProducts } from './functions/functions';

function App() {
  let products: Product[] = generateProducts();
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Route exact path='/' render={() => <ProductsPage products={products} />} />
      </div>
    </BrowserRouter>
  );
}
export default App;

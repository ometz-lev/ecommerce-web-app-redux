import {Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import CheckOut from './components/CheckOut';

function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<HomePage />} />  // Home page route
      <Route path="/products" element={<ProductList />} />     // Product listing route
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/checkout" element={<CheckOut />} />
    </Routes>
    </>
  );

}

export default App;

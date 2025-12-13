import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Routes, Route } from "react-router";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { use } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    axios.get("/api/cart-items?expand=product").then((response) => {
      setCart(response.data);
    });
  });
  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} />} />
      <Route path="orders" element={<OrdersPage />} />
    </Routes>
  );
}

export default App;

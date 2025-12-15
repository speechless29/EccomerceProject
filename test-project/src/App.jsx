import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { Routes, Route } from "react-router";
import { CheckoutPage } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/order/OrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };
  useEffect(() => {
    loadCart();
  });
  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} loadCart={loadCart} />} />
      <Route
        path="checkout"
        element={<CheckoutPage cart={cart} loadCart={loadCart} />}
      />
      <Route path="orders" element={<OrdersPage cart={cart} />} />
    </Routes>
  );
}

export default App;

import axios from "axios";
import { Header } from "../../components/Header";
import "./HomePage.css";
import { useEffect, useState } from "react";
import { ProductsGrid } from "./ProductsGrid";

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (err) {
        // if backend isn't available (deployed static), fall back to bundled JSON
        try {
          const local = await axios.get("/api/products.json");
          setProducts(local.data);
        } catch (e) {
          console.error(
            "Failed to load products from /api/products and /api/products.json",
            e
          );
        }
      }
    };
    getHomeData();
  }, []);

  return (
    <>
      <title>Homepage</title>
      <Header cart={cart} />
      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}

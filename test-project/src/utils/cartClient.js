import axios from "axios";

const LOCAL_KEY = "local-cart-items";

// Use Vite env var `VITE_API_BASE_URL` for backend URL when deployed.
// If not provided, requests use the same origin (useful for local dev).
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const apiClient = axios.create({ baseURL: API_BASE });

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export async function loadCart() {
  try {
    const response = await apiClient.get("/api/cart-items?expand=product");
    return response.data;
  } catch (e) {
    const items = readLocal();
    if (items.length === 0) return [];
    // try to attach product objects from bundled products.json
    try {
      // Always fetch the bundled static JSON from the frontend origin
      const resp = await axios.get("/api/products.json");
      const products = resp.data || [];
      return items.map((it) => {
        if (it.product) return it;
        const prod = products.find((p) => p.id === it.productId);
        return { ...it, product: prod || null };
      });
    } catch (e2) {
      return items.map((it) => ({ ...it, product: it.product || null }));
    }
  }
}

export async function addCartItem(productId, quantity = 1, product) {
  try {
    await apiClient.post("/api/cart-items", { productId, quantity });
  } catch (e) {
    const items = readLocal();
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(quantity);
    } else {
      items.push({ productId, quantity: Number(quantity), product });
    }
    writeLocal(items);
  }
}

export async function updateCartItem(productId, updates = {}) {
  try {
    await apiClient.put(`/api/cart-items/${productId}`, updates);
  } catch (e) {
    const items = readLocal();
    const idx = items.findIndex((i) => i.productId === productId);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      writeLocal(items);
    }
  }
}

export async function deleteCartItem(productId) {
  try {
    await apiClient.delete(`/api/cart-items/${productId}`);
  } catch (e) {
    const items = readLocal().filter((i) => i.productId !== productId);
    writeLocal(items);
  }
}

export function clearLocalCart() {
  writeLocal([]);
}

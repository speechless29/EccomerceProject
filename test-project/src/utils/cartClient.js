import axios from "axios";

const LOCAL_KEY = "local-cart-items";

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
    const response = await axios.get("/api/cart-items?expand=product");
    return response.data;
  } catch (e) {
    const items = readLocal();
    return items.map((it) => {
      // ensure product property exists for UI
      return { ...it, product: it.product };
    });
  }
}

export async function addCartItem(productId, quantity = 1, product) {
  try {
    await axios.post("/api/cart-items", { productId, quantity });
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
    await axios.put(`/api/cart-items/${productId}`, updates);
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
    await axios.delete(`/api/cart-items/${productId}`);
  } catch (e) {
    const items = readLocal().filter((i) => i.productId !== productId);
    writeLocal(items);
  }
}

export function clearLocalCart() {
  writeLocal([]);
}

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables before importing any modules that depend on them
dotenv.config({ path: path.join(__dirname, ".env") });

// Dynamic imports ensure dotenv runs first
const expressModule = await import("express");
const corsModule = await import("cors");
const fs = await import("fs");

const express = expressModule.default;
const cors = corsModule.default;

const { sequelize } = await import("./models/index.js");
const productRoutes = (await import("./routes/products.js")).default;
const deliveryOptionRoutes = (await import("./routes/deliveryOptions.js"))
  .default;
const cartItemRoutes = (await import("./routes/cartItems.js")).default;
const orderRoutes = (await import("./routes/orders.js")).default;
const resetRoutes = (await import("./routes/reset.js")).default;
const paymentSummaryRoutes = (await import("./routes/paymentSummary.js"))
  .default;

const { Product } = await import("./models/Product.js");
const { DeliveryOption } = await import("./models/DeliveryOption.js");
const { CartItem } = await import("./models/CartItem.js");
const { Order } = await import("./models/Order.js");

const { defaultProducts } = await import("./defaultData/defaultProducts.js");
const { defaultDeliveryOptions } =
  await import("./defaultData/defaultDeliveryOptions.js");
const { defaultCart } = await import("./defaultData/defaultCart.js");
const { defaultOrders } = await import("./defaultData/defaultOrders.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve images from the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/delivery-options", deliveryOptionRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/payment-summary", paymentSummaryRoutes);

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route to serve index.html for any unmatched routes
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "dist", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
/* eslint-enable no-unused-vars */

// Sync database and load default data if none exist
await sequelize.sync();

const productCount = await Product.count();
if (productCount === 0) {
  const timestamp = Date.now();

  const productsWithTimestamps = defaultProducts.map((product, index) => ({
    ...product,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map(
    (option, index) => ({
      ...option,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index),
    }),
  );

  const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  const ordersWithTimestamps = defaultOrders.map((order, index) => ({
    ...order,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index),
  }));

  await Product.bulkCreate(productsWithTimestamps);
  await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
  await CartItem.bulkCreate(cartItemsWithTimestamps);
  await Order.bulkCreate(ordersWithTimestamps);

  console.log("Default data added to the database.");
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

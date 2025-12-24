import express from "express";
import { DeliveryOption } from "../models/DeliveryOption.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const expand = req.query.expand;
    const deliveryOptions = await DeliveryOption.findAll();

    const base = deliveryOptions.map((opt) =>
      typeof opt.toJSON === "function" ? opt.toJSON() : { ...opt }
    );

    const wantsEstimated =
      expand === "estimatedDeliveryTimeMs" ||
      expand === "estimatedDeliveryTime" ||
      expand === "true";

    if (wantsEstimated) {
      const now = Date.now();

      const response = base.map((option) => {
        const days = Number(option.deliveryDays);
        const safeDays = Number.isFinite(days) ? days : 0;

        return {
          ...option,
          estimatedDeliveryTimeMs:
            now + Math.round(safeDays * 24 * 60 * 60 * 1000),
        };
      });

      return res.json(response);
    }

    return res.json(base);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load delivery options" });
  }
});

export default router;

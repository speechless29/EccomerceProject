import "./CheckoutPage.css";
import "./checkout-header.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { OrderSummary } from "./OrderSummary";
import { PaymentSummary } from "./PaymentSummary";

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        let response = await axios.get(
          "/api/delivery-options?expand=estimatedDeliveryTime"
        );
        setDeliveryOptions(response.data);
      } catch (e) {
        try {
          const local = await axios.get("/api/delivery-options.json");
          setDeliveryOptions(local.data);
        } catch (e) {
          setDeliveryOptions([]);
        }
      }

      try {
        const resp = await axios.get("/api/payment-summary");
        setPaymentSummary(resp.data);
      } catch (e) {
        // compute payment summary locally from cart + deliveryOptions
        const computePaymentSummary = () => {
          const totalItems = cart.reduce((s, it) => s + Number(it.quantity), 0);
          const productCostCents = cart.reduce(
            (s, it) => s + Number(it.quantity) * Number(it.product.priceCents),
            0
          );
          // choose cheapest delivery option per item (if any)
          const shippingCostCents = cart.reduce((s, it) => {
            const opt = deliveryOptions.find(
              (d) => d.id === it.deliveryOptionId
            );
            const price = opt ? Number(opt.priceCents) : 0;
            return s + price;
          }, 0);
          const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
          const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
          return {
            totalItems,
            productCostCents,
            shippingCostCents,
            totalCostBeforeTaxCents,
            taxCents,
            totalCostCents: totalCostBeforeTaxCents + taxCents,
          };
        };
        setPaymentSummary(computePaymentSummary());
      }
    };
    fetchCheckoutData();
  }, [cart]);

  return (
    <>
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              3 items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />

          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}

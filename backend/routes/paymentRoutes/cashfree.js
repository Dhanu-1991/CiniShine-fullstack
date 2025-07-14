import express from "express";
import payment from "../../controllers/payment-gateway-controllers/payment.js";
import paymentVerify from "../../controllers/payment-gateway-controllers/payment-verify.js";
import paymentWebhook from "../../controllers/payment-gateway-controllers/payment-webhook.js";
const router = express.Router();

router.post("/payment", payment);
router.post("/payment-verify", paymentVerify);
router.post("/payment-webhook", paymentWebhook);
//http://localhost:5000/api/v1/payments/payment-webhook
router.post("/webhook", express.json({ type: "*/*" }), paymentWebhook); // 👈 necessary to read raw body

export default router;

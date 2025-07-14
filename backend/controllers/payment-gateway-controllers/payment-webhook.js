// backend/controllers/payment-gateway-controllers/payment-webhook.js

const paymentWebhook = (req, res) => {
  const event = req.body?.event;
  const order = req.body?.data?.order;

  console.log("🔔 Webhook event received:", event);
  console.log("📦 Order Data:", order);

  // TODO: Save the event to your DB or perform logic like status update

  res.status(200).send("Webhook received");
};

export default paymentWebhook;

require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    console.log("creating instance");
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.price, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    console.log(order);
    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/successOrder", async (req, res) => {
  console.log(req.body);
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!verifyPayment(razorpaySignature, orderCreationId, razorpayPaymentId))
      return res.status(200).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    return res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/successSubscription", (req, res) => {
  console.log(req.body);
  try {
    // getting the details back from our font-end
    const {
      subscriptionId,
      razorpayPaymentId,
      razorpaySubscriptionId,
      razorpaySignature,
    } = req.body;

    if (!verifyPayment(razorpaySignature, subscriptionId, razorpayPaymentId))
      return res.status(200).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    return res.json({
      msg: "success",
      subscriptionId: razorpaySubscriptionId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

function verifyPayment(razorPaySignature, id, razorpayPaymentId, subscribe) {
  // Creating our own digest
  // The format should be like this:
  // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
  const shasum = crypto.createHmac("sha256", "D84NuLONPU3ohLtlj6JZ70YH");

  if (!subscribe) shasum.update(`${id}|${razorpayPaymentId}`);
  else shasum.update(`${razorpayPaymentId}|${id}`);

  const digest = shasum.digest("hex");
  return digest === razorPaySignature;
}

module.exports = router;

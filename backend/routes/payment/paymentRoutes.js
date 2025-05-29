const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  verifyQRPayment,
  getPaymentStatus
} = require('../../controllers/payment/paymentController');

// Create payment intent (Stripe or QR)
router.post('/create-payment', auth, createPaymentIntent);

// Confirm payment status
router.post('/confirm-payment', auth, confirmPayment);

// Verify QR payment
router.post('/verify-qr-payment', auth, verifyQRPayment);

// Get payment status
router.get('/status/:paymentId', auth, getPaymentStatus);

module.exports = router; 
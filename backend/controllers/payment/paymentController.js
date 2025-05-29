const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const MEMBERSHIP_PRICES = {
  Basic: 5000,
  Premium: 8000,
  Elite: 12000
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { membershipPlan, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!MEMBERSHIP_PRICES[membershipPlan]) {
      return res.status(400).json({ message: 'Invalid membership plan' });
    }

    const amount = MEMBERSHIP_PRICES[membershipPlan];

    // Create payment record
    const payment = new Payment({
      userId,
      membershipPlan,
      amount,
      paymentMethod,
      status: 'pending'
    });

    if (paymentMethod === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: 'lkr',
        metadata: {
          paymentId: payment._id.toString(),
          membershipPlan
        }
      });

      payment.stripePaymentId = paymentIntent.id;
      await payment.save();

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
      });
    } else if (paymentMethod === 'qr') {
      // Generate QR payment reference
      const qrReference = uuidv4();
      payment.qrReference = qrReference;
      await payment.save();

      // Generate QR code
      const qrData = JSON.stringify({
        amount,
        reference: qrReference,
        membershipPlan
      });

      const qrCode = await QRCode.toDataURL(qrData);

      return res.json({
        qrCode,
        paymentId: payment._id,
        reference: qrReference
      });
    }

    return res.status(400).json({ message: 'Invalid payment method' });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Error creating payment' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.json({ message: 'Payment status updated', payment });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
};

exports.verifyQRPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    const payment = await Payment.findOne({ qrReference: reference });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Here you would typically verify the payment with your QR payment provider
    // For demo purposes, we'll just mark it as completed
    payment.status = 'completed';
    await payment.save();

    res.json({ message: 'Payment verified', payment });
  } catch (error) {
    console.error('QR payment verification error:', error);
    res.status(500).json({ message: 'Error verifying QR payment' });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ status: payment.status });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ message: 'Error checking payment status' });
  }
}; 
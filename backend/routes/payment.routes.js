const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development');
const router = express.Router();

// Create payment intent for artwork upload
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount = 500 } = req.body; // 5 euros = 500 cents
        
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            metadata: {
                type: 'artwork_upload',
                user_id: req.user?.id || 'guest'
            },
            // Enable automatic payment methods
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: amount
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ 
            message: 'Error creating payment intent',
            error: error.message 
        });
    }
});

// Confirm payment success
router.post('/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        // Retrieve the payment intent to check its status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            res.json({
                success: true,
                message: 'Payment confirmed successfully',
                paymentIntent: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed',
                status: paymentIntent.status
            });
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ 
            message: 'Error confirming payment',
            error: error.message 
        });
    }
});

// Create payment intent for artwork purchase
router.post('/create-artwork-payment-intent', async (req, res) => {
    try {
        const { artworkId, title, artist, price } = req.body;
        
        if (!artworkId || !title || !artist || !price) {
            return res.status(400).json({ 
                message: 'Missing required fields: artworkId, title, artist, price' 
            });
        }

        // Convert price string to cents (remove $ and convert to number)
        const priceString = price.replace('$', '').replace(',', '');
        const amount = Math.round(parseFloat(priceString) * 100); // Convert to cents
        
        // Create a PaymentIntent with the artwork details
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            metadata: {
                type: 'artwork_purchase',
                artwork_id: artworkId.toString(),
                artwork_title: title,
                artist: artist,
                user_id: req.user?.id || 'guest'
            },
            // Enable automatic payment methods
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: amount,
            currency: 'usd',
            artworkId: artworkId
        });
    } catch (error) {
        console.error('Error creating artwork payment intent:', error);
        res.status(500).json({ 
            message: 'Error creating payment intent',
            error: error.message 
        });
    }
});

// Webhook to handle Stripe events (optional but recommended for production)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Here you could update database, send confirmation emails, etc.
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

// Get payment methods (optional - for displaying saved cards)
router.get('/payment-methods', async (req, res) => {
    try {
        // This would typically require a customer ID from your database
        res.json({
            message: 'Payment methods endpoint - implement based on your customer management needs'
        });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ 
            message: 'Error fetching payment methods',
            error: error.message 
        });
    }
});

module.exports = router;


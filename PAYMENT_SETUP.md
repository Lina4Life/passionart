# Payment Integration Setup Guide

This guide explains how to set up Stripe payment integration for the PassionArt platform.

## Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Test Mode**: Start with Stripe's test mode for development

## Configuration Steps

### 1. Get Stripe API Keys

1. Log into your Stripe Dashboard
2. Go to **Developers** > **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Copy your **Secret key** (starts with `sk_test_...`)

### 2. Configure Backend Environment

Edit `backend/.env` and update these values:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Configure Frontend Environment

Edit `frontend/.env` and update:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
```

### 4. Test Cards for Development

Use these test card numbers in development:

| Card Number | Description |
|-------------|-------------|
| `4242424242424242` | Visa (Success) |
| `4000000000000002` | Card Declined |
| `4000000000009995` | Insufficient Funds |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any ZIP code (e.g., 12345)

## Features Implemented

### Upload Flow with Payment

1. **Upload Page**: User fills artwork details and selects images
2. **Payment Page**: User enters card details and pays €5.00
3. **Verification**: Backend verifies payment before saving artwork
4. **Confirmation**: Success message and redirect to home

### Security Features

- ✅ **Payment Verification**: Backend validates payment before upload
- ✅ **Stripe Elements**: Secure card input with built-in validation
- ✅ **PCI Compliance**: Card details never touch your servers
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **User Authentication**: Protected routes require login

### API Endpoints

#### Payment Routes (`/api/payment/`)

- `POST /create-payment-intent` - Create new payment
- `POST /confirm-payment` - Verify payment completion
- `POST /webhook` - Handle Stripe webhooks (optional)

#### Upload Routes (`/api/artworks/`)

- `POST /upload` - Upload artwork (requires payment verification)

## Webhook Setup (Production)

For production, set up webhooks to handle payment events:

1. Go to **Developers** > **Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret to your `.env` file

## Error Handling

The system handles various payment scenarios:

- **Payment Success**: Proceeds with artwork upload
- **Payment Failed**: Shows error message, allows retry
- **Network Issues**: Graceful error handling
- **Invalid Cards**: Real-time validation feedback

## Development Testing

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Go to `/upload` and test the payment flow
4. Use test card numbers from the table above

## Going Live

To use real payments:

1. Complete Stripe account verification
2. Switch to live API keys (start with `pk_live_...` and `sk_live_...`)
3. Update environment variables
4. Test thoroughly with small amounts
5. Monitor transactions in Stripe Dashboard

## Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Test Cards**: [stripe.com/docs/testing](https://stripe.com/docs/testing)
- **Webhooks Guide**: [stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)

## Security Notes

⚠️ **Important Security Reminders**:

- Never commit real API keys to version control
- Use test keys during development
- Keep secret keys on server-side only
- Monitor failed payments for fraud attempts
- Set up proper webhook endpoint authentication

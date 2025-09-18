/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import api from '../services/api';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
// Guard against an undefined publishable key which causes Stripe internals to call
// `.match` on the key and throw when it's undefined (seen as a runtime error in
// some deployed bundles). If the env var is missing, keep stripePromise null.
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = typeof publishableKey === 'string' && publishableKey.trim() !== ''
  ? loadStripe(publishableKey)
  : null;

const CheckoutForm = ({ uploadData, artworkData, paymentType, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { showToast } = useToast();

  // Get computed CSS values for Stripe styling
  const getComputedCSSValue = (property) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
    }
    return '';
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: getComputedCSSValue('--text-primary') || '#000000',
        fontFamily: getComputedCSSValue('--font-primary') || 'Inter, sans-serif',
        backgroundColor: 'transparent',
        '::placeholder': {
          color: getComputedCSSValue('--text-muted') || '#888888',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444'
      },
    },
  };

  useEffect(() => {
    // Create PaymentIntent based on payment type
    const createPaymentIntent = async () => {
      try {
        let response;
        
        if (paymentType === 'artwork_purchase' && artworkData) {
          // Create payment intent for artwork purchase
          response = await api.post('/payment/create-artwork-payment-intent', {
            artworkId: artworkData.id,
            title: artworkData.title,
            artist: artworkData.artist,
            price: artworkData.price
          });
        } else if (paymentType === 'upload' && uploadData) {
          // Create payment intent for upload
          response = await api.post('/payment/create-payment-intent', {
            amount: 500 // 5 euros in cents
          });
        }
        
        if (response?.data?.clientSecret) {
          setClientSecret(response.data.clientSecret);
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        showToast({ 
          type: 'error', 
          message: 'Failed to initialize payment. Please try again.' 
        });
      }
    };

    createPaymentIntent();
  }, [paymentType, artworkData, uploadData, showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: paymentType === 'artwork_purchase' ? artworkData?.title : uploadData?.title,
        },
      }
    });

    if (error) {
      console.error('Payment failed:', error);
      showToast({ 
        type: 'error', 
        message: error.message || 'Payment failed. Please try again.' 
      });
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      showToast({ 
        type: 'success', 
        message: 'Payment successful! Proceeding with upload...' 
      });
      onPaymentSuccess(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        padding: 'var(--space-lg)',
        border: '2px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-secondary)',
        marginBottom: 'var(--space-xl)'
      }}>
        <CardElement
          options={cardElementOptions}
        />
      </div>
      
      <button
        disabled={!stripe || isLoading}
        style={{
          width: '100%',
          padding: 'var(--space-lg) var(--space-2xl)',
          background: isLoading ? 'var(--bg-secondary)' : 'var(--accent-color)',
          color: isLoading ? 'var(--text-muted)' : 'var(--bg-primary)',
          border: `2px solid ${isLoading ? 'var(--border-color)' : 'var(--accent-color)'}`,
          borderRadius: '8px',
          fontSize: 'var(--font-size-lg)',
          fontFamily: 'var(--font-display)',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'var(--transition)',
          boxShadow: isLoading ? 'none' : '0 4px 12px var(--shadow)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px var(--shadow-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px var(--shadow)';
          }
        }}
      >
        {isLoading ? 'Processing...' : 
          paymentType === 'artwork_purchase' ? 
            `Pay ${artworkData?.price} & Purchase Artwork` : 
            'Pay €5.00 & Upload Artwork'
        }
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, showToast, clearToast } = useToast();
  const [uploadData, setUploadData] = useState(null);
  const [artworkData, setArtworkData] = useState(null);
  const [paymentType, setPaymentType] = useState('upload');

  useEffect(() => {
    // Check what type of payment this is
    if (location.state?.type === 'artwork_purchase' && location.state?.artworkData) {
      setPaymentType('artwork_purchase');
      setArtworkData(location.state.artworkData);
    } else if (location.state?.uploadData) {
      setPaymentType('upload');
      setUploadData(location.state.uploadData);
    } else {
      // If no valid data, redirect to appropriate page
      showToast({ 
        type: 'error', 
        message: 'No payment data found. Please start the process again.' 
      });
      setTimeout(() => navigate('/'), 2000);
    }
  }, [location.state, navigate, showToast]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Confirm payment with backend
      await api.post('/payment/confirm-payment', {
        paymentIntentId: paymentIntent.id
      });

      if (paymentType === 'artwork_purchase') {
        // Handle artwork purchase
        showToast({ 
          type: 'success', 
          message: `Successfully purchased "${artworkData.title}" by ${artworkData.artist}!` 
        });
        
        setTimeout(() => navigate('/'), 3000);
      } else {
        // Handle artwork upload
        const formData = new FormData();
        
        // Upload each image separately
        for (let i = 0; i < uploadData.images.length; i++) {
          const singleFormData = new FormData();
          singleFormData.append('title', `${uploadData.title}${uploadData.images.length > 1 ? ` (${i + 1})` : ''}`);
          singleFormData.append('description', uploadData.description);
          singleFormData.append('keywords', uploadData.keywords);
          singleFormData.append('category', uploadData.category);
          singleFormData.append('image', uploadData.images[i]);
          singleFormData.append('paymentIntentId', paymentIntent.id);

          await api.post('/artworks/upload', singleFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        showToast({ 
          type: 'success', 
          message: `Successfully uploaded ${uploadData.images.length} artwork(s)!` 
        });
        
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error('Payment process failed:', error);
      showToast({ 
        type: 'error', 
        message: 'Payment succeeded but process failed. Please contact support.' 
      });
    }
  };

  if (!uploadData && !artworkData) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: 'var(--space-2xl)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-lg)' }}>...</div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: 'var(--space-2xl)', 
      background: 'var(--bg-primary)',
      borderRadius: '12px',
      boxShadow: '0 4px 20px var(--shadow)',
      fontFamily: 'var(--font-primary)',
      border: '1px solid var(--border-color)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: 'var(--space-lg)',
          color: 'var(--accent-color)',
          fontWeight: 'bold'
        }}>
          $
        </div>
        <h1 style={{ 
          fontSize: 'var(--font-size-3xl)', 
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)',
          letterSpacing: '0.02em'
        }}>
          {paymentType === 'artwork_purchase' ? 'Complete Your Purchase' : 'Complete Your Upload'}
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: 'var(--font-size-lg)',
          fontWeight: '400'
        }}>
          {paymentType === 'artwork_purchase' ? 'Secure payment to purchase artwork' : 'Secure payment to publish your artwork'}
        </p>
      </div>

      {/* Summary Section */}
      <div style={{
        background: 'var(--bg-secondary)',
        padding: 'var(--space-xl)',
        borderRadius: '8px',
        marginBottom: 'var(--space-2xl)',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-lg)',
          fontWeight: '600'
        }}>
          {paymentType === 'artwork_purchase' ? 'Purchase Summary' : 'Upload Summary'}
        </h3>
        
        {paymentType === 'artwork_purchase' ? (
          // Artwork Purchase Summary
          <>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Artwork:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {artworkData.title}
              </span>
            </div>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Artist:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {artworkData.artist}
              </span>
            </div>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Description:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {artworkData.description}
              </span>
            </div>
            
            <div style={{ 
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-lg)',
              marginTop: 'var(--space-lg)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                <span style={{ color: 'var(--accent-color)' }}>{artworkData.price}</span>
              </div>
            </div>
          </>
        ) : (
          // Upload Summary
          <>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Title:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {uploadData.title}
              </span>
            </div>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Category:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {uploadData.category}
              </span>
            </div>
            
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Images:</strong>
              <span style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-muted)' }}>
                {uploadData.images.length} file(s)
              </span>
            </div>
            
            <div style={{ 
              borderTop: '1px solid var(--border-color)',
              paddingTop: 'var(--space-lg)',
              marginTop: 'var(--space-lg)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>Upload Fee:</span>
                <span style={{ color: 'var(--accent-color)' }}>€5.00</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payment Form */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-lg)',
          fontWeight: '600'
        }}>
          Payment Information
        </h3>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            uploadData={uploadData}
            artworkData={artworkData}
            paymentType={paymentType}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>

      {/* Security Info */}
      <div style={{
        background: 'var(--bg-tertiary)',
        padding: 'var(--space-lg)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          marginBottom: 'var(--space-sm)',
          color: 'var(--accent-color)',
          fontWeight: 'bold'
        }}>
          SSL
        </div>
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-muted)',
          margin: 0
        }}>
          Your payment is secured by Stripe. We never store your card details.
        </p>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <button
          onClick={() => navigate(paymentType === 'artwork_purchase' ? '/store' : '/upload')}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            padding: 'var(--space-md) var(--space-lg)',
            borderRadius: '6px',
            fontSize: 'var(--font-size-base)',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--accent-color)';
            e.target.style.color = 'var(--accent-color)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.color = 'var(--text-muted)';
          }}
        >
          ← Back to {paymentType === 'artwork_purchase' ? 'Store' : 'Upload'}
        </button>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={clearToast} />
    </div>
  );
};

export default PaymentPage;

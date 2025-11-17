import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getOrderById } from "../api/woocommerce";
import "../assets/styles/OrderSuccess.css";

const formatPrice = (value) => {
  const amount = Number.parseFloat(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `AED ${safeAmount.toFixed(2)}`;
};

const popularSearchTerms = [
  "Mosquito killer machine",
  "Electric mosquito killer",
  "Installment mobile phones",
  "Hair curling iron",
  "Portable Screen",
  "Oral irrigator",
  "Water Flosser",
  "Water tooth flosser",
  "Toothbrush",
  "Oral",
  "Electric toothbrush",
  "Bluetooth headphones",
  "Wireless earphones",
  "Travel kit",
  "Coffee bean grinder",
  "Treadmill",
  "Coffee maker machine",
  "Coffee grinder",
  "Home projector",
  "Candle Machines",
  "Gym equipment",
];

export default function OrderCancel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");
  const paymentId = queryParams.get("payment_id");
  const cancelReason = queryParams.get("reason") || "Payment was cancelled by user";

  const [animate, setAnimate] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    setAnimate(true);

    const handlePopState = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, orderId]);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    alert('Order ID copied to clipboard!');
  };

  const handleCopyPaymentId = () => {
    if (paymentId) {
      navigator.clipboard.writeText(paymentId);
      alert('Payment ID copied to clipboard!');
    }
  };

  const handlePopularSearchClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="loading-spinner">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order || !orderId) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <div className="error-message">Order not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        {/* Header Section - Cancelled */}
        <div className="order-header">
          <div className="cancel-icon" style={{ 
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '48px', 
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)'
          }}>✕</div>
          <h1 className="thank-you-title" style={{ color: '#e74c3c' }}>
            Order Cancelled
          </h1>
          <p className="thank-you-subtitle" style={{ color: '#666', marginBottom: '10px' }}>
            Your order has been cancelled and will not be processed.
          </p>
          
          <button 
            className="order-btn" 
            onClick={() => navigate('/myaccount')}
            style={{ 
              background: '#e74c3c',
              marginTop: '10px'
            }}
          >
            View My Orders
          </button>
        </div>

        {/* Order Number Section */}
        <div className="order-number-section">
          <h2 className="order-id" onClick={handleCopyOrderId} style={{ color: '#e74c3c' }}>
            #S{order.id}
          </h2>
          <p className="copy-order-text" onClick={handleCopyOrderId}>
            📋 Copy order number
          </p>
        </div>

        {/* Payment ID Section (if available) */}
        {paymentId && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#6c757d', 
              marginBottom: '5px',
              fontWeight: '500'
            }}>
              Payment ID
            </div>
            <div 
              onClick={handleCopyPaymentId}
              style={{ 
                fontSize: '16px', 
                color: '#495057',
                fontFamily: 'monospace',
                cursor: 'pointer',
                wordBreak: 'break-all',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              {paymentId}
              <span style={{ fontSize: '12px', color: '#6c757d' }}>📋</span>
            </div>
          </div>
        )}

        {/* Cancellation Reason */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          borderRadius: '10px', 
          marginBottom: '25px',
          border: '2px solid #ffcccb',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#c0392b', 
            fontWeight: '600',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Cancellation Reason
          </div>
          <p style={{ 
            margin: 0, 
            color: '#c0392b',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {cancelReason}
          </p>
        </div>

        {/* Order Details Tabs */}
        <div className="order-tabs">
          <button className="tab-btn active">Order details</button>
        </div>

        {/* Order Info Grid */}
        <div className="order-info-grid">
          <div className="info-item">
            <span className="info-label">Order no.:</span>
            <span className="info-value">S{order.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Order date:</span>
            <span className="info-value">{new Date(order.date_created).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value" style={{ color: '#e74c3c', fontWeight: 'bold' }}>
              Cancelled
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Payment method:</span>
            <span className="info-value">{order.payment_method_title || 'COD'}</span>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-summary-section">
          <button className="order-summary-btn">Order summary</button>
        </div>

        {/* Products Table */}
        <div className="products-table">
          <div className="table-header">
            <span className="product-header">Product</span>
            <span className="total-header">Total</span>
          </div>
          
          {order.line_items.map((item) => (
            <div key={item.id} className="table-row">
              <div className="product-info">
                <div className="product-image">
                  {item.image?.src ? (
                    <img src={item.image.src} alt={item.name} />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <div className="product-details">
                  <div className="product-name">[{item.product_id}] {item.name}</div>
                  <div className="product-quantity">× {item.quantity}</div>
                </div>
              </div>
              <div className="product-total">{formatPrice(item.total)}</div>
            </div>
          ))}

          {/* Summary Section */}
          <div className="order-summary-details">
            <div className="summary-row">
              <span className="summary-label">Items</span>
              <span className="summary-value">{formatPrice(order.total)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Discount</span>
              <span className="summary-value"></span>
            </div>
            
            {order.shipping_total && parseFloat(order.shipping_total) > 0 && (
              <div className="summary-row">
                <span className="summary-label">Shipping & handling</span>
                <span className="summary-value">{formatPrice(order.shipping_total)}</span>
              </div>
            )}
            
            <div className="summary-row total-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Information Message */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginTop: '25px',
          textAlign: 'center',
          border: '1px solid #dee2e6'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '15px' }}>
            Your payment was not processed and no amount has been charged.
          </p>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
            If you have any questions or concerns, please contact our support team.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '25px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            className="track-order-btn" 
            onClick={() => navigate('/')}
            style={{ 
              backgroundColor: '#3498db',
              padding: '12px 30px',
              fontSize: '16px'
            }}
          >
            Continue Shopping
          </button>
          <button 
            className="track-order-btn" 
            onClick={() => navigate('/contact')}
            style={{ 
              backgroundColor: '#95a5a6',
              padding: '12px 30px',
              fontSize: '16px'
            }}
          >
            Contact Support
          </button>
          <button 
            className="track-order-btn" 
            onClick={() => navigate('/checkout')}
            style={{ 
              backgroundColor: '#27ae60',
              padding: '12px 30px',
              fontSize: '16px'
            }}
          >
            Try Again
          </button>
        </div>

        {/* Note for users */}
        {!user && (
          <div className="guest-note" style={{ marginTop: '20px' }}>
            <p>Note: This order was not completed. You can try placing the order again.</p>
          </div>
        )}

        {/* Popular Search Terms */}
        <div className="popular-search-section">
          <h3>Most popular search words</h3>
          <div className="search-tags">
            {popularSearchTerms.map((term) => (
              <button
                key={term}
                type="button"
                className="search-tag"
                onClick={() => handlePopularSearchClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

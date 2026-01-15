import React from 'react';
import '../../assets/styles/checkout/orderconfirmed.css';
import TabbyIcon from '../../assets/images/Footer icons/3.webp';
import TamaraIcon from '../../assets/images/Footer icons/6.webp';
import VisaIcon from '../../assets/images/Footer icons/17.webp';
import MasterIcon from '../../assets/images/Footer icons/16.webp';
import CashIcon from '../../assets/images/Footer icons/13.webp';

const OrderConfirmedPopup = ({
  isOpen,
  onClose,
  onPayNow,
  orderId,
  isLoading = false,
  paymentMethod = 'cod' // Add payment method prop
}) => {
  if (!isOpen) return null;

  const discountPercent = 5;

  // Show different popup based on payment method
  const isCOD = paymentMethod === 'cod';

  return (
    <div className="order-confirmed-overlay" onClick={onClose}>
      <div className="order-confirmed-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="order-confirmed-close" onClick={onClose}>
          ×
        </button>

        {/* Success Icon */}
        <div className="order-confirmed-icon-wrapper">
          <div className="order-confirmed-checkmark">✓</div>
        </div>

        {/* Success Message */}
        <h2 className="order-confirmed-title">Your order is confirmed. 🎉</h2>

        {/* COD-specific content */}
        {isCOD && (
          <div className="cod-confirmation-section" style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            <img src={CashIcon} alt="Cash on Delivery" style={{ width: '48px', marginBottom: '8px' }} />
            <p style={{ margin: '8px 0', color: '#1e40af', fontWeight: '500' }}>
              Payment Method: <strong>Cash on Delivery</strong>
            </p>
            <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
              Our delivery agent will collect payment when your order arrives
            </p>
          </div>
        )}

        {/* Discount Offer - Only show for non-COD */}
        {!isCOD && (
          <div className="order-confirmed-offer">
            <p className="offer-text">
              Enjoy an extra <span className="offer-highlight">{discountPercent}% OFF</span> when you choose prepaid payment.
            </p>
          </div>
        )}

        {/* Payment Method Options - Only show for non-COD */}
        {!isCOD && (
          <div className="order-confirmed-payment-methods">
            <div className="payment-methods-icons">
              <img src={VisaIcon} alt="Visa" className="method-icon" />
              <img src={MasterIcon} alt="Mastercard" className="method-icon" />
              <img src={TabbyIcon} alt="Tabby" className="method-icon" />
              <img src={TamaraIcon} alt="Tamara" className="method-icon" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="order-confirmed-actions">
          {!isCOD && (
            <button
              className="order-confirmed-pay-now"
              onClick={onPayNow}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="lightning-icon">⚡</span>
                  PAY NOW
                </>
              )}
            </button>
          )}
          <button
            className={`order-confirmed-no-thanks ${isCOD ? 'full-width' : ''}`}
            onClick={onClose}
            disabled={isLoading}
            style={isCOD ? { width: '100%' } : {}}
          >
            {isCOD ? 'CONTINUE TO ORDER TRACKING' : 'NO, THANKS'}
          </button>
        </div>

        {/* Order ID Info */}
        {orderId && (
          <div className="order-confirmed-info">
            <p>Order ID: <strong>#{orderId}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmedPopup;

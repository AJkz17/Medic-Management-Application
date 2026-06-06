'use client';

import { useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartModalProps {
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onClearCart: () => void;
}

export default function CartModal({ onClose, cartItems, onUpdateQuantity, onClearCart }: CartModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("counter");

  // Dynamic calculations compiled on every state adjustment
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmountPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    if (paymentMethod === "counter") {
      alert(`Checkout Successful!\nTotal Amount: RM ${totalAmountPrice.toFixed(2)}\nPlease proceed to the physical clinic counter to complete your payment.`);
    } else {
      alert(`Redirecting to Secure Financial Process Exchange (FPX) Gateways...\nTotal Amount: RM ${totalAmountPrice.toFixed(2)}\nPlease select your participating Malaysian banking institution on the next screen.`);
    }

    onClearCart();
    onClose();
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 shadow-lg">
          
          {/* Modal Header */}
          <div className="modal-header bg-primary text-white p-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-cart-fill me-2"></i>Medical Cart ({totalItemsCount} items)
            </h5>
            <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {cartItems.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-basket3 fs-1 opacity-25"></i>
                <p className="mt-2 mb-0 small">Your medical shopping basket is empty.</p>
              </div>
            ) : (
              <div>
                {/* Dynamic Cart Items List */}
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.image} alt={item.name} className="rounded border bg-light object-fit-cover" style={{ width: '50px', height: '50px' }} />
                      <div>
                        <div className="fw-bold text-dark small">{item.name}</div>
                        <small className="text-success fw-semibold">RM {item.price.toFixed(2)} each</small>
                      </div>
                    </div>

                    {/* Quantity Control Buttons Group */}
                    <div className="d-flex align-items-center gap-2">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary px-2 py-0 border-0 shadow-none"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        <i className="bi bi-dash-lg fw-bold"></i>
                      </button>
                      <span className="fw-bold text-dark small px-1">{item.quantity}</span>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary px-2 py-0 border-0 shadow-none"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        <i className="bi bi-plus-lg fw-bold"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Subtotal Calculation Box */}
                <div className="bg-light p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-secondary small">Estimated Subtotal:</span>
                  <span className="fw-bold text-primary fs-4">RM {totalAmountPrice.toFixed(2)}</span>
                </div>

                {/* Checkout Payment Form Selection Box */}
                <form onSubmit={handleCheckoutSubmit}>
                  <p className="text-muted small fw-bold mb-2 uppercase" style={{ letterSpacing: '0.05em' }}>Choose Payment Mode</p>
                  
                  {/* Option 1: Counter Payment */}
                  <div className="form-check p-3 border rounded mb-2 cursor-pointer bg-white transition-all d-flex align-items-center">
                    <input 
                      className="form-check-input cursor-pointer ms-0 me-3" 
                      type="radio" 
                      name="payment" 
                      id="payCounter" 
                      value="counter"
                      checked={paymentMethod === "counter"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label cursor-pointer w-100 text-dark" htmlFor="payCounter">
                      <div className="fw-bold small">Pay At Physical Clinic Counter</div>
                      <small className="text-muted">Settle your bills directly with the receptionist via cash or card.</small>
                    </label>
                  </div>

                  {/* Option 2: FPX Payment */}
                  <div className="form-check p-3 border rounded mb-4 cursor-pointer bg-white transition-all d-flex align-items-center">
                    <input 
                      className="form-check-input cursor-pointer ms-0 me-3" 
                      type="radio" 
                      name="payment" 
                      id="payFPX" 
                      value="fpx"
                      checked={paymentMethod === "fpx"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label cursor-pointer w-100 text-dark" htmlFor="payFPX">
                      <div className="fw-bold small">Online Banking (FPX Transfer)</div>
                      <small className="text-muted">Instant validation using secure Malaysian web banking portals.</small>
                    </label>
                  </div>

                  {/* Checkout Actions Buttons Footer */}
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary w-50 fw-semibold" onClick={onClose}>
                      Keep Browsing
                    </button>
                    <button type="submit" className="btn btn-primary w-50 fw-bold shadow-sm">
                      Confirm Checkout
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
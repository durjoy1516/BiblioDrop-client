"use client";

import { useState } from "react";
import { X, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, bookTitle = "Book Title", amount = 150 }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Payment Gateway delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md theme-bg-card border theme-border p-6 rounded-3xl shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-500/10 theme-text-secondary hover:text-amber-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-extrabold theme-text-primary">Payment Successful!</h3>
            <p className="text-xs theme-text-secondary">Your order has been placed for delivery.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold">
                <CreditCard className="w-3.5 h-3.5" /> Confirm Delivery Rent
              </div>
              <h2 className="text-xl font-bold theme-text-primary">Checkout Payment</h2>
              <p className="text-xs theme-text-secondary">Book: <span className="font-semibold theme-text-primary">{bookTitle}</span></p>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-amber-500/5 border theme-border rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between theme-text-secondary">
                <span>Rental Charge</span>
                <span>৳{amount - 40}</span>
              </div>
              <div className="flex justify-between theme-text-secondary">
                <span>Home Delivery Fee</span>
                <span>৳40</span>
              </div>
              <div className="pt-2 border-t theme-border flex justify-between font-bold text-sm theme-text-primary">
                <span>Total Amount</span>
                <span className="text-amber-500">৳{amount}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePayment} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium theme-text-secondary">Card / Mobile Banking Number</label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX or Card No"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border theme-border bg-amber-500/5 theme-text-primary focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processing Payment..." : `Pay ৳${amount} & Confirm`}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1 text-[10px] theme-text-secondary pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure SSL Encrypted Checkout
            </div>
          </>
        )}

      </div>
    </div>
  );
}
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MapPin, ShoppingBag, ArrowRight, CreditCard, CheckCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orderApi";

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const handleChange = (e) => setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.phone || !address.street || !address.city || !address.pincode) {
      toast.error("Please fill in all address fields");
      return;
    }
    setLoading(true);
    try {
      await placeOrder({ userId: user.userId, addressId: 1 });
      clearCart(user?.userId);
      setPlaced(true);
      toast.success("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
        <p className="text-gray-400">Redirecting to your orders...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={40} className="text-gray-300" />
        <p className="text-gray-500 font-medium">Your cart is empty</p>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-green-600" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "fullName", label: "Full Name", placeholder: "John Doe" },
                    { name: "phone", label: "Phone Number", placeholder: "9876543210" },
                    { name: "street", label: "Street Address", placeholder: "123 Main St", full: true },
                    { name: "city", label: "City", placeholder: "Chennai" },
                    { name: "state", label: "State", placeholder: "Tamil Nadu" },
                    { name: "pincode", label: "PIN Code", placeholder: "600001" },
                  ].map(({ name, label, placeholder, full }) => (
                    <div key={name} className={full ? "sm:col-span-2" : ""}>
                      <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
                      <input name={name} value={address[name]} onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard size={18} className="text-green-600" /> Payment Method
                </h2>
                <div className="flex flex-col gap-3">
                  {[
                    { value: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "CARD", label: "Credit / Debit Card", desc: "Coming soon" },
                    { value: "UPI", label: "UPI", desc: "Coming soon" },
                  ].map(({ value, label, desc }) => (
                    <label key={value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                    } ${value !== "COD" ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <input type="radio" name="payment" value={value} checked={paymentMethod === value}
                        onChange={() => value === "COD" && setPaymentMethod(value)} className="accent-green-600" />
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{label}</p>
                        <p className="text-gray-400 text-xs">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                <div className="flex flex-col gap-3 mb-5 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product = item.product || item;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm text-gray-500 border-b border-gray-50 pb-2">
                        <span className="truncate max-w-[160px]">{product.name} ×{item.quantity}</span>
                        <span className="font-medium text-gray-700">₹{((product.price || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900 font-bold text-lg">
                    <span>Total</span><span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                  {loading ? "Placing Order..." : <><span>Place Order</span><ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

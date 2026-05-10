import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, User, Store, ShoppingBag, Shield } from "lucide-react";
import { registerUser } from "../api/authApi";

const ROLES = [
  { value: "CUSTOMER", label: "Customer", icon: ShoppingBag, desc: "Shop and track orders" },
  { value: "SELLER",   label: "Seller",   icon: Store,       desc: "List and sell products" },
  { value: "ADMIN",    label: "Admin",    icon: Shield,      desc: "Manage the platform" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({ name, email, password, role });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
              <User size={22} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Create account</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Join NexShop today</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider block mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setRole(value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                      role === value ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}>
                    <Icon size={18} /><span>{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">{ROLES.find(r => r.value === role)?.desc}</p>
            </div>

            <div>
              <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm" />
            </div>
            <div>
              <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm" />
            </div>
            <div>
              <label className="text-gray-600 text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

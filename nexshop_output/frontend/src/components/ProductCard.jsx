import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addToWishlist } from "../api/wishlistApi";

const IMAGE_BASE = "http://localhost:8081";
const FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&q=80";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith("http") ? product.images[0] : `${IMAGE_BASE}${product.images[0]}`
    : FALLBACK;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(user?.userId, product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please login to add to wishlist"); return; }
    if (wishlisted) return;
    try {
      await addToWishlist({ userId: user.userId, productId: product.id });
      setWishlisted(true);
      toast.success("Added to wishlist!");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <div onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div className="relative overflow-hidden bg-gray-50 h-48">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = FALLBACK; }} />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium bg-white px-3 py-1 rounded-full border border-gray-200">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button onClick={handleWishlist}
            className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${
              wishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}>
            <Heart size={14} className={wishlisted ? "fill-red-500" : ""} />
          </button>
        </div>
        {product.category && (
          <div className="absolute top-2 left-2">
            <span className="text-xs font-medium bg-white text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{product.category}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        <h3 className="text-gray-900 font-semibold text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} className={s <= Math.round(product.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          {user?.role !== "SELLER" && user?.role !== "ADMIN" && (
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded-lg transition-all">
              <ShoppingCart size={13} />Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { AI_BASE_URL } from "../api/api";
import { ShoppingCart, Search, X, Minus, CheckCircle } from "lucide-react";

// images
import p1Img from "../assets/Ecom_Products/p1.png";
import p2Img from "../assets/Ecom_Products/p2.png";
import p3Img from "../assets/Ecom_Products/p3.png";
import p4Img from "../assets/Ecom_Products/p4.png";
import p5Img from "../assets/Ecom_Products/p5.png";
import p6Img from "../assets/Ecom_Products/p6.png";
import p7Img from "../assets/Ecom_Products/p7.png";
import p8Img from "../assets/Ecom_Products/p8.png";
import p9Img from "../assets/Ecom_Products/p9.png";
import p10Img from "../assets/Ecom_Products/p10.png";
import p11Img from "../assets/Ecom_Products/p11.png";
import p12Img from "../assets/Ecom_Products/p12.png";
import p13Img from "../assets/Ecom_Products/p13.png";
import p14Img from "../assets/Ecom_Products/p14.png";
import p15Img from "../assets/Ecom_Products/p15.png";

const productsData = [
  { id: 1, name: "Pepper Spray", price: 299, discount: 20, image: p1Img },
  { id: 2, name: "Personal Alarm", price: 499, discount: 15, image: p2Img },
  { id: 3, name: "Stun Gun", price: 1499, discount: 10, image: p3Img },
  { id: 4, name: "Safety Keychain", price: 199, discount: 25, image: p4Img },
  { id: 5, name: "Hidden Camera Detector", price: 999, discount: 30, image: p5Img },
  { id: 6, name: "Door Stop Alarm", price: 349, discount: 20, image: p6Img },
  { id: 7, name: "GPS Tracker", price: 1999, discount: 18, image: p7Img },
  { id: 8, name: "Emergency Torch", price: 399, discount: 22, image: p8Img },
  { id: 9, name: "Safety Bracelet", price: 599, discount: 12, image: p9Img },
  { id: 10, name: "Whistle Alarm", price: 149, discount: 30, image: p10Img },
  { id: 11, name: "Mini Tool", price: 699, discount: 15, image: p11Img },
  { id: 12, name: "Defense Stick", price: 899, discount: 20, image: p12Img },
  { id: 13, name: "Smart Ring Alert", price: 1299, discount: 10, image: p13Img },
  { id: 14, name: "Car Safety Hammer", price: 249, discount: 35, image: p14Img },
  { id: 15, name: "Flashlight Baton", price: 2499, discount: 15, image: p15Img }
];

export default function EcommercePage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [riskLevel, setRiskLevel] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved) setCart(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {

  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {

      const res = await axios.post(
        `${AI_BASE_URL}/predict`,
        {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
      );

      setRiskLevel(res.data.risk);

    } catch (err) {
      console.error("Prediction error:", err);
    }
  });

}, []);

  const getDynamicDiscount = (product) => {
    const extra = riskLevel * 50; // scale
    return Math.min(product.discount + extra, 70);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);

    setCart(updated);
  };

  const total = cart.reduce((acc, item) => {
    const discount = getDynamicDiscount(item);
    const final = item.price - (item.price * discount) / 100;
    return acc + final * item.qty;
  }, 0);

  const filteredProducts = productsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskColor = () => {
    if (riskLevel > 0.7) return "text-red-600";
    if (riskLevel > 0.4) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">

      {/* HEADER */}
<div className="sticky top-0 z-50 bg-pink-50/90 backdrop-blur-md border-b border-pink-200 py-3 shadow-sm">
  <div className="flex justify-between items-center max-w-7xl mx-auto px-4">

    {/* LOGO */}
    <h1 className="text-2xl font-bold whitespace-nowrap">
      Raksha Safety E-Store
    </h1>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">

      {/* SEARCH BAR */}
      <div className="flex items-center border rounded-lg px-3 py-1 bg-white shadow-sm">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none text-sm w-32 md:w-48"
        />
      </div>

      {/* CART */}
      <button
        onClick={() => setShowCart(true)}
        className="relative hover:scale-110 transition"
      >
        <ShoppingCart />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>

    </div>

  </div>
</div>

      {/* RISK INFO */}
      <p className={`${getRiskColor()} font-semibold mt-5 mb-4`}>
        Area Risk: {(riskLevel * 100).toFixed(0)}%
      </p>

      {riskLevel > 0.7 && (
        <p className="text-red-600 font-bold animate-pulse mb-4">
          ⚠ High Risk Zone – Extra Discounts Activated
        </p>
      )}

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const discount = getDynamicDiscount(p);
          const finalPrice = Math.round(
            p.price - (p.price * discount) / 100
          );

          return (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow">
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
                <img src={p.image} className="max-h-full" />
              </div>

              <h2 className="font-semibold">{p.name}</h2>

              <div className="text-sm mt-1">
                <span className="line-through text-gray-400 mr-2">
                  ₹{p.price}
                </span>
                <span className="text-green-600 font-bold">
                  ₹{finalPrice}
                </span>
              </div>

              <p className="text-xs text-red-500">
                {Math.round(discount)}% OFF
              </p>

              <button
                onClick={() => addToCart(p)}
                className="mt-3 w-full bg-pink-500 text-white py-1.5 rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {/* CART */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 relative">

            <button onClick={() => setShowCart(false)} className="absolute top-3 right-3">
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Cart</h2>

            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <div>
                  <p>{item.name}</p>
                  <p className="text-xs">Qty: {item.qty}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span>₹{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)}>
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            ))}

            <h3 className="mt-4 font-bold">Total: ₹{Math.round(total)}</h3>

            <button
              onClick={() => {
                setCart([]);
                setOrderPlaced(true);
              }}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <CheckCircle className="text-green-600 mx-auto mb-2" />
            <h2 className="font-bold text-green-600">Order Placed!</h2>
            <button
              onClick={() => setOrderPlaced(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
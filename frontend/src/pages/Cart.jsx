import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import api from "../api/axios";

export default function Cart() {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();


    //Load cart data
    const loadCart = async () => {
        if (!userId) return;
        try {
            const res = await api.get(`/cart/${userId}`);
            setCart(res.data);
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };
    useEffect(() => {
        loadCart();
    }, []);

    const removeItem = async (productId) => {
        try {
            await api.post(`/cart/remove`, {userId, productId});
            loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

    //Update item quantity
    const updateQty = async (productId, quantity) => {
        if (quantity === 0){
            await removeItem(productId);
            return;
        }

        try {
            await api.post(`/cart/update`, {userId, productId, quantity});
            loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    if (!userId) {
        return <div className="p-10 text-center">Please login to view your cart.</div>;
    }

    if (!cart) {
        return <div className="p-10 text-center">Loading cart...</div>;
    }

    const total = cart.items.reduce((sum, item) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            {
                cart.items.length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
                        Your cart is empty. 
                        <br/>
                        <Link to="/" className="text-blue-600 font-medium hover:underline mt-2 inline-block">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
                        <div className="divide-y">
                            {cart.items.map((item) => (
                                <div
                                key={item.productId?._id}
                                className="flex items-center justify-between p-6 hover:bg-gray-50 transition"
                                >

                                    <div className="flex items-center gap-4 flex-1">
                                        <img
                                        src={item.productId?.image}
                                        alt={item.productId?.title}
                                        className="w-20 h-20 object-contain rounded bg-white border"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                        />

                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{item.productId?.title}</h2>
                                            <p className="text-gray-500 font-medium">${item.productId?.price?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center border rounded-lg bg-white">
                                            <button
                                            onClick={() => updateQty(item.productId?._id, item.quantity -1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition rounded-l-lg"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 font-semibold min-w-[30px] text-center">{item.quantity}</span>
                                            <button
                                            onClick={() => updateQty(item.productId?._id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition rounded-r-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                        <div className="min-w-[80px] text-right">
                                            <p className="font-bold text-lg text-gray-900">
                                                ${(item.productId?.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                        onClick={() => removeItem(item.productId?._id)}
                                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition px-2 py-1 rounded hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                            <Link to="/" className="text-blue-600 hover:blue-700 font-medium">← Back to Store</Link>
                            <div className="text-right">
                                <p className="text-gray-600 text-sm">Estimated Total</p>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Total: ${total.toFixed(2)}
                                </h2>
                            </div>
                        </div>

                        <button onClick={()=> navigate("/checkout-address")} className="w-full bg-blue-500 text-white p-2 rounded">
                            Proceed to Checkout
                        </button>
                    </div>
                )
            }
        </div>
    )
}

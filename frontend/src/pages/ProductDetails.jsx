import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null); // Fixed typo: setProducts -> setProduct
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/products/details/${id}`);
            setProduct(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError("Failed to load product details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const userId = localStorage.getItem("userId");
        if(!userId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            await api.post(`/cart/add`, {userId, productId: product._id });
            alert(`${product.title} added to cart!`);
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <span className="mt-4 text-xl font-semibold text-gray-700 font-sans">Loading your product...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="text-red-500 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-gray-800 text-lg font-medium mb-6">{error}</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition transform active:scale-95 shadow-lg shadow-blue-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <p className="text-gray-600 text-xl font-medium mb-6">Product not found.</p>
                    <button 
                        onClick={() => navigate("/")}
                        className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition transform active:scale-95"
                    >
                        Explore More Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-12">
            {/* Header / Navigation */}
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <button 
                    onClick={() => navigate("/")} 
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                    title="Go Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="font-bold text-xl tracking-tight">ShopSphere</div>
                <div className="w-10"></div> {/* Spacer for centering title */}
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8 animate-fadeIn">
                <div className="flex flex-col items-center">
                    {/* Product Image - Centered and Large */}
                    <div className="w-full flex justify-center mb-10 overflow-hidden rounded-3xl bg-white">
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="max-w-full max-h-[450px] object-contain transition-all duration-700 hover:scale-105"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Product+Image"; }}
                        />
                    </div>
                    
                    {/* Product Info - Stacked as per Reference Image */}
                    <div className="w-full max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-3 tracking-tight">{product.title}</h1>
                        <p className="text-xl text-gray-500 font-medium mb-6">{product.category || "General Category"}</p>
                        
                        <div className="text-4xl font-bold text-gray-900 mb-8 font-mono tracking-tighter">
                            ${product.price}
                        </div>

                        {/* Add to Cart Button - Matches Reference Button Style */}
                        <div className="mt-8">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-xl shadow-2xl shadow-blue-200 transform transition-all active:scale-[0.98] flex items-center justify-center text-xl"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Additional Details */}
                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Product Description</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {product.description || "The Samsung Galaxy S23 Ultra features a groundbreaking camera system, powerful performance, and a stunning display. It's the ultimate smartphone experience."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
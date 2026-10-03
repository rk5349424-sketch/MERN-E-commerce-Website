import { useEffect, useState } from "react";
import api from "../api/axios";
import {Link} from "react-router";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const loadProduct = async () => {
        const res = await api.get(`/products?search=${search}&category=${category}`);
        setProducts(res.data);
    }

    useEffect(() => {
        loadProduct();
    }, [search, category]);

    const addToCart = async (productId) => {
        const userId = localStorage.getItem("userId");
        if(!userId) {
            alert("Please log in to add items to your cart.");
            return;
        }

        try {
            await api.post(`/cart/add`, {userId, productId });
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }

    }

    return (
        <div className="p-6">

          {/* Search */}
          <div className="mb-4  flex gap-3">
            <input
            placeholder="Search Products.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-1/2"
            />

            {/* Category Filter */}
            <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded">

                <option value="">All Categories</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Tablets">Tablets</option>
            </select>
          </div>

          {/* Product  Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((product) => (
                <div
                key = {product._id}
                className="border rounded p-3 flex flex-col items-center hover:shadow-lg transition">

                    <Link to = {`/product/${product._id}`} className="w-full flex flex-col items-center">
                    <img src={product.image}
                    alt={product.title}className="w-full h-40 object-contain"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                    />
                    <h2 className="mt-2 font-semibold text-lg text-center">{product.title}</h2>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                    </Link>

                    <button 
                        onClick={() => addToCart(product._id)}
                        className="mt-auto w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
                 
               
            ))}
          </div>
        </div>
    );
}

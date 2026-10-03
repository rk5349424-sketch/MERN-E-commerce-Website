import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function AddProduct() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.title || !form.price) {
            setError("Title and Price are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/products/add", form);
            alert("Product added successfully!");
            navigate("/admin/products");
        } catch (err) {
            console.error("Error adding product:", err);
            const message = err.response?.data?.message || "Something went wrong!";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow-lg rounded-lg border border-gray-100">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">Add New Product</h2>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                    <p className="font-bold text-sm uppercase tracking-wide">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Title*</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. iPhone 15 Pro"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the product details..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        rows="3"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)*</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="">Select Category</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Tablets">Tablets</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="Paste image link here..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full text-white p-4 rounded-xl font-bold text-lg shadow-md transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95'}`}
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    );
}
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [form, setForm] = useState({
       fullName: "",
       phone: "",
       addressLine: "",
       city: "",
       state: "",
       pincode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const saveAddress = async (e) => {
        if (!userId) {
            setError("User not logged in");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post("/address/add", {
                ...form,
                userId,
            });
            navigate("/checkout");
        } catch (err) {
            console.error("Error saving address:", err);
            setError("Failed to save address. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
            
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="space-y-4">
                {
                   Object.keys(form).map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                            name={key}
                            value={form[key]}
                            placeholder={`Enter ${key}`}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                   ))
                }
            </div>

            <button
                onClick={saveAddress}
                disabled={loading}
                className={`w-full mt-6 bg-blue-500 text-white p-3 rounded font-semibold transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
                {loading ? "Saving..." : "Save Address"}
            </button>
        </div>
    )
}


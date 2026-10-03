import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Checkout() {
    const userId = localStorage.getItem("userId");
    const [address, setAddress] = useState([]);
    const [selectAdress, setSelectAddress] = useState(null);
    const [cart , setCart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }
        if (userId) {
            api.get(`/cart/${userId}`).then((res) => setCart(res.data));
            api.get(`/address/${userId}`).then((res) => {
                setAddress(res.data);
                setSelectAddress(res.data[0]); // Default to first address
        }); 
        };
    }, [userId]);

    if (!cart || !cart.items){
        return <div className="p-10 text-center">Loading cart...</div>;
    }

    const total = cart.items.reduce(
        (sum, i) => {
            const price = i.productId?.price || 0;
            return sum + (i.quantity * price);
        }, 0
    );

    const placeOrder = async () => {
        if (!selectAdress) {
            alert("Please select an address");
            return;
        }

        try {
            const res = await api.post("/order/place", {
                userId,
                address: selectAdress,
            });
            if (res.status === 201) {
                navigate(`/order-sucess/${res.data.orderId}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. " + (error.response?.data?.message || ""));
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <h2 className="font-semibold mb-4">Select Address</h2>
            <div className="grid gap-4 mb-6">
                {address.length === 0 ? (
                    <p className="text-gray-500">No addresses found. Please add an address.</p>
                ) : (
                    address.map((addr) => (
                        <div
                            key={addr._id}
                            className={`border p-4 rounded-lg cursor-pointer transition flex items-start gap-3 ${
                                selectAdress?._id === addr._id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                            }`}
                            onClick={() => setSelectAddress(addr)}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={selectAdress?._id === addr._id}
                                readOnly
                                className="mt-1"
                            />
                            <div>
                                <p className="font-bold">{addr.fullName}</p>
                                <p className="text-sm text-gray-600">{addr.phone}</p>
                                <p className="text-gray-700">{addr.addressLine}</p>
                                <p className="text-gray-700">{addr.city}, {addr.state} - {addr.pincode}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <h2 className="font-semibold mb-2 mt-8">Order Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={placeOrder}
                    className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 transition shadow-md"
                >
                    Place Order (COD)
                </button>
            </div>
        </div>
    );
}

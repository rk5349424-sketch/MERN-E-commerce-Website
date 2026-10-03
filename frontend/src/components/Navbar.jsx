import {Link, useNavigate} from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const loadCart = async () => {
            if(!userId) return setCartCount(0);

            const res = await api.get(`/cart/${userId}`);
            const items = res.data?.items || [];
            const total = items.reduce(
                (sum, item) => sum + item.quantity, 0
            );
            setCartCount(total);
            
        }
        loadCart();
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        }
    }, [userId]);

    const logout = () => {
        localStorage.clear();
        setCartCount(0);
        navigate("/login");
    }

    return (
        <nav className="flex justify-between p-4 shadow">
            <Link to= "/" className="font-bold text-xl">Mohit Store</Link>
            <div className="flex gap-4 items-center">
                <Link to="/cart" className="relative p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <span className="text-2xl">🛒</span>
                    {
                        cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                                {cartCount}
                            </span>
                        )
                    }
                </Link>
                {
                    !userId ?(
                        <>
                        <Link to="/login" className="text-lg">Login</Link>
                        <Link to="/signup" className="text-lg">Signup</Link>
                        </>
                    ) : (
                        <button onClick={logout} className="text-lg">Logout</button>
                    )
                }

            </div>
        </nav>
    )

    
}
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function ProductList() {
    const [products, setProduct] = useState([]);

    const loadProducts = async () => {
        const response = await api.get("/products");
        setProduct(response.data);
    }

    const deletedProduct = async (id) => {
        try{
            await api.delete(`/products/delete/${id}`);
            alert("Product deleted successfully!");
            loadProducts();
        }catch(err){
            console.error("Error deleting product:", err);
        }
    }
    useEffect(() => {
        loadProducts();
    }, []);

    return(
        <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Product List</h2>
            <Link to="/admin/products/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Product
            </Link>
        </div>

       <table className="w-full table-auto border-collapse border border-gray-200">

        <thead>
            <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">Image</th>
                <th className="border border-gray-200 px-4 py-2">Title</th>
                <th className="border border-gray-200 px-4 py-2">Category</th>
                <th className="border border-gray-200 px-4 py-2">Price</th>
                <th className="border border-gray-200 px-4 py-2">Stock</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
                <tr key={product._id} className="text-center">
                    <td className="border border-gray-200 px-4 py-2">
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover mx-auto rounded"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                        />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{product.title}</td>
                    <td className="border border-gray-200 px-4 py-2">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-600">
                            {product.category || "No Category"}
                        </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">${product.price}</td>
                    <td className="border border-gray-200 px-4 py-2">{product.stock}</td>
                     <td className="border border-gray-200 px-4 py-2">

                        <Link to={`/admin/products/edit/${product._id}`} className="text-button mr-4">
                        Edit
                        </Link>

                        <button
                        onClick={() =>deletedProduct(product._id)}
                         className="text-red-500 hover:underline">


                            Delete
                        </button>
                     </td>

                </tr>
            ))}
        </tbody>
       </table>

        </div>
    )
}
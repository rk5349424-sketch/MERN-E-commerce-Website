import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import product from '../models/product.js';

export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;

        //Get Cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        //Prepare Order Items and filter out any items with missing productId
        const orderItems = cart.items
            .filter(item => item.productId) // Ensure product still exists
            .map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price || 0,
            }));

        if (orderItems.length === 0) {
            return res.status(400).json({ message: "Cart contains invalid products" });
        }

        //Calculate Total amount
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        //Deduct stock from Products
        for (let item of cart.items) {
            if (item.productId) {
                await product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
            }
        }

        //Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
            address,
            totalAmount,
            paymentMethod: "COD",
        });

        //Clear Cart
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.status(201).json({ message: "Order placed successfully", orderId: order._id });


    } catch (error) {
        console.error('Place Order Error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
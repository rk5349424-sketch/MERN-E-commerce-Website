import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId || req.body.userID;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ 
                message: 'userId and productId are required',
                tip: 'Make sure to use http://localhost:5001/api/cart/add (with /api)' 
            });
        }

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({
                userId: userId,
                items: [
                    { productId: productId, quantity: 1 }
                ]
            });
        } else {
            // Ensure items is an array
            if (!cart.items) cart.items = [];

            const item = cart.items.find(
                i => i.productId && i.productId.toString() === productId
            );

            if (item) {
                item.quantity += 1;
            } else {
                cart.items.push({ productId: productId, quantity: 1 });
            }
        }

        const savedCart = await cart.save();

        res.status(200).json({
            message: 'Item added to cart',
            cart: savedCart
        });

    } catch (error) {
        console.error('Cart Save Error:', error);
        res.status(500).json({ 
            message: 'Server Error', 
            error: error.message
        });
    }
}




// Remove item from cart
export const removeItem = async (req, res) => {
    try {
        const userId = req.body.userId || req.body.userID;
        const { productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'userId and productId are required' });
        }





        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found '});
        }

        cart.items = cart.items.filter(
            i => i.productId.toString() !== productId
        );

        await cart.save();
        res.json({
            message: 'Item removed from cart',
            cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}


// Update item quantity in cart 

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.body.userId || req.body.userID;
        const { productId, quantity } = req.body;

        if (!userId || !productId || quantity === undefined) {
            return res.status(400).json({ message: 'userId, productId, and quantity are required' });
        }




        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found '});
        }

        const item = cart.items.find(
            i => i.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart'})
        }
        item.quantity = quantity;

        await cart.save();
        res.json({
            message: 'Item quantity updated',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error});
    }
}


// Get cart by user ID
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        res.json(cart);
    } catch (error) {
        res.status(500).json({message: 'Server Error',error});
    }
}
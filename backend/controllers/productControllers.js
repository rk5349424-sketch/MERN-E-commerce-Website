//import product from "../models/product.js";
// import Product from "../models/product.js";
// Create a new product
// export const createProduct = async (req, res ) => {
//     try{
//         const product = await product.create(req.body);
//         res.json({
//             message: 'Product created successfully',
//             product,
//         })
//     }catch (error) {
//         res.status(500).json({ message: 'Server Error', error});

//     }

// };

// Get all products
// export const getProducts = async (req, res) => {
//     try {
      //  const products = (await product.find()).toSorted({ createdAt: -1});
//       const products = await Product.find().sort({ createdAt: -1 });
//         res.json(products);

// } catch (error) {
//     res.status(500).json({ message: 'Server Error', error});
// }
// };

//Update a product
// export const updateProduct = async (req, res) => {
//     try {
//         const updated = await product.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         res.json({
//             message: 'Product updated successfully',
//             updated,
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error});
//     }
// }


//Delete a product
// export const deleteProduct = async (req, res) => {
//     try {
//         await product.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Product deleted successfully'});
//     }catch (error) {
//         res.status(500).json({ message: 'Server Error', error});
//     }
// }






















import Product from "../models/product.js";

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', '), error });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let filter = {};

        // If user is searching by typing, search across everything
        if (search && search.trim() !== "") {
            const searchRegex = { $regex: search.trim(), $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { category: searchRegex },
                { description: searchRegex }
            ];
        }

        // Only apply category filter if user is NOT searching by text
        // OR combine them if they are both present
        if (category && category !== "" && category !== "all") {
             filter.category = { $regex: category, $options: 'i' };
        }
        
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Product updated successfully",
            updated,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
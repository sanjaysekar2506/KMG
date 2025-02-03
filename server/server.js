const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Razorpay configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Add these to your .env file
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define Category Schema and Model for MongoDB
const categorySchema = new mongoose.Schema({
    name: String,
    imageUrl: String
});

const Category = mongoose.model('Category', categorySchema);

// Define Product Schema and Model for MongoDB
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    imageUrl: String
});

const Product = mongoose.model('Product', productSchema);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to Add a New Category
app.post('/addCategories', upload.single('image'), async (req, res) => {
    try {
        const categoryName = req.body.name;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.error('Image upload error:', error);
                return res.status(500).json({ message: 'Image upload failed' });
            }

            const imageUrl = result.secure_url; // URL from Cloudinary

            // Save category in MongoDB
            const newCategory = new Category({
                name: categoryName,
                imageUrl: imageUrl
            });

            await newCategory.save();
            return res.status(201).json({ message: 'Category added successfully', category: newCategory });
        }).end(file.buffer);
    } catch (error) {
        console.error('Add Category Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to fetch all categories
app.get('/addcategories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Fetch Categories Error:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});

// Route to fetch a single category by ID
app.get('/addcategories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Fetch Category by ID Error:', error);
        res.status(500).json({ message: 'Failed to fetch category details' });
    }
});

// Route to Update a Category
app.put('/updateCategory/:id', upload.single('image'), async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryName = req.body.name;
        if (req.file) {
            const file = req.file;

            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.error('Image upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }

                const imageUrl = result.secure_url;
                updateData.imageUrl = imageUrl;

                // Update category in MongoDB
                await Category.findByIdAndUpdate(categoryId, updateData);
                res.status(200).json({ message: 'Category updated successfully', updatedCategory: updateData });
            }).end(file.buffer);
        } else {
            await Category.findByIdAndUpdate(categoryId, updateData);
            res.status(200).json({ message: 'Category updated successfully', updatedCategory: updateData });
        }
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ message: 'Failed to update category' });
    }
});

// Route to delete category
app.delete('/deleteCategory/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category removed successfully' });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ message: 'Failed to remove category' });
    }
});

// Route to Add a New Product
app.post('/addProduct', upload.single('image'), async (req, res) => {
    const { name, price, category } = req.body;
    const file = req.file;  // File uploaded via multer

    try {
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Upload image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.error('Image upload error:', error);
                return res.status(500).json({ message: 'Image upload failed' });
            }

            const imageUrl = result.secure_url;

            // Create a new product document
            const newProduct = new Product({
                name,
                price,
                category,
                imageUrl
            });

            // Save the product in the database
            await newProduct.save();
            res.status(201).json(newProduct);
        }).end(file.buffer);
    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to fetch all products or filter by category
app.get('/products', async (req, res) => {
    try {
        const { category } = req.query; // Extract category filter from query string
        let filter = {}; // Initialize empty filter object

        if (category) {
            // If category is provided, filter by category
            filter.category = category;
        }

        const products = await Product.find(filter).populate('category'); // Apply filter and populate category details
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Fetch Product by ID Error:', error);
        res.status(500).json({ message: 'Failed to fetch product details' });
    }
});

// Route to Update a Product
app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, category } = req.body;

        let updateData = { name, price, category };

        if (req.file) {
            const file = req.file;

            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.error('Image upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }

                const imageUrl = result.secure_url;
                updateData.imageUrl = imageUrl;

                // Update product in MongoDB
                const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
                res.status(200).json({ message: 'Product updated successfully', updatedProduct });
            }).end(file.buffer);
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
            res.status(200).json({ message: 'Product updated successfully', updatedProduct });
        }
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// Route to delete a product
app.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Failed to remove product' });
    }
});


// Razorpay Create Order Route
app.post('/api/payment/order', async (req, res) => { 
    const { amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).send("Error creating order");
    }
});

// Razorpay Verify Payment Route
app.post('/api/payment/verify', (req, res) => {
    const { payment_id, order_id, signature } = req.body;

    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === signature) {
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
});

app.get('/', (req, res) => {
    res.send("Hi")
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

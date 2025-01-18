const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS configuration to allow only your frontend domain
const corsOptions = {
    origin: 'https://sribalamurugantradersricewholesaler.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions)); // Enable CORS with specific options

// Middleware for parsing JSON
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define Category Schema and Model for MongoDB
const categorySchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
});

const Category = mongoose.model('Category', categorySchema);

// Define Product Schema and Model for MongoDB
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String },
});

const Product = mongoose.model('Product', productSchema);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        }).end(file.buffer);
    });
};

// Route to Add a New Category
app.post('/addCategories', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const imageUrl = await uploadToCloudinary(file);

        const newCategory = new Category({ name, imageUrl });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
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
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        console.error('Fetch Category by ID Error:', error);
        res.status(500).json({ message: 'Failed to fetch category details' });
    }
});

// Route to Update a Category
app.put('/updateCategory/:id', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        const updateData = { name };
        if (file) {
            updateData.imageUrl = await uploadToCloudinary(file);
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        console.error('Update Category Error:', error);
        res.status(500).json({ message: 'Failed to update category' });
    }
});

// Route to delete a category
app.delete('/deleteCategory/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category removed successfully' });
    } catch (error) {
        console.error('Delete Category Error:', error);
        res.status(500).json({ message: 'Failed to remove category' });
    }
});

// Route to Add a New Product
app.post('/addProduct', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const file = req.file;

        const newProduct = new Product({
            name,
            price,
            category,
            description,
            imageUrl: file ? await uploadToCloudinary(file) : null,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// Route to fetch all products
app.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter).populate('category');
        res.status(200).json(products);
    } catch (error) {
        console.error('Fetch Products Error:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Route to Update a Product
app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const file = req.file;

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name;
        product.price = price;
        product.category = category;
        product.description = description;
        if (file) product.imageUrl = await uploadToCloudinary(file);

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// Route to delete a product
app.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Failed to remove product' });
    }
});

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use(cors({
    origin: 'https://sribalamurugantradersricewholesaler.com', // Allow your frontend domain
  }));

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
    imageUrl: String
});

const Category = mongoose.model('Category', categorySchema);

// Define Product Schema and Model for MongoDB
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' }, // Add this
    imageUrl: { type: String },
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

        let updateData = { name: categoryName };

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
// Route to Add a New Product
app.post('/addProduct', upload.single('image'), async (req, res) => {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newProduct = new Product({
            name,
            price,
            category,
            description,
            imageUrl: req.file ? req.file.filename : null,
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
// Route to fetch a single product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the product by its ID and populate the category field
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
// Route to Update a Product
app.put('/updateProduct/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name;
        product.price = price;
        product.category = category;
        product.description = description; // Ensure this is updated

        if (req.file) {
            product.imageUrl = req.file.filename; // Update image if a new one is uploaded
        }

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
app.get('/',(req,res) => {
    res.send("Hi")
  });
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

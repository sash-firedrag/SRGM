import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Enquiry from './models/Enquiry.js';
import Product from './models/Product.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '930509721547-7usqdrjorcbm8i8h1l5ikl632trfshmo.apps.googleusercontent.com');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-for-dev';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload = multer({ storage: storage });

// MongoDB Connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<username>')) {
            console.warn('⚠️ MongoDB URI is not fully configured in your .env file.');
            console.warn('Please edit backend/.env to add your actual MongoDB connection string.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    }
};

connectDB();

// API Routes
app.post('/api/enquiry', async (req, res) => {
    try {
        const { name, email, phone, item, quantity, requirements } = req.body;

        // Basic validation
        if (!name || !email || !phone || !item) {
            return res.status(400).json({ message: 'Name, email, phone, and item are required fields.' });
        }

        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<username>')) {
            return res.status(503).json({ message: 'Database connection is not configured yet on the server.' });
        }

        const requestQuantity = quantity ? parseInt(quantity, 10) : 1;
        
        // Find product to validate against Minimum Order Quantity
        const product = await Product.findOne({ name: item });
        if (product && product.minOrderQuantity) {
            if (requestQuantity < product.minOrderQuantity) {
                 return res.status(400).json({ 
                     message: `Minimum order quantity for ${item} is ${product.minOrderQuantity}. Please increase your quantity.` 
                 });
            }
        }

        const newEnquiry = new Enquiry({
            name,
            email,
            phone,
            item,
            quantity: requestQuantity,
            requirements: requirements || ""
        });

        const savedEnquiry = await newEnquiry.save();

        // Send confirmation email
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Sri RajaGanapathi Mills" <${process.env.EMAIL_USER}>`,
                to: email, // Customer email
                subject: `Order Enquiry Received: ${item}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h2 style="color: #2c3e50; margin: 0; font-size: 24px;">Sri RajaGanapathi Mills</h2>
                            <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 14px;">Premium Textile Manufacturers</p>
                        </div>
                        
                        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <h3 style="color: #34495e; margin-top: 0;">Hello ${name},</h3>
                            <p style="color: #555; line-height: 1.6;">Thank you for exploring our products at Sri RajaGanapathi Mills. We have successfully received your enquiry.</p>
                            
                            <div style="margin: 25px 0; padding: 20px; border-left: 4px solid #3498db; background-color: #f4f6f7;">
                                <h4 style="margin: 0 0 10px; color: #2c3e50;">Enquiry Details:</h4>
                                <ul style="list-style: none; padding: 0; margin: 0; color: #555;">
                                    <li style="margin-bottom: 8px;"><strong>Product:</strong> ${item}</li>
                                    <li style="margin-bottom: 8px;"><strong>Quantity (in meters):</strong> ${quantity}</li>
                                    <li><strong>Requirements:</strong> ${requirements && requirements.trim() !== "" ? requirements : "<em>None specified</em>"}</li>
                                </ul>
                            </div>
                            
                            <p style="color: #555; line-height: 1.6;">Our dedicated wholesale team will review your request and get back to you shortly at <strong>${phone}</strong> or via this email address.</p>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                                <p style="color: #7f8c8d; font-size: 12px; margin: 0;">Have an urgent question? <br/> Call us or text on WhatsApp at <a href="https://wa.me/919443320033" style="color: #3498db; text-decoration: none;">+91 94433 20033</a></p>
                            </div>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to ${email}`);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // We still return 201 since the enquiry was successfully saved in MongoDB
        }

        res.status(201).json({ message: 'Enquiry submitted successfully!', data: savedEnquiry });
    } catch (error) {
        console.error('Error saving enquiry:', error);
        res.status(500).json({ message: 'Failed to submit enquiry. Please try again later.' });
    }
});

// Admin Routes

// Manual Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Check credentials (case-insensitive email)
    if (email && email.toLowerCase() === 'sashwathprakash725@gmail.com' && password === 'sashwath2005p') {
        const sessionToken = jwt.sign(
            { email, name: 'Admin Sashwath' },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        return res.json({ token: sessionToken, user: { email, name: 'Admin Sashwath' } });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
});

// Verify Google Token and Issue JWT
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || '930509721547-7usqdrjorcbm8i8h1l5ikl632trfshmo.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        // At this point, the user is authenticated with Google.
        // Verify payload.email against the authorized admin list
        const authorizedEmails = ['sashwathprakash725@gmail.com'];
        if (!authorizedEmails.includes(payload.email.toLowerCase())) {
            return res.status(403).json({ message: 'Unauthorized Google Account. Please use the authorized admin account.' });
        }

        const sessionToken = jwt.sign(
            { email: payload.email, name: payload.name, picture: payload.picture },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token: sessionToken, user: { email: payload.email, name: payload.name } });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Protected Route Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Get All Enquiries (Protected)
app.get('/api/enquiry', authenticateToken, async (req, res) => {
    try {
        // Only return non-hidden enquiries
        const enquiries = await Enquiry.find({ isHidden: { $ne: true } }).sort({ createdAt: -1 });
        res.json({ data: enquiries });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enquiries' });
    }
});

// Update Enquiry Status (Protected)
app.patch('/api/enquiry/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Find the current enquiry state before updating
        const currentEnquiry = await Enquiry.findById(req.params.id);
        if (!currentEnquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }

        const wasUpdatedToShipped = status === 'shipped' && currentEnquiry.status !== 'shipped';

        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        // Send 'Shipped' confirmation email
        if (wasUpdatedToShipped && updatedEnquiry.email) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: `"Sri RajaGanapathi Mills" <${process.env.EMAIL_USER}>`,
                    to: updatedEnquiry.email,
                    subject: `Your Order is Shipped: ${updatedEnquiry.item}`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h2 style="color: #2c3e50; margin: 0; font-size: 24px;">Sri RajaGanapathi Mills</h2>
                                <p style="color: #7f8c8d; margin: 5px 0 0; font-size: 14px;">Premium Textile Manufacturers</p>
                            </div>
                            
                            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top: 4px solid #3498db;">
                                <h3 style="color: #34495e; margin-top: 0;">Great news, ${updatedEnquiry.name}!</h3>
                                <p style="color: #555; line-height: 1.6; font-size: 16px;">
                                    Your order for <strong>${updatedEnquiry.item}</strong> (${updatedEnquiry.quantity} meters) has been marked as <strong>SHIPPED</strong> and is currently out for delivery!
                                </p>
                                
                                <div style="margin: 25px 0; padding: 20px; background-color: #e8f4f8; border-radius: 6px; text-align: center;">
                                    <span style="font-size: 24px;">🚚</span>
                                    <p style="color: #2980b9; font-weight: bold; margin: 10px 0 0 0;">Out for Delivery</p>
                                </div>
                                
                                <p style="color: #555; line-height: 1.6;">Our team will be in touch with you shortly at <strong>${updatedEnquiry.phone}</strong> if there are any updates regarding the delivery.</p>
                                
                                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                                    <p style="color: #7f8c8d; font-size: 12px; margin: 0;">Have an urgent question? <br/> Call us or text on WhatsApp at <a href="https://wa.me/919443320033" style="color: #3498db; text-decoration: none;">+91 94433 20033</a></p>
                                </div>
                            </div>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`Shipping notification email sent to ${updatedEnquiry.email}`);
            } catch (emailError) {
                console.error('Failed to send shipping notification email:', emailError);
            }
        }

        res.json({ data: updatedEnquiry });
    } catch (error) {
        console.error('SERVER ERROR IN STATUS UPDATE: ', error);
        res.status(500).json({ message: 'Error updating enquiry' });
    }
});

// Hide Enquiry (Soft Delete - Protected)
app.patch('/api/enquiry/:id/hide', authenticateToken, async (req, res) => {
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { isHidden: true },
            { new: true }
        );
        res.json({ data: updatedEnquiry, message: 'Enquiry hidden successfully' });
    } catch (error) {
        console.error('SERVER ERROR IN HIDE ENQUIRY: ', error);
        res.status(500).json({ message: 'Error hiding enquiry' });
    }
});

// Delete Enquiry Permanently (Hard Delete - Protected)
app.delete('/api/enquiry/:id', authenticateToken, async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Enquiry deleted permanently' });
    } catch (error) {
        console.error('SERVER ERROR IN DELETE ENQUIRY: ', error);
        res.status(500).json({ message: 'Error deleting enquiry' });
    }
});

// --- Product Routes ---

// Get all products (Public)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ data: products });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Add new product (Protected)
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ data: savedProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

// Update product (Protected)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});

// Delete product (Protected)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Image Upload Route (Protected)
app.post('/api/upload', authenticateToken, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        // Return the paths to the uploaded files
        const filePaths = req.files.map(file => `/public/uploads/${file.filename}`);
        res.status(200).json({ paths: filePaths });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

import { Storage } from 'megajs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_URI = 'mongodb://127.0.0.1:27017/textile-co';
const ATLAS_URI = process.env.MONGODB_URI;

// Same schema as models/Product.js
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    features: [String],
    minOrderQuantity: { type: Number, default: 1 },
    images: [String],
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

async function seedToAtlas() {
    try {
        console.log('1. Connecting to Local Database to fetch current products...');
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        const LocalProduct = localConn.model('Product', productSchema);
        
        const products = await LocalProduct.find().lean();
        console.log(`Found ${products.length} products locally.`);

        if (products.length === 0) {
            console.log('No products found in local DB. Exiting...');
            process.exit(0);
        }

        console.log('2. Connecting to Mega account...');
        const megaStorage = await new Storage({
            email: 'sashwathp.23csd@kongu.edu',
            password: 'Sash@2005p'
        }).ready;
        console.log('Mega Connected!');

        console.log('3. Uploading images to Mega and updating product image URLs...');
        for (let product of products) {
            console.log(`Processing product: ${product.name}`);
            const newImageUrls = [];
            
            for (let localUrl of product.images) {
                try {
                    // Local urls look like "/public/uploads/1773036594809.jpeg"
                    // Or they could be absolute.
                    const filename = path.basename(localUrl);
                    const filePath = path.join(__dirname, 'public', 'uploads', filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`   Uploading ${filename} to Mega...`);
                        const fileBuffer = fs.readFileSync(filePath);
                        const uploadedFile = await megaStorage.upload({
                            name: filename,
                            size: fileBuffer.length
                        }, fileBuffer).complete;
                        
                        const megaLink = await uploadedFile.link();
                        console.log(`   Success: ${megaLink}`);
                        newImageUrls.push(megaLink);
                    } else {
                        console.log(`   Warning: File ${filePath} not found locally. Skipping mapping for this image.`);
                    }
                } catch (imgUploadErr) {
                     console.error(`   Failed to upload image ${localUrl}:`, imgUploadErr);
                }
            }

            product.images = newImageUrls;
        }

        console.log('4. Connecting to Atlas Database...');
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        const AtlasProduct = atlasConn.model('Product', productSchema);

        console.log('5. Clearing existing Atlas products (if any)...');
        await AtlasProduct.deleteMany({});

        console.log('6. Inserting processed products into Atlas...');
        await AtlasProduct.insertMany(products);
        
        console.log('✅ ALL DONE! Migration to Atlas and Mega successful.');

        // Close connections gracefully
        await localConn.close();
        await atlasConn.close();
        process.exit(0);

    } catch (err) {
        console.error('Fatal Error during migration:', err);
        process.exit(1);
    }
}

seedToAtlas();

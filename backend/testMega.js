import { Storage, File } from 'megajs';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMega() {
    try {
        console.log('Connecting to Mega...');
        const storage = await new Storage({
            email: 'sashwathp.23csd@kongu.edu',
            password: 'Sash@2005p'
        }).ready;
        console.log('Connected to Mega!');

        // Read a test file
        const testFilePath = path.join(__dirname, 'public', 'uploads', '1773036594809.jpeg');
        const fileBuffer = fs.readFileSync(testFilePath);

        console.log('Uploading test file...');
        const uploadedFile = await storage.upload({
            name: 'test_image.jpeg',
            size: fileBuffer.length
        }, fileBuffer).complete;

        console.log('File uploaded. Getting link...');
        const link = await uploadedFile.link();
        console.log('Public Link:', link);
        
    } catch (error) {
        console.error('Mega Test Error:', error);
    }
}

testMega();

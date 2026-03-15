import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    features: [{
        type: String,
        trim: true
    }],
    minOrderQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    images: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;

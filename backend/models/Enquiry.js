import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    requirements: {
        type: String,
        trim: true,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;

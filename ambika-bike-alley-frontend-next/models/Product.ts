import mongoose from 'mongoose';

// 1. Review Sub-schema
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 2. Main Product Schema
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['Bicycles', 'Accessories', 'Spare Parts'] 
    },
    subCategory: { type: String, required: true },
    targetAudience: { 
      type: String, 
      required: true, 
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Unisex'
    },
    description: { type: String, required: true },
    specs: {
       frame: { type: String },
       weight: { type: String },
       gear: { type: String },
    },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
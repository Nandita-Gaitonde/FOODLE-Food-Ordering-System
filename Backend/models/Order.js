const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ 
    name: String, 
    quantity: Number, 
    price: Number 
  }],
  totalAmount: { type: Number, required: true },
  pickupTime: { type: String, required: true }, // Format: "HH:mm"
  orderDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Online', 'COD'], required: true },
  paymentScreenshot: { type: String }, // Path to uploaded file
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Cancelled'] },
  cancellationFine: { type: Number, default: 0 },
  pickupToken: { type: String, required: true } 
});

module.exports = mongoose.model('Order', OrderSchema);

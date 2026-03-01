const mongoose = require('mongoose');

const franchiseSchema = mongoose.Schema({
    name: { type: String, required: true },
    investmentAmount: { type: Number, required: true },
    requiredArea: { type: String, required: true },
    expectedROI: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
}, {
    timestamps: true,
});

const Franchise = mongoose.models.Franchise || mongoose.model('Franchise', franchiseSchema);

module.exports = Franchise;

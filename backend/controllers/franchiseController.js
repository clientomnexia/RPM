const Franchise = require('../models/Franchise');

const getFranchises = async (req, res) => {
    try {
        const franchises = await Franchise.find({});
        res.json(franchises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFranchiseById = async (req, res) => {
    try {
        const franchise = await Franchise.findById(req.params.id);
        if (franchise) {
            res.json(franchise);
        } else {
            res.status(404).json({ message: 'Franchise plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFranchise = async (req, res) => {
    try {
        const { name, investmentAmount, requiredArea, expectedROI, duration, description, image } = req.body;
        const franchise = new Franchise({ name, investmentAmount, requiredArea, expectedROI, duration, description, image });
        const createdFranchise = await franchise.save();
        res.status(201).json(createdFranchise);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateFranchise = async (req, res) => {
    try {
        const { name, investmentAmount, requiredArea, expectedROI, duration, description, image } = req.body;
        const franchise = await Franchise.findById(req.params.id);
        if (franchise) {
            franchise.name = name || franchise.name;
            franchise.investmentAmount = investmentAmount !== undefined ? investmentAmount : franchise.investmentAmount;
            franchise.requiredArea = requiredArea || franchise.requiredArea;
            franchise.expectedROI = expectedROI || franchise.expectedROI;
            franchise.duration = duration || franchise.duration;
            franchise.description = description || franchise.description;
            franchise.image = image || franchise.image;
            const updatedFranchise = await franchise.save();
            res.json(updatedFranchise);
        } else {
            res.status(404).json({ message: 'Franchise plan not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFranchise = async (req, res) => {
    try {
        const franchise = await Franchise.findById(req.params.id);
        if (franchise) {
            await franchise.deleteOne();
            res.json({ message: 'Franchise plan removed' });
        } else {
            res.status(404).json({ message: 'Franchise plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFranchises, getFranchiseById, createFranchise, updateFranchise, deleteFranchise };

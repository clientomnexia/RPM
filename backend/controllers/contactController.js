const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const contact = new Contact({ name, email, phone, message });
        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (contact) {
            await contact.deleteOne();
            res.json({ message: 'Message deleted' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createContact, getContacts, deleteContact };

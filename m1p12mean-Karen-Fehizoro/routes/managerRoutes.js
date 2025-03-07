const express = require('express');
const router = express.Router();
const Manager = require('../models/Manager');

router.post('/', async (req, res) => {
    try {
        const managers = new Manager(req.body);
        await managers.save();
        res.status(201).json(managers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const managers = await Manager.find();
    res.json(managers);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const managers = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(managers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await Manager.findByIdAndDelete(req.params.id);
        res.json({ message: "Client supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
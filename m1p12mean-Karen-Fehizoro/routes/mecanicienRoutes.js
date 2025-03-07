const express = require('express');
const router = express.Router();
const Mecanicien = require('../models/Mecanicien');

router.post('/', async (req, res) => {
    try {
        const mecaniciens = new Mecanicien(req.body);
        await mecaniciens.save();
        res.status(201).json(mecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const mecaniciens = await Mecanicien.find();
    res.json(mecaniciens);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const mecaniciens = await Mecanicien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(mecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await Mecanicien.findByIdAndDelete(req.params.id);
        res.json({ message: "Mecanicien supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
const express = require('express');
const router = express.Router();
const TacheMecanicien = require('../models/TacheMecanicien');

router.post('/', async (req, res) => {
    try {
        const tacheMecaniciens = new TacheMecanicien(req.body);
        await tacheMecaniciens.save();
        res.status(201).json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const tacheMecaniciens = await TacheMecanicien.find();
    res.json(tacheMecaniciens);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const tacheMecaniciens = await TacheMecanicien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await TacheMecanicien.findByIdAndDelete(req.params.id);
        res.json({ message: "Tache mécanicien supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
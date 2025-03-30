const express = require('express');
const router = express.Router();
const HeureDeTravail = require('../models/HeureDeTravail');

router.post('/', async (req, res) => {
    try {
        const heureDeTravail = new HeureDeTravail(req.body);
        await heureDeTravail.save();
        res.status(201).json(heureDeTravail);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const heureDeTravails = await HeureDeTravail.find();
    res.json(heureDeTravails);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

// Mettre à jour un heureDeTravail
router.put('/:id', async (req, res) => {
        try {
            const heureDeTravail = await HeureDeTravail.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(heureDeTravail);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
   });
   // Supprimer un heureDeTravail
   router.delete('/:id', async (req, res) => {
    try {
        await HeureDeTravail.findByIdAndDelete(req.params.id);
        res.json({ message: "heureDeTravail supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
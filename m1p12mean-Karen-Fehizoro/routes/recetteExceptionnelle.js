const express = require('express');
const router = express.Router();
const RecetteExceptionnelle = require('../models/RecetteExceptionnelle');

router.post('/', async (req, res) => {
    try {
        const recetteExceptionnelles = new RecetteExceptionnelle(req.body);
        await recetteExceptionnelles.save();
        res.status(201).json(recetteExceptionnelles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const recetteExceptionnelles = await RecetteExceptionnelle.find();
    res.json(recetteExceptionnelles);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const recetteExceptionnelles = await RecetteExceptionnelle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(recetteExceptionnelles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await RecetteExceptionnelle.findByIdAndDelete(req.params.id);
        res.json({ message: "Recette exceptionnelle supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
const express = require('express');
const router = express.Router();
const DepenseExceptionnelle = require('../models/DepenseExceptionnelle');

router.post('/', async (req, res) => {
    try {
        const depenseExceptionnelles = new DepenseExceptionnelle(req.body);
        await depenseExceptionnelles.save();
        res.status(201).json(depenseExceptionnelles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const depenseExceptionnelles = await DepenseExceptionnelle.find();
    res.json(depenseExceptionnelles);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const depenseExceptionnelles = await DepenseExceptionnelle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(depenseExceptionnelles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await DepenseExceptionnelle.findByIdAndDelete(req.params.id);
        res.json({ message: "Dépense exceptionnelle supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
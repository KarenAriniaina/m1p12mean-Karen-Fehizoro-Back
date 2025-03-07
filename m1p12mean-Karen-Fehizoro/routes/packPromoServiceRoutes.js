const express = require('express');
const router = express.Router();
const PackPromoService = require('../models/PackPromoService');

router.post('/', async (req, res) => {
    try {
        const packPromoServices = new PackPromoService(req.body);
        await packPromoServices.save();
        res.status(201).json(packPromoServices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const packPromoServices = await PackPromoService.find();
    res.json(packPromoServices);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const packPromoServices = await PackPromoService.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(packPromoServices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await PackPromoService.findByIdAndDelete(req.params.id);
        res.json({ message: "Service supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
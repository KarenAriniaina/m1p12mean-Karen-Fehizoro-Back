const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.post('/', async (req, res) => {
    try {
        const services = new Service(req.body);
        await services.save();
        res.status(201).json(services);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const services = await Service.find();
    res.json(services);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.put('/:id', async (req, res) => {
    try {
        const services = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(services);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: "Service supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
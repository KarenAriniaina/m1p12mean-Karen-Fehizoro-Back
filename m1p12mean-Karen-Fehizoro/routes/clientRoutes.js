const express = require('express');
const Service = require('../models/Service');
const { ListePack } = require('../services/pack');
const router = express.Router();

router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/packs', async (req, res) => {
    const { type, dd, df, nom, statut } = req.query;
    const response = await ListePack(type, dd, df, nom, statut);
    res.status(response.status).json({
        message: response.error,
        packs: response.pack
    })
});

module.exports = router;
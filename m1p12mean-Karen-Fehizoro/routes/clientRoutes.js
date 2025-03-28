const express = require('express');
const Service = require('../models/Service');
const { ListePack, getOnePack } = require('../services/pack');
const { getOneService } = require('../services/service');
const router = express.Router();

router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/service/:id', async (req, res) => {
    const response = await getOneService(req.params.id);
    res.status(response.status).json({
        message: response.error,
        service: response.service
    })
});

router.get('/packs', async (req, res) => {
    const { type, dd, df, nom, statut } = req.query;
    const response = await ListePack(type, dd, df, nom, statut);
    res.status(response.status).json({
        message: response.error,
        packs: response.pack
    })
});

router.get('/pack/:id', async (req, res) => {
    const response = await getOnePack(req.params.id);
    res.status(response.status).json({
        message: response.error,
        pack: response.pack
    })
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { CreationService, getOneService, ModificationService, SupprimerService } = require('../services/service');

router.post('/', upload.array('images'), async (req, res) => {
    const { nom, tarif, estimation, nbrmeca } = req.body;
    const response = await CreationService(nom, tarif, estimation, nbrmeca, req.files)
    res.status(response.status).json({
        message: response.error,
        service: response.service
    })
});

router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const response = await getOneService(req.params.id);
    res.status(response.status).json({
        message: response.error,
        service: response.service
    })
});

router.put('/:id', upload.array('images'), async (req, res) => {
    const { nom, tarif, estimation, nbrmeca, existing } = req.body;
    const response = await ModificationService(req.params.id, nom, tarif, estimation, nbrmeca, existing, req.files)
    res.status(response.status).json({
        message: response.error,
        service: response.service
    })
});

router.delete('/:id', async (req, res) => {
    const response= await SupprimerService(req.params.id);
    res.status(response.status).json({
        message: response.error,
        service: response.service
    })
});

module.exports = router;
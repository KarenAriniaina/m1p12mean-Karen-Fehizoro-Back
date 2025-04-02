const express = require('express');
const router = express.Router();
const PackPromoService = require('../models/PackPromoService');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { ListePack, ArreterPack, ModifierPackService, SupprimerPack, creerPackService } = require('../services/pack');
const { envoiNotifPromo } = require('../services/notif');

router.post('/', upload.array('images'), async (req, res) => {
    const { nom, services, dd, df, tarif, idservice, notif, description } = req.body;
    const response = await creerPackService(nom, services, dd, df, tarif, idservice, description, req.files);
    if (notif && response.status == 201) envoiNotifPromo(response.pack)
    res.status(response.status).json({
        message: response.error,
        pack: response.pack
    })
});

router.get('/', async (req, res) => {
    const { type, dd, df, nom, statut } = req.query;
    const response = await ListePack(type, dd, df, nom, statut);
    res.status(response.status).json({
        message: response.error,
        packs: response.pack
    })
});

router.post('/ArreterPack/:id', async (req, res) => {
    const { type } = req.body;
    const response = await ArreterPack(req.params.id, type);
    res.status(response.status).json({
        message: response.error,
        pack: response.pack
    })
});

router.put('/:id', upload.array('images'), async (req, res) => {
    const { type, nom, services, dd, df, tarif, description, existingphoto } = req.body;
    const response = await ModifierPackService(req.params.id, type, nom, services, dd, df, tarif, description, existingphoto, req.files);
    res.status(response.status).json({
        message: response.error,
        pack: response.pack
    })
});

router.delete('/:id', async (req, res) => {
    const { type } = req.body;
    const response = await SupprimerPack(req.params.id, type);
    res.status(response.status).json({
        message: response.error,
        pack: response.pack
    })
});

module.exports = router;
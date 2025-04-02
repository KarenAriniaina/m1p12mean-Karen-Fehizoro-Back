const express = require('express');
const router = express.Router();
const { insertionRetraitOuDepotAvecNouveauSolde, ListeDepotEtRetrait} = require('../services/depotOuRetrait');


router.post('/', async (req, res) => {
    const response = await insertionRetraitOuDepotAvecNouveauSolde(req.body,req.user)
    res.status(response.status).json({
        error: response.error,
        clientsolde: response.clientsolde
    })
});

router.get('/', async (req, res) => {
    const response=await ListeDepotEtRetrait(req.user)
    res.status(response.status).json({
        message: response.error,
        ldr: response.ldr
    })
});

module.exports = router;
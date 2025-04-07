const express = require('express');
const { rechercheGlobal} = require('../services/traitementRechercheGlobal');
const router = express.Router();

router.post('/', async (req, res) => {

    const text  = req.body.text
    const reponse = await rechercheGlobal(text);
    console.log(reponse.tableauService)
    
    
    
    res.status(reponse.status).json({ 
        message: reponse.error,
        resultatRecherche: reponse.resultatRecherche });
});



module.exports = router;
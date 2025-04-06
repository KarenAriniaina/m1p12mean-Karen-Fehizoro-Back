const express = require('express');
const router = express.Router();
const Facture = require('../models/Facture');
const { ValiderFacture, getFacturesSelonClient, ListeFacture, getFacture } = require('../services/facturation');

router.post('/', async (req, res) => {
    const { iddemande, infoFact } = req.body;
    const reponse = await ValiderFacture(iddemande, infoFact, req.user);
    res.status(reponse.status).json({ message: reponse.error });
});

router.get('/', async (req, res) => {
    try {
        const facturess = await Facture.find();
        res.json(facturess);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/mesFactures', async (req, res) => {
    const response = await getFacturesSelonClient(req.user);
    console.log(response)
    res.status(response.status).json({
        message: response.error,
        listeFacture: response.listeFacture
    })
});

router.get('/all', async (req, res) => {
    const { fact, dd, df } = req.query;
    const response = await ListeFacture(fact, dd, df);
    res.status(response.status).json({
        message: response.error,
        lfact: response.lfact
    })
});

router.get('/test', async (req, res) => {
    try {

        const factures = await Facture.aggregate([
            {
                $lookup: {
                    from: "clients",  // Collection à joindre
                    localField: "idClient", // Champ de référence dans "taches"
                    foreignField: "_id",  // Champ correspondant dans "mecaniciens"
                    as: "client" // Nom du champ de sortie
                }
            },
            {
                $unwind: { // Déplie le tableau pour obtenir un objet
                    path: "$client", // Le champ à déplier
                    preserveNullAndEmptyArrays: true // Si aucune correspondance, garde un champ vide
                }
            }
        ])
        res.status(201).json(factures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/facture-pdf/:id", (req, res) => {
    const idfact = req.params.id;
    getFacture(idfact).then(pdf => {
        res.status(200)
        res.contentType("application/pdf");
        res.setHeader('Content-Disposition', 'attachment; filename="facture_' + idfact + '.pdf"');
        res.send(pdf);
    }).catch(err => {
        console.error(err)
        res.status(500).send({ success: false, error: "Une erreur s'est produite" })
    })
})

module.exports = router;
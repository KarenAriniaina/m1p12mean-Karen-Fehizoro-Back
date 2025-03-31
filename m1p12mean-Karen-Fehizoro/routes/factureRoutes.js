const express = require('express');
const router = express.Router();
const Facture = require('../models/Facture');

router.post('/', async (req, res) => {
    try {
        const factures = new Facture(req.body);
        await factures.save();
        res.status(201).json(factures);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/', async (req, res) => {
 try {
    const facturess = await Facture.find();
    res.json(facturess);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});
router.get('/test', async (req, res) => {
    try { 
        
        const factures =await Facture.aggregate([
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


module.exports = router;
const express = require('express');
const router = express.Router();
const DepotEtRetrait = require('../models/DepotEtRetrait');
const { insertionRetraitOuDepotAvecNouveauSolde} = require('../services/depotOuRetrait');

// Créer un article
router.post('/', async (req, res) => {
    // try {
    //     if(req.body.depot== null || req.body.depot<0 || req.body.retrait== null || req.body.retrait<0  ){ throw new Error("Erreur sur le montant!")}
    //     const depotEtRetrait = new DepotEtRetrait(req.body);
    //     await depotEtRetrait.save();
    //     res.status(201).json(depotEtRetrait);
    // } catch (error) {
    //     res.status(400).json({ error: error.message });
    // }
   
    const response = await insertionRetraitOuDepotAvecNouveauSolde(req.body)
    res.status(response.status).json({
        error: response.error,
    })
});
// Lire tous les articles
router.get('/', async (req, res) => {
 try {
    const depotEtRetraits = await DepotEtRetrait.find()
        .sort({ _id: -1 }) 
        .exec();;
    res.json(depotEtRetraits);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

    router.get('/:id_client', async (req, res) => {
        try {
        const depotEtRetraits = await DepotEtRetrait.find({id_client : id_client})
            .sort({ _id: -1 }) 
            .exec();;
        res.json(depotEtRetraits);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
   });

// Mettre à jour un article
router.put('/:id', async (req, res) => {
        try {
            const depotEtRetrait = await DepotEtRetrait.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(depotEtRetrait);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
   });
// Supprimer un article
router.delete('/:id', async (req, res) => {
    try {
        await DepotEtRetrait.findByIdAndDelete(req.params.id);
        res.json({ message: "Supprimé avec succes" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
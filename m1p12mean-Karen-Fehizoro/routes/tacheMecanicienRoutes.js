const express = require('express');
const router = express.Router();
const TacheMecanicien = require('../models/TacheMecanicien');
const { ListeTacheMecanicienFiltre, TotalTacheSelonEtat } = require('../services/tacheMecanicien');

router.post('/', async (req, res) => {
    try {
        const tacheMecaniciens = new TacheMecanicien(req.body);
        await tacheMecaniciens.save();
        res.status(201).json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
 try {
    const tacheMecaniciens = await TacheMecanicien.find();
    res.json(tacheMecaniciens);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});

router.post('/tacheParMecanicienSelonPersonnel', async (req, res) => {
 try {
    idPersonnel = req.body.id 
    if(idPersonnel == false) {idPersonnel =0} 
    const tacheMecaniciens = await TacheMecanicien.find({idMeca:idPersonnel });
    res.json(tacheMecaniciens);
 } catch (error) {
    res.status(500).json({ message: error.message });
 }
});



router.put('/:id', async (req, res) => {
    try {
        const tacheMecaniciens = await TacheMecanicien.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
   
router.delete('/:id', async (req, res) => {
    try {
        await TacheMecanicien.findByIdAndDelete(req.params.id);
        res.json({ message: "Tache mécanicien supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/changerSatatus/:id/:nouveauStatus', async (req, res) => {
    try {
        const tacheMecaniciens = await TacheMecanicien.updateOne(
            { _id: req.params.id},
            { $set: { status: req.params.nouveauStatus } } 
        );

        res.json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/tacheMecanicienFiltre', async (req, res) => {
    const { idService, dd, df,  statut } = req.query;
    
    idPersonnel = req.body.id 
    const response = await ListeTacheMecanicienFiltre(idPersonnel,idService, dd, df,  statut);
    res.status(response.status).json({
        message: response.error,
        listeTache: response.listeTache
    })
});

router.post('/totalTacheParMecanicien', async (req, res) => {    
    idPersonnel = req.body.id 
    const response = await TotalTacheSelonEtat(idPersonnel);
    res.status(response.status).json({
        message: response.error,
        totalTacheSelonTache: response.totalTacheParStatus
    })
});
module.exports = router;
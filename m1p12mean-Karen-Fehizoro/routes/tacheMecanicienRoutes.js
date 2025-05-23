const express = require('express');
const router = express.Router();
const TacheMecanicien = require('../models/TacheMecanicien');
const { ListeTacheMecanicienFiltre, TotalTacheSelonEtat, ListeMecaDispo, ModifierMecaTache } = require('../services/tacheMecanicien');
const Facture = require('../models/Facture');
const { ListeTacheEnCours } = require('../services/facturation');

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
        if (idPersonnel == false) { idPersonnel = 0 }
        const tacheMecaniciens = await TacheMecanicien.find({ idMeca: idPersonnel });
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
        const tacheMecaniciens = await TacheMecanicien.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { status: req.params.nouveauStatus } },
            { new: true } // Returns the updated document
        );

        // pour changer status fact
        const result = await TacheMecanicien.aggregate([
            { $match: { idfact: req.params.idfact } },
            { $group: { _id: null, minStatus: { $min: "$status" } } }
        ]);

        const minStatus = result.length > 0 ? result[0].minStatus : null;
        await Facture.findOneAndUpdate(
            { _id: tacheMecaniciens.idfact },
            { $set: { status: minStatus } },
            { new: true }
        );
        // await TacheMecanicien.updateOne(
        //     { _id: req.params.id},
        //     { $set: { status: req.params.nouveauStatus } } 
        // );

        res.json(tacheMecaniciens);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post('/tacheMecanicienFiltre', async (req, res) => {
    const { idService, dd, df, statut } = req.query;

    idPersonnel = req.body.id
    const response = await ListeTacheMecanicienFiltre(idPersonnel, idService, dd, df, statut);
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

router.get('/tacheJour', async (req, res) => {
    const { date } = req.query;
    const user = req.user;
    if (user.role != 0) res.status(403).json({ message: "Accès Non Autorisée" })
    else {
        const reponse = await ListeTacheEnCours(date);
        res.status(reponse.status).json({ message: reponse.error, task: reponse.task });
    }
});

router.get('/MecaDispoTache', async (req, res) => {
    const { dd, df } = req.query;
    const user = req.user;
    if (user.role != 0) res.status(403).json({ message: "Accès Non Autorisée" })
    else {
        const reponse = await ListeMecaDispo(dd, df);
        res.status(reponse.status).json({ message: reponse.error, lmeca: reponse.lmeca });
    }
});

router.post('/ModifierMecaTache', async (req, res) => {
    const { tachesupp, tacheadd, nbrMecaPresent, nbrMecaNeed } = req.body;
    console.log(tachesupp, tacheadd, nbrMecaPresent, nbrMecaNeed)
    const user = req.user;
    if (user.role != 0) res.status(403).json({ message: "Accès Non Autorisée" })
    else {
        const reponse = await ModifierMecaTache(tachesupp, tacheadd, nbrMecaPresent, nbrMecaNeed);
        res.status(reponse.status).json({ message: reponse.error });
    }
});

module.exports = router;
const express = require('express');
const { getStatToday, getChiffreParHeure, getChiffreParDate } = require('../services/CA');
const router = express.Router();

router.get('/statjour', async (req, res) => {
    const { date } = req.query
    console.log(date);
    const reponse = await getStatToday(date);
    res.status(reponse.status).json({ message: reponse.erreur, stat: reponse.stat });
});

router.get('/caheure', async (req, res) => {
    const { date } = req.query
    const reponse = await getChiffreParHeure(date);
    res.status(reponse.status).json({ message: reponse.erreur, caHeure: reponse.caHeure });
});

router.get('/cajour', async (req, res) => {
    const { dd, df } = req.query
    const reponse = await getChiffreParDate(dd, df);
    res.status(reponse.status).json({ message: reponse.erreur, caJour: reponse.caJour });
});


module.exports = router;
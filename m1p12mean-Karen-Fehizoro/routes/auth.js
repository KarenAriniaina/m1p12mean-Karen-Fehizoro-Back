const express = require('express');
const { login, createAdmin, inscriptionClient } = require('../services/auth');
const { setToken, regenererTokenAccess } = require('../services/token');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, mdp, type } = req.body;
    const log = await login(email, mdp, type)
    if (log.logged) {
        let { accessToken, refreshToken } = setToken(log.detailslog)
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
        res.json({
            token: accessToken
        })
    } else {
        res.status(401).json({ error: log.error });
    }
});

router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    regenererTokenAccess(refreshToken)
        .then(result => {
            res.json({
                token: result.accesstoken
            })
        })
        .catch(error => {
            res.status(401).json({ error: error.error });
        });
});

router.post('/manager', async (req, res) => {
    const { login, mdp, prenom } = req.body
    const createdadmin = await createAdmin(login, mdp, prenom)
    if (createdadmin.created) {
        res.json(createdadmin)
    } else {
        res.status(400).json({ error: createdadmin.error })
    }
})

router.post('/client', async (req, res) => {
    const { nom, mdp, email, tel, adresse } = req.body
    const inscri = await inscriptionClient(nom, mdp, email, tel, adresse)
    if (inscri.logged) {
        let { accessToken, refreshToken } = setToken(inscri.detailslog)
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
        res.json({
            token: accessToken
        })
    } else {
        res.status(401).json({ error: inscri.error });
    }
})

module.exports = router;

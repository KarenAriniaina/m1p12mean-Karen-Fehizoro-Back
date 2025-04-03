const DepenseExceptionnelle = require("../models/DepenseExceptionnelle");
const Facture = require("../models/Facture");
const RecetteExceptionnelle = require("../models/RecetteExceptionnelle");

async function getStatToday(dt) {
    dt = (dt) ? new Date(dt) : new Date();
    let statut = 200; let erreur = ''; let reponse = null;
    try {
        const recettes = await RecetteExceptionnelle.aggregate([
            { $match: { date: { $gte: dt } } },
            { $group: { _id: null, totalRecettes: { $sum: "$total" } } }
        ]);

        const factures = await Facture.aggregate([
            { $match: { datefact: { $gte: dt } } }, // Utilisation de timestamps
            { $group: { _id: null, totalFactures: { $sum: "$total" }, countFactures: { $sum: 1 } } }
        ]);

        const depenses = await DepenseExceptionnelle.aggregate([
            { $match: { date: { $gte: dt } } },
            { $group: { _id: null, totalDepenses: { $sum: "$total" } } }
        ]);

        const totalRecettes = recettes.length > 0 ? recettes[0].totalRecettes : 0;
        const totalFactures = factures.length > 0 ? factures[0].totalFactures : 0;
        const nbrFactures = factures.length > 0 ? factures[0].countFactures : 0;
        const totalDepenses = depenses.length > 0 ? depenses[0].totalDepenses : 0;

        reponse = {
            totalEntrees: totalRecettes + totalFactures, // Somme des entrées
            totalSorties: totalDepenses, // Somme des sorties
            nombreFactures: nbrFactures // Nombre de factures traitées
        };
    } catch (error) {
        statut = 400;
        erreur = "Impossible de charger les statistiques pour la date en cours";
    }
    return {
        "status": statut,
        "erreur": erreur,
        "stat": reponse
    }
}

async function getChiffreParHeure(date) {
    date = (date) ? new Date(date) : new Date();
    let statut = 200; let erreur = ''; let reponse = null;
    try {
        const TotalRecetteParHeure = await RecetteExceptionnelle.aggregate([
            { $match: { date: { $gte: date } } },
            {
                $group: {
                    _id: { $hour: "$date" },
                    totalRecettes: { $sum: "$total" }
                }
            }
        ]);

        const TotalFactureParHeure = await Facture.aggregate([
            { $match: { datefact: { $gte: date } } },
            {
                $group: {
                    _id: { $hour: "$datefact" },
                    totalFactures: { $sum: "$total" }
                }
            }
        ]);

        const TotalDepenseParHeure = await DepenseExceptionnelle.aggregate([
            { $match: { date: { $gte: date } } },
            {
                $group: {
                    _id: { $hour: "$date" },
                    totalDepenses: { $sum: "$total" }
                }
            }
        ]);

        const listeCaHeure = {};

        TotalRecetteParHeure.forEach(item => {
            listeCaHeure[item._id] = { heure: item._id, total: item.totalRecettes };
        });

        TotalFactureParHeure.forEach(item => {
            if (listeCaHeure[item._id]) {
                listeCaHeure[item._id].total += item.totalFactures;
            } else {
                listeCaHeure[item._id] = { heure: item._id, total: item.totalFactures };
            }
        });

        TotalDepenseParHeure.forEach(item => {
            if (listeCaHeure[item._id]) {
                listeCaHeure[item._id].total -= item.totalDepenses;
            } else {
                listeCaHeure[item._id] = { heure: item._id, total: -item.totalDepenses };
            }
        });

        // Générer toutes les heures de 0 à 23 avec CA cumulé
        let cumulativeTotal = 0;
        const results = [];
        const now = new Date();
        const hours = now.getHours();
        for (let i = 7; i < 24; i++) {
            if (listeCaHeure[i]) {
                cumulativeTotal += listeCaHeure[i].total;
            }
            results.push({ heure: i, total: cumulativeTotal });
        }
        reponse = results;
    } catch (error) {
        statut = 400;
        erreur = "Impossible de charger les chiffres par heure du jour";
    }
    return {
        "status": statut,
        "erreur": erreur,
        "caHeure": reponse
    }
}

async function getChiffreParDate(dd, df) {
    dd = (dd) ? new Date(dd) : new Date();
    if (!df) {
        df = dd
        df.setDate(dd.getDate() + 30);
    } else {
        df = new Date(df)
    }
    let statut = 200; let erreur = ''; let reponse = null;
    try {
        // entree
        const TotalRecette = await RecetteExceptionnelle.aggregate([
            { $match: { date: { $gte: dd, $lte: df } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalRecettes: { $sum: "$total" }
                }
            },
            { $sort: { date: 1 } }
        ]);

        const TotalFacture = await Facture.aggregate([
            { $match: { datefact: { $gte: dd, $lte: df } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$datefact" } },
                    totalFactures: { $sum: "$total" }
                }
            },
            { $sort: { datefact: 1 } }
        ]);

        // sortie
        const TotalSortie = await DepenseExceptionnelle.aggregate([
            {
                $match: {
                    date: {
                        $gte: dd,
                        $lte: df
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { date: 1 } }
        ]);
        const TotalEntreeSortie = {};

        TotalRecette.forEach(item => {
            const dateKey = item._id;
            TotalEntreeSortie[dateKey] = { date: item._id, entree: item.totalRecettes, sortie: 0 };
        });

        TotalFacture.forEach(item => {
            const dateKey = item._id;
            if (TotalEntreeSortie[dateKey]) {
                TotalEntreeSortie[dateKey].entree += item.totalFactures;
            } else {
                TotalEntreeSortie[dateKey] = { date: item._id, entree: item.totalFactures, sortie: 0 };
            }
        });

        TotalSortie.forEach(item => {
            const dateKey = item._id;
            if (TotalEntreeSortie[dateKey]) {
                TotalEntreeSortie[dateKey].sortie = item.total;
            } else {
                TotalEntreeSortie[dateKey] = { date: item._id, entree: 0, sortie: item.total };
            }
        });

        reponse = Object.values(TotalEntreeSortie);
    } catch (error) {
        console.log(error)
        statut = 400;
        erreur = "Impossible de charger les chiffres de l'intervalle choisi";
    }
    return {
        "status": statut,
        "erreur": erreur,
        "caJour": reponse
    }

}

module.exports = { getStatToday, getChiffreParHeure, getChiffreParDate }
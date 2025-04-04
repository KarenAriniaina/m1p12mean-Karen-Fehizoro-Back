const cloudinary = require('../config/cloudinary');
const PackPromoService = require('../models/PackPromoService');
const TacheMecanicien = require('../models/TacheMecanicien');
const Mecanicien = require('../models/Mecanicien');

async function ListeTacheMecanicienFiltre(idPersonnel, idService, dd, df, statusFiltre) {
    let listeTacheMecanicien = [];
    let status = 200;
    let error = '';
    try {
        let query = {};
        if (idService && idService != null && idService != 0) query.idservice = idService

        if (dd) {
            query.$expr = {
                $gte: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$dateDebut" } },
                    dd
                ]
            };
        }

        if (df) {
            query.$expr = {
                $and: [
                    query.$expr || {},
                    {
                        $lte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$estimation" } },
                            df
                        ]
                    }
                ]
            };
        }

        if (statusFiltre && statusFiltre != null && statusFiltre != "")
            query.status = Number(statusFiltre);
        // query.idDemande = 0;
        query.idMeca = idPersonnel;
        console.log(query)
        listeTacheMecanicien = await TacheMecanicien.find(query);
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "listeTache": listeTacheMecanicien
    }
}

async function TotalTacheSelonEtat(idPersonnel) {
    let status = 200;
    let error = '';
    resultat = {}
    try {
        tacheEnAttente = await TacheMecanicien.countDocuments({ idMeca: idPersonnel, status: 0 });
        tacheEnCours = await TacheMecanicien.countDocuments({ idMeca: idPersonnel, status: 1 });
        tacheTerminer = await TacheMecanicien.countDocuments({ idMeca: idPersonnel, status: 2 });
        resultat = {
            nbrEnAttente: tacheEnAttente,
            nbrEnCours: tacheEnCours,
            nbrTerminer: tacheTerminer,
        }

    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "totalTacheParStatus": resultat
    }
}

async function ModifierMecaTache(tachesupp, tacheadd, nbrMecaPresent, nbrMecaNeed) {
    let status = 200; let error = '';
    try {
        if (nbrMecaPresent !== nbrMecaNeed) throw new Error(`Le nombre de mécanicien est invalide (Besoin: ${nbrMecaNeed})`);
        await TacheMecanicien.deleteMany({ _id: { $in: tachesupp } });
        if(tacheadd.length>0){
            tacheadd.forEach(t => {
                new TacheMecanicien(t).save();
            });
        }
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
    }
}

async function ListeMecaDispo(dd, df) {
    let status = 200; let error = ''; let lmeca = null;
    try {
        const busyMecas = await TacheMecanicien.distinct("idMeca", {
            $or: [
                { dateFin: { $lt: dd } },
                { dateDebut: { $gt: df } }
            ]
        });

        const allmeca = await Mecanicien.find();
        lmeca = allmeca.filter(meca => !busyMecas.includes(meca._id));
    } catch (err) {
        error = err.message;
        status = 400
    }
    return {
        "status": status,
        "error": error,
        "lmeca": lmeca
    }
}

module.exports = { ListeTacheMecanicienFiltre, TotalTacheSelonEtat, ModifierMecaTache, ListeMecaDispo }

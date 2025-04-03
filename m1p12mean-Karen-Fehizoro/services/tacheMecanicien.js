const cloudinary = require('../config/cloudinary');
const PackPromoService = require('../models/PackPromoService');
const TacheMecanicien = require('../models/TacheMecanicien');


async function ListeTacheMecanicienFiltre( idPersonnel,idService, dd, df, statusFiltre) {
    
    
    let listeTacheMecanicien = [];
    let status = 200;
    let error = '';
    try {
        let query = {};
        if (idService && idService!= null && idService!= 0) query.idservice = idService
    
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
        
        if (statusFiltre && statusFiltre != null && statusFiltre != "" ) 
            query.status = Number(statusFiltre);
        query.idDemande = 0;
        query.idMeca = idPersonnel;
        console.log(query)
        // listeTacheMecanicien = await TacheMecanicien.find(query);
        listeTacheMecanicien = await TacheMecanicien.aggregate([
            { $match: query }, // Filtrage de la requête
            {
                $lookup: {
                    from: "services", // Nom de la collection à joindre
                    localField: "idservice", // Champ de la collection actuelle
                    foreignField: "_id", // Champ de la collection "services"
                    as: "serviceDetails" // Nom du champ qui contiendra les résultats joints
                }
            },
            {
                $unwind: {
                    path: "$serviceDetails", // Déplie le tableau serviceDetails pour avoir une seule ligne
                    preserveNullAndEmptyArrays: true // Garde les documents sans correspondance dans "services"
                }
            },
           
        ]);
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

async function TotalTacheSelonEtat(idPersonnel){
    let status = 200;
    let error = '';
    resultat = {}
    try {
        tacheEnAttente=await TacheMecanicien.countDocuments({  idMeca :idPersonnel , idDemande:0, status: 0 });
        tacheEnCours=await TacheMecanicien.countDocuments({  idMeca :idPersonnel, idDemande:0 , status: 1 });
        tacheTerminer=await TacheMecanicien.countDocuments({  idMeca :idPersonnel, idDemande:0 , status: 2 });
        resultat = {
            nbrEnAttente : tacheEnAttente ,
            nbrEnCours : tacheEnCours ,
            nbrTerminer : tacheTerminer ,
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

module.exports = {ListeTacheMecanicienFiltre , TotalTacheSelonEtat}
